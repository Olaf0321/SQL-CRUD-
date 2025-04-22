'use client';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../config';

export default function Dashboard() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  // Fetch list of tables on initial load
  const fetchTables = async () => {
    try {
      const res = await fetch(`${SERVER_URL}tables/`);
      const data = await res.json();
      setTables(data.tables);
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  // Fetch records when a table is selected
  const fetchRecords = async (tableName: string) => {
    try {
      const res = await fetch(`${SERVER_URL}items/${tableName}`);
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName);
    fetchRecords(tableName);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div>
        <h2 className="text-xl font-semibold">Tables:</h2>
        <ul>
          {tables.map((table) => (
            <li key={table} className="cursor-pointer text-blue-600" onClick={() => handleTableClick(table)}>
              {table}
            </li>
          ))}
        </ul>
      </div>

      {selectedTable && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Records in {selectedTable}</h2>
          <ul className="space-y-2">
            {records.map((record, index) => (
              <li key={index} className="p-4 border rounded shadow-sm bg-white">
                {JSON.stringify(record)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
