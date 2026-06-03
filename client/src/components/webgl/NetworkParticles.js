'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/lib/ThemeContext';

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec4 uRipple;
  attribute float aPhase;

  void main() {
    vec3 pos = position;

    pos.x += sin(uTime * 0.25 + aPhase) * 0.08;
    pos.y += cos(uTime * 0.2 + aPhase * 1.3) * 0.08;
    pos.z += sin(uTime * 0.15 + aPhase * 0.7) * 0.05;

    vec2 mousePlane = uMouse * 12.0;
    float mouseDist = distance(pos.xy, mousePlane);
    float mousePull = smoothstep(5.5, 0.0, mouseDist);
    vec2 toMouse = pos.xy - mousePlane;
    float len = max(length(toMouse), 0.001);
    pos.xy -= (toMouse / len) * mousePull * 0.65;

    float rippleAge = uRipple.w;
    if (rippleAge > 0.0 && rippleAge < 2.5) {
      vec2 rippleCenter = uRipple.xy * 12.0;
      float rd = distance(pos.xy, rippleCenter);
      float wave = sin(rd * 2.8 - rippleAge * 9.0) * exp(-rippleAge * 1.2);
      wave *= smoothstep(8.0, 0.0, rd);
      pos.z += wave * 0.55;
      pos.xy += normalize(pos.xy - rippleCenter + 0.0001) * wave * 0.12;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float sizeBoost = 1.0 + mousePull * 2.2;
    gl_PointSize = sizeBoost * (220.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 14.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uIsDark;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.0, dist);
    float glow = pow(core, 1.4);
    vec3 darkA = vec3(0.35, 0.2, 0.65);
    vec3 darkB = vec3(0.75, 0.55, 1.0);
    vec3 lightA = vec3(0.52, 0.42, 0.82);
    vec3 lightB = vec3(0.82, 0.72, 1.0);
    vec3 colorA = mix(lightA, darkA, uIsDark);
    vec3 colorB = mix(lightB, darkB, uIsDark);
    vec3 color = mix(colorA, colorB, core);
    float alpha = glow * mix(0.55, 0.85, uIsDark);
    gl_FragColor = vec4(color, alpha);
  }
`;

function buildParticles(count) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 4 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
    phases[i] = Math.random() * Math.PI * 2;
  }

  return { positions, phases };
}

export default function NetworkParticles({ mouseRef, ripplesRef }) {
  const { isDark } = useTheme();
  const materialRef = useRef(null);
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const count = reducedMotion ? 800 : typeof window !== 'undefined' && window.innerWidth < 768 ? 1400 : 2800;

  const { positions, phases } = useMemo(() => buildParticles(count), [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [positions, phases]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRipple: { value: new THREE.Vector4(0, 0, 0, -1) },
      uIsDark: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    const mat = materialRef.current;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    if (mouseRef?.current) {
      mat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    }

    const ripples = ripplesRef?.current || [];
    const now = performance.now();
    let active = null;

    for (let i = ripples.length - 1; i >= 0; i--) {
      const age = (now - ripples[i].t) / 1000;
      if (age < 2.5) {
        active = { ...ripples[i], age };
        break;
      }
    }

    if (active) {
      mat.uniforms.uRipple.value.set(active.x, active.y, 1, active.age);
    } else {
      mat.uniforms.uRipple.value.w = -1;
    }

    mat.uniforms.uIsDark.value = isDark ? 1 : 0;
  });

  return (
    <points frustumCulled={false} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
