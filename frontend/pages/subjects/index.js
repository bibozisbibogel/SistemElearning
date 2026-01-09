import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import { subjectsAPI, usersAPI } from '../../lib/api';

const columns = [
  { key: 'title', label: 'Titlu' },
  { key: 'description', label: 'Descriere', render: (val) => val ? (val.length > 40 ? val.slice(0, 40) + '...' : val) : '-' },
  { key: 'total_points', label: 'Puncte', render: (val) => val ?? '-' },
  { key: 'time_limit_minutes', label: 'Timp (min)', render: (val) => val ?? '-' },
  { key: 'is_published', label: 'Publicat', render: (val) => val ? 'Da' : 'Nu' },
];

const filters = [
  { key: 'search', label: 'Căutare', placeholder: 'Titlu sau descriere...' },
  {
    key: 'is_published',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'true', label: 'Publicat' },
      { value: 'false', label: 'Nepublicat' },
    ]
  },
];

const emptyForm = {
  title: '',
  description: '',
  total_points: '',
  time_limit_minutes: '',
  is_published: false,
  created_by: '',
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadSubjects = async (params = {}) => {
    setLoading(true);
    try {
      const data = await subjectsAPI.getAll(params);
      setSubjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await usersAPI.getAll({ user_type: 'teacher' });
      setTeachers(data);
    } catch (err) {
      console.error('Failed to load teachers:', err);
    }
  };

  useEffect(() => {
    loadSubjects();
    loadTeachers();
  }, []);

  const handleSearch = (params) => loadSubjects(params);
  const handleReset = () => loadSubjects();

  const openCreateModal = () => {
    setEditingSubject(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setForm({
      title: subject.title,
      description: subject.description || '',
      total_points: subject.total_points || '',
      time_limit_minutes: subject.time_limit_minutes || '',
      is_published: subject.is_published,
      created_by: subject.created_by || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (subject) => {
    if (!confirm(`Sigur doriți să ștergeți subiectul "${subject.title}"?`)) return;
    try {
      await subjectsAPI.delete(subject.id);
      loadSubjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
        total_points: form.total_points ? parseInt(form.total_points) : null,
        time_limit_minutes: form.time_limit_minutes ? parseInt(form.time_limit_minutes) : null,
        created_by: form.created_by || null,
      };
      if (editingSubject) {
        await subjectsAPI.update(editingSubject.id, submitData);
      } else {
        await subjectsAPI.create(submitData);
      }
      setModalOpen(false);
      loadSubjects();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-900">Subiecte</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Adaugă subiect
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
          <DataTable columns={columns} data={subjects} onEdit={openEditModal} onDelete={handleDelete} />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubject ? 'Editare subiect' : 'Adăugare subiect'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Titlu</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Descriere</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Puncte totale</label>
              <input
                type="number"
                value={form.total_points}
                onChange={(e) => setForm({ ...form, total_points: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Timp limită (min)</label>
              <input
                type="number"
                value={form.time_limit_minutes}
                onChange={(e) => setForm({ ...form, time_limit_minutes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Creator (profesor)</label>
            <select
              value={form.created_by}
              onChange={(e) => setForm({ ...form, created_by: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selectează...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="is_published" className="text-sm text-gray-600">Publicat</label>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {editingSubject ? 'Salvează' : 'Adaugă'}
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
