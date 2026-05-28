import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine, LineChart, Line,
} from 'recharts';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { facilities, kpiMetrics, pueChartData } from '../data.js';
import AnnotationBadge from '../components/AnnotationBadge.jsx';

const sourceBadge = (source) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${
    source === 'AUTO'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-700 border-amber-200'
  }`}>
    {source}
  </span>
);

const statusBadge = (submitted) => submitted
  ? <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-xs"><CheckCircle size={12} /> Submitted</span>
  : <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs"><AlertTriangle size={12} /> Pending ⚠</span>;

const statusColors = {
  red: {
    bar: 'bg-red-500',
    text: 'text-red-600',
    badge: 'bg-red-50 text-red-700 border-red-200',
    spark: '#ef4444',
  },
  amber: {
    bar: 'bg-amber-400',
    text: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    spark: '#f59e0b',
  },
  green: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    spark: '#10b981',
  },
};

const SparkLine = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={36}>
    <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

const PUETooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const color = val <= 1.35 ? '#10b981' : val <= 1.50 ? '#f59e0b' : '#ef4444';
  const verdict = val <= 1.35 ? '✓ Below target' : val <= 1.50 ? '⚠ Approaching threshold' : '✗ Above threshold';
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      <p style={{ color }} className="font-bold">PUE: {val.toFixed(2)}</p>
      <p className="text-xs text-slate-500 mt-0.5">{verdict}</p>
    </div>
  );
};

const KPICard = ({ metric }) => {
  const progress = metric.direction === 'lower'
    ? Math.min((metric.target / metric.current) * 100, 100)
    : Math.min((metric.current / metric.target) * 100, 100);

  const colors = statusColors[metric.status];
  const valueStr = metric.unit === '%'
    ? `${metric.current}%`
    : `${metric.current}${metric.unit ? ' ' + metric.unit : ''}`;
  const targetStr = `${metric.targetLabel}${metric.unit && metric.unit !== '%' ? ' ' + metric.unit : ''}`;

  const trendDir = metric.direction === 'lower'
    ? (metric.sparkline[5]?.value < metric.sparkline[0]?.value ? 'good' : 'bad')
    : (metric.sparkline[5]?.value > metric.sparkline[0]?.value ? 'good' : 'bad');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{metric.label}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-slate-900">{valueStr}</span>
            {metric.unit !== '%' && metric.unit && (
              <span className="text-xs text-slate-400">{metric.unit}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {trendDir === 'good'
            ? <TrendingDown size={14} className="text-emerald-500" />
            : <TrendingUp size={14} className="text-red-500" />}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
            {metric.statusLabel}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Progress toward target</span>
          <span className={`font-semibold ${colors.text}`}>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${colors.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Current: <strong className="text-slate-600">{valueStr}</strong></span>
          <span>Target: <strong className="text-slate-600">{targetStr}</strong></span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-2">
        <p className="text-xs text-slate-400 mb-1">6-month trend (Dec–May)</p>
        <SparkLine data={metric.sparkline} color={statusColors[metric.status].spark} />
      </div>
    </div>
  );
};

const AnalystDashboard = () => {
  const pending = facilities.filter(f => !f.submitted);

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Portfolio Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">May 2026 reporting period · 12 facilities · {pending.length} pending submission{pending.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {pending.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium">
              <AlertTriangle size={13} />
              {pending.length} facilit{pending.length !== 1 ? 'ies' : 'y'} pending — deadline May 31
            </div>
          )}
        </div>
      </div>

      {/* ══ SECTION A: Submission Status ══ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-slate-900">Submission Status</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-26</span>
              <AnnotationBadge
                storyIds={['TEAMB7-26']}
                fields={['data_timestamp', 'data_source_type', 'reporting_period']}
                rationale="Replaces the analyst's handwritten checklist observed during field research. Centralizes submission visibility for all 12 facilities. data_timestamp drives the submitted/pending status. Supports TEAMB7-26."
                role="Sustainability Analyst"
              />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">May 2026 · {facilities.filter(f => f.submitted).length}/{facilities.length} submitted</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> Submitted
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" /> Pending
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Facility</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Region</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Data Source</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Submitted</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {facilities.map(f => (
                <tr
                  key={f.id}
                  className={`transition-colors ${!f.submitted ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-slate-50/60'}`}
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900">{f.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{f.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                      f.region === 'EU' ? 'bg-blue-100 text-blue-700' :
                      f.region === 'NA' ? 'bg-violet-100 text-violet-700' :
                      f.region === 'APAC' ? 'bg-orange-100 text-orange-700' :
                      'bg-pink-100 text-pink-700'
                    }`}>
                      {f.region}
                    </span>
                  </td>
                  <td className="px-4 py-3">{sourceBadge(f.source)}</td>
                  <td className="px-4 py-3 text-center">
                    {f.submitted
                      ? <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                      : <span className="text-slate-300 text-lg mx-auto block text-center">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{f.timestamp}</td>
                  <td className="px-4 py-3">{statusBadge(f.submitted)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ SECTION B: Target Progress KPIs ══ */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-base font-semibold text-slate-900">2026 Annual Target Progress</h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-29</span>
          <AnnotationBadge
            storyIds={['TEAMB7-29']}
            fields={['pue_value', 'renewable_energy_pct', 'water_usage_m3', 'scope2_emissions_kg']}
            rationale="Co-design workshop finding: target-based view produced the strongest positive reaction across all roles. Stakeholders need to track progress against named commitments, not just raw numbers. Supports TEAMB7-29."
            role="Sustainability Analyst, CSuO"
          />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiMetrics.map(metric => (
            <KPICard key={metric.key} metric={metric} />
          ))}
        </div>
      </div>

      {/* ══ SECTION C: PUE by Facility ══ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-slate-900">PUE by Facility</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-8</span>
              <AnnotationBadge
                storyIds={['TEAMB7-8']}
                fields={['pue_value', 'data_source_type', 'facility_id']}
                rationale="Supports TEAMB7-8 (Sustainability Performance Dashboard). Bar color encodes PUE performance band. data_source_type badge distinguishes measured vs. manual data per data dictionary. Dashed reference line at portfolio target (1.35)."
                role="Sustainability Analyst"
              />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Power Usage Effectiveness — May 2026 · lower is better</p>
          </div>

          <div className="ml-auto flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" /> ≤ 1.35 (On Target)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-400 rounded-sm inline-block" /> 1.35–1.50 (Watch)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-500 rounded-sm inline-block" /> &gt; 1.50 (Critical)
            </span>
          </div>
        </div>

        <div className="p-5">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={pueChartData}
              layout="vertical"
              margin={{ top: 5, right: 60, left: 90, bottom: 5 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                domain={[1.0, 2.0]}
                tickCount={6}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={82}
                tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<PUETooltip />} cursor={{ fill: '#f8fafc' }} />
              <ReferenceLine
                x={1.35}
                stroke="#64748b"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                label={{
                  value: 'Portfolio Target: 1.35',
                  position: 'top',
                  fill: '#64748b',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <Bar dataKey="pue" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {pueChartData.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={entry.pue <= 1.35 ? '#10b981' : entry.pue <= 1.50 ? '#f59e0b' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
