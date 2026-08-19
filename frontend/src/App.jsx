import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// The main app is a single-page dashboard for the laboratory quality system.
// Each tab represents a functional area: dashboard, competencies, staff, SOPs, and equipment.
// Future tabs for departmental dashboards (Microbiology, Virology) are placeholders for Coming Soon pages.
const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'competency', label: 'Competencies' },
  { key: 'staff', label: 'Laboratory Staffing' },
  { key: 'sops', label: 'SOPs' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'microbiology', label: 'Microbiology' },
  { key: 'virology', label: 'Virology' }
];

function App() {
  // activeTab controls which section of the dashboard is currently visible.
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
  const [showCompetencyForm, setShowCompetencyForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loadError, setLoadError] = useState('');

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
    section_ids: [],
    competency_procedure_ids: []
  });

  // Load all core records once when the app starts so the dashboard is populated.
  useEffect(() => {
    fetchAll();
  }, []);

  // This function fetches all of the main datasets from the backend and updates component state.
  const fetchAll = async () => {
    const [sopBookResult, sopResult, equipmentResult, testResult, procedureResult, staffResult, competencyResult, sectionsResult] = await Promise.allSettled([
      api.get('/sop-books'),
      api.get('/sops'),
      api.get('/equipment'),
      api.get('/tests'),
      api.get('/competency-procedures'),
      api.get('/staff'),
      api.get('/competency-records'),
      api.get('/sections')
    ]);

    if (sopBookResult.status === 'fulfilled') setSopBooks(sopBookResult.value.data);
    if (sopResult.status === 'fulfilled') setSops(sopResult.value.data);
    if (equipmentResult.status === 'fulfilled') setEquipment(equipmentResult.value.data);
    if (testResult.status === 'fulfilled') setTests(testResult.value.data);
    if (procedureResult.status === 'fulfilled') setCompetencyProcedures(procedureResult.value.data);
    if (staffResult.status === 'fulfilled') setStaff(staffResult.value.data);
    if (competencyResult.status === 'fulfilled') setCompetencyRecords(competencyResult.value.data);
    if (sectionsResult.status === 'fulfilled') setSections(sectionsResult.value.data);

    const failures = [sopBookResult, sopResult, equipmentResult, testResult, procedureResult, staffResult, competencyResult, sectionsResult]
      .filter((result) => result.status === 'rejected');
    setLoadError(failures.length ? 'Some records could not be loaded. Refresh the page after checking that the API is running.' : '');
  };

  const onChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  // Shared save function used by all forms.
  // It prepares the payload for the selected backend route, posts it, refreshes data, and resets the form.
  // This shared submit handler is the heart of data entry.
  // It translates the form state into the exact JSON that the backend expects,
  // sends the request, refreshes all data, and resets the form after a successful save.
  const submit = async (endpoint, form, resetFn) => {
    try {
      const payload = endpoint === '/staff'
        ? {
            // Staff registration sends a list of section IDs and competency procedure IDs,
            // because one staff member can belong to multiple sections and hold multiple competencies.
            ...form,
            section_ids: form.section_ids.map(Number),
            competency_procedure_ids: form.competency_procedure_ids.map(Number)
          }
        : endpoint === '/competency-procedures'
          ? {
              // Competency procedures are linked to a section, selected SOPs, and optional equipment.
              ...form,
              section_id: Number(form.section_id),
              sop_ids: form.sop_ids.map(Number),
              equipment_ids: form.equipment_ids.map(Number)
            }
        : endpoint === '/competency-records'
          ? (() => {
            // For a competency assessment, the system looks up the selected procedure,
            // then automatically fills in the related test ID and SOP list.
            const procedure = competencyProcedures.find((item) => item.id === Number(form.procedure_id));
            return {
              ...form,
              staff_id: Number(form.staff_id),
              test_id: procedure.test_id,
              sop_ids: procedure.sops.map((sop) => sop.id),
              assessment_phase: nextAssessmentPhase(form.staff_id, form.procedure_id)
            };
          })()
          : endpoint === '/equipment'
            ? { name: form.name, section_ids: form.section_ids.map(Number) }
            : form;
      
      console.log('Submitting payload:', payload);
      const result = await api.post(endpoint, payload);
      console.log('Response:', result.data);
      
      if (endpoint === '/equipment' || endpoint === '/staff' || endpoint === '/competency-procedures' || endpoint === '/competency-records') {
        // User feedback is shown after a successful save.
        // This also hides the form after saving so the dashboard returns to the table view.
        setNotification(endpoint === '/staff' ? `Laboratory staff ${result.data.employee_number} registered successfully.`
          : endpoint === '/competency-procedures' ? `Competency procedure ${result.data.code} registered successfully.`
          : endpoint === '/competency-records' ? 'Competency assessment recorded successfully.'
          : `added "${result.data.name}"`);
        setTimeout(() => setNotification(null), 3000);
        setShowEquipmentForm(false);
        setShowCompetencyForm(false);
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
  const resetStaff = () => setStaffForm({ first_name: '', middle_name: '', last_name: '', email: '', phone: '', status: 'active', section_ids: [], competency_procedure_ids: [] });
  // This function decides the next allowed competency phase for a staff member.
  // It enforces the usual sequence: Initial -> 6-Mo -> Annual.
  // This prevents the user from entering the wrong assessment phase in the wrong order.
  const nextAssessmentPhase = (staffId, procedureId) => {
    const procedure = competencyProcedures.find((item) => item.id === Number(procedureId));
    if (!staffId || !procedure) return 'Initial';
    const phases = new Set(
      competencyRecords
        .filter((record) => record.staff_id === Number(staffId) && record.test_id === procedure.test_id)
        .map((record) => record.assessment_phase)
    );

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
        // This tab is the heart of the training-validation workflow.
        // It lets the user define a competency procedure, then later assign that procedure to staff members.
        // The form stays collapsed until the user clicks the + button, which keeps the table view clean.
        const sops = procedureForm.sop_book_id
          ? allSops.filter((sop) => sop.book_id === Number(procedureForm.sop_book_id))
          : [];
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {notification && <Notification message={notification} />}
            <div className="equipment-container" style={{ gridColumn: '1 / -1' }}>
              <div className="equipment-header">
                <h2>Registered Competencies / Test Procedures</h2>
                {/* The + button is used to reveal or hide the form while keeping the list of registered procedures visible. */}
                <button className="add-button" type="button" onClick={() => setShowCompetencyForm((show) => !show)} aria-label={showCompetencyForm ? 'Hide competency form' : 'Show competency form'}>
                  {showCompetencyForm ? '−' : '+'}
                </button>
              </div>
              <p className="field-help" style={{ margin: '0 0 12px 0' }}>
                Use this section to define each competency requirement for a test or procedure. Select the applicable section, the relevant SOPs, and the equipment involved, then save. The registered competency list stays visible as your working table.
              </p>
              {showCompetencyForm && (
                <Panel title="Register Competency / Test Procedure that Requires Competency">
                  <form className="form-grid" onSubmit={(e) => {
                    e.preventDefault();
                    // A competency procedure is not valid without at least one applicable SOP.
                    if (procedureForm.sop_ids.length === 0) {
                      setNotification('Select at least one applicable SOP before registering the competency procedure.');
                      setTimeout(() => setNotification(null), 3000);
                      return;
                    }
                    // Save the new procedure and then collapse the form back to the table view.
                    submit('/competency-procedures', procedureForm, resetProcedure);
                  }}>
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
                      <MultiSelect options={equipment} selected={procedureForm.equipment_ids} onChange={(ids) => setProcedureForm((current) => ({ ...current, equipment_ids: ids }))} placeholder="Select equipment used in this procedure" addLabel="Add equipment" />
                    </label>

                    <div className="form-actions">
                      <button className="button" type="submit">Register Competency Procedure</button>
                      <button className="button button-secondary" type="button" onClick={() => { setShowCompetencyForm(false); resetProcedure(); }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </Panel>
              )}
              <Table columns={['Unique ID', 'Title', 'Section', 'Required SOPs']} data={competencyProcedures} renderRow={(procedure) => ([procedure.code, procedure.title, procedure.section?.name || 'N/A', <ApplicableSopsCell key={procedure.id} sops={procedure.sops} />])} />
            </div>

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
        // This tab is used to register staff members and connect them to sections and competencies.
        // The backend then creates initial competency records for selected procedures so the staff profile is immediately useful.
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {notification && <Notification message={notification} />}
            {loadError && <div className="import-result error">{loadError}</div>}
            <p className="field-help" style={{ margin: '0 0 12px 0' }}>
              Register each staff member with their section assignments and competency profile. After saving, the staff record is added to the table below and the form is cleared for the next entry.
            </p>
            <Panel title="Register Laboratory Staff">
              <form className="form-grid" onSubmit={(e) => {
                e.preventDefault();
                // The staff save triggers backend validation and automatically creates competency records for the chosen competency procedures.
                submit('/staff', staffForm, resetStaff);
              }}>
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
                <label className="form-field">
                  <span>Competencies</span>
                  <MultiSelect options={competencyProcedures} selected={staffForm.competency_procedure_ids} onChange={(ids) => setStaffForm((current) => ({ ...current, competency_procedure_ids: ids }))} placeholder="Select competencies held by this staff member" />
                  <small className="field-help">Selected competencies are recorded as Initial, Competent when the staff member is registered.</small>
                </label>
                <button className="button" type="submit" disabled={staffForm.section_ids.length === 0}>Register Laboratory Staff</button>
              </form>
            </Panel>

            <Panel title="Registered Laboratory Staff by Section">
              <Table columns={['Staff ID', 'Name', 'Email', 'Phone', 'Sections', 'Competencies']} data={staff} renderRow={(s) => ([s.employee_number || 'N/A', [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' '), s.email || 'N/A', s.phone || 'N/A', s.staff_sections?.map((link) => link.section?.name).filter(Boolean).join(', ') || 'N/A', competencyRecords.filter((record) => record.staff_id === s.id).map((record) => competencyProcedures.find((procedure) => procedure.test_id === record.test_id)?.title || record.test?.name).filter(Boolean).join(', ') || 'None'])} />
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
            <p className="field-help" style={{ margin: '0 0 12px 0' }}>
              Add equipment used in each section so the system can link instruments and methods to the correct competency workflow.
            </p>
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

      case 'microbiology':
      case 'virology':
        return (
          <div className="coming-soon-container">
            <Panel title={activeTab === 'microbiology' ? 'Microbiology Dashboard' : 'Virology Dashboard'}>
              <div className="coming-soon-content">
                <div className="coming-soon-icon">🔬</div>
                <h3>Coming Soon</h3>
                <p>The {activeTab === 'microbiology' ? 'Microbiology' : 'Virology'} departmental dashboard is under development.</p>
                <p className="coming-soon-message">This specialized dashboard will provide section-specific quality control, staff competency tracking, and SOP management for the {activeTab === 'microbiology' ? 'Microbiology' : 'Virology'} laboratory.</p>
                <button 
                  className="button" 
                  onClick={() => setActiveTab('dashboard')}
                  style={{ marginTop: '24px' }}
                >
                  Return to Main Dashboard
                </button>
              </div>
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
          </div>
          {/* Animated glassy reflective effect that tracks the active tab */}
          <div className="hero-shine" style={{
            width: '140px',
            left: `calc(36px + ${tabs.findIndex(t => t.key === activeTab) * 150}px)`,
            transition: 'left 0.4s ease'
          }} />
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

function ApplicableSopsCell({ sops = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const cellRef = useRef(null);
  const count = sops.length;

  useEffect(() => {
    const closeWhenClickingOutside = (event) => {
      if (cellRef.current && !cellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', closeWhenClickingOutside);
      return () => document.removeEventListener('mousedown', closeWhenClickingOutside);
    }
  }, [isOpen]);

  return (
    <div className="applicable-sops-cell" ref={cellRef}>
      <span>{count} {count === 1 ? 'SOP' : 'SOPs'}</span>
      {count > 0 && (
        <button
          type="button"
          className="view-sops-button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Hide SOPs' : 'View SOPs'}
        </button>
      )}
      {isOpen && (
        <div className="applicable-sops-popover" role="dialog" aria-label="Applicable SOPs">
          <div className="applicable-sops-popover-header">
            <strong>Applicable SOPs</strong>
            <button type="button" className="close-sops-button" onClick={() => setIsOpen(false)} aria-label="Close applicable SOPs">×</button>
          </div>
          <ul>
            {sops.map((sop) => <li key={sop.id}>{sop.title}</li>)}
          </ul>
        </div>
      )}
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

// Small success/error message that appears after a save action.
function Notification({ message }) {
  return (
    <div className="notification">
      <span>{message}</span>
    </div>
  );
}

// Multi-select is used for many-to-many selections such as sections, equipment, and competency mappings.
function MultiSelect({ options, selected, onChange, placeholder, addLabel = 'Add section' }) {
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
            <span>{section.name || section.title}</span>
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
          <span className="multi-select-placeholder">{placeholder}</span>
        )}
      </div>
      
      <div className="multi-select-dropdown">
        <button
          type="button"
          className="dropdown-toggle"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {addLabel} ▼
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
                  + {section.name || section.title}
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
