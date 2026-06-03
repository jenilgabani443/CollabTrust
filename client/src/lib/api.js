const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Centralized fetch wrapper with auth token injection.
 */
async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Guard: if the response is HTML, the request hit the wrong server (e.g. Next.js instead of Express)
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error(
      `API request to ${API_BASE}${endpoint} returned HTML instead of JSON. ` +
      `Ensure NEXT_PUBLIC_API_URL is set correctly and the Express backend is running on ${API_BASE}.`
    );
  }

  // 204 No Content — no body to parse
  if (res.status === 204) {
    return { status: 'success', data: null };
  }

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ── Auth ──────────────────────────────────────────
export async function handleLogin(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function handleRegister(email, password, role, profileDetails = {}) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, role, profileDetails }),
  });
}

// ── Discovery ─────────────────────────────────────
export async function fetchCreators(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/api/discover/creators?${query}`);
}

export async function fetchCreatorById(id) {
  return request(`/api/discover/creators/${id}`);
}

// ── Campaigns ─────────────────────────────────────
export async function createCampaign(payload) {
  return request('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchCampaigns() {
  return request('/api/campaigns');
}

export async function fetchCampaignById(id) {
  return request(`/api/campaigns/${id}`);
}

export async function transitionCampaignStatus(id, status, body = {}) {
  return request(`/api/campaigns/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, ...body }),
  });
}

export async function submitDeliverable(campaignId, submissionUrl, type) {
  return request(`/api/campaigns/${campaignId}/deliverables`, {
    method: 'POST',
    body: JSON.stringify({ submissionUrl, type }),
  });
}

// ── User ──────────────────────────────────────────
export async function fetchUserProfile() {
  return request('/api/auth/me');
}

export async function updateUserProfile(profileDetails) {
  return request('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify({ profileDetails }),
  });
}

export async function deleteAccount() {
  return request('/api/auth/me', {
    method: 'DELETE',
  });
}

// ── Invoices ──────────────────────────────────────
export async function fetchInvoiceByCampaign(campaignId) {
  return request(`/api/campaigns/${campaignId}/invoice`);
}
