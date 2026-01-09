import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import { coursesAPI } from '../../lib/api';

const columns = [
  { key: 'title', label: 'Titlu' },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Descriere', render: (val) => val ? (val.length > 50 ? val.slice(0, 50) + '...' : val) : '-' },
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
  slug: '',
  is_published: false,
  thumbnail_url: '',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadCourses = async (params = {}) => {
    setLoading(true);
    try {
      const data = await coursesAPI.getAll(params);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSearch = (params) => loadCourses(params);
  const handleReset = () => loadCourses();

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description || '',
      slug: course.slug,
      is_published: course.is_published,
      thumbnail_url: course.thumbnail_url || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (course) => {
    if (!confirm(`Sigur doriți să ștergeți cursul "${course.title}"?`)) return;
    try {
      await coursesAPI.delete(course.id);
      loadCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await coursesAPI.update(editingCourse.id, form);
      } else {
        await coursesAPI.create(form);
      }
      setModalOpen(false);
      loadCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-900">Cursuri</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Adaugă curs
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
          <DataTable columns={columns} data={courses} onEdit={openEditModal} onDelete={handleDelete} />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Editare curs' : 'Adăugare curs'}
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
            <label className="block text-sm text-gray-600 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
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
          <div>
            <label className="block text-sm text-gray-600 mb-1">URL Thumbnail</label>
            <input
              type="text"
              value={form.thumbnail_url}
              onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
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
              {editingCourse ? 'Salvează' : 'Adaugă'}
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
