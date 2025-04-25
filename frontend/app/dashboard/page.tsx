'use client';

import { useState, useEffect } from 'react';
import { Button } from '../componenets/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../componenets/ui/Dialog'
import { Input } from '../componenets/ui/Input';
import { LOGIN_SERVER_URL, SERVER_URL } from '../config';
import Toggle from '../componenets/ui/SwitchToggle';
import SwitchToggle from '../componenets/ui/SwitchToggle';
import Notification from '../componenets/Notification';

type RecordType = { [key: string]: any; id: number };

export default function DashboardPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [columnFilter, setColumnFilter] = useState<{ [key: string]: any }>({});
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [totalFilter, setTotalFilter] = useState('');
  const [rowNumber, setRowNumber] = useState(0);
  const [disPlayRecords, setDisPlayRecords] = useState<any[]>([]);
  const [sortedColumnName, setSortedColumnName] = useState('');
  const [sortedColumnState, setSortedColumnState] = useState(0);
  const [tableColumnsWithoutID, setTableColumnsWithoutID] = useState<string[]>([]);
  const [isOn, setIsOn] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleToggle = () => {
    setIsOn(prev => !prev);
  }

  const triggerNotification = () => setShowNotif(true);

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
      const newCol = data.columns.filter((ele: string) => ele != 'ID');
      setTableColumnsWithoutID([...newCol]);

      // Initialize formData with empty strings
      const initialForm: { [key: string]: any } = {};
      data.columns.forEach((col: string) => initialForm[col] = '');
      setFormData(initialForm);
      setColumnFilter(initialForm);
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
    console.log('formdata', formData);
    let flag: Boolean = false;
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '') flag = true;
    });

    if (flag == true) {
      alert('正確に入力してください。');
      return;
    }
    if (!selectedTable) return;

    try {
      const res = await fetch(`${SERVER_URL}items/${selectedTable}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Items failed');

      setIsModalOpen(false);
      setFormData({});
      fetchRecords(selectedTable); // Reload data
    } catch (err) {
      console.error('Items error:', err);
    }
  };

  const handleEditClick = async (record: any) => {
    if (!selectedTable) return;
    await fetchTableColumns(selectedTable);
    setEditMode(true);
    setEditId(record.ID);
    const { ID, ...editableData } = record;

    // Fill missing keys with empty string
    const completeData = tableColumnsWithoutID.reduce((acc, col) => {
      acc[col] = editableData[col] || ''; // if undefined, set to empty string
      return acc;
    }, {} as any);
    console.log('completeData', completeData);
    setFormData(completeData);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    let flag: Boolean = false;
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '') flag = true;
    });

    if (flag == true) {
      alert('正確に入力してください。');
      return;
    }

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

  const getDisplayRecords = () => {
    let newRecords: Record<string, any>[] = [];
    records.map(record => {
      let str = '';
      Object.entries(record).map(([key, value]) => {
        str += value;
      });
      if (contains(str, totalFilter)) newRecords.push(record);
    });
    let reNewRecords: Record<string, any>[] = [];
    tableColumns.map((column: string) => {
      newRecords.map(record => {
        if (contains(String(record[column]), String(columnFilter[column]))) reNewRecords.push(record);
      })
      console.log('reNewRecords', reNewRecords);
      newRecords = [...reNewRecords];
      reNewRecords = [];
    })
    console.log('newRecords', newRecords);
    setDisPlayRecords([...newRecords]);
  }

  const handleDeleteClick = async (ID: number) => {
    if (!selectedTable) return;

    const confirmDelete = window.confirm('本当にこのレコードを削除しますか？');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${SERVER_URL}items/${selectedTable}/${ID}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      fetchRecords(selectedTable);
    } catch (err) {
      console.error('削除エラー:', err);
    }
  };

  const contains = (text: string, search: string): boolean => {
    return text.includes(search);
  };

  const handleSelect = () => {
    setIsSelected(!isSelected);
    setShowNotif(true);
  }

  const emptyFun = () => {

  }

  const sortJsonByField = (jsonArray: any[], fieldName: string, order: string) => {
    console.log('order', order);
    return jsonArray.sort((a, b) => {
      if (order === 'asc') {
        return a[fieldName] > b[fieldName] ? 1 : (a[fieldName] < b[fieldName] ? -1 : 0);
      } else {
        return a[fieldName] < b[fieldName] ? 1 : (a[fieldName] > b[fieldName] ? -1 : 0);
      }
    });
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${LOGIN_SERVER_URL}check-session`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) {
          // Session expired
          window.location.href = '/'; // Redirect to login page
        }
      } catch (err) {
        console.error('Session check failed:', err);
        window.location.href = '/';
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);
    checkSession(); // Also run once right away

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    setRowNumber(records.length);
    getDisplayRecords();
  }, [records, totalFilter, columnFilter])

  useEffect(() => {
    console.log('sortedColumnState', sortedColumnState);
    console.log('sortedColumnName', sortedColumnName);
    let sortedArr: any[] = [];
    if (sortedColumnState == 0) {
      sortedArr = sortJsonByField(disPlayRecords, 'ID', 'asc');
    } else if (sortedColumnState == 1) {
      sortedArr = sortJsonByField(disPlayRecords, sortedColumnName, 'asc');
    } else {
      sortedArr = sortJsonByField(disPlayRecords, sortedColumnName, 'desc');
    }
    console.log('sortedArr', sortedArr);
    setDisPlayRecords([...sortedArr]);
  }, [sortedColumnState])

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
          <div className='flex items-center'>
            <SwitchToggle isOn={isOn} toggle={handleToggle} />
            <Input
              id=''
              label=''
              value={totalFilter}
              placeholderValue={`${rowNumber} 行をフィルター`}
              onChange={(e: any) => setTotalFilter(e.target.value)}
              className='mt-3 mr-3'
            />
            <Button onClick={() => {
              setIsModalOpen(true);
              setFormData({});
            }}
            >追加</Button>
          </div>
        </div>

        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {tableColumns.map((key) => (
                <th key={key} className="border border-gray-300 px-4 py-2 max-w-full">
                  <div className='flex justify-between'>
                    <div>{key}</div>
                    <div>
                      <button onClick={() => {
                        setSortedColumnName(String(key));
                        setSortedColumnState((sortedColumnState + 1) % 3);
                      }}>
                        {sortedColumnName == key ? sortedColumnState == 1 ? <div className='w-3'>▲</div> : sortedColumnState == 2 ? <div className='w-3'>▼</div> : <div className='w-3'>◼️</div> : <div className='w-3'>◼️</div>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Input
                      id=''
                      label=''
                      value={columnFilter[key]}
                      placeholderValue='フィルター'
                      onChange={(e: any) => setColumnFilter({ ...columnFilter, [key]: e.target.value })}
                      className='mt-3'
                    />
                  </div>
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2 text-left items-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {disPlayRecords.length === 0 ? (
              <tr className="hover:bg-gray-50">
                <td colSpan={tableColumns.length}>
                  <div className='m-3'>このテーブルにはレコードが存在しません。</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <Button onClick={() => emptyFun()}>更新</Button>
                  <Button variant="destructive" onClick={() => emptyFun()}>削除</Button>
                </td>
              </tr>
            ) : (
              disPlayRecords.map((record: RecordType, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(record).map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">
                      {String(value)}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <Button onClick={() => handleEditClick(record)}>更新</Button>
                    <Button variant="destructive" onClick={() => handleDeleteClick(record.ID)}>削除</Button>
                    {isOn && (
                      <Button onClick={() => handleSelect()}>{isSelected ? '選択' : '解除'}</Button>
                    )}
                  </td>
                </tr>
              )))}
          </tbody>
        </table>

        {/* Modal Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'レコードを更新' : 'レコードを追加'}</DialogTitle>
            </DialogHeader>

            {tableColumnsWithoutID.map((col) => (
              <Input
                key={col}
                id={col}
                label={col}
                value={formData[col] || ''}
                onChange={(e: any) => setFormData({ ...formData, [col]: e.target.value })}
                className=''
                placeholderValue=''
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

        <Notification
          message={isSelected ? "選択されました。" : "解除されました。"}
          visible={showNotif}
          onClose={() => setShowNotif(false)}
        />

      </div>
    </main>
  );
}