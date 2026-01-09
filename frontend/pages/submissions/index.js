import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import { submissionsAPI, usersAPI } from '../../lib/api';

const columns = [
  { key: 'student_id', label: 'Student ID', render: (val) => val ? val.slice(0, 8) + '...' : '-' },
  { key: 'exercise_id', label: 'Exercițiu ID', render: (val) => val ? val.slice(0, 8) + '...' : '-' },
  { key: 'text_response', label: 'Răspuns', render: (val) => val ? (val.length > 30 ? val.slice(0, 30) + '...' : val) : '-' },
  { key: 'is_correct', label: 'Corect', render: (val) => val === null ? '-' : val ? 'Da' : 'Nu' },
  { key: 'score', label: 'Scor', render: (val) => val ?? '-' },
];

const filters = [
  {
    key: 'is_correct',
    label: 'Corectitudine',
    type: 'select',
    options: [
      { value: 'true', label: 'Corecte' },
      { value: 'false', label: 'Incorecte' },
    ]
  },
];

const emptyForm = {
  student_id: '',
  exercise_id: '',
  text_response: '',
  is_correct: null,
  score: '',
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadSubmissions = async (params = {}) => {
    setLoading(true);
    try {
      const data = await submissionsAPI.getAll(params);
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await usersAPI.getAll({ user_type: 'student' });
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  useEffect(() => {
    loadSubmissions();
    loadStudents();
  }, []);

  const handleSearch = (params) => loadSubmissions(params);
  const handleReset = () => loadSubmissions();

  const openCreateModal = () => {
    setEditingSubmission(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (submission) => {
    setEditingSubmission(submission);
    setForm({
      student_id: submission.student_id,
      exercise_id: submission.exercise_id,
      text_response: submission.text_response || '',
      is_correct: submission.is_correct,
      score: submission.score || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (submission) => {
    if (!confirm('Sigur doriți să ștergeți această trimitere?')) return;
    try {
      await submissionsAPI.delete(submission.id);
      loadSubmissions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
        score: form.score ? parseInt(form.score) : null,
        is_correct: form.is_correct === '' ? null : form.is_correct,
      };
      if (editingSubmission) {
        await submissionsAPI.update(editingSubmission.id, submitData);
      } else {
        await submissionsAPI.create(submitData);
      }
      setModalOpen(false);
      loadSubmissions();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-900">Trimiteri</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Adaugă trimitere
        </button>
      </div>

      <SearchBar filters={filters} onSearch={handleSearch} onReset={handleReset} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Se încarcă...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg">
          <DataTable columns={columns} data={submissions} onEdit={openEditModal} onDelete={handleDelete} />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubmission ? 'Editare trimitere' : 'Adăugare trimitere'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Student</label>
            <select
              value={form.student_id}
              onChange={(e) => setForm({ ...form, student_id: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selectează...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Exercise ID (UUID)</label>
            <input
              type="text"
              value={form.exercise_id}
              onChange={(e) => setForm({ ...form, exercise_id: e.target.value })}
              required
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Răspuns text</label>
            <textarea
              value={form.text_response}
              onChange={(e) => setForm({ ...form, text_response: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Corect</label>
              <select
                value={form.is_correct === null ? '' : String(form.is_correct)}
                onChange={(e) => setForm({ ...form, is_correct: e.target.value === '' ? null : e.target.value === 'true' })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Neevaluat</option>
                <option value="true">Da</option>
                <option value="false">Nu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Scor</label>
              <input
                type="number"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {editingSubmission ? 'Salvează' : 'Adaugă'}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Anulează
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
