import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'project-coordinator' | 'intern' | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailLabel = useMemo(() => {
    if (selectedRole === 'admin') return 'Admin Username or Email';
    if (selectedRole === 'project-coordinator') return 'Employee ID or Email';
    if (selectedRole === 'intern') return 'Intern ID or Email';
    return 'Username or Email';
  }, [selectedRole]);

  const emailPlaceholder = useMemo(() => {
    if (selectedRole === 'admin') return 'e.g. admin@company.com';
    if (selectedRole === 'project-coordinator') return 'e.g. EMP-001 or coordinator@company.com';
    if (selectedRole === 'intern') return 'e.g. INT-101 or intern@company.com';
    return 'you@company.com or Employee ID / Intern ID';
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'PROJECT_COORDINATOR') navigate('/project-coordinator');
      else navigate('/intern');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: 'admin' | 'project-coordinator' | 'intern') => {
    setError(null);
    setSelectedRole(role);
    setEmail('');
    setPassword('');
  };

  // Generate deterministic particles for background
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${(i * 7) % 95}%`,
      top: `${(i * 13) % 95}%`,
      size: `${((i * 3) % 5) + 3}px`,
      delay: `${(i * 0.8) % 8}s`,
      duration: `${((i * 4) % 8) + 12}s`,
    }));
  }, []);

  // Configuration for 5 sliding image cards (plus 1 duplicate for seamless loop)
  const carouselCards = [
    {
      image: '/classroom.png',
      caption: 'Corporate Classroom',
      topic: 'Corporate Training',
    },
    {
      image: '/software_dev.png',
      caption: 'Software Engineering',
      topic: 'Software Development Team',
    },
    {
      image: '/learning.png',
      caption: 'Teaching Session',
      topic: 'Project Coordinator Session',
    },
    {
      image: '/online.png',
      caption: 'Digital Courses',
      topic: 'Online Learning',
    },
    {
      image: '/discussion.png',
      caption: 'Interactive Brainstorming',
      topic: 'Project Collaboration',
    },
    // Duplicate of Card 1 for seamless vertical loop transition
    {
      image: '/classroom.png',
      caption: 'Corporate Classroom',
      topic: 'Corporate Training',
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#0c232c] overflow-hidden select-none">

      {/* LEFT SIDE (60% width on Desktop) */}
      <div className="w-full lg:w-[60%] min-h-screen bg-[#0a2540] text-white flex flex-col justify-between p-8 xl:p-12 relative overflow-hidden">

        {/* Soft Glowing Elements (Background orbs) */}
        <div className="w-[450px] h-[450px] bg-[#0F4C81]/10 rounded-full blur-3xl absolute top-[5%] left-[-5%] animate-glow-pulse pointer-events-none" />
        <div className="w-[500px] h-[500px] bg-[#0F4C81]/40 rounded-full blur-3xl absolute bottom-[5%] right-[-5%] animate-glow-pulse pointer-events-none" />

        {/* Animated background shape elements */}
        <div className="absolute top-[15%] left-[-10%] w-64 h-64 rounded-full border border-teal-500/20 bg-teal-500/5 blur-xs animate-shape-1 pointer-events-none" />
        <div className="absolute bottom-[25%] right-[-10%] w-80 h-80 rounded-3xl border border-[#0F4C81]/15 bg-[#0F4C81]/5 blur-xs animate-shape-2 pointer-events-none" />

        {/* Rising glowing particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute bg-white/15 rounded-full animate-particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        {/* Branding Area Centered at the Very Top */}
        <div className="w-full text-center z-10 flex flex-col items-center">
          {/* Large Company Logo */}
          <div className="p-8 rounded-2xl bg-white shadow-2xl flex items-center justify-center mb-6 max-w-[420px] w-full transition-all duration-300 hover:scale-[1.02] overflow-hidden">
            <img src="/logo.png" alt="Career Solutions Logo" className="h-28 w-auto object-contain scale-110" />
          </div>
          {/* Company Tagline */}
          <p className="text-base xl:text-lg font-medium text-teal-200 mt-2 font-display drop-shadow-sm">
            "Bridge The Gap, Accelerate Your Career"
          </p>

          {/* Company Description */}
          <p className="text-xs xl:text-sm text-white/80 mt-3 max-w-xl text-center leading-relaxed font-sans px-4">
            Career Solutions is a corporate learning platform that helps interns and employees gain industry-ready skills through structured courses, projects, assessments, and certifications.
          </p>
        </div>

        {/* PHOTO SECTION (Auto-sliding vertical carousel of 5 cards) */}
        <div className="w-full max-w-[400px] xl:max-w-[440px] mx-auto my-8 z-10 relative">
          {/* Carousel Viewport Box */}
          <div className="h-[236px] overflow-hidden relative w-full rounded-[24px] border border-white/10 shadow-inner">
            <div className="flex flex-col gap-4 animate-vertical-slide hover:[animation-play-state:paused]">
              {carouselCards.map((card, idx) => (
                <div
                  key={idx}
                  className="h-[220px] w-full flex-shrink-0 p-1.5 rounded-[20px] glassmorphism border border-white/25 shadow-md hover:scale-[1.03] hover:shadow-xl transition-all duration-300 ease-out cursor-pointer group relative overflow-hidden"
                >
                  <img
                    src={card.image}
                    alt={card.topic}
                    className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle dark gradient overlay inside the card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent rounded-[14px]" />

                  {/* Card text tag */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-left flex flex-col items-start">
                    <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest font-display">
                      {card.topic}
                    </span>
                    <h3 className="text-xs xl:text-sm font-bold text-white mt-0.5">
                      {card.caption}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-white/40 tracking-wider uppercase z-10 border-t border-white/10 pt-4 w-full">
          © {new Date().getFullYear()} Career Solutions LMS. All Rights Reserved.
        </div>
      </div>

      {/* RIGHT SIDE (40% width on Desktop, Centered login form) */}
      <div className="w-full lg:w-[40%] min-h-screen flex items-center justify-center p-6 xl:p-12 bg-[#f0f9fa]/40 dark:bg-[#0c232c]/95 relative overflow-y-auto z-10 border-t lg:border-t-0 lg:border-l border-slate-200/50 dark:border-slate-800/50">

        {/* Background decorative blobs for mobile devices */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl lg:hidden pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#17A2B8]/10 rounded-full blur-3xl lg:hidden pointer-events-none" />

        {/* Form Card wrapper */}
        <Card className="w-full max-w-md border border-border bg-card/75 backdrop-blur-md shadow-2xl glow-indigo">
          <CardHeader className="space-y-4 text-center pb-4 pt-6">
            <div className="mx-auto flex items-center justify-center mb-4 p-6 rounded-xl bg-white border border-slate-100 shadow-md max-w-[280px] w-full transition-all duration-300 hover:scale-105 overflow-hidden">
              <img src="/logo.png" alt="Career Solutions Logo" className="h-20 w-auto object-contain scale-110" />
            </div>
            <CardTitle className="text-2xl font-bold font-display tracking-tight text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-xs max-w-sm mx-auto leading-relaxed mt-1.5">
              Access your corporate training academy portal to view courses, take assessments, and track certificates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4.5">
              {error && (
                <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-left font-semibold animate-fade-in">
                  {error}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-9.5 h-4 w-4 text-muted-foreground/60" />
                <Input
                  label={emailLabel}
                  id="email"
                  type="text"
                  placeholder={emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11"
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-9.5 h-4 w-4 text-muted-foreground/60" />
                <Input
                  label="Password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9.5 text-muted-foreground/60 hover:text-foreground focus:outline-none cursor-pointer"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold tracking-wide" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Role Selection */}
            <div className="mt-8 pt-6 border-t border-border/50 text-left">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 font-display">
                Select Your Role:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedRole === 'admin' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleSelect('admin')}
                  className="text-xs h-8.5"
                >
                  Admin
                </Button>
                <Button
                  variant={selectedRole === 'project-coordinator' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleSelect('project-coordinator')}
                  className="text-xs h-8.5"
                >
                  Project Coordinator
                </Button>
                <Button
                  variant={selectedRole === 'intern' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleSelect('intern')}
                  className="text-xs h-8.5"
                >
                  Intern
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
