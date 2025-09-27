// Table component
// Following the clean architecture principle of single-responsibility components

import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectable?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (item: T) => string;
  className?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onSort,
  sortKey,
  sortDirection,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  getRowId = (item: T) => String(item.id),
  className = ''
}: TableProps<T>) {
  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    const allIds = data.map(getRowId);
    const allSelected = allIds.every(id => selectedItems.includes(id));

    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allIds);
    }
  };

  const handleSelectRow = (item: T) => {
    if (!onSelectionChange) return;

    const id = getRowId(item);
    const isSelected = selectedItems.includes(id);

    if (isSelected) {
      onSelectionChange(selectedItems.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedItems, id]);
    }
  };

  const handleSort = (columnKey: string) => {
    if (!onSort || !columns.find(col => col.key === columnKey)?.sortable) return;

    const newDirection = sortKey === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  const allIds = data.map(getRowId);
  const selectedCount = selectedItems.filter(id => allIds.includes(id)).length;
  const allSelected = allIds.length > 0 && selectedCount === allIds.length;
  const someSelected = selectedCount > 0 && selectedCount < allIds.length;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {selectable && (
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${column.className || ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && sortKey === column.key && (
                    <span className="text-gray-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const rowId = getRowId(item);
            const isSelected = selectedItems.includes(rowId);

            return (
              <tr
                key={rowId}
                className={`border-b hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(item)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 text-sm text-gray-900 ${column.className || ''}`}
                  >
                    {column.render ? column.render(item) : String(item[column.key] || '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
