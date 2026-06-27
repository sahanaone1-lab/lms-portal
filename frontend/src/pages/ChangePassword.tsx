import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { Lock, Check, X, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';

export const ChangePassword: React.FC = () => {
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Requirement checks
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });

  useEffect(() => {
    setChecks({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[@$!%*?&#^()_+=\[\]{}|\\:;"'<>,.?/~`]/.test(newPassword),
      match: newPassword !== '' && newPassword === confirmPassword,
    });
  }, [newPassword, confirmPassword]);

  const allRulesPass = Object.values(checks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!allRulesPass) {
      setError('Please satisfy all password strength requirements.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        if (user?.role === 'ADMIN') navigate('/admin');
         else if (user?.role === 'PROJECT_COORDINATOR') navigate('/project-coordinator');
        else navigate('/intern');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to change password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const RuleRow: React.FC<{ label: string; passed: boolean }> = ({ label, passed }) => (
    <div className="flex items-center space-x-2 text-xs transition-colors duration-250">
      {passed ? (
        <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground/40 stroke-[3]" />
      )}
      <span className={passed ? 'text-emerald-500 font-semibold' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 px-4 py-12 relative overflow-hidden text-left">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 border border-border bg-card/75 backdrop-blur-md shadow-xl glow-indigo">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold font-display tracking-tight text-foreground">
            Update Password
          </CardTitle>
          <CardDescription>
            You must update your default password to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-center font-semibold text-sm animate-fade-in flex flex-col items-center space-y-2">
              <Check className="h-8 w-8 stroke-[3]" />
              <p>Password Updated Successfully!</p>
              <p className="text-xs text-emerald-500/70 font-normal">Redirecting you to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg font-semibold">
                  {error}
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground/60" />
                <Input
                  label="Current Password"
                  id="oldPassword"
                  type={showOld ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="pl-9 pr-10 h-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-9 text-muted-foreground/60 hover:text-foreground cursor-pointer"
                >
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground/60" />
                <Input
                  label="New Password"
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-9 pr-10 h-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-9 text-muted-foreground/60 hover:text-foreground cursor-pointer"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground/60" />
                <Input
                  label="Confirm New Password"
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 pr-10 h-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-muted-foreground/60 hover:text-foreground cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Requirements Checklist */}
              <div className="p-3 bg-secondary/20 rounded-lg border border-border/50 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <RuleRow label="Min 8 Characters" passed={checks.length} />
                  <RuleRow label="1 Uppercase Letter" passed={checks.uppercase} />
                  <RuleRow label="1 Lowercase Letter" passed={checks.lowercase} />
                  <RuleRow label="1 Number" passed={checks.number} />
                  <RuleRow label="1 Special Character" passed={checks.special} />
                  <RuleRow label="Passwords Match" passed={checks.match} />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || !allRulesPass}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
