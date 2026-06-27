import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { authService, domainService } from '../services/apiService';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { User as UserIcon, Lock, ShieldCheck, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { Domain } from '../types';
import { HeroBanner } from '../components/HeroBanner';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [domain, setDomain] = useState(user?.domain || '');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const list = await domainService.getAll();
        setDomains(list);
        if (!domain && user?.domain) {
          setDomain(user.domain);
        } else if (!domain && list.length > 0) {
          setDomain(list[0].name);
        }
      } catch (err) {
        console.error('Failed to load domains', err);
      }
    };
    fetchDomains();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setProfileError('Fields cannot be blank');
      return;
    }
    setProfileError(null);
    setProfileSuccess(null);
    setProfileLoading(true);
    try {
      const domainValue = user?.role === 'PROJECT_COORDINATOR' ? undefined : domain;
      await updateProfile(name, email, domainValue);
      setProfileSuccess('Profile details updated successfully!');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    setPassError(null);
    setPassSuccess(null);
    setPassLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setPassSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <HeroBanner
        title="Account Settings & Credentials"
        subtitle="Portal Configuration"
        description="Manage your profile details, work email address, domain paths, and security credentials."
        icon={SettingsIcon}
        badgeText="SETTINGS"
        badgeSubText="USER"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile settings card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserIcon className="mr-2 h-5 w-5 text-primary" /> Profile Settings
          </CardTitle>
          <CardDescription>Update your public profile display information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {profileSuccess && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                {profileError}
              </div>
            )}
            
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={profileLoading}
            />
            <Input
              label="Work Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={profileLoading}
            />

            {user?.role === 'INTERN' && (
              <Select
                label="Domain / Path"
                value={domain}
                onChange={(val) => setDomain(val)}
                options={domains.map(d => ({ value: d.name, label: d.name }))}
                disabled={profileLoading}
              />
            )}

            {user?.role === 'PROJECT_COORDINATOR' && (
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Assigned Domain</label>
                <div className="p-3 bg-secondary/30 rounded-lg text-sm font-semibold border border-border/80 text-muted-foreground select-none cursor-not-allowed">
                  {user?.domain || 'Not Assigned'}
                </div>
              </div>
            )}

            <Button type="submit" disabled={profileLoading} className="w-full">
              {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Details'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security credentials change card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-primary" /> Credentials Security
          </CardTitle>
          <CardDescription>Revise or change your account entry passcode.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passSuccess && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                {passSuccess}
              </div>
            )}
            {passError && (
              <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                {passError}
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={passLoading}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={passLoading}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={passLoading}
            />

            <Button type="submit" disabled={passLoading} className="w-full">
              {passLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
