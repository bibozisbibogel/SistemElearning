import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import { usersAPI } from '../../lib/api';

const columns = [
  { key: 'first_name', label: 'Prenume' },
  { key: 'last_name', label: 'Nume' },
  { key: 'email', label: 'Email' },
  {
    key: 'user_type',
    label: 'Tip',
    render: (val) => val === 'teacher' ? 'Profesor' : val === 'student' ? 'Elev' : val
  },
  {
    key: 'is_active',
    label: 'Status',
    render: (val) => val ? 'Activ' : 'Inactiv'
  },
];

const filters = [
  { key: 'search', label: 'Căutare', placeholder: 'Nume, prenume sau email...' },
  {
    key: 'user_type',
    label: 'Tip utilizator',
    type: 'select',
    options: [
      { value: 'teacher', label: 'Profesor' },
      { value: 'student', label: 'Elev' },
    ]
  },
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
  email: '',
  password_hash: '',
  first_name: '',
  last_name: '',
  user_type: 'student',
  is_active: true,
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadUsers = async (params = {}) => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll(params);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (params) => {
    loadUsers(params);
  };

  const handleReset = () => {
    loadUsers();
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      password_hash: '',
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      is_active: user.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Sigur doriți să ștergeți utilizatorul ${user.first_name} ${user.last_name}?`)) {
      return;
    }
    try {
      await usersAPI.delete(user.id);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { ...form };
        if (!updateData.password_hash) {
          delete updateData.password_hash;
        }
        await usersAPI.update(editingUser.id, updateData);
      } else {
        await usersAPI.create(form);
      }
      setModalOpen(false);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-900">Utilizatori</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Adaugă utilizator
        </button>
      </div>

      <SearchBar filters={filters} onSearch={handleSearch} onReset={handleReset} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Se încarcă...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg">
          <DataTable
            columns={columns}
            data={users}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Editare utilizator' : 'Adăugare utilizator'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Parolă {editingUser && '(lăsați gol pentru a păstra)'}
            </label>
            <input
              type="password"
              value={form.password_hash}
              onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
              required={!editingUser}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Prenume</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nume</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tip utilizator</label>
            <select
              value={form.user_type}
              onChange={(e) => setForm({ ...form, user_type: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="student">Elev</option>
              <option value="teacher">Profesor</option>
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
              {editingUser ? 'Salvează' : 'Adaugă'}
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
