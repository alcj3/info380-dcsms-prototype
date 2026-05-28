import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell,
} from 'recharts';
import { Lock, TrendingDown, TrendingUp, CheckCircle, AlertTriangle, Minus } from 'lucide-react';
import { kpiMetrics, portfolioTrendData } from '../data.js';
import AnnotationBadge from '../components/AnnotationBadge.jsx';

const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-sm">
      <p className="font-semibold text-slate-700">{label} 2026</p>
      <p className="text-blue-600 font-bold">PUE: {payload[0].value}</p>
      {payload[0].value <= 1.35 && <p className="text-emerald-600 text-xs">✓ At or below target</p>}
    </div>
  );
};

const ExecutiveDashboard = () => {
  const ringData = [
    { name: 'On Track', value: 61 },
    { name: 'Remaining', value: 39 },
  ];

  const statusColors = {
    red: { bar: 'bg-red-500', text: 'text-red-600', badge: 'bg-red-50 text-red-700 border-red-200' },
    amber: { bar: 'bg-amber-400', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    green: { bar: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  return (
    <div className="pb-8 space-y-6">
      {/* Read-only banner */}
      <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 px-5 py-3 rounded-xl text-purple-700 text-sm font-medium">
        <Lock size={15} className="flex-shrink-0" />
        <span>
          <strong>Read-only view</strong> — Chief Sustainability Officer. All data entry and facility-level raw data is hidden per role-based access control.
        </span>
        <AnnotationBadge
          align="right"
          storyIds={['TEAMB7-17', 'TEAMB7-8', 'TEAMB7-29']}
          fields={['pue_value', 'renewable_energy_pct', 'scope1_emissions_kg', 'scope2_emissions_kg']}
          rationale="CSuO stakeholder need: 'I need to show our board measurable year-over-year improvement.' This screen provides executive-level read-only view. Role-based access (TEAMB7-17) hides all data entry and raw facility data — consistent with CSO requirement that compliance team has read access but cannot modify source data."
          role="Chief Sustainability Officer (read-only)"
        />
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Executive Sustainability Summary</h1>
        <p className="text-slate-500 text-sm mt-0.5">YTD 2026 · Meridian Retail Group · 12 Global Facilities</p>
      </div>

      {/* ── TOP 3 SUMMARY CARDS ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Net-Zero Progress */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Net-Zero Progress</p>
              <p className="text-xs text-slate-400 mt-0.5">2040 milestone tracking</p>
            </div>
            <AnnotationBadge
              align="right"
              storyIds={['TEAMB7-29']}
              fields={['pue_value', 'renewable_energy_pct']}
              rationale="Co-design workshop: target-based view was strongest positive reaction. Board needs milestone tracking, not raw numbers. Shows % of 2040 net-zero milestones currently on track."
              role="CSuO"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Donut chart */}
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie
                    data={ringData}
                    cx="50%"
                    cy="50%"
                    innerRadius={34}
                    outerRadius={50}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">61%</div>
                  <div className="text-xs text-slate-500 leading-none">on track</div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                61% of 2040 target milestones on track
              </p>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle size={11} className="text-emerald-500" />
                  <span className="text-slate-600">PPA agreements: 9/12 facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={11} className="text-amber-500" />
                  <span className="text-slate-600">APAC efficiency: behind schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={11} className="text-emerald-500" />
                  <span className="text-slate-600">EU carbon: target met 4/4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Carbon YTD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Portfolio Carbon YTD</p>
            <AnnotationBadge
              align="right"
              storyIds={['TEAMB7-8', 'TEAMB7-29']}
              fields={['scope1_emissions_kg', 'scope2_emissions_kg']}
              rationale="YoY comparison is the primary board KPI per CSuO interview. Scope 1+2 combined gives total organizational carbon footprint per GHG Protocol. 2025 baseline enables meaningful YoY comparison."
              role="CSuO"
            />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-slate-900">142,400</div>
            <div className="text-sm text-slate-500 mt-0.5">tCO₂e Scope 1+2 YTD 2026</div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <TrendingDown size={14} />
                −10.0% YoY
              </div>
              <span className="text-xs text-slate-500">vs. 158,000 same period 2025</span>
            </div>

            <div className="mt-4 bg-slate-50 rounded-lg p-3">
              <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                <span>2025 baseline</span>
                <span className="font-semibold">158,000 tCO₂e</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>2030 target</span>
                <span className="font-semibold text-emerald-600">95,000 tCO₂e (−40%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Compliance Status</p>
            <AnnotationBadge
              align="right"
              storyIds={['TEAMB7-7', 'TEAMB7-26']}
              fields={['reporting_period', 'data_source_type']}
              rationale="CSuO needs high-level compliance visibility without seeing raw facility data. Shows report readiness status for each regulatory framework. SECR pending status driven by submission gaps (TEAMB7-26)."
              role="CSuO"
            />
          </div>

          <div className="space-y-3 mt-2">
            <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">CSRD Draft Ready</p>
                <p className="text-xs text-emerald-700 mt-0.5">Full Year 2025 · Generated 2026-05-28</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">SECR: 2 Facilities Pending</p>
                <p className="text-xs text-amber-700 mt-0.5">Singapore · Tokyo · Data due May 31</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Minus size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">CDP Questionnaire</p>
                <p className="text-xs text-blue-700 mt-0.5">Opens July 2026 · Data collection ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI CARDS (simplified, no edit) ── */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-base font-semibold text-slate-900">Portfolio KPI Summary — 2026 Targets</h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-29</span>
          <AnnotationBadge
            storyIds={['TEAMB7-29']}
            fields={['pue_value', 'renewable_energy_pct', 'water_usage_m3']}
            rationale="Same KPI data as analyst view but with no edit controls visible. Read-only access enforced by role. Board reporting requires current vs. target for all four key metrics."
            role="CSuO (read-only)"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {kpiMetrics.map(metric => {
            const progress = metric.direction === 'lower'
              ? Math.min((metric.target / metric.current) * 100, 100)
              : Math.min((metric.current / metric.target) * 100, 100);
            const colors = statusColors[metric.status];
            const valStr = metric.unit === '%' ? `${metric.current}%` : `${metric.current}${metric.unit ? ' ' + metric.unit : ''}`;

            return (
              <div key={metric.key} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{metric.label}</p>
                <div className="text-2xl font-bold text-slate-900 mb-1">{valStr}</div>
                <div className={`text-xs font-semibold ${colors.text} mb-2`}>
                  Target: {metric.targetLabel}
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                    {metric.statusLabel}
                  </span>
                  <span className="text-xs text-slate-400">{Math.round(progress)}% to target</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TREND LINE CHART ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-slate-900">Portfolio PUE Trend — Jan to May 2026</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-8</span>
              <AnnotationBadge
                storyIds={['TEAMB7-8', 'TEAMB7-29']}
                fields={['pue_value']}
                rationale="CSuO stakeholder need: board presentation requires visible downward trend toward target. Monthly aggregate PUE trend shows portfolio-wide improvement trajectory. Dashed line at 1.35 makes target gap immediately visible."
                role="CSuO (read-only)"
              />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Portfolio-average Power Usage Effectiveness · trending toward 2026 target of ≤1.35</p>
          </div>

          <div className="ml-auto flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <TrendingDown size={13} />
            −0.09 pts Jan→May · Trend: improving
          </div>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={portfolioTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[1.3, 1.6]}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v.toFixed(2)}
              />
              <Tooltip content={<TrendTooltip />} />
              <ReferenceLine
                y={1.35}
                stroke="#10b981"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                label={{
                  value: 'Target: 1.35',
                  position: 'insideTopRight',
                  fill: '#10b981',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="pue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-blue-500 rounded" />
              Portfolio Average PUE
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-emerald-500 rounded border-dashed" style={{ borderTop: '2px dashed #10b981', height: 0 }} />
              <div className="w-6 border-t-2 border-dashed border-emerald-500" />
              2026 Target (≤1.35)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
