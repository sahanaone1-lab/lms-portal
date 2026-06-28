import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { notificationService } from '../services/apiService';
import { Notification } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  FileCheck,
  Sun,
  Moon,
  Clock,
  Grid,
  Award,
  Briefcase,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout, isProjectCoordinator, isIntern } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
      setIsDark(true);
    } else {
      root.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notif: any) => {
    // 1. Mark as read if not already read
    if (!notif.read) {
      markAsRead(notif.id);
    }

    // 2. Close the notification dropdown
    setIsNotifOpen(false);

    // 3. Route to respective page based on notification details or user role
    const type = notif.type;
    const entityId = notif.entityId;
    const title = (notif.title || '').toLowerCase();
    const userRole = user?.role;

    if (userRole === 'PROJECT_COORDINATOR') {
      if (type === 'project_assigned') {
        navigate(`/project-coordinator/projects?id=${entityId}`);
      } else if (type === 'assignment_submitted') {
        navigate(`/project-coordinator/grading?submissionId=${entityId}`);
      } else if (type === 'certificate_claim' || title.includes('certificate') || title.includes('request')) {
        navigate('/project-coordinator/certificates');
      } else {
        navigate('/project-coordinator');
      }
    } else if (userRole === 'ADMIN') {
      if (type === 'new_intern' || type === 'coordinator_added') {
        navigate(`/admin/users?edit=${entityId}`);
      } else if (type === 'new_course') {
        navigate(`/admin/courses?id=${entityId}`);
      } else if (title.includes('certificate') || title.includes('request')) {
        navigate('/admin/projects');
      } else {
        navigate('/admin');
      }
    } else if (userRole === 'INTERN') {
      if (type === 'new_course') {
        navigate(`/intern/enrolled?id=${entityId}`);
      } else if (type === 'assignment_graded') {
        navigate(`/intern/enrolled`);
      } else if (type === 'certificate_approved' || type === 'certificate_rejected') {
        navigate('/intern/certificates');
      } else {
        if (title.includes('certificate')) {
          navigate('/intern/certificates');
        } else if (title.includes('graded') || title.includes('assignment')) {
          navigate('/intern/enrolled');
        } else {
          navigate('/intern');
        }
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: isIntern ? '/intern' : isProjectCoordinator ? '/project-coordinator' : '/admin',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'PROJECT_COORDINATOR', 'INTERN']
    },
    { title: 'Manage Users', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { title: 'Manage Courses', path: '/admin/courses', icon: BookOpen, roles: ['ADMIN'] },
    { title: 'Domain Management', path: '/admin/domains', icon: Grid, roles: ['ADMIN'] },
    { title: 'Presentation Registration', path: '/admin/projects', icon: Briefcase, roles: ['ADMIN'] },
    { title: 'My Courses', path: '/project-coordinator/courses', icon: BookOpen, roles: ['PROJECT_COORDINATOR'] },
    { title: 'Grades', path: '/project-coordinator/grading', icon: FileCheck, roles: ['PROJECT_COORDINATOR'] },
    { title: 'Presentation Registration', path: '/project-coordinator/projects', icon: Briefcase, roles: ['PROJECT_COORDINATOR'] },
    { title: 'Certificate Requests', path: '/project-coordinator/certificates', icon: Award, roles: ['PROJECT_COORDINATOR'] },
    { title: 'Domains', path: '/project-coordinator/domains', icon: Grid, roles: ['PROJECT_COORDINATOR'] },
    { title: 'My Enrolled Courses', path: '/intern/enrolled', icon: GraduationCap, roles: ['INTERN'] },
    { title: 'Presentation Registration', path: '/intern/projects', icon: Briefcase, roles: ['INTERN'] },
    { title: 'My Certificates', path: '/intern/certificates', icon: FileCheck, roles: ['INTERN'] }
  ];

  const filteredMenu = menuItems.filter((item) => user && item.roles.includes(user.role));

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50';
      case 'PROJECT_COORDINATOR': return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50';
      case 'INTERN': return 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'PROJECT_COORDINATOR': return 'Coordinator';
      case 'INTERN': return 'Intern';
      default: return role;
    }
  };

  const getComputedPageTitle = (path: string) => {
    switch (path) {
      // Admin paths
      case '/admin':
        return 'Dashboard';
      case '/admin/users':
        return 'Manage Users';
      case '/admin/courses':
        return 'Manage Courses';
      case '/admin/domains':
        return 'Domain Management';
      case '/admin/projects':
        return 'Presentation Registration';

      // Project Coordinator paths
      case '/project-coordinator':
        return 'Dashboard';
      case '/project-coordinator/courses':
        return 'My Courses';
      case '/project-coordinator/grading':
        return 'Grades';
      case '/project-coordinator/projects':
        return 'Presentation Registration';
      case '/project-coordinator/domains':
        return 'Domains';
      case '/project-coordinator/certificates':
        return 'Certificate Requests';

      // Intern paths
      case '/intern':
        return 'Dashboard';
      case '/intern/courses':
        return 'Browse Curriculum';
      case '/intern/enrolled':
        return 'My Enrolled Courses';
      case '/intern/projects':
        return 'Presentation Registration';
      case '/intern/certificates':
        return 'My Certificates';

      // Common paths
      case '/settings':
        return 'Account Settings';
      case '/change-password':
        return 'Change Password';

      default:
        if (path.startsWith('/admin')) return 'Admin Portal';
        if (path.startsWith('/project-coordinator')) return 'Coordinator Portal';
        if (path.startsWith('/intern')) return 'Intern Portal';
        return 'Portal';
    }
  };

  const currentPageTitle = getComputedPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#06111e] overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0b1a2e] border-r border-slate-100 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out shadow-lg md:shadow-none md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo Header - Zoomed CS Logo Icon + Career Solutions Stacked Text */}
        <div className="flex items-center justify-between h-24 px-5 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3.5 w-full min-w-0">
            <div className="dark-logo-wrapper square-logo h-18 w-18 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="CS Logo" className="h-full w-full object-contain scale-110" />
            </div>
            <div className="flex flex-col text-left leading-none select-none gap-1">
              <span className="text-[19px] font-black font-display text-slate-800 dark:text-white tracking-widest uppercase">
                Career
              </span>
              <span className="text-[13px] font-black font-display text-[#0F4C81] dark:text-blue-400 tracking-widest uppercase">
                Solutions
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <div className="px-3 mb-2.5">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Navigation</span>
          </div>

          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 h-11 rounded-xl text-sm font-medium transition-all duration-200 relative border-l-[3px] ${isActive
                    ? 'bg-[#EAF4F8] dark:bg-[#0F4C81]/15 text-[#0F4C81] dark:text-blue-400 font-semibold border-[#0F4C81] dark:border-blue-400 pl-[9px]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200 border-transparent pl-[9px]'
                  }`}
              >
                <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-[#0F4C81] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="flex-shrink-0 border-t border-slate-100 dark:border-slate-800/80 p-4 space-y-3 bg-slate-50/60 dark:bg-slate-900/30">
          {/* User info */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 shadow-sm">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#1B6CA8] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="flex items-center justify-between px-0.5">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(user?.role || '')}`}>
              {getRoleLabel(user?.role || '')}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-700 transition-all duration-150"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-24 md:h-26 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-[#0b1a2e] border-b border-slate-100 dark:border-slate-800/80 z-20 flex-shrink-0 shadow-sm transition-all duration-200">
          {/* Left Side: Mobile Menu Trigger only */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Center: Current Page Title in a larger, bold font aligned vertically */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-none select-none">
            <span className="text-lg md:text-3xl font-black font-display text-[#0c3d6e] dark:text-blue-300 tracking-tight uppercase truncate max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-none">
              {currentPageTitle}
            </span>
          </div>
          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              title="Toggle theme"
            >
              {isDark
                ? <Sun className="h-[18px] w-[18px] text-amber-500" />
                : <Moon className="h-[18px] w-[18px]" />
              }
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-btn"
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1e32] shadow-xl z-50 overflow-hidden max-h-96 flex flex-col animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-[#1B6CA8] dark:text-blue-400 hover:underline font-semibold">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 transition-colors ${!notif.read ? 'bg-[#1B6CA8]' : 'bg-transparent'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
                                  <Clock className="h-3 w-3" />
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar / Profile */}
            <div className="relative">
              <button
                id="profile-btn"
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#1B6CA8] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">{user?.name?.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{getRoleLabel(user?.role || '')}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 hidden md:block" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1e32] shadow-xl z-50 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-[#06111e]">
          <div className="p-5 md:p-6 max-w-[1600px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
