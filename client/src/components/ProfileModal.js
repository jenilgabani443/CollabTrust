'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Loader2, User, Calendar, MapPin, Phone, Globe,
  FileText, Camera,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { updateUserProfile } from '@/lib/api';

const GENDER_OPTIONS = ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const pd = user?.profileDetails || {};

  const [form, setForm] = useState({
    profilePicture: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    phone: '',
    bio: '',
    languagePreferences: [],
  });
  const [langInput, setLangInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        profilePicture: pd.profilePicture || '',
        firstName: pd.firstName || '',
        lastName: pd.lastName || '',
        dateOfBirth: pd.dateOfBirth ? new Date(pd.dateOfBirth).toISOString().split('T')[0] : '',
        gender: pd.gender || '',
        location: pd.location || '',
        phone: pd.phone || '',
        bio: pd.bio || '',
        languagePreferences: pd.languagePreferences || [],
      });
      setSuccess(false);
    }
  }, [isOpen, user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addLang = () => {
    const lang = langInput.trim();
    if (lang && !form.languagePreferences.includes(lang)) {
      setForm((prev) => ({
        ...prev,
        languagePreferences: [...prev.languagePreferences, lang],
      }));
    }
    setLangInput('');
  };

  const removeLang = (lang) => {
    setForm((prev) => ({
      ...prev,
      languagePreferences: prev.languagePreferences.filter((l) => l !== lang),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        dateOfBirth: form.dateOfBirth || null,
      };
      const res = await updateUserProfile(payload);
      updateUser(res.data.user);
      setSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <User className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Edit Profile</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 px-4 py-3 text-sm text-[var(--color-success)]"
            >
              Profile updated successfully!
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Profile Picture */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                <Camera className="h-3 w-3" /> Profile Picture URL
              </label>
              <input
                type="url"
                value={form.profilePicture}
                onChange={(e) => handleChange('profilePicture', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className={inputClass}
              />
              {form.profilePicture && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={form.profilePicture}
                    alt="Preview"
                    className="h-16 w-16 rounded-full object-cover border-2 border-[var(--color-primary)]/30"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* First Name / Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  <User className="h-3 w-3" /> First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="John"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Doe"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Date of Birth / Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  <Calendar className="h-3 w-3" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g || 'Select gender'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                <MapPin className="h-3 w-3" /> Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className={inputClass}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                <Phone className="h-3 w-3" /> Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={inputClass}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                <FileText className="h-3 w-3" /> Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Language Preferences */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                <Globe className="h-3 w-3" /> Language Preferences
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.languagePreferences.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]"
                  >
                    {lang}
                    <button onClick={() => removeLang(lang)} className="hover:text-[var(--color-danger)] transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLang())}
                  placeholder="Add language (e.g. English)"
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={addLang}
                  className="rounded-xl border border-[var(--color-primary)]/30 px-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save / Update
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
