'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch('http://localhost:8010/tables/');
        const data = await res.json();
        const tableList = data.tables;
        setTables(tableList.filter((ele: string) => ele !== 'sqlite_sequence'));
        if (tableList.length > 0) {
          setSelectedTable(tableList[0]);
          fetchRecords(tableList[0]);
        }
      } catch (err) {
        console.error('テーブル取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const fetchRecords = async (tableName: string) => {
    try {
      const res = await fetch(`http://localhost:8010/items/${tableName}`);
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error('レコード取得エラー:', err);
    }
  };

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName);
    fetchRecords(tableName);
  };

  return (
    <main className="flex h-screen">
      {/* 左サイドバー：テーブル一覧 */}
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

      {/* 右側：レコード表示 */}
      <div className="w-3/4 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {selectedTable ? `テーブル「${selectedTable}」のレコード` : 'レコード表示'}
        </h2>

        {records.length === 0 ? (
          <p className="text-gray-500">このテーブルにはレコードが存在しません。</p>
        ) : (
          < table className="min-w-full table-auto border border-gray-300 mt-4">
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
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(record).map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main >
  );
}
