import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'competency', label: 'Competencies' },
  { key: 'staff', label: 'Laboratory Staffing' },
  { key: 'sops', label: 'SOPs' },
  { key: 'equipment', label: 'Equipment' }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sopBooks, setSopBooks] = useState([]);
  const [allSops, setSops] = useState([]);
  const [tests, setTests] = useState([]);
  const [competencyProcedures, setCompetencyProcedures] = useState([]);
  const [staff, setStaff] = useState([]);
  const [competencyRecords, setCompetencyRecords] = useState([]);
  const [sections, setSections] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [importResult, setImportResult] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showSopForms, setShowSopForms] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [notification, setNotification] = useState(null);

  const [sopBookForm, setSopBookForm] = useState({
    code: '',
    name: '',
    description: '',
    book_number: ''
  });

  const [sopForm, setSopForm] = useState({
    book_id: '',
    index_code: '',
    title: '',
    version: '',
    effective_date: '',
    next_review_date: '',
    scope_distribution: '',
    status: 'active',
    description: ''
  });

  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    section_ids: []
  });

  const [procedureForm, setProcedureForm] = useState({
    title: '', section_id: '', sop_book_id: '', sop_ids: [], equipment_ids: []
  });

  const [competencyForm, setCompetencyForm] = useState({
    staff_id: '',
    procedure_id: '',
    assessment_phase: 'Initial',
    assessment_date: '',
    next_review_date: '',
    competency_status: 'Competent',
    notes: ''
  });

  const [staffForm, setStaffForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: 'active',
    section_ids: []
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [sopBookRes, sopRes, equipmentRes, testRes, procedureRes] = await Promise.all([
      api.get('/sop-books'),
      api.get('/sops'),
      api.get('/equipment'),
      api.get('/tests'),
      api.get('/competency-procedures')
    ]);

    setSopBooks(sopBookRes.data);
    setSops(sopRes.data);
    setEquipment(equipmentRes.data);
    setTests(testRes.data);
    setCompetencyProcedures(procedureRes.data);
    // Keep section selection available even if a separate staff-related request fails.
    const [staffResult, competencyResult, sectionsResult] = await Promise.allSettled([
      api.get('/staff'),
      api.get('/competency-records'),
      api.get('/sections')
    ]);
    if (staffResult.status === 'fulfilled') setStaff(staffResult.value.data);
    if (competencyResult.status === 'fulfilled') setCompetencyRecords(competencyResult.value.data);
    if (sectionsResult.status === 'fulfilled') setSections(sectionsResult.value.data);
  };

  const onChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (endpoint, form, resetFn) => {
    try {
      const payload = endpoint === '/staff'
        ? { ...form, section_ids: form.section_ids.map(Number) }
        : endpoint === '/competency-procedures'
          ? { ...form, section_id: Number(form.section_id), sop_ids: form.sop_ids.map(Number), equipment_ids: form.equipment_ids.map(Number) }
        : endpoint === '/competency-records'
          ? (() => {
            const procedure = competencyProcedures.find((item) => item.id === Number(form.procedure_id));
            return { ...form, staff_id: Number(form.staff_id), test_id: procedure.test_id, sop_ids: procedure.sops.map((sop) => sop.id), assessment_phase: nextAssessmentPhase(form.staff_id, form.procedure_id) };
          })()
          : endpoint === '/equipment'
            ? { name: form.name, section_ids: form.section_ids.map(Number) }
            : form;
      
      console.log('Submitting payload:', payload);
      const result = await api.post(endpoint, payload);
      console.log('Response:', result.data);
      
      if (endpoint === '/equipment' || endpoint === '/staff' || endpoint === '/competency-procedures' || endpoint === '/competency-records') {
        setNotification(endpoint === '/staff' ? `Laboratory staff ${result.data.employee_number} registered successfully.`
          : endpoint === '/competency-procedures' ? `Competency procedure ${result.data.code} registered successfully.`
          : endpoint === '/competency-records' ? 'Competency assessment recorded successfully.'
          : `added "${result.data.name}"`);
        setTimeout(() => setNotification(null), 3000);
        setShowEquipmentForm(false);
      }
      await fetchAll();
      resetFn();
    } catch (error) {
      console.error('Submit error:', error.response?.data || error.message);
      alert('Error saving: ' + (error.response?.data?.detail || error.message));
    }
  };

  const importSOPs = async () => {
    try {
      const result = await api.post('/sop-import');
      setImportResult(result.data);
      await fetchAll();
    } catch (error) {
      setImportResult({ status: 'error', message: error.response?.data?.detail || error.message });
    }
  };

  const resetSopBook = () => setSopBookForm({ code: '', name: '', description: '', book_number: '' });
  const resetSop = () => setSopForm({ book_id: '', index_code: '', title: '', version: '', effective_date: '', next_review_date: '', scope_distribution: '', status: 'active', description: '' });
  const resetEquipment = () => setEquipmentForm({ name: '', section_ids: [] });
  const resetCompetency = () => setCompetencyForm({ staff_id: '', procedure_id: '', assessment_phase: 'Initial', assessment_date: '', next_review_date: '', competency_status: 'Competent', notes: '' });
  const resetProcedure = () => setProcedureForm({ title: '', section_id: '', sop_book_id: '', sop_ids: [], equipment_ids: [] });
  const selectedCompetencySops = allSops.filter((sop) => procedureForm.sop_ids.map(Number).includes(sop.id));

  const addCompetencySop = (sopId) => {
    if (!sopId) return;
    setProcedureForm((current) => current.sop_ids.map(Number).includes(Number(sopId))
      ? current
      : { ...current, sop_ids: [...current.sop_ids, Number(sopId)] });
  };

  const removeCompetencySop = (sopId) => {
    setProcedureForm((current) => ({ ...current, sop_ids: current.sop_ids.filter((id) => Number(id) !== sopId) }));
  };
  const resetStaff = () => setStaffForm({ first_name: '', middle_name: '', last_name: '', email: '', phone: '', status: 'active', section_ids: [] });
  const nextAssessmentPhase = (staffId, procedureId) => {
    const procedure = competencyProcedures.find((item) => item.id === Number(procedureId));
    if (!staffId || !procedure) return 'Initial';
    const phases = new Set(competencyRecords.filter((record) => record.staff_id === Number(staffId) && record.test_id === procedure.test_id).map((record) => record.assessment_phase));
    return !phases.has('Initial') ? 'Initial' : (!phases.has('6-Mo') ? '6-Mo' : 'Annual');
  };

  const panel = () => {
    switch (activeTab) {
      case 'sops': {
        const normalizedBookId = selectedBookId ? Number(selectedBookId) : null;
        const filteredSops = normalizedBookId ? allSops.filter((sop) => sop.book_id === normalizedBookId || sop.book?.id === normalizedBookId) : allSops;
        const currentBook = sopBooks.find((book) => book.id === normalizedBookId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const soonThreshold = new Date(today);
        soonThreshold.setDate(today.getDate() + 30);

        const expiredSops = filteredSops.filter((sop) => sop.next_review_date && new Date(sop.next_review_date) < today);
        const expiringSoonSops = filteredSops.filter((sop) => {
          if (!sop.next_review_date) return false;
          const nextReview = new Date(sop.next_review_date);
          return nextReview >= today && nextReview <= soonThreshold;
        });

        const getSopRowClass = (sop) => {
          if (!sop.next_review_date) return '';
          const nextReview = new Date(sop.next_review_date);
          if (nextReview < today) return 'row-expired';
          if (nextReview <= soonThreshold) return 'row-expiring';
          return '';
        };

        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="SOP Books">
              <div className="panel-content">
                <label className="form-field">
                  <span>Select a book</span>
                  <select className="input" value={selectedBookId || ''} onChange={(e) => setSelectedBookId(e.target.value || null)}>
                    <option value="">All books</option>
                    {sopBooks.map((book) => (
                      <option key={book.id} value={book.id}>{book.code} — {book.name}</option>
                    ))}
                  </select>
                </label>
                <Table columns={['ID', 'Code', 'Name', 'Book #']} data={sopBooks} renderRow={(book) => ([book.id, book.code, book.name, book.book_number || 'N/A'])} />
              </div>
            </Panel>

            <Panel title={currentBook ? `SOPs in ${currentBook.name}` : 'SOP Registry'}>
              {(expiredSops.length > 0 || expiringSoonSops.length > 0) && (
                <div className="alert warning large">
                  {expiredSops.length > 0 && <span className="alert-emphasis">{expiredSops.length} expired</span>}
                  {expiredSops.length > 0 && expiringSoonSops.length > 0 && <span> · </span>}
                  {expiringSoonSops.length > 0 && <span className="alert-emphasis">{expiringSoonSops.length} expiring soon</span>}
                  <span> SOP(s) need attention within 30 days.</span>
                </div>
              )}
              <Table
                columns={['ID', 'Book', 'Index Code', 'Title', 'Version', 'Effective Date', 'Next Review', 'Scope / Distribution']}
                data={filteredSops}
                renderRow={(sop) => ([
                  sop.id,
                  sop.book?.code || 'N/A',
                  sop.index_code,
                  sop.title,
                  sop.version || 'N/A',
                  sop.effective_date || 'N/A',
                  sop.next_review_date || 'N/A',
                  sop.scope_distribution || 'N/A'
                ])}
                rowClassName={getSopRowClass}
              />
            </Panel>

            <Panel title="Import SOPs from docs">
              <div className="panel-content">
                <p>Import SOP books and inventories from <code>docs/Lab_SOPs</code>.</p>
                <button type="button" className="button" onClick={importSOPs}>Import SOPs</button>
                {importResult && (
                  <div className={`import-result ${importResult.status === 'error' ? 'error' : 'success'}`}>
                    {importResult.status === 'error'
                      ? `Error: ${importResult.message}`
                      : `${importResult.books} SOP book(s) imported, ${importResult.sops} SOP(s) imported.`}
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="SOP Management">
              <button type="button" className="button" onClick={() => setShowSopForms((show) => !show)}>
                {showSopForms ? 'Hide' : 'Show'} SOP management
              </button>
              {showSopForms && (
                <div className="panel-stack">
                  <Panel title="Create SOP Book">
                    <Form fields={[
                      { name: 'code', label: 'Book Code', type: 'text' },
                      { name: 'name', label: 'Book Name', type: 'text' },
                      { name: 'description', label: 'Description', type: 'text' },
                      { name: 'book_number', label: 'Book Number', type: 'number' }
                    ]} data={sopBookForm} onChange={onChange(setSopBookForm)} onSubmit={(e) => { e.preventDefault(); submit('/sop-books', sopBookForm, resetSopBook); }} buttonLabel="Save SOP Book" />
                  </Panel>
                  <Panel title="Create SOP">
                    <Form fields={[
                      { name: 'book_id', label: 'SOP Book ID', type: 'number' },
                      { name: 'index_code', label: 'Index Code', type: 'text' },
                      { name: 'title', label: 'Title', type: 'text' },
                      { name: 'version', label: 'Version', type: 'text' },
                      { name: 'effective_date', label: 'Effective Date', type: 'date' },
                      { name: 'next_review_date', label: 'Next Review Date', type: 'date' },
                      { name: 'scope_distribution', label: 'Scope / Distribution', type: 'text' },
                      { name: 'status', label: 'Status', type: 'text' },
                      { name: 'description', label: 'Description', type: 'text' }
                    ]} data={sopForm} onChange={onChange(setSopForm)} onSubmit={(e) => { e.preventDefault(); submit('/sops', sopForm, resetSop); }} buttonLabel="Save SOP" />
                  </Panel>
                </div>
              )}
            </Panel>
          </div>
        );
      }

      case 'dashboard': {
        const uniqueCycles = [...new Set(tests.map((test) => test.competency_cycle).filter(Boolean))];
        return (
          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Executive Dashboard">
              <div className="dashboard-grid">
                <MetricCard label="SOP Books" value={sopBooks.length} />
                <MetricCard label="SOPs" value={allSops.length} />
                <MetricCard label="Staff" value={staff.length} />
                <MetricCard label="Equipment" value={equipment.length} />
                <MetricCard label="Competency Records" value={competencyRecords.length} />
                <MetricCard label="Tests" value={tests.length} />
              </div>
            </Panel>
            <Panel title="Competency Snapshot">
              <div className="dashboard-grid">
                <MetricCard label="Competency Cycles" value={uniqueCycles.length} />
                <MetricCard label="Tests with Competency" value={tests.filter((test) => test.competency_cycle).length} />
                <MetricCard label="Tests with Authorization" value={tests.filter((test) => test.result_authorization_level).length} />
              </div>
              <p className="panel-note">Use the Competency tab to inspect tests, required cycles, authorization levels, and training coverage.</p>
            </Panel>
            <Panel title="Operational Alerts">
              <div className="alert-list">
                <div className="alert-item">
                  <span className="item-label">Missing Cycle</span>
                  <span className="item-value">{tests.filter((test) => !test.competency_cycle).length} tests have no competency cycle set.</span>
                </div>
                <div className="alert-item">
                  <span className="item-label">Missing Authorization</span>
                  <span className="item-value">{tests.filter((test) => !test.result_authorization_level).length} tests have no authorization level set.</span>
                </div>
              </div>
            </Panel>
            <Panel title="Section Analytics">
              <div className="analytics-links" aria-label="Section analytics links">
                <a className="analytics-link sysmex" href="#hematology-live-sysmex-analytics">
                  <span className="analytics-link-kicker">Hematology</span>
                  <span>Live Sysmex Analytics</span>
                </a>
                <a className="analytics-link cobas" href="#chemistry-cobas-analytics">
                  <span className="analytics-link-kicker">Chemistry</span>
                  <span>COBAS Analytics</span>
                </a>
              </div>
              <p className="panel-note">Quick links for the section-level analytics workspaces.</p>
            </Panel>
          </div>
        );
      }

      case 'competency': {
        const sops = procedureForm.sop_book_id
          ? allSops.filter((sop) => sop.book_id === Number(procedureForm.sop_book_id))
          : [];
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {notification && <Notification message={notification} />}
            <Panel title="Register Competency / Test Procedure that Requires Competency">
              <form className="form-grid" onSubmit={(e) => { e.preventDefault(); submit('/competency-procedures', procedureForm, resetProcedure); }}>
                <label className="form-field">
                  <span>Section</span>
                  <select name="section_id" value={procedureForm.section_id} onChange={onChange(setProcedureForm)} className="input" required>
                    <option value="">Select section</option>
                    {sections.map((section) => (<option key={section.id} value={section.id}>{section.code} - {section.name}</option>))}
                  </select>
                </label>
                <label className="form-field">
                  <span>Competency / Test Procedure Title</span>
                  <input name="title" value={procedureForm.title} onChange={onChange(setProcedureForm)} className="input" required />
                </label>
                <label className="form-field">
                  <span>Staff</span>
                  <select name="staff_id" value={competencyForm.staff_id} onChange={onChange(setCompetencyForm)} className="input">
                    <option value="">Select staff</option>
                    {staff.map((s) => (<option key={s.id} value={s.id}>{s.employee_number ? `${s.employee_number} — ` : ''}{s.first_name} {s.last_name}</option>))}
                  </select>
                </label>
                <label className="form-field">
                  <span>Or create Staff</span>
                  <div style={{display: 'flex', gap: 8}}>
                    <input placeholder="First Last" className="input" onFocus={() => setActiveTab('staff')} />
                    <button type="button" className="button" onClick={() => setActiveTab('staff')}>Add</button>
                  </div>
                </label>

                <label className="form-field">
                  <span>Test Procedure</span>
                  <select name="test_id" value={competencyForm.test_id} onChange={onChange(setCompetencyForm)} className="input">
                    <option value="">Select test procedure</option>
                    {tests.map((t) => (<option key={t.id} value={t.id}>{t.code} — {t.name}</option>))}
                  </select>
                </label>

                <div className="form-field sop-selector">
                  <span>Applicable SOPs</span>
                  <select name="sop_book_id" value={procedureForm.sop_book_id} onChange={onChange(setProcedureForm)} className="input">
                    <option value="">First select an SOP book</option>
                    {sopBooks.map((book) => (<option key={book.id} value={book.id}>{book.code} — {book.name}</option>))}
                  </select>
                  <select value="" disabled={!procedureForm.sop_book_id} onChange={(event) => addCompetencySop(event.target.value)} className="input">
                    <option value="">Then add an SOP from the selected book</option>
                    {sops.map((sop) => (<option key={sop.id} value={sop.id}>{sop.index_code} — {sop.title}</option>))}
                  </select>
                  {selectedCompetencySops.length > 0 && <div className="sop-tags">{selectedCompetencySops.map((sop) => (<button type="button" className="sop-tag" key={sop.id} onClick={() => removeCompetencySop(sop.id)}>{sop.index_code} — {sop.title} ×</button>))}</div>}
                  <small className="field-help">Select one or more SOPs. Click a tag to remove it.</small>
                </div>

                <label className="form-field">
                  <span>Equipment Used (optional)</span>
                  <MultiSelect options={equipment} selected={procedureForm.equipment_ids} onChange={(ids) => setProcedureForm((current) => ({ ...current, equipment_ids: ids }))} placeholder="Select equipment used in this procedure" />
                </label>

                <label className="form-field">
                  <span>Assessment Phase</span>
                  <select name="assessment_phase" value={competencyForm.assessment_phase} onChange={onChange(setCompetencyForm)} className="input">
                    <option>Initial</option>
                    <option>6-Mo</option>
                    <option>Annual</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Assessment Date</span>
                  <input type="date" name="assessment_date" value={competencyForm.assessment_date} onChange={onChange(setCompetencyForm)} className="input" />
                </label>

                <label className="form-field">
                  <span>Next Review Date</span>
                  <input type="date" name="next_review_date" value={competencyForm.next_review_date} onChange={onChange(setCompetencyForm)} className="input" />
                </label>

                <label className="form-field">
                  <span>Competency Status</span>
                  <select name="competency_status" value={competencyForm.competency_status} onChange={onChange(setCompetencyForm)} className="input">
                    <option>Competent</option>
                    <option>Needs Review</option>
                    <option>Suspended</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Notes</span>
                  <input type="text" name="notes" value={competencyForm.notes} onChange={onChange(setCompetencyForm)} className="input" />
                </label>

                <button className="button" type="submit" disabled={procedureForm.sop_ids.length === 0}>Register Competency Procedure</button>
              </form>
            </Panel>

            <Panel title="Registered Competencies / Test Procedures">
              <Table columns={['Unique ID', 'Title', 'Section', 'Required SOPs']} data={competencyProcedures} renderRow={(procedure) => ([procedure.code, procedure.title, procedure.section?.name || 'N/A', procedure.sops.map((sop) => `${sop.index_code} - ${sop.title}`).join('; ')])} />
            </Panel>

            <Panel title="Competency Assessment History">
              {competencyRecords.length === 0 ? (
                <p className="empty-text">No competency records yet.</p>
              ) : (
                <div className="item-list">
                  {competencyRecords.map((rec) => (
                    <div key={rec.id} className="item-card">
                      <div className="item-grid">
                        <div className="item-cell">
                          <span className="item-label">Staff</span>
                          <span className="item-value">{rec.staff ? `${rec.staff.first_name} ${rec.staff.last_name}` : rec.staff_id}</span>
                        </div>
                        <div className="item-cell">
                          <span className="item-label">Test Procedure</span>
                          <span className="item-value">{rec.test ? `${rec.test.code} — ${rec.test.name}` : rec.test_id}</span>
                        </div>
                        <div className="item-cell">
                          <span className="item-label">Phase</span>
                          <span className="item-value">{rec.assessment_phase}</span>
                        </div>
                        <div className="item-cell">
                          <span className="item-label">Status</span>
                          <span className="item-value">{rec.competency_status}</span>
                        </div>
                      </div>
                      <p className="panel-text">{rec.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        );
      }

      case 'staff':
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {notification && <Notification message={notification} />}
            <Panel title="Register Laboratory Staff">
              <form className="form-grid" onSubmit={(e) => { e.preventDefault(); submit('/staff', staffForm, resetStaff); }}>
                <label className="form-field">
                  <span>Laboratory Staff ID</span>
                  <input className="input" value="Automatically generated when saved" disabled />
                </label>
                <label className="form-field">
                  <span>First Name</span>
                  <input name="first_name" className="input" value={staffForm.first_name} onChange={onChange(setStaffForm)} />
                </label>
                <label className="form-field">
                  <span>Last Name</span>
                  <input name="last_name" className="input" value={staffForm.last_name} onChange={onChange(setStaffForm)} />
                </label>
                <label className="form-field">
                  <span>Middle Name (optional)</span>
                  <input name="middle_name" className="input" value={staffForm.middle_name} onChange={onChange(setStaffForm)} />
                </label>
                <label className="form-field">
                  <span>Email</span>
                  <input name="email" className="input" value={staffForm.email} onChange={onChange(setStaffForm)} />
                </label>
                <label className="form-field">
                  <span>Phone</span>
                  <input name="phone" className="input" value={staffForm.phone} onChange={onChange(setStaffForm)} />
                </label>
                <label className="form-field">
                  <span>Section</span>
                  <select name="section_id" className="input" value={staffForm.section_id} onChange={onChange(setStaffForm)}>
                    <option value="">Select section</option>
                    {sections.map((sec) => (<option key={sec.id} value={sec.id}>{sec.code} — {sec.name}</option>))}
                  </select>
                </label>
                <label className="form-field">
                  <span>Status</span>
                  <select name="status" className="input" value={staffForm.status} onChange={onChange(setStaffForm)}>
                    <option>active</option>
                    <option>inactive</option>
                  </select>
                </label>
                <label className="form-field">
                  <span>Additional Sections the staff member is competent to work in</span>
                  <MultiSelect options={sections} selected={staffForm.section_ids} onChange={(ids) => setStaffForm((current) => ({ ...current, section_ids: ids }))} placeholder="Select one or more sections" />
                </label>
                <button className="button" type="submit" disabled={staffForm.section_ids.length === 0}>Register Laboratory Staff</button>
              </form>
            </Panel>

            <Panel title="Registered Laboratory Staff by Section">
              <Table columns={['Staff ID', 'Name', 'Email', 'Phone', 'Sections']} data={staff} renderRow={(s) => ([s.employee_number || 'N/A', [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' '), s.email || 'N/A', s.phone || 'N/A', s.staff_sections?.map((link) => link.section?.name).filter(Boolean).join(', ') || 'N/A'])} />
            </Panel>
            <Panel title="Record Staff Competency Assessment">
              <form className="form-grid" onSubmit={(e) => { e.preventDefault(); submit('/competency-records', competencyForm, resetCompetency); }}>
                <label className="form-field">
                  <span>Laboratory Staff</span>
                  <select name="staff_id" value={competencyForm.staff_id} onChange={onChange(setCompetencyForm)} className="input" required>
                    <option value="">Select laboratory staff</option>
                    {staff.map((s) => <option key={s.id} value={s.id}>{s.employee_number} - {s.first_name} {s.last_name}</option>)}
                  </select>
                </label>
                <label className="form-field">
                  <span>Registered Competency / Test Procedure</span>
                  <select name="procedure_id" value={competencyForm.procedure_id} onChange={onChange(setCompetencyForm)} className="input" required>
                    <option value="">Select competency procedure</option>
                    {competencyProcedures.map((procedure) => <option key={procedure.id} value={procedure.id}>{procedure.code} - {procedure.title}</option>)}
                  </select>
                </label>
                <label className="form-field">
                  <span>Assessment Phase</span>
                  <select name="assessment_phase" value={competencyForm.assessment_phase} onChange={onChange(setCompetencyForm)} className="input">
                    <option>Initial</option><option>6-Mo</option><option>Annual</option>
                  </select>
                  <small className="field-help">The system accepts only Initial, then 6-Mo, then Annual for each staff member and procedure.</small>
                </label>
                <label className="form-field"><span>Assessment Date</span><input type="date" name="assessment_date" value={competencyForm.assessment_date} onChange={onChange(setCompetencyForm)} className="input" required /></label>
                <label className="form-field"><span>Next Review Date</span><input type="date" name="next_review_date" value={competencyForm.next_review_date} onChange={onChange(setCompetencyForm)} className="input" /></label>
                <label className="form-field"><span>Competency Status</span><select name="competency_status" value={competencyForm.competency_status} onChange={onChange(setCompetencyForm)} className="input"><option>Competent</option><option>Needs Review</option><option>Suspended</option></select></label>
                <label className="form-field"><span>Notes</span><input name="notes" value={competencyForm.notes} onChange={onChange(setCompetencyForm)} className="input" /></label>
                <button className="button" type="submit">Save Competency Assessment</button>
              </form>
            </Panel>
          </div>
        );

      case 'sops':
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Create SOP Book">
              <Form fields={[
                { name: 'code', label: 'Book Code', type: 'text' },
                { name: 'name', label: 'Book Name', type: 'text' },
                { name: 'description', label: 'Description', type: 'text' },
                { name: 'book_number', label: 'Book Number', type: 'number' }
              ]} data={sopBookForm} onChange={onChange(setSopBookForm)} onSubmit={(e) => { e.preventDefault(); submit('/sop-books', sopBookForm, resetSopBook); }} buttonLabel="Save SOP Book" />
            </Panel>
            <Panel title="Create SOP">
              <Form fields={[
                { name: 'book_id', label: 'SOP Book ID', type: 'number' },
                { name: 'index_code', label: 'Index Code', type: 'text' },
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'version', label: 'Version', type: 'text' },
                { name: 'effective_date', label: 'Effective Date', type: 'date' },
                { name: 'next_review_date', label: 'Next Review Date', type: 'date' },
                { name: 'scope_distribution', label: 'Scope / Distribution', type: 'text' },
                { name: 'status', label: 'Status', type: 'text' },
                { name: 'description', label: 'Description', type: 'text' }
              ]} data={sopForm} onChange={onChange(setSopForm)} onSubmit={(e) => { e.preventDefault(); submit('/sops', sopForm, resetSop); }} buttonLabel="Save SOP" />
            </Panel>
            <Panel title="Import SOPs from docs">
              <div className="panel-content">
                <p>Import SOP books and inventories from <code>docs/Lab_SOPs</code>.</p>
                <button type="button" className="button" onClick={importSOPs}>Import SOPs</button>
                {importResult && (
                  <div className={`import-result ${importResult.status === 'error' ? 'error' : 'success'}`}>
                    {importResult.status === 'error'
                      ? `Error: ${importResult.message}`
                      : `${importResult.books} SOP book(s) imported, ${importResult.sops} SOP(s) imported.`}
                  </div>
                )}
              </div>
            </Panel>
            <Panel title="SOP Books">
              <Table columns={['ID', 'Code', 'Name', 'Book #']} data={sopBooks} renderRow={(book) => ([book.id, book.code, book.name, book.book_number || 'N/A'])} />
            </Panel>
            <Panel title="SOP Registry">
              <Table columns={['ID', 'Book', 'Index Code', 'Title', 'Version', 'Effective Date', 'Next Review', 'Scope / Distribution']} data={allSops} renderRow={(sop) => ([sop.id, sop.book?.code || 'N/A', sop.index_code, sop.title, sop.version || 'N/A', sop.effective_date || 'N/A', sop.next_review_date || 'N/A', sop.scope_distribution || 'N/A'])} />
            </Panel>
          </div>
        );

      case 'equipment':
        return (
          <div className="equipment-container">
            {notification && <Notification message={notification} />}
            <div className="equipment-header">
              <h2>Equipment Registry</h2>
              <button className="add-button" onClick={() => setShowEquipmentForm(!showEquipmentForm)}>+</button>
            </div>
            {showEquipmentForm && (
              <Panel title="Add Equipment">
                <div className="form-grid">
                  <label className="form-field">
                    <span>Equipment Name</span>
                    <input
                      type="text"
                      name="name"
                      value={equipmentForm.name}
                      onChange={onChange(setEquipmentForm)}
                      className="input"
                      placeholder="Enter equipment name"
                    />
                  </label>
                  <label className="form-field">
                    <span>Sections / Distribution</span>
                    <MultiSelect
                      options={sections}
                      selected={equipmentForm.section_ids}
                      onChange={(ids) => setEquipmentForm({ ...equipmentForm, section_ids: ids })}
                      placeholder="Select sections where equipment is used"
                    />
                  </label>
                </div>
                <div className="form-actions">
                  <button
                    className="button"
                    onClick={(e) => {
                      e.preventDefault();
                      
                      // Validation
                      if (!equipmentForm.name.trim()) {
                        alert('Please enter an equipment name');
                        return;
                      }
                      if (equipmentForm.section_ids.length === 0) {
                        alert('Please select at least one section');
                        return;
                      }
                      
                      submit('/equipment', equipmentForm, resetEquipment);
                    }}
                  >
                    Save Equipment
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setShowEquipmentForm(false);
                      resetEquipment();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Panel>
            )}
            <Panel title="Registered Equipment">
              <Table
                columns={['Code', 'Equipment Name', 'Sections']}
                data={equipment}
                renderRow={(item) => {
                  const sections = item.equipment_sections && item.equipment_sections.length > 0
                    ? item.equipment_sections.map(es => es.section?.name || 'Unknown').join(', ')
                    : 'No sections';
                  return [
                    item.code,
                    item.name,
                    sections
                  ];
                }}
              />
            </Panel>
          </div>
        );

      default:
        return null;
    }
  };

  // Staff tab
  // handled by switch above via 'staff' case below


  return (
    <div className="app-container">
      <div className="page-inner">
        <header className="hero">
          <p className="hero-subtitle">LabQMS</p>
          <h1 className="hero-title">JCRC - CAP Audit Readiness Dashboard</h1>
          <p className="hero-text">Monitor section QC, Manage SOP books, review selected book SOPs, and track staff competency records. The SOP tab focuses on books and their contents.</p>
          <div className="summary-grid">
            <SummaryCard title="SOP Books" value={sopBooks.length} />
            <SummaryCard title="SOPs" value={allSops.length} />
            <SummaryCard title="Staff" value={staff.length} />
            <SummaryCard title="Competency Records" value={competencyRecords.length} />
            <SummaryCard title="Equipment" value={equipment.length} />
            <SummaryCard title="Tests" value={tests.length} />
          </div>
        </header>

        <div className="card">
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="panel-wrapper">
            {panel()}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Form({ fields, data, onChange, onSubmit, buttonLabel }) {
  return (
    <form onSubmit={onSubmit} className="form-grid">
      {fields.map((field) => (
        <label key={field.name} className="form-field">
          <span>{field.label}</span>
          <input
            type={field.type}
            name={field.name}
            value={data[field.name] ?? ''}
            onChange={onChange}
            className="input"
          />
        </label>
      ))}
      <button type="submit" className="button">{buttonLabel}</button>
    </form>
  );
}

function ItemList({ items, columns, render }) {
  return (
    <div className="item-list">
      {items.length === 0 ? (
        <p className="empty-text">No records yet.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-grid">
              {render(item).map((value, index) => (
                <div key={index} className="item-cell">
                  <span className="item-label">{columns[index]}</span>
                  <span className="item-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Table({ columns, data, renderRow, rowClassName }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={columns.length}>No records yet.</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className={rowClassName ? rowClassName(item) : undefined}>
                {renderRow(item).map((cell, index) => (
                  <td key={index}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="summary-card">
      <span className="summary-title">{title}</span>
      <strong className="summary-value">{value}</strong>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
    </div>
  );
}

function Notification({ message }) {
  return (
    <div className="notification">
      <span>{message}</span>
    </div>
  );
}

function MultiSelect({ options, selected, onChange, placeholder }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const containerRef = useRef(null);

  const handleAdd = (sectionId) => {
    if (selected.includes(sectionId)) {
      setDuplicateMessage('already selected');
      setTimeout(() => setDuplicateMessage(''), 2000);
      return;
    }
    onChange([...selected, sectionId]);
    setDropdownOpen(false);
  };

  const handleRemove = (sectionId) => {
    onChange(selected.filter(id => id !== sectionId));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const selectedSections = options.filter(opt => selected.includes(opt.id));
  const availableSections = options.filter(opt => !selected.includes(opt.id));

  return (
    <div className="multi-select-container" ref={containerRef}>
      <div className="multi-select-tags">
        {selectedSections.map((section) => (
          <div key={section.id} className="tag">
            <span>{section.name}</span>
            <button
              type="button"
              className="tag-remove"
              onClick={() => handleRemove(section.id)}
              title="Remove section"
            >
              ×
            </button>
          </div>
        ))}
        {selected.length === 0 && (
          <span className="multi-select-placeholder">Select sections...</span>
        )}
      </div>
      
      <div className="multi-select-dropdown">
        <button
          type="button"
          className="dropdown-toggle"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Add Section ▼
        </button>
        
        {dropdownOpen && (
          <div className="dropdown-menu">
            {availableSections.length > 0 ? (
              availableSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleAdd(section.id)}
                >
                  + {section.name}
                </button>
              ))
            ) : (
              <div className="dropdown-empty">
                {selected.length === 0 ? 'No sections available' : 'All sections selected'}
              </div>
            )}
          </div>
        )}
      </div>

      {duplicateMessage && (
        <small className="error-message">{duplicateMessage}</small>
      )}
    </div>
  );
}

export default App;
