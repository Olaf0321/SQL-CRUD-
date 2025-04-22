'use client';

import { useState, useEffect } from 'react';
import { Button } from '../componenets/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../componenets/ui/Dialog'
import { Input } from '../componenets/ui/Input';
import { SERVER_URL } from '../config';

type RecordType = { [key: string]: any; id: number };

export default function DashboardPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: any }>({ name: '' });
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchTables = async () => {
    try {
      const res = await fetch(`${SERVER_URL}tables/`);
      const data = await res.json();
      const tableList = data.tables;
      setTables(tableList.filter((t: string) => t !== 'sqlite_sequence'));
      if (tableList.length > 0) {
        setSelectedTable(tableList[0]);
        fetchRecords(tableList[0]);
        fetchTableColumns(tableList[0]);
      }
    } catch (err) {
      console.error('テーブル取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableColumns = async (tableName: string) => {
    try {
      const res = await fetch(`${SERVER_URL}columns/${tableName}`);
      const data = await res.json();
      setTableColumns(data.columns || []);

      // Initialize formData with empty strings
      const initialForm: { [key: string]: any } = {};
      data.columns.forEach((col: string) => initialForm[col] = '');
      setFormData(initialForm);
    } catch (err) {
      console.error('Failed to fetch columns:', err);
    }
  };

  const fetchRecords = async (tableName: string) => {
    try {
      const res = await fetch(`${SERVER_URL}items/${tableName}`);
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error('レコード取得エラー:', err);
    }
  };

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName);
    fetchRecords(tableName);
    fetchTableColumns(tableName); // Get column names
  };

  const handleFormSubmit = async () => {
    if (!selectedTable) return;

    try {
      const res = await fetch(`${SERVER_URL}items/${selectedTable}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Items failed');

      setIsModalOpen(false);
      setFormData({ name: '' });
      fetchRecords(selectedTable); // Reload data
    } catch (err) {
      console.error('Items error:', err);
    }
  };

  const handleEditClick = async (record: any) => {
    if (!selectedTable) return;
    await fetchTableColumns(selectedTable);
    setEditMode(true);
    setEditId(record.id);
    const { id, ...editableData } = record;

    // Fill missing keys with empty string
    const completeData = tableColumns.reduce((acc, col) => {
      acc[col] = editableData[col] || ''; // if undefined, set to empty string
      return acc;
    }, {} as any);
    console.log('completeData', completeData);
    setFormData(completeData);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedTable || editId === null) return;

    try {
      const res = await fetch(`${SERVER_URL}items/${selectedTable}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');

      setIsModalOpen(false);
      setEditMode(false);
      setEditId(null);
      setFormData({});
      fetchRecords(selectedTable);
    } catch (err) {
      console.error('更新エラー:', err);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!selectedTable) return;

    const confirmDelete = window.confirm('本当にこのレコードを削除しますか？');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${SERVER_URL}items/${selectedTable}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      fetchRecords(selectedTable);
    } catch (err) {
      console.error('削除エラー:', err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <main className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-semibold mb-4">テーブル一覧</h2>
        {loading ? (
          <p>読み込み中...</p>
        ) : tables.length === 0 ? (
          <p className="text-gray-500">テーブルが見つかりませんでした。</p>
        ) : (
          <ul className="space-y-2">
            {tables.map((table) => (
              <li
                key={table}
                onClick={() => handleTableClick(table)}
                className={`cursor-pointer px-3 py-2 rounded-md transition-all ${table === selectedTable
                  ? 'bg-blue-500 text-white font-bold'
                  : 'hover:bg-blue-100 text-gray-800'
                  }`}
              >
                {table}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Area */}
      <div className="w-3/4 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedTable ? `テーブル「${selectedTable}」のレコード` : 'レコード表示'}
          </h2>
          <Button onClick={() => setIsModalOpen(true)}>Add Record</Button>
        </div>

        {/* Records Table */}
        {records.length === 0 ? (
          <p className="text-gray-500">このテーブルにはレコードが存在しません。</p>
        ) : (
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(records[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record: RecordType, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(record).map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">
                      {String(value)}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <Button onClick={() => handleEditClick(record)}>更新</Button>
                    <Button variant="destructive" onClick={() => handleDeleteClick(record.id)}>削除</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'レコードを更新' : 'レコードを追加'}</DialogTitle>
            </DialogHeader>

            {tableColumns.map((col) => (
              <Input
                key={col}
                id={col}
                label={col}
                value={formData[col] || ''}
                onChange={(e: any) => setFormData({ ...formData, [col]: e.target.value })}
              />
            ))}

            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => {
                setIsModalOpen(false);
                setEditMode(false);
                setFormData({});
                setEditId(null);
              }}>
                キャンセル
              </Button>
              <Button onClick={editMode ? handleUpdateSubmit : handleFormSubmit}>
                {editMode ? '保存' : '追加'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
