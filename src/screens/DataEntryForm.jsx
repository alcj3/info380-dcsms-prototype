import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ChevronDown, Trash2, Save, Send } from 'lucide-react';
import AnnotationBadge from '../components/AnnotationBadge.jsx';

const empty = {
  energy_consumption: '',
  energy_unit: 'kWh',
  pue_value: '',
  renewable_energy_pct: '',
  water_usage_m3: '',
  scope1_emissions_kg: '',
  scope2_emissions_kg: '',
  confidence_level: '',
  anomaly_note: '',
};

const FieldLabel = ({ label, required, children, annotation }) => (
  <div className="flex items-center gap-1.5 mb-1.5">
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {annotation && annotation}
  </div>
);

const SectionHeader = ({ title, subtitle, storyId, annotation }) => (
  <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-5">
    <div>
      <div className="flex items-center gap-2.5">
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">{title}</h3>
        {storyId && (
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">{storyId}</span>
        )}
        {annotation}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const DataEntryForm = () => {
  const [form, setForm] = useState({ ...empty });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.energy_consumption || Number(form.energy_consumption) <= 0) {
      e.energy_consumption = 'Energy consumption is required and must be a positive number';
    }
    if (!form.pue_value) {
      e.pue_value = 'PUE value is required';
    } else if (Number(form.pue_value) < 1.0 || Number(form.pue_value) > 3.0) {
      e.pue_value = 'PUE must be between 1.0 and 3.0';
    }
    if (!form.water_usage_m3 || Number(form.water_usage_m3) < 0) {
      e.water_usage_m3 = 'Water usage is required';
    }
    if (!form.confidence_level) {
      e.confidence_level = 'Confidence level is required';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  };

  const handleClear = () => {
    if (window.confirm('Clear all form data? This cannot be undone.')) {
      setForm({ ...empty });
      setErrors({});
    }
  };

  const pueWarn = form.pue_value && Number(form.pue_value) > 2.0;
  const estimatedBanner = form.confidence_level === 'Estimated';

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Submission recorded</h2>
          <p className="text-slate-500 text-sm mb-6">May 2026 · Dublin Data Center</p>

          <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Facility</span>
              <span className="text-sm font-semibold text-slate-900">Dublin Data Center (DCF-007-DUB)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Reporting period</span>
              <span className="text-sm font-semibold text-slate-900">May 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-mono text-xs">data_timestamp</span>
              <span className="text-sm font-mono text-slate-900">2026-05-28 10:34:22 UTC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-mono text-xs">confidence_level</span>
              <span className="text-sm font-semibold text-slate-900">{form.confidence_level || 'Measured'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Status</span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-sm font-semibold">
                <CheckCircle size={13} /> SUBMITTED
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg p-3 text-left mb-6">
            <Info size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700 text-xs">
              Dublin is now showing as <strong>submitted</strong> on the analyst dashboard. The <code>data_timestamp</code> was auto-set at submission — it cannot be modified retroactively.
            </p>
          </div>

          <button
            onClick={() => { setSubmitted(false); setForm({ ...empty }); }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Submit another period
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-xl font-bold text-slate-900">Monthly Data Submission</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-4</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">TEAMB7-5</span>
        </div>
        <p className="text-slate-500 text-sm">Dublin Data Center · May 2026 · Please submit by May 31, 2026</p>
      </div>

      {savedDraft && (
        <div className="mb-4 flex items-center gap-2.5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium">
          <Save size={14} />
          Draft saved — you can return to complete this submission.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">

          {/* ── GROUP 1: Facility & Period ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <SectionHeader
              title="Facility & Reporting Period"
              subtitle="Auto-populated from your login context — read-only"
              annotation={
                <AnnotationBadge
                  storyIds={['TEAMB7-14', 'TEAMB7-17']}
                  fields={['facility_id', 'reporting_period', 'data_timestamp', 'data_source_type']}
                  rationale="facility_id and reporting_period are auto-populated from auth context to prevent entry errors. data_source_type is auto-set to MANUAL for this submission path — enum constraint prevents typos. data_timestamp is read-only and server-set on submit; drives submitted/pending status in TEAMB7-26. Cannot be future-dated."
                  role="Facility Manager"
                />
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Facility ID" />
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono">
                  DCF-007-DUB
                </div>
              </div>
              <div>
                <FieldLabel label="Facility Name" />
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500">
                  Dublin Data Center
                </div>
              </div>
              <div>
                <FieldLabel label="Reporting Period" />
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500">
                  May 2026
                </div>
              </div>
              <div>
                <FieldLabel label="Data Source Type" />
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm flex items-center gap-2">
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">
                    MANUAL
                  </span>
                  <span className="text-slate-400 text-xs">Auto-set for this path</span>
                </div>
              </div>
              <div className="col-span-2">
                <FieldLabel label="Submission Timestamp" />
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 italic">
                  Will be recorded automatically on submission · Cannot be future-dated
                </div>
              </div>
            </div>
          </div>

          {/* ── GROUP 2: Energy Data ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <SectionHeader
              title="Energy Data"
              subtitle="Required fields — all values stored in kWh"
              storyId="TEAMB7-4 / TEAMB7-5"
              annotation={
                <AnnotationBadge
                  storyIds={['TEAMB7-4', 'TEAMB7-5']}
                  fields={['energy_consumption', 'pue_value', 'renewable_energy_pct']}
                  rationale="energy_consumption: decimal type, required, positive only. Unit dropdown auto-converts to kWh on save — eliminates analyst's manual unit reconciliation (6 incidents in past 12 months per incident log). pue_value range 1.0–3.0 enforced with soft warning above 2.0. Supports TEAMB7-4 and TEAMB7-5."
                  role="Facility Manager"
                />
              }
            />

            <div className="space-y-4">
              {/* Energy Consumption */}
              <div>
                <FieldLabel
                  label="Energy Consumption"
                  required
                  annotation={
                    <AnnotationBadge
                      storyIds={['TEAMB7-4', 'TEAMB7-5']}
                      fields={['energy_consumption']}
                      rationale="Decimal type, required, positive only. Unit dropdown auto-converts to kWh before saving — eliminates 6 annual unit-conversion incidents observed in incident log. Stored value always in kWh regardless of input unit."
                      role="Facility Manager"
                    />
                  }
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={form.energy_consumption}
                    onChange={e => set('energy_consumption', e.target.value)}
                    placeholder="e.g. 4850000"
                    min="0"
                    step="any"
                    className={`flex-1 px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                      errors.energy_consumption
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-400'
                    }`}
                  />
                  <div className="relative">
                    <select
                      value={form.energy_unit}
                      onChange={e => set('energy_unit', e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white cursor-pointer"
                    >
                      <option>kWh</option>
                      <option>MWh</option>
                      <option>MJ</option>
                      <option>GJ</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                {form.energy_unit !== 'kWh' && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Info size={11} />
                    Will be auto-converted to kWh on save
                  </p>
                )}
                {errors.energy_consumption && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {errors.energy_consumption}
                  </p>
                )}
              </div>

              {/* PUE Value */}
              <div>
                <FieldLabel
                  label="Power Usage Effectiveness (PUE)"
                  required
                  annotation={
                    <AnnotationBadge
                      storyIds={['TEAMB7-4']}
                      fields={['pue_value']}
                      rationale="pue_value: decimal 1.0–3.0. Soft warning (not hard error) above 2.0 preserves data entry for genuinely unusual conditions while flagging data quality concern. Dublin 2026 target: ≤1.35."
                      role="Facility Manager"
                    />
                  }
                />
                <input
                  type="number"
                  value={form.pue_value}
                  onChange={e => set('pue_value', e.target.value)}
                  placeholder="e.g. 1.32"
                  min="1.0"
                  max="3.0"
                  step="0.01"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                    errors.pue_value
                      ? 'border-red-400 focus:ring-red-200 bg-red-50'
                      : pueWarn
                      ? 'border-amber-400 focus:ring-amber-200 bg-amber-50/30'
                      : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-400'
                  }`}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Total facility energy ÷ IT equipment energy. Lower is better. Dublin target: ≤ 1.35
                </p>
                {pueWarn && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertTriangle size={11} />
                    PUE above 2.0 is unusually high — please verify before submitting
                  </p>
                )}
                {errors.pue_value && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {errors.pue_value}
                  </p>
                )}
              </div>

              {/* Renewable % */}
              <div>
                <FieldLabel
                  label="Renewable Energy %"
                  annotation={
                    <AnnotationBadge
                      storyIds={['TEAMB7-4']}
                      fields={['renewable_energy_pct']}
                      rationale="renewable_energy_pct: integer 0–100. Optional field — not all facilities have reliable renewable data. Defaults to 0 if omitted and is clearly flagged in analyst view."
                      role="Facility Manager"
                    />
                  }
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.renewable_energy_pct}
                    onChange={e => set('renewable_energy_pct', e.target.value)}
                    placeholder="e.g. 78"
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
                  />
                  <span className="text-sm text-slate-500 font-medium">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── GROUP 3: Water & Carbon ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <SectionHeader
              title="Water & Carbon Emissions"
              subtitle="Scope 1 = direct emissions · Scope 2 = from purchased electricity"
              annotation={
                <AnnotationBadge
                  storyIds={['TEAMB7-4', 'TEAMB7-5']}
                  fields={['water_usage_m3', 'scope1_emissions_kg', 'scope2_emissions_kg']}
                  rationale="Separate Scope 1 and Scope 2 fields match CSRD Article 19a requirements — both must be reported independently for regulatory submissions. water_usage_m3 is required for water stewardship reporting."
                  role="Facility Manager"
                />
              }
            />

            <div className="space-y-4">
              <div>
                <FieldLabel label="Water Usage (m³)" required />
                <input
                  type="number"
                  value={form.water_usage_m3}
                  onChange={e => set('water_usage_m3', e.target.value)}
                  placeholder="e.g. 1820"
                  min="0"
                  step="any"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                    errors.water_usage_m3
                      ? 'border-red-400 focus:ring-red-200 bg-red-50'
                      : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-400'
                  }`}
                />
                {errors.water_usage_m3 && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> {errors.water_usage_m3}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel
                    label="Scope 1 Emissions (kg CO₂e)"
                    annotation={
                      <AnnotationBadge
                        storyIds={['TEAMB7-4']}
                        fields={['scope1_emissions_kg']}
                        rationale="scope1_emissions_kg: decimal. Direct emissions — e.g. refrigerant leaks, on-site generators. Stored in kg CO₂e; converted to tCO₂e in analyst and compliance views."
                        role="Facility Manager"
                      />
                    }
                  />
                  <input
                    type="number"
                    value={form.scope1_emissions_kg}
                    onChange={e => set('scope1_emissions_kg', e.target.value)}
                    placeholder="e.g. 12400"
                    min="0"
                    step="any"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
                  />
                  <p className="text-xs text-slate-500 mt-1">Direct emissions e.g. refrigerant leaks</p>
                </div>

                <div>
                  <FieldLabel
                    label="Scope 2 Emissions (kg CO₂e)"
                    annotation={
                      <AnnotationBadge
                        storyIds={['TEAMB7-4']}
                        fields={['scope2_emissions_kg']}
                        rationale="scope2_emissions_kg: decimal. From purchased electricity. Emissions factor is applied automatically based on grid region (e.g. Dublin: SEAI grid factor). Stored as kg CO₂e in data dictionary."
                        role="Facility Manager"
                      />
                    }
                  />
                  <input
                    type="number"
                    value={form.scope2_emissions_kg}
                    onChange={e => set('scope2_emissions_kg', e.target.value)}
                    placeholder="e.g. 187300"
                    min="0"
                    step="any"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
                  />
                  <p className="text-xs text-slate-500 mt-1">From purchased electricity</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── GROUP 4: Data Quality ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <SectionHeader
              title="Data Quality & Notes"
              subtitle="Transparency about data quality improves report accuracy"
              storyId="TEAMB7-25"
              annotation={
                <AnnotationBadge
                  storyIds={['TEAMB7-25']}
                  fields={['confidence_level', 'anomaly_note']}
                  rationale="confidence_level and anomaly_note together address a co-design finding: managers need to attach context to anomalies so a data spike doesn't 'just look bad' to analysts. Estimated data is accepted and labeled — not silently rejected. Supports TEAMB7-25."
                  role="Facility Manager"
                />
              }
            />

            <div className="space-y-4">
              {/* Confidence Level */}
              <div>
                <FieldLabel
                  label="Data Confidence Level"
                  required
                  annotation={
                    <AnnotationBadge
                      storyIds={['TEAMB7-25']}
                      fields={['confidence_level']}
                      rationale="Enum: Measured / Estimated / Manual-Calculated. Carried through to analyst dashboards and compliance reports as a badge. Designed to be transparent — estimated data is accepted and clearly labeled rather than rejected."
                      role="Facility Manager"
                    />
                  }
                />
                <div className="relative">
                  <select
                    value={form.confidence_level}
                    onChange={e => set('confidence_level', e.target.value)}
                    className={`w-full appearance-none pl-3.5 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition cursor-pointer ${
                      errors.confidence_level
                        ? 'border-red-400 focus:ring-red-200 bg-red-50 text-slate-900'
                        : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-400 text-slate-900 bg-white'
                    } ${!form.confidence_level ? 'text-slate-400' : ''}`}
                  >
                    <option value="">Select confidence level…</option>
                    <option value="Measured">Measured — from monitoring system or smart meter</option>
                    <option value="Estimated">Estimated — calculated or approximated</option>
                    <option value="Manual-Calculated">Manual-Calculated — derived from manual readings</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Be transparent — estimated data is accepted and will be labeled accordingly in reports
                </p>
                {errors.confidence_level && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> {errors.confidence_level}
                  </p>
                )}
              </div>

              {/* Estimated banner */}
              {estimatedBanner && (
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3.5">
                  <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Estimated data will be flagged with an <strong>ESTIMATED</strong> badge in analyst dashboards
                    and compliance reports per data dictionary field <code className="bg-amber-100 px-1 rounded">confidence_level</code>.
                    This is expected and acceptable — the flag provides transparency rather than blocking submission.
                  </p>
                </div>
              )}

              {/* Anomaly Note */}
              <div>
                <FieldLabel
                  label="Anomaly Explanation (if any)"
                  annotation={
                    <AnnotationBadge
                      storyIds={['TEAMB7-25']}
                      fields={['anomaly_note']}
                      rationale="Co-design workshop finding: Facility Managers needed a way to attach context to anomalies so that a data spike doesn't 'just look bad' to analysts reviewing reports. anomaly_note carries through to compliance reports and audit trail alongside any system-flagged anomaly. Optional — leave blank if no anomalies to report."
                      role="Facility Manager"
                    />
                  }
                />
                <textarea
                  value={form.anomaly_note}
                  onChange={e => set('anomaly_note', e.target.value)}
                  placeholder="e.g. Energy spike May 14–16 caused by cooling system failure, not an efficiency regression"
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none transition placeholder-slate-400"
                />
                <p className="text-xs text-slate-500 mt-1">
                  This note will appear in reports alongside any flagged anomalies
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              <Send size={14} />
              Submit Data
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <Save size={14} />
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ml-auto"
            >
              <Trash2 size={14} />
              Clear Form
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3.5">
              <AlertTriangle size={15} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-xs leading-relaxed">
                Please fix {Object.keys(errors).length} validation error{Object.keys(errors).length !== 1 ? 's' : ''} before submitting.
                Required fields are marked with <span className="text-red-500 font-bold">*</span>.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DataEntryForm;
