"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const API_URL = "http://localhost:3001/items";

  const fetchItems = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");
    setEditingId(null);
    fetchItems();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">Task Manager</h1>
          <p className="mt-2 text-gray-500">Next.js + NestJS CRUD App</p>
        </header>

        <form onSubmit={handleSubmit} className="mb-10 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="grid gap-4">
            <input
              className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white transition hover:bg-indigo-700">
              {editingId ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => startEdit(item)} className="text-sm font-medium text-indigo-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => deleteItem(item.id)} className="text-sm font-medium text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-gray-400">No tasks found. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}