import { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

const AnnotationBadge = ({ storyIds = [], fields = [], rationale = '', role = '', align = 'left' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const popupClass = align === 'right'
    ? 'right-0 left-auto'
    : 'left-0';

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors flex-shrink-0"
        title="Design annotation"
        aria-label="Show design annotation"
      >
        <Info size={11} />
      </button>

      {open && (
        <div
          className={`absolute z-[100] top-7 ${popupClass} w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 text-sm`}
          style={{ minWidth: '300px' }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Design Annotation</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-0.5 transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {storyIds.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
                  Jira Story IDs
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {storyIds.map(id => (
                    <span
                      key={id}
                      className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-mono border border-blue-100"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {fields.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1.5">
                  Data Dictionary Fields
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {fields.map(f => (
                    <span
                      key={f}
                      className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-mono border border-emerald-100"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Design Rationale
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{rationale}</p>
            </div>

            {role && (
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1.5">
                  User Role
                </div>
                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md text-xs border border-purple-100">
                  {role}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotationBadge;
