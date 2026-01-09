const API_BASE = 'http://localhost:8000/api';

export async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Eroare necunoscută' }));
    throw new Error(error.detail || 'Eroare la comunicarea cu serverul');
  }

  if (res.status === 204 || options.method === 'DELETE') {
    return null;
  }

  return res.json();
}

// Users API
export const usersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/users${query ? `?${query}` : ''}`);
  },
  getById: (id) => fetchAPI(`/users/${id}`),
  create: (data) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
};

// Courses API
export const coursesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/courses${query ? `?${query}` : ''}`);
  },
  getById: (id) => fetchAPI(`/courses/${id}`),
  create: (data) => fetchAPI('/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/courses/${id}`, { method: 'DELETE' }),
};

// Subjects API
export const subjectsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/subjects${query ? `?${query}` : ''}`);
  },
  create: (data) => fetchAPI('/subjects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/subjects/${id}`, { method: 'DELETE' }),
};

// Virtual Classes API
export const classesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/classes${query ? `?${query}` : ''}`);
  },
  create: (data) => fetchAPI('/classes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/classes/${id}`, { method: 'DELETE' }),
};

// Submissions API
export const submissionsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/submissions${query ? `?${query}` : ''}`);
  },
  create: (data) => fetchAPI('/submissions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/submissions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/submissions/${id}`, { method: 'DELETE' }),
};
