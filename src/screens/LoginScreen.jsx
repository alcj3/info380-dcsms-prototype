import { useState, useRef } from 'react';
import { Eye, EyeOff, Shield, ChevronRight, Lock, Zap } from 'lucide-react';
import AnnotationBadge from '../components/AnnotationBadge.jsx';

const roles = [
  {
    id: 'analyst',
    label: 'Sustainability Analyst',
    desc: 'Full access — portfolio dashboard, reports, audit trail',
    user: 'A. Rodriguez',
    color: 'border-emerald-300 bg-emerald-50/70',
    ring: 'ring-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    id: 'facility-manager',
    label: 'Facility Manager — Dublin',
    desc: 'Data entry for Dublin DC · own facility benchmarks only',
    user: 'J. Murphy',
    color: 'border-blue-300 bg-blue-50/70',
    ring: 'ring-blue-400',
    dot: 'bg-blue-500',
  },
  {
    id: 'csuo',
    label: 'Chief Sustainability Officer',
    desc: 'Read-only · executive summary and compliance status',
    user: 'M. Chen',
    color: 'border-purple-300 bg-purple-50/70',
    ring: 'ring-purple-400',
    dot: 'bg-purple-500',
  },
];

const LoginScreen = ({ onAuthenticated }) => {
  const [step, setStep] = useState('login'); // login | mfa | role
  const [email, setEmail] = useState('a.rodriguez@meridianretail.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [mfaDigits, setMfaDigits] = useState(['', '', '', '', '', '']);
  const [selectedRole, setSelectedRole] = useState('analyst');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('mfa'); }, 900);
  };

  const handleAzureSSO = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('mfa'); }, 1100);
  };

  const handleMfaInput = (i, val) => {
    const next = [...mfaDigits];
    next[i] = val.replace(/\D/g, '').slice(-1);
    setMfaDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleMfaKey = (i, e) => {
    if (e.key === 'Backspace' && !mfaDigits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleMfaVerify = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('role'); }, 700);
  };

  const handleEnter = () => {
    onAuthenticated(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Green glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-xl mb-4">
            <span className="text-white font-bold text-xl tracking-tight">DC</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">DCSMS</h1>
          <p className="text-slate-400 text-sm mt-1">Data Center Sustainability Management</p>
          <p className="text-slate-500 text-xs mt-0.5">Meridian Retail Group · 12 Global Facilities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-visible">

          {/* ── LOGIN STEP ── */}
          {step === 'login' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Sign in</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Secure access to sustainability data</p>
                </div>
                <AnnotationBadge
                  align="right"
                  storyIds={['TEAMB7-14', 'TEAMB7-17']}
                  fields={['facility_id', 'data_source_type']}
                  rationale="Supports TEAMB7-14 (Secure Login + MFA). Azure AD SSO integration per CIO requirement. Role-based routing post-auth per TEAMB7-17. MFA enforced for all users per InfoSec policy."
                  role="All roles — entry point to DCSMS"
                />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400 transition"
                    placeholder="you@meridianretail.com"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <span className="text-xs text-emerald-600 cursor-pointer hover:underline">Forgot password?</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10 transition"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Sign in
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-400">or continue with</span>
                </div>
              </div>

              <button
                onClick={handleAzureSSO}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-slate-300 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60 text-slate-700 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                {/* Microsoft logo */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="0.5" y="0.5" width="8" height="8" fill="#F25022"/>
                  <rect x="9.5" y="0.5" width="8" height="8" fill="#7FBA00"/>
                  <rect x="0.5" y="9.5" width="8" height="8" fill="#00A4EF"/>
                  <rect x="9.5" y="9.5" width="8" height="8" fill="#FFB900"/>
                </svg>
                Sign in with Azure AD
              </button>

              <p className="text-center text-xs text-slate-400 mt-5">
                Protected by Microsoft Entra ID · MFA required
              </p>
            </div>
          )}

          {/* ── MFA STEP ── */}
          {step === 'mfa' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-2xl mb-4">
                  <Shield size={26} className="text-slate-700" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Two-factor authentication</h2>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                  Enter the 6-digit code from your Microsoft Authenticator app
                </p>
                <p className="text-slate-400 text-xs mt-1">{email}</p>
              </div>

              <div className="flex gap-2 justify-center mb-6">
                {mfaDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleMfaInput(i, e.target.value)}
                    onKeyDown={e => handleMfaKey(i, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-900 transition"
                  />
                ))}
              </div>

              <button
                onClick={handleMfaVerify}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : 'Verify code'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Zap size={11} />
                Any code accepted in this prototype
              </div>
            </div>
          )}

          {/* ── ROLE SELECT STEP ── */}
          {step === 'role' && (
            <div className="p-8">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Select your role</h2>
                  <p className="text-slate-500 text-sm mt-1">Your role controls screen access and data visibility.</p>
                </div>
                <AnnotationBadge
                  align="right"
                  storyIds={['TEAMB7-17']}
                  fields={['facility_id']}
                  rationale="TEAMB7-17: Role-based access control. Facility Manager role restricts visibility to own facility's raw data. CSuO role enforces read-only access. Role is set at login and drives which screens and data appear."
                  role="All roles"
                />
              </div>

              <div className="space-y-3">
                {roles.map(r => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === r.id
                        ? `${r.color} shadow-sm`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.id}
                      checked={selectedRole === r.id}
                      onChange={() => setSelectedRole(r.id)}
                      className="mt-0.5 accent-emerald-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{r.label}</span>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`} />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                      <div className="text-xs text-slate-400 mt-1">User: {r.user}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleEnter}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                Enter DCSMS
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-5">
          INFO 380 Prototype · Academic deliverable · Sprint 1–3
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
