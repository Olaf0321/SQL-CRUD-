'use client';

import { useState, useEffect } from 'react';
import { Button } from '../componenets/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../componenets/ui/Dialog'
import { Input } from '../componenets/ui/Input';
import { LOGIN_SERVER_URL, SERVER_URL, DB_LIST_URL } from '../config';
import SwitchToggle from '../componenets/ui/SwitchToggle';
import Notification from '../componenets/Notification';

type RecordType = { [key: string]: any; ID: number };

export default function DashboardPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [databases, setDatabases] = useState<any[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<any | null>(null);
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
  const [isSelectedState, setIsSelectedState] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [parentTableName, setParentTableName] = useState<string>('');
  const [showNotif, setShowNotif] = useState(false);
  const [child, setChild] = useState<{ [key: string]: any }>({});
  const [listColumn, setListColumn] = useState<{ [key: string]: any }>({});
  const [options, setOptions] = useState<string[]>([]);
  const [selectListColumn, setSelectListColumn] = useState<{ [key: string]: any[] }>({});
  const [fkcolumnName, setFkColumnName] = useState<string>("");

  const handleToggle = () => {
    setIsOn(prev => !prev);
    setIsSelectedState(false);
  }

  const buildDbHeaders = () => {
    if (!selectedDatabase) return {} as any;
    return {
      'X-DB-Type': 'mysql',
      'X-DB-Host': selectedDatabase['ホスト'] || 'localhost',
      'X-DB-Port': String(selectedDatabase['ポート'] ?? '3306'),
      'X-DB-User': selectedDatabase['接続ID'] || '',
      'X-DB-Password': selectedDatabase['パスワード'] || '',
      'X-DB-Name': selectedDatabase['データベース名'] || ''
    } as any;
  }

  const fetchDatabases = async () => {
    try {
      const res = await fetch(DB_LIST_URL);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.databases) ? data.databases : [data]);
      setDatabases(list.filter(Boolean));
    } catch (err) {
      console.error('データベース一覧取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }

  const fetchTables = async () => {
    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}tables/${encodeURIComponent(dbName)}`, {
        headers: {
          ...buildDbHeaders()
        }
      });
      const data = await res.json();
      const tableList = data.tables;
      setTables(tableList.filter((t: string) => t !== 'sqlite_sequence'));
      // do not auto-select a table; wait for user selection
    } catch (err) {
      console.error('テーブル取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChild = async () => {
    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}child/${encodeURIComponent(dbName)}`, {
        headers: { ...buildDbHeaders() }
      });
      const data = await res.json();
      setChild(data.child);
    } catch (err) {
      console.error('テーブル取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListColumn = async () => {
    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}list_column/${encodeURIComponent(dbName)}`, {
        headers: { ...buildDbHeaders() }
      });
      const data = await res.json();
      setListColumn(data.list_column);
    } catch (err) {
      console.error('テーブル取得エラー:', err);
    }
  }

  const fetchTableColumns = async (tableName: string) => {
    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}columns/${encodeURIComponent(dbName)}/${encodeURIComponent(tableName)}`, {
        headers: {
          ...buildDbHeaders()
        }
      });
      const data = await res.json();
      setTableColumns(data.columns || []);
      const newCol = data.columns.filter((ele: string) => ele !== 'ID' && ele !== 'id');
      setTableColumnsWithoutID([...newCol]);
      // Initialize formData with empty strings
      const initialForm: { [key: string]: any } = {};
      newCol.forEach((col: string) => initialForm[col] = '');
      setFormData(initialForm);
      setColumnFilter(initialForm);
      fetchOptions()
    } catch (err) {
      console.error('Failed to fetch columns:', err);
    }
  };

  const fetchRecords = async (tableName: string) => {
    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}items/${encodeURIComponent(dbName)}/${encodeURIComponent(tableName)}`, {
        headers: {
          ...buildDbHeaders()
        }
      });
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error('レコード取得エラー:', err);
    }
  };

  const fetchOptions = () => {
    let containTable: Boolean = false;
    Object.keys(listColumn).some(key => {
      if (key == selectedTableName) containTable = true;
    }
    )
    if (containTable) {
      const arr = listColumn[selectedTableName];
      let newArr: { [key: string]: any } = {};
      for (let i = 0; i < tableColumns.length; i++) {
        const columnName = tableColumns[i];
        for (let j = 0; j < arr.length; j++) {
          const ele = arr[j];
          if (ele['column'] != columnName) continue;
          newArr = { ...newArr, [columnName]: ele['values'] };
          break;
        }
      }
      setSelectListColumn({ ...newArr });
    }
    return;
  }

  const handleTableClick = (tableName: string) => {
    setSelectedTableName(tableName);
    fetchRecords(tableName);
    fetchTableColumns(tableName); // Get column names
    fetchOptions();
  };

  const handleFormSubmit = async () => {
    let flag: Boolean = false;
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '') flag = true;
    });

    if (flag == true) {
      alert('正確に入力してください。');
      return;
    }
    if (!selectedTableName) return;

    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}items/${encodeURIComponent(dbName)}/${encodeURIComponent(selectedTableName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...buildDbHeaders() },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Items failed');

      setIsModalOpen(false);
      setFormData({});
      fetchRecords(selectedTableName); // Reload data
    } catch (err) {
      console.error('Items error:', err);
    }
  };

  const handleEditClick = async (record: any) => {
    if (!selectedTableName) return;
    await fetchTableColumns(selectedTableName);
    setEditMode(true);
    setEditId(record.ID);
    const { ID, id, ...rest } = record as any;
    const editableData = { ...rest };

    // Fill missing keys with empty string
    const completeData = tableColumnsWithoutID.reduce((acc, col) => {
      acc[col] = editableData[col] || ''; // if undefined, set to empty string
      return acc;
    }, {} as any);
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

    if (!selectedTableName || editId === null) return;

    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}items/${encodeURIComponent(dbName)}/${encodeURIComponent(selectedTableName)}/${encodeURIComponent(String(editId))}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...buildDbHeaders() },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');

      setIsModalOpen(false);
      setEditMode(false);
      setEditId(null);
      setFormData({});
      fetchRecords(selectedTableName);
    } catch (err) {
      console.error('更新エラー:', err);
    }
  };

  const getDisplayRecords = async () => {
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
      const filterValue = String(columnFilter[column] ?? '');
      if (filterValue === '') return; // no filter for this column
      newRecords.map(record => {
        if (contains(String(record[column] ?? ''), filterValue)) reNewRecords.push(record);
      })
      newRecords = [...reNewRecords];
      reNewRecords = [];
    })
    if (isOn && isSelectedState) {
      // TODO: Implement this
      // This is a placeholder for the actual implementation
      // Currently, in this code, the fkcolumnName is made from parentTableName + ID
      // So, if actual column name is different from parentTableName + ID, this will not work
      // So, i gonna get fkcolumnName using request to the server
      // The configuration of requst is like following:
      // purpos: check if the selectedTable is a child of parentTableName
      // how to do:
      // Send parentTableName and selectedTableName to the backend.
      // Information about selectedDatabase is also sent.
      // The backend connects to MySQL based on the information in selectedDatabase.
      // Get column information about parentTableName and selectedTableName.
      // If the column name is found, return the column name.
      // If not, return "".
      // The request is sent to the backend using fetch.
      // The response is received and the fkcolumnName is set.
      // If the fkcolumnName is not "", the fkcolumnName is used to filter the records.
      // If the fkcolumnName is "", the records are not filtered.
      // The filtered records are displayed.
      console.log("parentTableName: ", parentTableName);
      console.log("selectedTableName: ", selectedTableName);
      const res = await fetch(`${SERVER_URL}fkcolumnName/${encodeURIComponent(parentTableName)}/${encodeURIComponent(selectedTableName)}`, {
        headers: { ...buildDbHeaders() }
      });
      const data = await res.json();
      const fkcolumnName = data;
      setFkColumnName(fkcolumnName);
      if (fkcolumnName != "") {
        newRecords = newRecords.filter(record => {
          return record[fkcolumnName] == selectedId;
        });
      }
    }
    setDisPlayRecords([...newRecords]);
  }

  const handleDeleteClick = async (ID: number) => {
    if (!selectedTableName) return;

    const confirmDelete = window.confirm('本当にこのレコードを削除しますか？');
    if (!confirmDelete) return;

    try {
      if (!selectedDatabase) return;
      const dbName = selectedDatabase['データベース名'];
      const res = await fetch(`${SERVER_URL}items/${encodeURIComponent(dbName)}/${encodeURIComponent(selectedTableName)}/${encodeURIComponent(String(ID))}`, {
        method: 'DELETE',
        headers: {
          ...buildDbHeaders()
        }
      });

      if (!res.ok) throw new Error('Delete failed');

      fetchRecords(selectedTableName);
    } catch (err) {
      console.error('削除エラー:', err);
    }
  };

  const contains = (text: string, search: string): boolean => {
    return text.includes(search);
  };

  const handleSelect = (record: RecordType) => {
    setIsSelectedState(!isSelectedState);
    setShowNotif(true);
    setSelectedId(record.ID);
    setParentTableName(selectedTableName);
  }

  const emptyFun = () => {

  }

  const sortJsonByField = (jsonArray: any[], fieldName: string, order: string) => {
    return jsonArray.sort((a, b) => {
      if (order === 'asc') {
        return a[fieldName] > b[fieldName] ? 1 : (a[fieldName] < b[fieldName] ? -1 : 0);
      } else {
        return a[fieldName] < b[fieldName] ? 1 : (a[fieldName] > b[fieldName] ? -1 : 0);
      }
    });
  }

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

  const listCheck = (columnName: string) => {

    let containTable: Boolean = false;
    Object.keys(listColumn).some(key => {
      if (key == selectedTableName) containTable = true;
    }
    )
    if (containTable) {
      const arr = listColumn[selectedTableName];
      let columnCheck = false;
      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];
        if (ele['column'] != columnName) continue;
        columnCheck = true; break;
      }
      return columnCheck;
    }
    return containTable;
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchOptions();
  }, [listColumn, selectedTableName, tableColumns]);

  useEffect(() => {
    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);
    checkSession(); // Also run once right away
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    fetchDatabases();
    fetchChild();
    fetchListColumn();
  }, []);

  useEffect(() => {
    // when database selection changes, reset and load tables
    setTables([]);
    setSelectedTableName('');
    setRecords([]);
    if (selectedDatabase) {
      setLoading(true);
      fetchTables();
      // Load relationship and list metadata for filtering and select lists
      fetchChild();
      fetchListColumn();
    }
  }, [selectedDatabase]);

  useEffect(() => {
    setRowNumber(records.length);
    getDisplayRecords();
  }, [records, totalFilter, columnFilter, isOn]);

  useEffect(() => {
    let sortedArr: any[] = [];
    if (sortedColumnState == 0) {
      sortedArr = sortJsonByField(disPlayRecords, 'ID', 'asc');
    } else if (sortedColumnState == 1) {
      sortedArr = sortJsonByField(disPlayRecords, sortedColumnName, 'asc');
    } else {
      sortedArr = sortJsonByField(disPlayRecords, sortedColumnName, 'desc');
    }
    setDisPlayRecords([...sortedArr]);
  }, [sortedColumnState]);

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
                className={`cursor-pointer px-3 py-2 rounded-md transition-all ${table === selectedTableName
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
        {/* Database Selector */}
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm text-gray-700">データベース</label>
          <select
            className="border border-gray-300 rounded-md p-2"
            value={selectedDatabase ? selectedDatabase['id'] ?? '' : ''}
            onChange={(e) => {
              const id = e.target.value;
              const db = databases.find(d => String(d.id ?? d['id']) === id);
              setSelectedDatabase(db ?? null);
            }}
          >
            <option value="">未選択</option>
            {databases.map((db, idx) => (
              <option key={db.id ?? idx} value={String(db.id ?? idx)}>
                {db['データベース名']}@{db['ホスト']}:{db['ポート']}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedTableName ? `テーブル「${selectedTableName}」のレコード` : 'レコード表示'}
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
              if (isOn && isSelectedState) {
                const hasFk = tableColumns.includes(fkcolumnName);
                if (hasFk) setFormData({ [fkcolumnName]: selectedId });
              } else {
                setFormData({});
              }
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
                      value={columnFilter[key] ?? ''}
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
                  {tableColumns.map((key) => (
                    <td key={`${index}-${key}`} className="border border-gray-300 px-4 py-2">
                      {String(record[key] ?? '')}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <Button
                      onClick={() => handleEditClick(record)}
                      variant='edit'
                    >
                      更新
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteClick(record.ID)}>削除</Button>
                    {isOn && (
                      <Button
                        onClick={() => handleSelect(record)}
                        isSelectedState={isSelectedState}
                        parentTableName={parentTableName}
                        selectedTableName={selectedTableName}
                        selectedID={selectedId}
                        curID={record.ID}
                        variant={isSelectedState == true && parentTableName == selectedTableName && record.ID == selectedId ? 'deselect' : 'select'}
                      >
                        {
                          isSelectedState == true && parentTableName == selectedTableName && record.ID == selectedId ? '解除' : '選択'
                        }
                      </Button>
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

            {tableColumnsWithoutID.map((col, id) => (
              listCheck(col) == false ? (
                <Input
                  key={col}
                  id={col}
                  label={col}
                  value={formData[col] || ''}
                  onChange={(e: any) => setFormData({ ...formData, [col]: e.target.value })}
                  className=''
                  placeholderValue=''
                />
              ) : (
                <div key={col} className={`mb-4`}>
                  <label className="block text-sm font-medium text-gray-700">
                    {col}
                  </label>
                  <select key={col} name={col} value={formData[col]} onChange={handleSelectChange} className={`mt-1 p-2 border border-gray-300 rounded-md w-full h-11`}>
                    {selectListColumn[col] != undefined && selectListColumn[col].map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )))}

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
          message={isSelectedState ? `${selectedTableName}テーブルのID=${selectedId}が親として選択されました。` : "解除されました。"}
          visible={showNotif}
          onClose={() => setShowNotif(false)}
        />

      </div>

    </main>
  );
}
