import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, LayoutDashboard, FileText, Database, BarChart2 } from 'lucide-react';

const roleConfig = {
  analyst: {
    label: 'Sustainability Analyst',
    abbr: 'Analyst',
    pill: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  },
  'facility-manager': {
    label: 'Facility Manager — Dublin',
    abbr: 'FM Dublin',
    pill: 'bg-blue-100 text-blue-800 border border-blue-200',
  },
  csuo: {
    label: 'Chief Sustainability Officer',
    abbr: 'CSuO',
    pill: 'bg-purple-100 text-purple-800 border border-purple-200',
  },
};

const navItemsByRole = {
  analyst: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileText },
  ],
  'facility-manager': [
    { id: 'data-entry', label: 'Data Entry', icon: Database },
  ],
  csuo: [
    { id: 'executive', label: 'Executive Summary', icon: BarChart2 },
    { id: 'reports', label: 'Reports', icon: FileText },
  ],
};

const Navbar = ({ currentRole, activeScreen, setActiveScreen, onRoleSwitch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const config = roleConfig[currentRole] || roleConfig.analyst;
  const navItems = navItemsByRole[currentRole] || [];

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700/60 h-16 flex items-center px-5 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-6 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-xs tracking-tight">DC</span>
        </div>
        <div className="leading-none">
          <div className="text-white font-semibold text-sm tracking-tight">DCSMS</div>
          <div className="text-slate-400 text-xs">Meridian Retail Group</div>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeScreen === id;
          return (
            <button
              key={id}
              onClick={() => setActiveScreen(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Period badge */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
        May 2026 Reporting Period
      </div>

      {/* Role switcher */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${config.pill}`}
        >
          {config.abbr}
          <ChevronDown size={11} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch Role — Demo</p>
            </div>
            {Object.entries(roleConfig).map(([id, cfg]) => (
              <button
                key={id}
                onClick={() => { onRoleSwitch(id); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                  id === currentRole
                    ? 'bg-slate-50 text-slate-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{cfg.label}</span>
                {id === currentRole && (
                  <span className="text-emerald-600 text-xs font-semibold">● Active</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center cursor-pointer transition-colors flex-shrink-0">
        <User size={15} className="text-slate-300" />
      </div>
    </nav>
  );
};

export default Navbar;
