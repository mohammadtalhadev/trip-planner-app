import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Upload,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Camera,
  KeyRound,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useUserStore } from '../../store/useUserStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'password';
}

const PRESET_AVATARS = [
  { id: 'default', label: 'Default', url: '/avatar.png' },
  {
    id: 'adventurer',
    label: 'Voyager',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'hiker',
    label: 'Alpine',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'nomad',
    label: 'Nomad',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'wanderer',
    label: 'Urban',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'profile',
}) => {
  const { user, updateProfile, updatePassword } = useUserStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>(defaultTab);

  // Profile Form State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & Feedback State
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200 dark:bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) {
      return { score, text: 'Weak', color: 'bg-rose-500' };
    }
    if (score <= 4) {
      return { score, text: 'Good', color: 'bg-amber-500' };
    }
    return { score, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  // Handle image upload from computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please choose a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Check size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setProfileError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const isPasswordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isPasswordMatch = confirmPassword.length > 0 && newPassword.length >= 6 && newPassword === confirmPassword;

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setProfileError('Please enter your name.');
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setProfileError('Please provide a valid email address.');
      return;
    }

    const finalAvatar = customAvatarUrl.trim() || avatar;

    updateProfile({
      name: trimmedName,
      email: trimmedEmail,
      avatar: finalAvatar,
      bio: bio.trim(),
    });

    setProfileSuccess('Profile updated successfully!');
    setTimeout(() => {
      setProfileSuccess(null);
    }, 3000);
  };

  // Handle Save Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (currentPassword && currentPassword === newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    const result = updatePassword(currentPassword, newPassword);

    if (!result.success) {
      setPasswordError(result.error || 'Failed to update password.');
      return;
    }

    setPasswordSuccess('Password successfully updated!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setPasswordSuccess(null);
    }, 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      hideHeader
      noPadding
    >
      <div className="bg-[#f8fafd] dark:bg-[#0b101b] rounded-2xl overflow-hidden transition-colors">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-[#c2410c] dark:text-[#fb923c] border border-orange-100 dark:border-orange-900/40">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Account & Profile Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your identity, personal information, and access credentials.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'text-[#c2410c] dark:text-[#fb923c] border-b-2 border-[#c2410c] dark:border-[#fb923c]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'password'
                ? 'text-[#c2410c] dark:text-[#fb923c] border-b-2 border-[#c2410c] dark:border-[#fb923c]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Password & Security</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {profileSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* AVATAR SECTION */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profile Picture
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Current Avatar with ring */}
                  <div className="relative group">
                    <img
                      src={avatar}
                      alt={name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/avatar.png';
                      }}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-sky-400/40 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      title="Upload new image"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Upload Actions & Presets */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-sky-500" />
                        <span>Upload from device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        {showUrlInput ? 'Hide URL input' : 'Paste image URL'}
                      </button>
                    </div>

                    {showUrlInput && (
                      <div className="pt-1">
                        <input
                          type="url"
                          value={customAvatarUrl}
                          onChange={(e) => {
                            setCustomAvatarUrl(e.target.value);
                            if (e.target.value.trim()) setAvatar(e.target.value.trim());
                          }}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                      </div>
                    )}

                    {/* Presets Grid */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Or choose from travel personas:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {PRESET_AVATARS.map((preset) => {
                          const isSelected = avatar === preset.url;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setAvatar(preset.url);
                                setCustomAvatarUrl('');
                              }}
                              className={`relative p-0.5 rounded-full transition-all ${
                                isSelected
                                  ? 'ring-2 ring-[#c2410c] scale-105'
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                              title={preset.label}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NAME & EMAIL FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sophia Vance"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sophia.vance@tripplanner.io"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* BIO FIELD */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Explorer Bio / Notes
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your travel interests, favorite cities, or vacation goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PASSWORD & SECURITY */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-5">
              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl border border-sky-200/80 dark:border-sky-900/40 bg-sky-50/40 dark:bg-sky-950/20 flex items-start gap-3">
                <Shield className="w-4 h-4 text-sky-500 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Choose a robust password to safeguard your journeys, offline sync keys, and saved itineraries.
                </p>
              </div>

              {/* CURRENT PASSWORD */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Password Strength:</span>
                      <span className="font-bold">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${Math.min(100, strength.score * 20)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRM NEW PASSWORD */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Repeat new password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white focus:outline-none transition-all ${
                      isPasswordMismatch
                        ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                        : isPasswordMatch
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Inline Feedback */}
                {isPasswordMismatch && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold pt-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>Passwords do not match. Please ensure both passwords match.</span>
                  </div>
                )}
                {isPasswordMatch && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1 animate-in fade-in duration-150">
                    <Check className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span>Passwords match!</span>
                  </div>
                )}
              </div>

              {/* Form-level Error Banner */}
              {passwordError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#b91c1c] active:bg-[#9a3412] text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
