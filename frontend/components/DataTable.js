export default function DataTable({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nu există date de afișat
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-2 font-medium text-gray-600">
                {col.label}
              </th>
            ))}
            <th className="text-right py-3 px-2 font-medium text-gray-600">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-2 text-gray-700">
                  {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '-')}
                </td>
              ))}
              <td className="py-3 px-2 text-right space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editare
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Ștergere
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
