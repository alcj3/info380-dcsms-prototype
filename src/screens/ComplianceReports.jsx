import { useState } from 'react';
import { FileText, Download, ChevronDown, ChevronRight, ExternalLink, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { facilities } from '../data.js';
import AnnotationBadge from '../components/AnnotationBadge.jsx';

const reportData = [
  { name: 'Dublin',      energy: '58,200', pue: '1.28', s1: '12.4', s2: '187.3', renewable: '78%', source: 'AUTO',   confidence: 'Measured' },
  { name: 'Frankfurt',   energy: '61,400', pue: '1.31', s1: '9.8',  s2: '198.2', renewable: '82%', source: 'AUTO',   confidence: 'Measured' },
  { name: 'N. Virginia', energy: '72,100', pue: '1.38', s1: '15.2', s2: '231.4', renewable: '65%', source: 'AUTO',   confidence: 'Measured' },
  { name: 'Chicago',     energy: '68,900', pue: '1.35', s1: '11.8', s2: '215.6', renewable: '71%', source: 'AUTO',   confidence: 'Measured' },
  { name: 'Seattle',     energy: '54,300', pue: '1.41', s1: '8.4',  s2: '174.2', renewable: '88%', source: 'MANUAL', confidence: 'Manual-Calculated' },
  { name: 'Singapore',   energy: '47,800', pue: '1.67', s1: '18.6', s2: '154.1', renewable: '41%', source: 'MANUAL', confidence: 'Estimated' },
  { name: 'São Paulo',   energy: '39,200', pue: '1.58', s1: '14.2', s2: '126.4', renewable: '35%', source: 'MANUAL', confidence: 'Manual-Calculated' },
  { name: 'Amsterdam',   energy: '55,800', pue: '1.30', s1: '7.6',  s2: '179.4', renewable: '91%', source: 'AUTO',   confidence: 'Measured' },
  { name: 'Paris',       energy: '49,600', pue: '1.44', s1: '10.2', s2: '159.7', renewable: '75%', source: 'MANUAL', confidence: 'Manual-Calculated' },
  { name: 'Sydney',      energy: '43,200', pue: '1.36', s1: '9.1',  s2: '138.9', renewable: '62%', source: 'AUTO',   confidence: 'Measured' },
  { name: 'Toronto',     energy: '51,700', pue: '1.33', s1: '8.9',  s2: '165.3', renewable: '73%', source: 'AUTO',   confidence: 'Measured' },
  { name: 'Tokyo',       energy: '44,100', pue: '1.72', s1: '16.8', s2: '141.6', renewable: '38%', source: 'MANUAL', confidence: 'Estimated' },
];

const auditEntries = [
  {
    field: 'energy_consumption for Dublin',
    source: 'EcoStruxure export',
    ingested: '2026-05-02 08:14 UTC',
    note: 'No manual adjustments · automated ingestion · checksum verified',
    factor: null,
  },
  {
    field: 'scope2_emissions_kg for Singapore',
    source: 'Manual entry by J. Tan',
    ingested: '2026-05-14',
    note: 'Emissions factor applied: Singapore grid 0.4085 kgCO₂/kWh (IEA 2024, updated 2026-01-15)',
    factor: 'IEA 2024 Singapore grid factor · 0.4085 kgCO₂/kWh',
  },
  {
    field: 'pue_value for Tokyo',
    source: 'Manual entry — J. Yamamoto',
    ingested: '2026-05-12',
    note: 'Confidence level: Estimated · anomaly_note present: "Cooling system upgrade in progress"',
    factor: null,
  },
  {
    field: 'renewable_energy_pct for Seattle',
    source: 'Manual-Calculated — R. Davis',
    ingested: '2026-05-06 16:05 UTC',
    note: 'Derived from utility green tariff documentation + on-site solar output log',
    factor: null,
  },
];

const sourceBadge = (source) => (
  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
    source === 'AUTO'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : 'bg-amber-50 text-amber-700 border border-amber-200'
  }`}>
    {source}
  </span>
);

const confidenceBadge = (c) => {
  if (c === 'Measured') return <span className="text-xs text-emerald-600 font-medium">{c}</span>;
  if (c === 'Estimated') return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-xs font-semibold">ESTIMATED</span>;
  return <span className="text-xs text-blue-600 font-medium">{c}</span>;
};

const ComplianceReports = ({ currentRole }) => {
  const [reportType, setReportType] = useState('CSRD Annual Report');
  const [period, setPeriod] = useState('Full Year 2025');
  const [selectedFacilities, setSelectedFacilities] = useState(
    new Set(facilities.map(f => f.name))
  );
  const [generated, setGenerated] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [mockSubmitted, setMockSubmitted] = useState(false);

  const isReadOnly = currentRole === 'csuo';

  const toggleFacility = (name) => {
    if (isReadOnly) return;
    setSelectedFacilities(prev => {
      const n = new Set(prev);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });
  };

  const filteredReport = reportData.filter(r => selectedFacilities.has(r.name));
  const manualCount = filteredReport.filter(r => r.source === 'MANUAL').length;

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-slate-900">Compliance Report Generation</h1>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-7</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-12</span>
            <AnnotationBadge
              storyIds={['TEAMB7-7', 'TEAMB7-12', 'TEAMB7-11']}
              fields={['data_source_type', 'confidence_level', 'anomaly_note', 'scope1_emissions_kg', 'scope2_emissions_kg']}
              rationale="TEAMB7-7: automated report drafts. TEAMB7-12: regulatory template updates (CSRD/SECR). TEAMB7-11: audit trail — compliance lead requirement: trace any reported number back to its source. data_source_type and confidence_level from data dictionary surface directly in report columns, satisfying CSRD Article 19a auditability."
              role="Sustainability Analyst, CSuO (read-only)"
            />
          </div>
          <p className="text-slate-500 text-sm">
            CSRD · SECR · Custom Export · {isReadOnly ? 'Read-only view' : 'Analyst access'}
          </p>
        </div>
        {isReadOnly && (
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium">
            <Lock size={12} />
            CSuO read-only — report generation is disabled
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* ── LEFT PANEL: Config ── */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Report Configuration</h3>
              <AnnotationBadge
                storyIds={['TEAMB7-7', 'TEAMB7-12']}
                fields={['reporting_period']}
                rationale="TEAMB7-12: report template is configurable — type and period selection drives which regulatory schema is applied (CSRD Article 19a vs. SECR). Facility filter allows partial reports for regional submissions."
                role="Sustainability Analyst"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Report Type
                </label>
                <div className="relative">
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    disabled={isReadOnly}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white disabled:bg-slate-50 disabled:text-slate-500 cursor-pointer"
                  >
                    <option>CSRD Annual Report</option>
                    <option>SECR Annual Report</option>
                    <option>Custom Export</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Reporting Period
                </label>
                <div className="relative">
                  <select
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    disabled={isReadOnly}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white disabled:bg-slate-50 disabled:text-slate-500 cursor-pointer"
                  >
                    <option>Q1 2026</option>
                    <option>Q2 2026</option>
                    <option>Full Year 2025</option>
                    <option>Custom Range</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Facilities ({selectedFacilities.size}/{facilities.length})
                </label>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {facilities.map(f => (
                    <label
                      key={f.name}
                      className={`flex items-center gap-2 text-xs py-1 px-1.5 rounded cursor-pointer hover:bg-slate-50 ${isReadOnly ? 'opacity-60 cursor-default' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFacilities.has(f.name)}
                        onChange={() => toggleFacility(f.name)}
                        disabled={isReadOnly}
                        className="accent-emerald-600"
                      />
                      <span className="text-slate-700 font-medium">{f.name}</span>
                      <span className="text-slate-400 ml-auto">{f.region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {!isReadOnly && (
                <button
                  onClick={() => setGenerated(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText size={14} />
                  Generate Report Draft
                </button>
              )}

              {isReadOnly && generated === false && (
                <button
                  onClick={() => setGenerated(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={14} />
                  View Latest Draft
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Preview ── */}
        <div className="flex-1 min-w-0">
          {!generated ? (
            <div className="bg-white rounded-xl border border-slate-200 border-dashed h-80 flex flex-col items-center justify-center text-center p-8">
              <FileText size={36} className="text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Configure your report and click Generate</p>
              <p className="text-slate-400 text-xs mt-1">Preview will appear here with all {selectedFacilities.size} selected facilities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Report header card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">DRAFT</span>
                        <span className="text-slate-300 text-xs">Not for official submission</span>
                      </div>
                      <h2 className="text-base font-bold">{reportType} — Meridian Retail Group</h2>
                      <p className="text-slate-300 text-sm mt-0.5">{period} · {filteredReport.length} facilities</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <div>Generated: 2026-05-28 10:41 UTC</div>
                      <div>By: A. Rodriguez (Sustainability Analyst)</div>
                      <div className="mt-1 text-emerald-400 font-medium">
                        {reportType === 'CSRD Annual Report' ? 'CSRD Article 19a' : 'SECR 2018 Regulations'}
                      </div>
                    </div>
                  </div>
                </div>

                {manualCount > 0 && (
                  <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-700">
                    <AlertTriangle size={13} />
                    <strong>{manualCount} facilit{manualCount !== 1 ? 'ies' : 'y'}</strong> submitted MANUAL data.
                    Estimated/Manual-Calc values are flagged per CSRD Article 19a audit trail requirements.
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-4 py-3 font-semibold text-slate-600 uppercase tracking-wide">Facility</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 uppercase tracking-wide">Energy (MWh)</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 uppercase tracking-wide">PUE</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 uppercase tracking-wide">Scope 1 (tCO₂e)</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 uppercase tracking-wide">Scope 2 (tCO₂e)</th>
                        <th className="text-right px-3 py-3 font-semibold text-slate-600 uppercase tracking-wide">Renewable</th>
                        <th className="text-center px-3 py-3 font-semibold text-slate-600 uppercase tracking-wide">Source</th>
                        <th className="text-left px-3 py-3 font-semibold text-slate-600 uppercase tracking-wide">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredReport.map((row, i) => (
                        <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.confidence === 'Estimated' ? 'bg-amber-50/30' : ''}`}>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{row.name}</td>
                          <td className="px-3 py-2.5 text-right text-slate-600 tabular-nums">{row.energy}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">
                            <span className={`font-semibold ${
                              Number(row.pue) <= 1.35 ? 'text-emerald-600' :
                              Number(row.pue) <= 1.50 ? 'text-amber-600' :
                              'text-red-600'
                            }`}>{row.pue}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-600 tabular-nums">{row.s1}</td>
                          <td className="px-3 py-2.5 text-right text-slate-600 tabular-nums">{row.s2}</td>
                          <td className="px-3 py-2.5 text-right text-slate-600">{row.renewable}</td>
                          <td className="px-3 py-2.5 text-center">{sourceBadge(row.source)}</td>
                          <td className="px-3 py-2.5">{confidenceBadge(row.confidence)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t-2 border-slate-200">
                        <td className="px-4 py-2.5 font-bold text-slate-800 text-xs">TOTAL / AVG</td>
                        <td className="px-3 py-2.5 text-right font-bold text-slate-800 tabular-nums">
                          {filteredReport.reduce((sum, r) => sum + Number(r.energy.replace(',','')), 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-slate-800 tabular-nums">
                          {(filteredReport.reduce((s, r) => s + Number(r.pue), 0) / filteredReport.length).toFixed(2)}
                        </td>
                        <td colSpan={5} className="px-3 py-2.5 text-xs text-slate-500 text-center">
                          Totals in tCO₂e · values converted from kg source data
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── Audit Trail (TEAMB7-11) ── */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setAuditOpen(!auditOpen)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-slate-800">Calculation Audit Trail</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-11</span>
                        <AnnotationBadge
                          storyIds={['TEAMB7-11']}
                          fields={['data_timestamp', 'data_source_type', 'confidence_level', 'anomaly_note']}
                          rationale="TEAMB7-11: full audit trail for each reported value. Compliance Lead requirement: trace any reported number back to its source. Includes ingestion timestamp, emissions factor version, and any manual adjustments. Required for CSRD Article 19a verification."
                          role="Sustainability Analyst"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 text-left">
                        {auditEntries.length} entries · CSRD Article 19a traceability
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform ${auditOpen ? 'rotate-90' : ''}`} />
                </button>

                {auditOpen && (
                  <div className="px-6 pb-5 border-t border-slate-100">
                    <div className="space-y-3 mt-4">
                      {auditEntries.map((entry, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                              {entry.field}
                            </span>
                            <span className="text-xs text-slate-400 flex-shrink-0">{entry.ingested}</span>
                          </div>
                          <p className="text-xs text-slate-600 mb-1">
                            <strong>Source:</strong> {entry.source}
                          </p>
                          <p className="text-xs text-slate-600">{entry.note}</p>
                          {entry.factor && (
                            <div className="mt-2 bg-amber-50 border border-amber-100 rounded px-2.5 py-1.5 text-xs text-amber-700">
                              <strong>Emissions factor:</strong> {entry.factor}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Export buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <Download size={14} />
                  Download PDF
                </button>
                <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <Download size={14} />
                  Download CSV
                </button>
                {!isReadOnly && !mockSubmitted && (
                  <button
                    onClick={() => setMockSubmitted(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ml-auto"
                  >
                    <ExternalLink size={14} />
                    Submit to Regulator (Mock)
                  </button>
                )}
                {mockSubmitted && (
                  <div className="ml-auto flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-lg text-sm font-medium">
                    <CheckCircle size={14} />
                    Mock submission sent — 2026-05-28 10:41 UTC
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceReports;
