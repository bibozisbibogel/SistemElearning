import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import { classesAPI, usersAPI } from '../../lib/api';

const columns = [
  { key: 'name', label: 'Nume' },
  { key: 'access_code', label: 'Cod acces' },
  { key: 'description', label: 'Descriere', render: (val) => val ? (val.length > 40 ? val.slice(0, 40) + '...' : val) : '-' },
  { key: 'is_active', label: 'Status', render: (val) => val ? 'Activ' : 'Inactiv' },
];

const filters = [
  { key: 'search', label: 'Căutare', placeholder: 'Nume sau cod acces...' },
  {
    key: 'is_active',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'true', label: 'Activ' },
      { value: 'false', label: 'Inactiv' },
    ]
  },
];

const emptyForm = {
  name: '',
  description: '',
  access_code: '',
  is_active: true,
  teacher_id: '',
};

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadClasses = async (params = {}) => {
    setLoading(true);
    try {
      const data = await classesAPI.getAll(params);
      setClasses(data);
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
    loadClasses();
    loadTeachers();
  }, []);

  const handleSearch = (params) => loadClasses(params);
  const handleReset = () => loadClasses();

  const openCreateModal = () => {
    setEditingClass(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setForm({
      name: cls.name,
      description: cls.description || '',
      access_code: cls.access_code || '',
      is_active: cls.is_active,
      teacher_id: cls.teacher_id,
    });
    setModalOpen(true);
  };

  const handleDelete = async (cls) => {
    if (!confirm(`Sigur doriți să ștergeți clasa "${cls.name}"?`)) return;
    try {
      await classesAPI.delete(cls.id);
      loadClasses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
        access_code: form.access_code || null,
      };
      if (editingClass) {
        await classesAPI.update(editingClass.id, submitData);
      } else {
        await classesAPI.create(submitData);
      }
      setModalOpen(false);
      loadClasses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-900">Clase Virtuale</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Adaugă clasă
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
          <DataTable columns={columns} data={classes} onEdit={openEditModal} onDelete={handleDelete} />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClass ? 'Editare clasă' : 'Adăugare clasă'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nume</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cod acces</label>
            <input
              type="text"
              value={form.access_code}
              onChange={(e) => setForm({ ...form, access_code: e.target.value })}
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
          <div>
            <label className="block text-sm text-gray-600 mb-1">Profesor</label>
            <select
              value={form.teacher_id}
              onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
              required
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
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-sm text-gray-600">Activ</label>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {editingClass ? 'Salvează' : 'Adaugă'}
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
