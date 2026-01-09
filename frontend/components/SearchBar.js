import { useState } from 'react';

export default function SearchBar({ filters, onSearch, onReset }) {
  const [values, setValues] = useState({});

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanValues = {};
    Object.entries(values).forEach(([key, val]) => {
      if (val !== '' && val !== undefined) {
        cleanValues[key] = val;
      }
    });
    onSearch(cleanValues);
  };

  const handleReset = () => {
    setValues({});
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filters.map((filter) => (
          <div key={filter.key}>
            <label className="block text-xs text-gray-500 mb-1">{filter.label}</label>
            {filter.type === 'select' ? (
              <select
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Toate</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type || 'text'}
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                placeholder={filter.placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Caută
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
        >
          Resetează
        </button>
      </div>
    </form>
  );
}
