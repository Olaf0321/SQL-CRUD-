"use client";
import { useEffect, useState } from "react";
import { SERVER_URL } from '../config'

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetch(`${SERVER_URL}items/`)
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        setItems(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}
      {items.length > 0 ? (
        <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
          {items.map((item: any) => (
            <div key={item.id} className="border p-4 rounded shadow bg-white">
              <p className="font-semibold text-gray-800">ID: {item.id}</p>
              <p className="text-gray-700">名前: {item["名前"]}</p>
              <p className="text-gray-600">説明: {item["説明"]}</p>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No items found.</p>
      )}
    </div>
  );
}
