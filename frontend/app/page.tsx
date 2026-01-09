"use client"
import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  const fetchItems = () => {
    fetch('http://localhost:3001/items').then(res => res.json()).then(setItems);
  };

  useEffect(() => { fetchItems(); }, []);

  const addItem = async () => {
    await fetch('http://localhost:3001/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setName('');
    fetchItems();
  };

  const deleteItem = async (id: number) => {
    await fetch(`http://localhost:3001/items/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold">CRUD: Next.js + NestJS</h1>
      <div className="flex gap-2 mt-4">
        <input className="border p-2 text-black" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <button onClick={addItem} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul className="mt-5">
        {items.map((item: any) => (
          <li key={item.id} className="flex justify-between w-64 border-b py-2">
            {item.name} <button onClick={() => deleteItem(item.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}