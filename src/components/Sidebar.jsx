import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { facilities } from '../data.js';

const regionBadge = {
  EU: 'bg-blue-900/60 text-blue-300',
  NA: 'bg-violet-900/60 text-violet-300',
  APAC: 'bg-orange-900/60 text-orange-300',
  SA: 'bg-pink-900/60 text-pink-300',
};

const Sidebar = ({ currentRole }) => {
  const display = currentRole === 'facility-manager'
    ? facilities.filter(f => f.name === 'Dublin')
    : facilities;

  const submitted = facilities.filter(f => f.submitted).length;
  const pending = facilities.filter(f => !f.submitted).length;

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-60 bg-slate-900 border-r border-slate-700/60 flex flex-col sidebar-scroll overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/60 flex-shrink-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {currentRole === 'facility-manager' ? 'My Facility' : 'All Facilities'}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">May 2026 · {submitted}/{facilities.length} submitted</p>
      </div>

      {/* Facility list */}
      <div className="flex-1 py-1">
        {display.map(f => (
          <div
            key={f.id}
            className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <div className="mt-0.5 flex-shrink-0">
              {f.submitted
                ? <CheckCircle size={13} className="text-emerald-500" />
                : <AlertTriangle size={13} className="text-amber-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 font-medium truncate">{f.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${regionBadge[f.region] || 'bg-slate-700 text-slate-300'}`}>
                  {f.region}
                </span>
                <span className={`text-xs font-medium ${f.source === 'AUTO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {f.source}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="px-4 py-3 border-t border-slate-700/60 bg-slate-800/40 flex-shrink-0">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle size={11} className="text-emerald-500" /> Submitted
            </span>
            <span className="text-emerald-400 font-semibold">{submitted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <AlertTriangle size={11} className="text-amber-400" /> Pending
            </span>
            <span className="text-amber-400 font-semibold">{pending}</span>
          </div>
          <div className="mt-2 bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(submitted / facilities.length) * 100}%` }}
            />
          </div>
          <div className="text-slate-500 text-right">{Math.round((submitted / facilities.length) * 100)}% complete</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
