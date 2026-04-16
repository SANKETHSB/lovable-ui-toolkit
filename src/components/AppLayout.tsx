import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import {
  LayoutDashboard, Users, FileText, ShoppingCart, ClipboardList,
  Shield, Bell, Settings, ChevronLeft, ChevronRight, LogOut,
  Building2, BarChart3, UserCog, Menu
} from 'lucide-react';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'VENDOR', 'COMPLIANCE_OFFICER'] },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} />, roles: ['ADMIN', 'PROCUREMENT_MANAGER'] },
  { label: 'Vendors', path: '/vendors', icon: <Building2 size={20} />, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'COMPLIANCE_OFFICER'] },
  { label: 'RFQs', path: '/rfqs', icon: <FileText size={20} />, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'VENDOR'] },
  { label: 'Quotations', path: '/quotations', icon: <ClipboardList size={20} />, roles: ['PROCUREMENT_MANAGER', 'VENDOR'] },
  { label: 'Purchase Orders', path: '/purchase-orders', icon: <ShoppingCart size={20} />, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'VENDOR'] },
  { label: 'Audit Logs', path: '/audit-logs', icon: <Shield size={20} />, roles: ['ADMIN', 'COMPLIANCE_OFFICER'] },
  { label: 'User Management', path: '/users', icon: <UserCog size={20} />, roles: ['ADMIN'] },
  { label: 'Role Management', path: '/roles', icon: <Settings size={20} />, roles: ['ADMIN'] },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredItems = NAV_ITEMS.filter(item => hasRole(item.roles));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed lg:relative z-50 h-full flex flex-col border-r border-sidebar-border bg-sidebar ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform lg:transition-none`}
        style={{ width: collapsed ? 72 : 260 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0"
            style={{ background: 'var(--gradient-primary)' }}>
            V
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="font-semibold text-sidebar-foreground whitespace-nowrap text-sm">
                VMS Portal
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {filteredItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
              >
                <motion.span whileHover={{ scale: 1.1 }} className="shrink-0">{item.icon}</motion.span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="whitespace-nowrap">{item.label}</motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:flex items-center justify-center p-3 border-t border-sidebar-border">
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-secondary">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.button whileHover={{ scale: 1.05 }} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </motion.button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                style={{ background: 'var(--gradient-primary)' }}>
                {user?.name.charAt(0)}
              </div>
              {user && <span className="hidden sm:block text-sm font-medium text-foreground">{user.name}</span>}
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <LogOut size={18} />
            </motion.button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
