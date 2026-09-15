import React, { useEffect, useState, useRef } from 'react';
/**
 * Main application entry for the React frontend.
 *
 * This component loads core datasets from the backend on startup
 * and renders the tabbed interface used for data entry and review.
 *
 * Keep this file focused on composition of smaller components and
 * delegate API calls to `api` (axios instance) and business logic to
 * helper functions where possible.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Expose the resolved API base for debugging in the UI and console.
const apiBase = api.defaults.baseURL;
console.info('Frontend API baseURL:', apiBase);

// The main app is a single-page dashboard for the laboratory quality system.
// The primary navigation stays focused on the four operational workspaces.
const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'competency', label: 'Competencies' },
  { key: 'staff', label: 'Laboratory Staffing' },
  { key: 'equipment', label: 'Equipment' },
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
  const [expandedExpiryBooks, setExpandedExpiryBooks] = useState([]);
  const [showSopForms, setShowSopForms] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [showCompetencyForm, setShowCompetencyForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [expandedMasterBooks, setExpandedMasterBooks] = useState([]);
  const [editingSopId, setEditingSopId] = useState(null);
  const [expandedEquipmentSections, setExpandedEquipmentSections] = useState([]);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [expandedStaffSections, setExpandedStaffSections] = useState([]);
  const [expandedStaff, setExpandedStaff] = useState([]);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editingCompetencyId, setEditingCompetencyId] = useState(null);
  const [renewingCompetencyId, setRenewingCompetencyId] = useState(null);
  const [addingCompetencyStaffId, setAddingCompetencyStaffId] = useState(null);
  const [historyCompetencyKey, setHistoryCompetencyKey] = useState(null);
  const [expandedExpiredStaff, setExpandedExpiredStaff] = useState([]);
  const [staffCompetencyDetails, setStaffCompetencyDetails] = useState({});
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
    section_ids: [],
    model: '',
    serial_number: '',
    status: '',
    notes: '',
    service_date: '',
    next_service_date: ''
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
    competency_procedure_ids: [],
    competency_records: []
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

    // Debug: log counts so dev console shows whether data was actually received
    try {
      console.log('Loaded counts:', {
        sopBooks: sopBookResult.status === 'fulfilled' ? sopBookResult.value.data.length : 0,
        sops: sopResult.status === 'fulfilled' ? sopResult.value.data.length : 0,
        equipment: equipmentResult.status === 'fulfilled' ? equipmentResult.value.data.length : 0,
        tests: testResult.status === 'fulfilled' ? testResult.value.data.length : 0,
        competencyProcedures: procedureResult.status === 'fulfilled' ? procedureResult.value.data.length : 0,
        staff: staffResult.status === 'fulfilled' ? staffResult.value.data.length : 0,
        competencyRecords: competencyResult.status === 'fulfilled' ? competencyResult.value.data.length : 0,
        sections: sectionsResult.status === 'fulfilled' ? sectionsResult.value.data.length : 0,
      });
    } catch (e) {
      console.warn('Debug log failed', e);
    }

    // Treat competency-procedures as non-fatal: some backends may not expose it.
    const settled = [sopBookResult, sopResult, equipmentResult, testResult, procedureResult, staffResult, competencyResult, sectionsResult];
    const nonCriticalIndices = [4]; // index 4 === procedureResult (competency-procedures)
    const failures = settled.filter((result, idx) => result.status === 'rejected' && !nonCriticalIndices.includes(idx));
    if (procedureResult.status === 'rejected') console.warn('/competency-procedures failed to load; continuing without it.');
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
            competency_procedure_ids: form.competency_procedure_ids.map(Number),
            competency_records: form.competency_records
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
              sop_ids: procedure.sops.map((sop) => sop.id)
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
      const status = error.response?.status;
      const data = error.response?.data;
      console.error('Submit error:', { status, data, message: error.message });
      const detail = data?.detail || JSON.stringify(data) || error.message;
      alert(`Error saving: ${detail} (status: ${status || 'unknown'})`);
    }
  };

  const updateStaff = async (staffId, form) => {
    try {
      await api.put(`/staff/${staffId}`, { ...form, section_ids: form.section_ids.map(Number) });
      setEditingStaffId(null);
      setNotification('Staff details updated successfully.');
      setTimeout(() => setNotification(null), 3000);
      await fetchAll();
    } catch (error) {
      const detail = error.response?.data?.detail || error.message;
      alert(`Error updating staff: ${detail}${error.response?.status === 404 ? ' Please restart the backend server so the latest API routes are loaded.' : ''}`);
    }
  };

  const updateCompetencyRecord = async (recordId, form) => {
    try {
      await api.put(`/competency-records/${recordId}`, form);
      setEditingCompetencyId(null);
      setNotification('Competency record updated successfully.');
      setTimeout(() => setNotification(null), 3000);
      await fetchAll();
    } catch (error) {
      alert('Error updating competency record: ' + (error.response?.data?.detail || error.message));
    }
  };

  const renewCompetencyRecord = async (recordId, form) => {
    try {
      await api.post(`/competency-records/${recordId}/renew`, form);
      setRenewingCompetencyId(null);
      setNotification('Competency renewed successfully. The previous evaluation remains in history.');
      setTimeout(() => setNotification(null), 3500);
      await fetchAll();
    } catch (error) {
      alert('Error renewing competency: ' + (error.response?.data?.detail || error.message));
    }
  };

  const addSopVersion = async (sopId, form) => {
    try {
      await api.post(`/sops/${sopId}/versions`, form);
      setEditingSopId(null);
      setNotification('SOP version added successfully.');
      setTimeout(() => setNotification(null), 3000);
      await fetchAll();
    } catch (error) {
      alert('Error adding SOP version: ' + (error.response?.data?.detail || error.message));
    }
  };

  const updateEquipment = async (equipmentId, form) => {
    try {
      await api.put(`/equipment/${equipmentId}`, { ...form, section_ids: form.section_ids.map(Number) });
      setEditingEquipmentId(null);
      setNotification('Equipment details updated successfully.');
      setTimeout(() => setNotification(null), 3000);
      await fetchAll();
    } catch (error) {
      alert('Error updating equipment: ' + (error.response?.data?.detail || error.message));
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
  const resetEquipment = () => setEquipmentForm({ name: '', section_ids: [], model: '', serial_number: '', status: '', notes: '', service_date: '', next_service_date: '' });
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
  const resetStaff = () => setStaffForm({ first_name: '', middle_name: '', last_name: '', email: '', phone: '', status: 'active', section_ids: [], competency_procedure_ids: [], competency_records: [] });
  const resetStaffCompetencies = () => setStaffCompetencyDetails({});
  const toggleStaffSection = (sectionId) => setExpandedStaffSections((current) => current.includes(sectionId)
    ? current.filter((id) => id !== sectionId)
    : [...current, sectionId]);
  const toggleStaff = (staffId) => setExpandedStaff((current) => current.includes(staffId)
    ? current.filter((id) => id !== staffId)
    : [...current, staffId]);
  const startAddingCompetency = (staffId) => {
    setAddingCompetencyStaffId(staffId);
    setCompetencyForm({ ...competencyForm, staff_id: String(staffId), procedure_id: '', assessment_phase: 'Initial', assessment_date: '', next_review_date: '', competency_status: 'Competent', notes: '' });
  };
  const currentCompetencyRecords = Object.values(competencyRecords.reduce((records, record) => {
    const key = `${record.staff_id}-${record.test_id}`;
    if (!records[key] || record.id > records[key].id) records[key] = record;
    return records;
  }, {}));
  const toggleExpiredStaff = (staffId) => setExpandedExpiredStaff((current) => current.includes(staffId)
    ? current.filter((id) => id !== staffId)
    : [...current, staffId]);
  const toggleEquipmentSection = (sectionId) => setExpandedEquipmentSections((current) => current.includes(sectionId)
    ? current.filter((id) => id !== sectionId)
    : [...current, sectionId]);
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const soonThreshold = new Date(today);
        soonThreshold.setDate(today.getDate() + 30);
        const ninetyDayThreshold = new Date(today);
        ninetyDayThreshold.setDate(today.getDate() + 90);
        const expiringSops = allSops
          .filter((sop) => sop.next_review_date)
          .map((sop) => ({ ...sop, reviewDate: new Date(sop.next_review_date) }))
          .filter(({ reviewDate }) => reviewDate <= soonThreshold)
          .sort((a, b) => a.reviewDate - b.reviewDate);
        const formatSections = (sop) => sop.sections?.map((section) => section.name).join(', ') || 'All sections / Unassigned';
        const getExpiryRowClass = (sop) => sop.reviewDate < today ? 'row-expired' : 'row-expiring';
        const expiredCompetencies = currentCompetencyRecords
          .filter((record) => record.next_review_date && new Date(record.next_review_date) <= ninetyDayThreshold)
          .sort((a, b) => new Date(a.next_review_date) - new Date(b.next_review_date));
        const competencyUrgency = (record) => {
          const reviewDate = new Date(record.next_review_date);
          if (reviewDate < today) return 'Expired';
          const daysRemaining = Math.ceil((reviewDate - today) / 86400000);
          if (daysRemaining <= 30) return 'Due within 30 days';
          if (daysRemaining <= 60) return 'Due within 60 days';
          return 'Due within 90 days';
        };
        const expiredCompetencyStaff = Object.values(expiredCompetencies.reduce((groups, record) => {
          const staffKey = record.staff_id;
          if (!groups[staffKey]) {
            groups[staffKey] = {
              staffId: staffKey,
              name: record.staff ? `${record.staff.first_name} ${record.staff.last_name}` : `Staff #${staffKey}`,
              records: []
            };
          }
          groups[staffKey].records.push(record);
          return groups;
        }, {}));
        const expiryBooks = Object.values(expiringSops.reduce((groups, sop) => {
          const bookKey = sop.book?.id || 'unassigned';
          if (!groups[bookKey]) {
            groups[bookKey] = {
              key: bookKey,
              name: sop.book ? `${sop.book.code} - ${sop.book.name}` : 'Unassigned SOPs',
              sops: []
            };
          }
          groups[bookKey].sops.push(sop);
          return groups;
        }, {}));
        const toggleExpiryBook = (bookKey) => setExpandedExpiryBooks((current) => current.includes(bookKey)
          ? current.filter((key) => key !== bookKey)
          : [...current, bookKey]);
        const masterBooks = Object.values(allSops.reduce((groups, sop) => {
          const bookKey = sop.book?.id || 'unassigned';
          if (!groups[bookKey]) {
            groups[bookKey] = {
              key: bookKey,
              name: sop.book ? `${sop.book.code} - ${sop.book.name}` : 'Unassigned SOPs',
              sops: []
            };
          }
          groups[bookKey].sops.push(sop);
          return groups;
        }, {})).map((book) => ({
          ...book,
          sops: [...book.sops].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        })).sort((a, b) => a.name.localeCompare(b.name));
        const toggleMasterBook = (bookKey) => setExpandedMasterBooks((current) => current.includes(bookKey)
          ? current.filter((key) => key !== bookKey)
          : [...current, bookKey]);
        return (
          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Section Analytics">
              <div className="analytics-links" aria-label="Section analytics links">
                <a className="analytics-link cobas" href="http://10.4.45.203:8000/ui" target="_blank" rel="noreferrer">
                  <span className="analytics-link-kicker">Chemistry</span>
                  <span>COBAS Analytics</span>
                </a>
                <a className="analytics-link sysmex" href="#hematology-live-sysmex-analytics">
                  <span className="analytics-link-kicker">Hematology</span>
                  <span>Live Sysmex Analytics</span>
                </a>
                <a className="analytics-link microbiology" href="#microbiology">
                  <span className="analytics-link-kicker">Department</span>
                  <span>Microbiology</span>
                </a>
                <a className="analytics-link virology" href="#virology">
                  <span className="analytics-link-kicker">Department</span>
                  <span>Virology</span>
                </a>
              </div>
              <p className="panel-note">Quick links for the section-level analytics workspaces.</p>
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
            <div className="dashboard-wide-panel">
              <Panel title="Competency Renewal Watch">
                <div className="expiry-summary">
                  <span>{expiredCompetencies.filter((record) => competencyUrgency(record) === 'Expired').length} expired</span>
                  <span>{expiredCompetencies.filter((record) => competencyUrgency(record) !== 'Expired').length} due within 90 days</span>
                  <span>{expiredCompetencyStaff.length} staff member{expiredCompetencyStaff.length === 1 ? '' : 's'} affected</span>
                </div>
                {expiredCompetencyStaff.length === 0 ? (
                  <p className="empty-text">No competency renewals are expired or due within 90 days.</p>
                ) : (
                  <div className="expired-competency-list">
                    {expiredCompetencyStaff.map((staffGroup) => {
                      const isExpanded = expandedExpiredStaff.includes(staffGroup.staffId);
                      return <div className="expired-competency-item" key={staffGroup.staffId}>
                        <button className="expired-staff-toggle" type="button" onClick={() => toggleExpiredStaff(staffGroup.staffId)} aria-expanded={isExpanded}>
                          <span><strong>{staffGroup.name}</strong><small>{staffGroup.records.length} competency renewal{staffGroup.records.length === 1 ? '' : 's'} needed · Open Laboratory Staffing to renew</small></span>
                          <span className="expiry-chevron">{isExpanded ? '−' : '+'}</span>
                        </button>
                        {isExpanded && <div className="expired-competency-details">{staffGroup.records.map((record) => {
                          const test = tests.find((item) => item.id === record.test_id);
                          const section = sections.find((item) => item.id === test?.section_id);
                          return <div className="expired-competency-detail" key={record.id}><strong>{test?.name || 'Unknown competency'}</strong><span>{section?.name || 'Unknown section'}</span><small>{competencyUrgency(record)} · {record.next_review_date}</small></div>;
                        })}</div>}
                      </div>;
                    })}
                  </div>
                )}
              </Panel>
            </div>
            <div className="dashboard-wide-panel">
              <Panel title="SOP Expiry Watch">
                <div className="expiry-summary">
                  <span>{expiringSops.filter((sop) => sop.reviewDate < today).length} expired</span>
                  <span>{expiringSops.filter((sop) => sop.reviewDate >= today).length} due within 30 days</span>
                </div>
                {expiryBooks.length === 0 ? (
                  <p className="empty-text">No SOPs are expired or due within 30 days.</p>
                ) : (
                  <div className="expiry-book-list">
                    {expiryBooks.map((book) => {
                      const expiredCount = book.sops.filter((sop) => sop.reviewDate < today).length;
                      const soonCount = book.sops.length - expiredCount;
                      const isExpanded = expandedExpiryBooks.includes(book.key);
                      return (
                        <div className="expiry-book" key={book.key}>
                          <button className="expiry-book-toggle" type="button" onClick={() => toggleExpiryBook(book.key)} aria-expanded={isExpanded}>
                            <span>
                              <strong>{book.name}</strong>
                              <small>{book.sops.length} SOP(s) need attention</small>
                            </span>
                            <span className="expiry-book-counts">
                              {expiredCount > 0 && <span className="expiry-count expired-count">{expiredCount} expired</span>}
                              {soonCount > 0 && <span className="expiry-count soon-count">{soonCount} due soon</span>}
                              <span className="expiry-chevron">{isExpanded ? '−' : '+'}</span>
                            </span>
                          </button>
                          {isExpanded && (
                            <Table
                              columns={['SOP', 'Title', 'Section', 'Review Date', 'Status']}
                              data={book.sops}
                              renderRow={(sop) => ([
                                sop.index_code,
                                sop.title,
                                formatSections(sop),
                                sop.next_review_date,
                                sop.reviewDate < today ? 'Expired' : 'Expiring soon'
                              ])}
                              rowClassName={getExpiryRowClass}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            </div>
            <div className="dashboard-wide-panel">
              <Panel title="SOP Master List">
                {masterBooks.length === 0 ? (
                  <p className="empty-text">No SOPs have been loaded.</p>
                ) : (
                  <div className="expiry-book-list">
                    {masterBooks.map((book) => {
                      const isExpanded = expandedMasterBooks.includes(book.key);
                      return (
                        <div className="expiry-book" key={book.key}>
                          <button className="expiry-book-toggle" type="button" onClick={() => toggleMasterBook(book.key)} aria-expanded={isExpanded}>
                            <span>
                              <strong>{book.name}</strong>
                              <small>{book.sops.length} SOP(s)</small>
                            </span>
                            <span className="expiry-book-counts">
                              <span className="expiry-count master-count">{book.sops.length} SOPs</span>
                              <span className="expiry-chevron">{isExpanded ? '−' : '+'}</span>
                            </span>
                          </button>
                          {isExpanded && (
                            <SopMasterTable sops={book.sops} formatSections={formatSections} editingSopId={editingSopId} onEdit={setEditingSopId} onSave={addSopVersion} onCancel={() => setEditingSopId(null)} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            </div>
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

            <div className="dashboard-wide-panel">
              <div className="compact-section-header"><div><h2>Record Competency Assessment</h2><p className="panel-note">Add a testing date, competency type, and validity period.</p></div><button className="add-button" type="button" onClick={() => setShowAssessmentForm((show) => !show)} aria-expanded={showAssessmentForm} aria-label="Record competency assessment">{showAssessmentForm ? '−' : '+'}</button></div>
            {showAssessmentForm && <Panel title="New Competency Assessment">
              <form className="form-grid" onSubmit={(event) => { event.preventDefault(); submit('/competency-records', competencyForm, resetCompetency); }}>
                <label className="form-field"><span>Staff member</span><select className="input" name="staff_id" value={competencyForm.staff_id} onChange={onChange(setCompetencyForm)} required><option value="">Select staff member</option>{staff.map((member) => <option key={member.id} value={member.id}>{member.employee_number} - {member.first_name} {member.last_name}</option>)}</select></label>
                <label className="form-field"><span>Competency</span><select className="input" name="procedure_id" value={competencyForm.procedure_id} onChange={onChange(setCompetencyForm)} required><option value="">Select competency</option>{competencyProcedures.map((procedure) => <option key={procedure.id} value={procedure.id}>{procedure.code} - {procedure.title}</option>)}</select></label>
                <label className="form-field"><span>Competency type</span><select className="input" name="assessment_phase" value={competencyForm.assessment_phase} onChange={onChange(setCompetencyForm)}><option>Initial</option><option>6-Mo</option><option>Annual</option></select></label>
                <label className="form-field"><span>Date of competency testing</span><input className="input" type="date" name="assessment_date" min="1900-01-01" max="2100-12-31" value={competencyForm.assessment_date} onChange={onChange(setCompetencyForm)} required /></label>
                <label className="form-field"><span>Expiry date</span><input className="input" type="date" name="next_review_date" min="1900-01-01" max="2100-12-31" value={competencyForm.next_review_date} onChange={onChange(setCompetencyForm)} /></label>
                <label className="form-field"><span>Status</span><select className="input" name="competency_status" value={competencyForm.competency_status} onChange={onChange(setCompetencyForm)}><option>Competent</option><option>Needs follow-up</option><option>Not Competent</option></select></label>
                <label className="form-field"><span>Notes</span><textarea className="input" name="notes" value={competencyForm.notes} onChange={onChange(setCompetencyForm)} rows="3" /></label>
                <button className="button" type="submit">Save Competency Record</button>
              </form>
            </Panel>}
            </div>

            <div className="dashboard-wide-panel competency-history-quick-link">
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
          </div>
        );
      }

      case 'staff': {
        // This tab is used to register staff members and connect them to sections and competencies.
        // The backend then creates initial competency records for selected procedures so the staff profile is immediately useful.
        const staffBySection = sections.map((section) => ({
          ...section,
          staff: staff.filter((member) => member.staff_sections?.some((link) => link.section?.id === section.id))
        })).filter((section) => section.staff.length > 0);
        const unassignedStaff = staff.filter((member) => !member.staff_sections?.length);
        const staffName = (member) => [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ');
        return (
          <div className="staff-workspace">
            {notification && <Notification message={notification} />}
            {loadError && <div className="import-result error">{loadError}</div>}
            <p className="field-help" style={{ margin: '0 0 12px 0' }}>
              Register each staff member with their section assignments and competency profile. After saving, the staff record is added to the table below and the form is cleared for the next entry.
            </p>
            <div className="dashboard-wide-panel staff-registration">
              <div className="equipment-header">
                <div>
                  <h2>Register Laboratory Staff</h2>
                  <p className="field-help">Use this form only when a new staff member joins the laboratory.</p>
                </div>
                <button className="add-button" type="button" onClick={() => setShowStaffForm((show) => !show)} aria-expanded={showStaffForm} aria-label={showStaffForm ? 'Hide staff registration form' : 'Register laboratory staff'} title={showStaffForm ? 'Hide registration form' : 'Register laboratory staff'}>
                  {showStaffForm ? '−' : '+'}
                </button>
              </div>
            </div>
            {showStaffForm && <Panel title="New Laboratory Staff Details">
              <form className="form-grid" onSubmit={(e) => {
                e.preventDefault();
                // Build section_ids payload: include the primary `section_id` plus any additional sections.
                const primary = staffForm.section_id ? [Number(staffForm.section_id)] : [];
                const additional = Array.isArray(staffForm.section_ids) ? staffForm.section_ids.map(Number) : [];
                const section_ids = Array.from(new Set([...primary, ...additional].filter(Boolean)));

                // The staff save triggers backend validation and automatically creates competency records
                // for the chosen competency procedures. Ensure `section_ids` is provided to the API.
                submit('/staff', {
                  ...staffForm,
                  section_ids,
                  competency_records: staffForm.competency_procedure_ids.map((procedureId) => ({
                    procedure_id: Number(procedureId),
                    ...(staffCompetencyDetails[procedureId] || {})
                  }))
                }, () => { resetStaff(); resetStaffCompetencies(); });
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
                  <MultiSelect options={competencyProcedures} selected={staffForm.competency_procedure_ids} onChange={(ids) => {
                    setStaffForm((current) => ({ ...current, competency_procedure_ids: ids }));
                    setStaffCompetencyDetails((current) => Object.fromEntries(ids.map((id) => [id, current[id] || { assessment_phase: 'Initial', assessment_date: '', next_review_date: '', competency_status: 'Competent', notes: '' }])));
                  }} placeholder="Select competencies held by this staff member" />
                  {staffForm.competency_procedure_ids.length > 0 && <div className="competency-entry-list">
                    {staffForm.competency_procedure_ids.map((procedureId) => {
                      const procedure = competencyProcedures.find((item) => item.id === Number(procedureId));
                      const detail = staffCompetencyDetails[procedureId] || {};
                      const updateDetail = (name, value) => setStaffCompetencyDetails((current) => ({ ...current, [procedureId]: { ...current[procedureId], [name]: value } }));
                      return <div className="competency-entry" key={procedureId}>
                        <strong>{procedure?.title || 'Selected competency'}</strong>
                        <div className="competency-entry-fields">
                          <label className="form-field"><span>Type</span><select className="input" value={detail.assessment_phase || 'Initial'} onChange={(e) => updateDetail('assessment_phase', e.target.value)}><option>Initial</option><option>6-Mo</option><option>Annual</option></select></label>
                          <label className="form-field"><span>Testing date</span><input className="input" type="date" min="1900-01-01" max="2100-12-31" value={detail.assessment_date || ''} onChange={(e) => updateDetail('assessment_date', e.target.value)} required /></label>
                          <label className="form-field"><span>Expiry date</span><input className="input" type="date" min="1900-01-01" max="2100-12-31" value={detail.next_review_date || ''} onChange={(e) => updateDetail('next_review_date', e.target.value)} /></label>
                        </div>
                      </div>;
                    })}
                  </div>}
                  <small className="field-help">Add the competency type, testing date, and expiry date for each selected competency.</small>
                </label>
                <button className="button" type="submit" disabled={!(staffForm.section_id || (staffForm.section_ids && staffForm.section_ids.length > 0))}>Register Laboratory Staff</button>
              </form>
            </Panel>}

            <section className="staff-directory">
              <div className="staff-directory-heading">
                <div><h2>Registered Laboratory Staff by Section</h2><p className="panel-note">Expand a section, then open a staff profile to review competencies.</p></div>
                <span className="directory-count">{staff.length} staff</span>
              </div>
              <div className="staff-section-list">
                {staffBySection.map((section) => {
                  const sectionOpen = expandedStaffSections.includes(section.id);
                  return <div className="staff-section" key={section.id}>
                    <button className="staff-section-toggle" type="button" onClick={() => toggleStaffSection(section.id)} aria-expanded={sectionOpen}>
                      <span><strong>{section.code} - {section.name}</strong><small>{section.staff.length} staff member(s)</small></span><span className="expiry-chevron">{sectionOpen ? '−' : '+'}</span>
                    </button>
                    {sectionOpen && <div className="staff-section-members">{section.staff.map((member) => {
                      const memberOpen = expandedStaff.includes(member.id);
                      const records = currentCompetencyRecords.filter((record) => record.staff_id === member.id);
                      return <div className="staff-profile" key={member.id}>
                        <div className="staff-profile-header">
                          <button className="staff-profile-toggle" type="button" onClick={() => toggleStaff(member.id)} aria-expanded={memberOpen}>
                            <span><strong>{staffName(member)}</strong><small>{member.employee_number || 'No staff ID'} · {member.status || 'active'}</small></span><span className="expiry-chevron">{memberOpen ? '−' : '+'}</span>
                          </button>
                          <button className="icon-button" type="button" title="Edit staff details" aria-label={`Edit ${staffName(member)}`} onClick={() => setEditingStaffId(member.id)}>✎</button>
                        </div>
                        {memberOpen && <div className="staff-profile-details">
                          {editingStaffId === member.id ? <StaffEditForm staff={member} sections={sections} onCancel={() => setEditingStaffId(null)} onSave={updateStaff} /> : <>
                            <div className="staff-contact"><span>{member.email || 'No email'}</span><span>{member.phone || 'No phone'}</span></div>
                            <div className="staff-competency-heading"><h3>Competencies</h3><button className="button button-secondary" type="button" onClick={() => addingCompetencyStaffId === member.id ? setAddingCompetencyStaffId(null) : startAddingCompetency(member.id)}>{addingCompetencyStaffId === member.id ? 'Cancel' : 'Add competency'}</button></div>
                            {addingCompetencyStaffId === member.id && <form className="form-grid staff-competency-form" onSubmit={(event) => { event.preventDefault(); submit('/competency-records', competencyForm, () => { resetCompetency(); setAddingCompetencyStaffId(null); }); }}>
                              <label className="form-field"><span>Competency</span><select className="input" name="procedure_id" value={competencyForm.procedure_id} onChange={(event) => { const procedureId = event.target.value; setCompetencyForm((current) => ({ ...current, procedure_id: procedureId, assessment_phase: nextAssessmentPhase(member.id, procedureId) })); }} required><option value="">Select competency</option>{competencyProcedures.map((procedure) => <option key={procedure.id} value={procedure.id}>{procedure.code} - {procedure.title}</option>)}</select></label>
                              <label className="form-field"><span>Competency type</span><select className="input" name="assessment_phase" value={competencyForm.assessment_phase} onChange={onChange(setCompetencyForm)}><option>Initial</option><option>6-Mo</option><option>Annual</option></select></label>
                              <label className="form-field"><span>Date of competency testing</span><input className="input" type="date" name="assessment_date" min="1900-01-01" max="2100-12-31" value={competencyForm.assessment_date} onChange={onChange(setCompetencyForm)} required /></label>
                              <label className="form-field"><span>Expiry date</span><input className="input" type="date" name="next_review_date" min="1900-01-01" max="2100-12-31" value={competencyForm.next_review_date} onChange={onChange(setCompetencyForm)} /></label>
                              <label className="form-field"><span>Status</span><select className="input" name="competency_status" value={competencyForm.competency_status} onChange={onChange(setCompetencyForm)}><option>Competent</option><option>Needs follow-up</option><option>Not Competent</option></select></label>
                              <label className="form-field"><span>Notes</span><textarea className="input" name="notes" value={competencyForm.notes} onChange={onChange(setCompetencyForm)} rows="3" /></label>
                              <button className="button" type="submit">Save competency</button>
                            </form>}
                            <CompetencyTable records={records} allRecords={competencyRecords} procedures={competencyProcedures} editingId={editingCompetencyId} onEdit={setEditingCompetencyId} onSave={updateCompetencyRecord} onCancel={() => setEditingCompetencyId(null)} historyKey={historyCompetencyKey} onHistory={setHistoryCompetencyKey} renewingId={renewingCompetencyId} onRenew={setRenewingCompetencyId} onRenewSave={renewCompetencyRecord} onRenewCancel={() => setRenewingCompetencyId(null)} />
                          </>}
                        </div>}
                      </div>;
                    })}</div>}
                  </div>;
                })}
                {unassignedStaff.length > 0 && <div className="staff-section"><div className="staff-section-toggle static"><span><strong>Unassigned Section</strong><small>{unassignedStaff.length} staff member(s)</small></span></div></div>}
                {staff.length === 0 && <p className="empty-text">No laboratory staff registered yet.</p>}
              </div>
            </section>
          </div>
        );
      }

      case 'equipment':
        {
        const equipmentBySection = sections.map((section) => ({
          ...section,
          equipment: equipment.filter((item) => item.equipment_sections?.some((link) => link.section?.id === section.id))
        })).filter((section) => section.equipment.length > 0);
        const unassignedEquipment = equipment.filter((item) => !item.equipment_sections?.length);
        return (
          <div className="equipment-container">
            {notification && <Notification message={notification} />}
            <section className="equipment-directory">
              <div className="equipment-header"><div><h2>Equipment Master List</h2><p className="panel-note">Expand a section to review instruments, service dates, and maintenance links.</p></div><span className="directory-count">{equipment.length} equipment</span></div>
              <div className="staff-section-list">
                {equipmentBySection.map((section) => {
                  const isExpanded = expandedEquipmentSections.includes(section.id);
                  return <div className="staff-section" key={section.id}>
                    <button className="staff-section-toggle" type="button" onClick={() => toggleEquipmentSection(section.id)} aria-expanded={isExpanded}><span><strong>{section.code} - {section.name}</strong><small>{section.equipment.length} equipment item(s)</small></span><span className="expiry-chevron">{isExpanded ? '−' : '+'}</span></button>
                    {isExpanded && <div className="staff-section-members">{section.equipment.map((item) => <EquipmentProfile key={item.id} equipment={item} sections={sections} editing={editingEquipmentId === item.id} onEdit={setEditingEquipmentId} onSave={updateEquipment} onCancel={() => setEditingEquipmentId(null)} />)}</div>}
                  </div>;
                })}
                {unassignedEquipment.length > 0 && <div className="staff-section"><div className="staff-section-toggle static"><span><strong>Unassigned Section</strong><small>{unassignedEquipment.length} equipment item(s)</small></span></div></div>}
                {equipment.length === 0 && <p className="empty-text">No equipment registered yet.</p>}
              </div>
            </section>
            <div className="equipment-registration-bottom">
              <div className="equipment-header"><div><h2>Equipment Registry</h2><p className="field-help">Add equipment only when a new instrument is introduced.</p></div><button className="add-button" type="button" onClick={() => setShowEquipmentForm((show) => !show)} aria-expanded={showEquipmentForm} aria-label="Register equipment">{showEquipmentForm ? '−' : '+'}</button></div>
              {showEquipmentForm && <Panel title="Register Equipment">
                <form className="form-grid" onSubmit={(event) => { event.preventDefault(); if (!equipmentForm.name.trim() || equipmentForm.section_ids.length === 0) { alert('Enter a name and select at least one section.'); return; } submit('/equipment', equipmentForm, resetEquipment); }}>
                  <label className="form-field"><span>Equipment Name</span><input name="name" value={equipmentForm.name} onChange={onChange(setEquipmentForm)} className="input" required /></label>
                  <label className="form-field"><span>Sections</span><MultiSelect options={sections} selected={equipmentForm.section_ids} onChange={(ids) => setEquipmentForm({ ...equipmentForm, section_ids: ids })} placeholder="Select sections" /></label>
                  <label className="form-field"><span>Model</span><input name="model" value={equipmentForm.model || ''} onChange={onChange(setEquipmentForm)} className="input" /></label>
                  <label className="form-field"><span>Serial Number</span><input name="serial_number" value={equipmentForm.serial_number || ''} onChange={onChange(setEquipmentForm)} className="input" /></label>
                  <label className="form-field"><span>Service Date</span><input name="service_date" type="date" min="1900-01-01" max="2100-12-31" value={equipmentForm.service_date || ''} onChange={onChange(setEquipmentForm)} className="input" /></label>
                  <label className="form-field"><span>Next Service Date</span><input name="next_service_date" type="date" min="1900-01-01" max="2100-12-31" value={equipmentForm.next_service_date || ''} onChange={onChange(setEquipmentForm)} className="input" /></label>
                  <label className="form-field"><span>Status</span><input name="status" value={equipmentForm.status || ''} onChange={onChange(setEquipmentForm)} className="input" /></label>
                  <label className="form-field"><span>Notes</span><textarea name="notes" value={equipmentForm.notes || ''} onChange={onChange(setEquipmentForm)} className="input" rows="3" /></label>
                  <div className="form-actions"><button className="button" type="submit">Save Equipment</button><button className="button button-secondary" type="button" onClick={() => { setShowEquipmentForm(false); resetEquipment(); }}>Cancel</button></div>
                </form>
              </Panel>}
            </div>
          </div>
        );
        }

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
            <SummaryCard title="Equipment" value={equipment.length} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>API: {apiBase}</div>
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
            <a
              className="main-admin-link"
              href="http://10.4.45.203:5174/"
              target="_blank"
              rel="noreferrer"
            >
              Go to Main Admin Front-End <span aria-hidden="true">↗</span>
            </a>
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

function StaffEditForm({ staff, sections, onCancel, onSave }) {
  const [form, setForm] = useState({
    first_name: staff.first_name || '',
    middle_name: staff.middle_name || '',
    last_name: staff.last_name || '',
    email: staff.email || '',
    phone: staff.phone || '',
    status: staff.status || 'active',
    section_ids: staff.staff_sections?.map((link) => link.section?.id).filter(Boolean) || []
  });

  return (
    <form className="staff-edit-form" onSubmit={(event) => { event.preventDefault(); onSave(staff.id, form); }}>
      <div className="staff-edit-grid">
        <input className="input" value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} placeholder="First name" required />
        <input className="input" value={form.middle_name} onChange={(event) => setForm({ ...form, middle_name: event.target.value })} placeholder="Middle name" />
        <input className="input" value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} placeholder="Last name" required />
        <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" />
        <input className="input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone" />
        <select className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>active</option><option>inactive</option></select>
      </div>
      <MultiSelect options={sections} selected={form.section_ids} onChange={(ids) => setForm({ ...form, section_ids: ids })} placeholder="Select sections" />
      <div className="form-actions"><button className="button" type="submit" disabled={form.section_ids.length === 0}>Save Changes</button><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}

function SopMasterTable({ sops, formatSections, editingSopId, onEdit, onSave, onCancel }) {
  return <div className="sop-master-list">{sops.map((sop) => editingSopId === sop.id
    ? <SopVersionForm key={sop.id} sop={sop} onSave={onSave} onCancel={onCancel} />
    : <div className="sop-master-row" key={sop.id}>
      <div className="sop-master-main"><strong>{sop.index_code} · {sop.title}</strong><span>{formatSections(sop)}</span></div>
      <div className="sop-master-meta"><span>v{sop.version || 'N/A'}</span><span>Effective {sop.effective_date || 'N/A'}</span><span>Review {sop.next_review_date || 'N/A'}</span></div>
      <div className="sop-master-actions"><button className="table-action" type="button" onClick={() => onEdit(sop.id)}>New Version</button><VersionHistoryButton versions={sop.versions || []} /></div>
    </div>
  )}</div>;
}

function SopVersionForm({ sop, onSave, onCancel }) {
  const [form, setForm] = useState({ version: '', effective_date: '', next_review_date: '' });
  return <form className="sop-version-form" onSubmit={(event) => { event.preventDefault(); onSave(sop.id, form); }}>
    <strong>New version for {sop.index_code}</strong>
    <input className="input" value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} placeholder="Version" required />
    <input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.effective_date} onChange={(event) => setForm({ ...form, effective_date: event.target.value })} required />
    <input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.next_review_date} onChange={(event) => setForm({ ...form, next_review_date: event.target.value })} required />
    <button className="button" type="submit">Save Version</button><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>
  </form>;
}

function VersionHistoryButton({ versions }) {
  const [open, setOpen] = useState(false);
  return <div className="version-history"><button className="table-action history-action" type="button" onClick={() => setOpen((value) => !value)} title="View previous versions" aria-expanded={open}>◷</button>{open && <div className="version-history-popover">{versions.length === 0 ? <span>No previous versions</span> : versions.map((version) => <div key={version.id}><strong>v{version.version}</strong><span>Effective {version.effective_date || 'N/A'}</span><span>Review {version.next_review_date || 'N/A'}</span></div>)}</div>}</div>;
}

function EquipmentProfile({ equipment, sections, editing, onEdit, onSave, onCancel }) {
  const sectionIds = equipment.equipment_sections?.map((link) => link.section?.id).filter(Boolean) || [];
  const [form, setForm] = useState({ name: equipment.name || '', model: equipment.model || '', serial_number: equipment.serial_number || '', status: equipment.status || '', notes: equipment.notes || '', service_date: equipment.service_date || '', next_service_date: equipment.next_service_date || '', section_ids: sectionIds });
  if (editing) return <form className="equipment-profile equipment-edit-form" onSubmit={(event) => { event.preventDefault(); onSave(equipment.id, form); }}><div className="staff-edit-grid"><input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" required /><input className="input" value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} placeholder="Model" /><input className="input" value={form.serial_number} onChange={(event) => setForm({ ...form, serial_number: event.target.value })} placeholder="Serial number" /><input className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} placeholder="Status" /><input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.service_date} onChange={(event) => setForm({ ...form, service_date: event.target.value })} /><input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.next_service_date} onChange={(event) => setForm({ ...form, next_service_date: event.target.value })} /></div><MultiSelect options={sections} selected={form.section_ids} onChange={(ids) => setForm({ ...form, section_ids: ids })} placeholder="Select sections" /><textarea className="input" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Equipment notes" rows="2" /><div className="form-actions"><button className="button" type="submit">Save Equipment</button><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button></div></form>;
  return <div className="equipment-profile"><div><strong>{equipment.code} · {equipment.name}</strong><span>{equipment.model || 'Model not recorded'} · {equipment.serial_number || 'Serial number not recorded'}</span><small>Service: {equipment.service_date || 'N/A'} · Next service: {equipment.next_service_date || 'N/A'}</small></div><div className="equipment-profile-actions"><span className="maintenance-link">Maintenance logs</span><button className="icon-button" type="button" title="Edit equipment" aria-label={`Edit ${equipment.name}`} onClick={() => onEdit(equipment.id)}>✎</button></div></div>;
}

function RenewCompetencyForm({ record, onSave, onCancel }) {
  const [form, setForm] = useState({
    assessment_phase: 'Annual',
    assessment_date: new Date().toISOString().slice(0, 10),
    next_review_date: '',
    competency_status: 'Competent',
    notes: ''
  });

  return <form className="renewal-form" onSubmit={(event) => { event.preventDefault(); onSave(record.id, form); }}>
    <strong>Renew competency</strong>
    <div className="renewal-form-fields">
      <label className="form-field"><span>Type</span><select className="input" value={form.assessment_phase} onChange={(event) => setForm({ ...form, assessment_phase: event.target.value })}><option>6-Mo</option><option>Annual</option></select></label>
      <label className="form-field"><span>Renewed testing date</span><input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.assessment_date} onChange={(event) => setForm({ ...form, assessment_date: event.target.value })} required /></label>
      <label className="form-field"><span>Valid until</span><input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.next_review_date} onChange={(event) => setForm({ ...form, next_review_date: event.target.value })} required /></label>
      <label className="form-field"><span>Notes</span><input className="input" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
    </div>
    <div className="form-actions"><button className="button" type="submit">Save Renewal</button><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}

function CompetencyTable({ records, allRecords, procedures, editingId, onEdit, onSave, onCancel, historyKey, onHistory, renewingId, onRenew, onRenewSave, onRenewCancel }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return records.length === 0 ? <p className="empty-text">No competency records yet.</p> : (
    <div className="competency-table-wrapper">
      <table className="competency-table">
        <thead><tr><th>Competency</th><th>Type</th><th>Testing Date</th><th>Expiry Date</th><th>Status</th></tr></thead>
        <tbody>{records.map((record) => {
          const procedure = procedures.find((item) => item.test_id === record.test_id);
          const recordKey = `${record.staff_id}-${record.test_id}`;
          const history = allRecords.filter((item) => `${item.staff_id}-${item.test_id}` === recordKey).sort((a, b) => b.id - a.id);
          const isExpired = record.next_review_date && new Date(record.next_review_date) < today;
          const displayStatus = isExpired ? 'Expired - Renewal required' : (record.competency_status || 'Valid');
          return editingId === record.id
            ? <CompetencyEditRow key={record.id} record={record} onSave={onSave} onCancel={onCancel} />
            : <React.Fragment key={record.id}><tr className={isExpired ? 'competency-expired-row' : undefined}><td>{procedure?.title || record.test?.name || 'N/A'}</td><td>{record.assessment_phase}</td><td>{record.assessment_date || 'N/A'}</td><td>{record.next_review_date || 'N/A'}</td><td><span className={`status-chip ${isExpired ? 'status-chip-expired' : ''}`}>{displayStatus}</span> <button className="table-action" type="button" onClick={() => onEdit(record.id)}>Edit</button> <button className="table-action history-action" type="button" title="View previous evaluations" aria-label="View previous evaluations" onClick={() => onHistory(historyKey === recordKey ? null : recordKey)}>◷</button> {onRenew && isExpired && <button className="table-action renewal-action" type="button" onClick={() => onRenew(record.id)}>Renew</button>}</td></tr>{historyKey === recordKey && <tr className="history-row"><td colSpan="5"><strong>Evaluation history</strong><div className="history-list">{history.map((item) => <div className="history-item" key={item.id}><span>{item.assessment_phase}</span><span>Tested {item.assessment_date || 'N/A'}</span><span>Valid until {item.next_review_date || 'N/A'}</span><span>{item.id === record.id ? 'Current' : 'Previous'}</span></div>)}</div></td></tr>}{renewingId === record.id && <tr className="renewal-row"><td colSpan="5"><RenewCompetencyForm record={record} onSave={onRenewSave} onCancel={onRenewCancel} /></td></tr>}</React.Fragment>;
        })}</tbody>
      </table>
    </div>
  );
}

function CompetencyEditRow({ record, onSave, onCancel }) {
  const [form, setForm] = useState({
    assessment_phase: record.assessment_phase || 'Initial',
    assessment_date: record.assessment_date || '',
    next_review_date: record.next_review_date || '',
    competency_status: record.competency_status || 'Competent',
    notes: record.notes || ''
  });

  return <tr className="competency-edit-row"><td colSpan="5"><form className="competency-edit-form" onSubmit={(event) => { event.preventDefault(); onSave(record.id, form); }}>
    <select className="input" value={form.assessment_phase} onChange={(event) => setForm({ ...form, assessment_phase: event.target.value })}><option>Initial</option><option>6-Mo</option><option>Annual</option></select>
    <input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.assessment_date} onChange={(event) => setForm({ ...form, assessment_date: event.target.value })} required />
    <input className="input" type="date" min="1900-01-01" max="2100-12-31" value={form.next_review_date} onChange={(event) => setForm({ ...form, next_review_date: event.target.value })} />
    <select className="input" value={form.competency_status} onChange={(event) => setForm({ ...form, competency_status: event.target.value })}><option>Competent</option><option>Needs follow-up</option><option>Not Competent</option></select>
    <input className="input" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" />
    <span className="competency-edit-actions"><button className="button" type="submit">Save</button><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button></span>
  </form></td></tr>;
}

function Form({ fields, data, onChange, onSubmit, buttonLabel }) {
  return (
    <form onSubmit={onSubmit} className="form-grid">
      {fields.map((field) => (
        <label key={field.name} className="form-field">
          <span>{field.label}</span>
          <input
            type={field.type}
            min={field.type === 'date' ? '1900-01-01' : undefined}
            max={field.type === 'date' ? '2100-12-31' : undefined}
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
