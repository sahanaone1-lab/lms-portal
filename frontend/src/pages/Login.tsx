import React, { useState, useMemo, useEffect } from 'react';
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
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Carousel Configuration
  const carouselCards = useMemo(() => [
    {
      image: '/classroom.png',
      title: 'Industry-Focused Training',
      desc: 'Expert-led curriculum mapped to real-world corporate requirements.'
    },
    {
      image: '/team.png',
      title: 'Internship Programs',
      desc: 'Practical exposure working within simulated corporate environments.'
    },
    {
      image: '/software_dev.png',
      title: 'Project-Based Learning',
      desc: 'Apply knowledge directly to coding challenges and systems engineering.'
    },
    {
      image: '/discussion.png',
      title: 'Placement Assistance',
      desc: 'Guidance and linkages with partner enterprises to launch your career.'
    },
    {
      image: '/learning.png',
      title: 'Certifications & Skill Development',
      desc: 'Validate your competence with shareable, secure graduation certificates.'
    }
  ], []);

  // Carousel Autoplay Timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselCards.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, carouselCards.length]);

  // Floating background shape particles
  const particles = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${(i * 9) % 95}%`,
      top: `${(i * 17) % 95}%`,
      size: `${((i * 4) % 6) + 4}px`,
      delay: `${(i * 1.2) % 8}s`,
      duration: `${((i * 5) % 10) + 15}s`,
    }));
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#07162c] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none font-sans">
      
      {/* Background image visible at 65% opacity */}
      <div 
        className="absolute inset-0 bg-[url('/software_dev.png')] bg-cover bg-center mix-blend-overlay opacity-65 pointer-events-none z-0" 
      />

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#0F4C81]/15 blur-3xl pointer-events-none z-0 animate-glow-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none z-0 animate-glow-pulse" />

      {/* Rising particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-white/10 rounded-full animate-particle"
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

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Section: Centered Branding & Carousel */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center text-center text-white space-y-8 animate-fade-in">
          
          {/* Logo & Headline */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center justify-center p-5 bg-white/95 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.02] mx-auto">
              <img src="/logo.png" alt="Career Solutions Logo" className="h-24 w-auto object-contain" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                Career Solutions LMS
              </h1>
              <p className="text-lg sm:text-xl font-bold text-sky-400 font-display leading-tight max-w-xl mx-auto">
                "Empowering Future Professionals Through Industry-Focused Learning."
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mx-auto">
              Career Solutions LMS is an enterprise-grade digital academy offering professional curriculums, interactive skill assessments, and direct project evaluations to build career-ready technical competencies.
            </p>
          </div>

          {/* Carousel */}
          <div
            className="relative h-72 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group bg-slate-900/50 backdrop-blur-sm"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {carouselCards.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 flex flex-col justify-end p-8 ${
                  idx === activeSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
                }`}
              >
                {/* Background image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-[6000ms]"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Caption info */}
                <div className="relative z-10 space-y-1">
                  <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest bg-sky-950/60 border border-sky-800/30 px-2 py-0.5 rounded-full inline-block">
                    Curriculum Highlight
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">{slide.title}</h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{slide.desc}</p>
                </div>
              </div>
            ))}

            {/* Carousel Dot Indicators */}
            <div className="absolute bottom-6 right-8 z-20 flex space-x-2">
              {carouselCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide ? 'w-5 bg-sky-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Show feature ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          
          <Card className="w-full max-w-md border border-white/10 bg-slate-900/60 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6 text-white animate-slide-up">
            
            <CardHeader className="p-0 space-y-2 text-center">
              <h2 className="text-2xl font-black tracking-tight text-white font-display">Welcome Back</h2>
              <p className="text-xs text-slate-400">
                Log in to resume your training, complete assessments, and download credentials.
              </p>
            </CardHeader>

            <CardContent className="p-0 space-y-5">
              
              {error && (
                <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-left font-semibold animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                
                <div className="relative space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emailLabel}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="text"
                      placeholder={emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-white rounded-xl focus:border-sky-500 focus:ring-sky-500 text-xs sm:text-sm"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="relative space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-slate-950/40 border-slate-800 text-white rounded-xl focus:border-sky-500 focus:ring-sky-500 text-xs sm:text-sm"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Row */}
                <div className="flex items-center py-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-sky-500 border-slate-700 bg-slate-950 rounded focus:ring-sky-500"
                    />
                    <label htmlFor="rememberMe" className="text-slate-400 font-medium select-none cursor-pointer">
                      Remember Me
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-xs sm:text-sm font-bold tracking-wide rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#38bdf8] hover:from-[#0f4c81]/95 hover:to-[#38bdf8]/95 hover:scale-[1.01] active:scale-[0.99] transition-all text-white flex items-center justify-center shadow-lg shadow-sky-950/30"
                  disabled={loading}
                >
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
              <div className="pt-4 border-t border-slate-800 text-left space-y-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Quick Role Selector
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['admin', 'project-coordinator', 'intern'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`text-[10px] font-bold py-2 px-1.5 rounded-lg border transition-all cursor-pointer text-center leading-tight ${
                        selectedRole === role
                          ? 'bg-[#0F4C81]/20 border-[#38bdf8] text-[#38bdf8] shadow-xs'
                          : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {role === 'project-coordinator' ? 'Coordinator' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
          
        </div>

      </div>

    </div>
  );
};
