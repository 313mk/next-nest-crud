"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", priority: "Medium" });
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const API = "http://localhost:3001/items";

  const fetchItems = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = isSignup ? "signup" : "signin";
    const res = await fetch(`${API}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    });

    if (res.ok) {
      if (isSignup) {
        setIsSignup(false);
      } else {
        const data = await res.json();
        setUser(data.user);
        setIsLoggedIn(true);
        fetchItems();
      }
    } else {
      alert("Auth Failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API}/${editingId}` : API;
    await fetch(url, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", priority: "Medium" });
    setEditingId(null);
    fetchItems();
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 text-3xl font-black text-slate-800">{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignup && (
              <input
                className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="Full Name"
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              />
            )}
            <input
              className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="Email Address"
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            />
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="Password"
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />
            <button className="w-full rounded-xl bg-indigo-600 p-4 font-bold text-white transition hover:bg-indigo-700">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <button onClick={() => setIsSignup(!isSignup)} className="mt-6 w-full text-center text-sm font-semibold text-slate-500 hover:text-indigo-600">
            {isSignup ? "Already have an account? Sign In" : "New here? Create an account"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b bg-white px-8 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-black tracking-tighter text-indigo-600">DASHBOARD</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 uppercase tracking-widest">{user?.name}</span>
            <button onClick={() => setIsLoggedIn(false)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600">Logout</button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-1">
            <div className="sticky top-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="mb-4 text-lg font-bold">{editingId ? "Edit Task" : "New Task"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <textarea
                  className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Details"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
                <select 
                  className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <button className="w-full rounded-lg bg-indigo-600 p-3 font-bold text-white hover:bg-indigo-700">
                  {editingId ? "Update" : "Create"}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-2 space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="group relative flex items-center justify-between rounded-2xl bg-white p-6 border border-slate-100 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-1 rounded-full ${item.priority === 'High' ? 'bg-red-500' : item.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => { setEditingId(item.id); setForm(item); }} className="text-sm font-bold text-indigo-600">Edit</button>
                  <button onClick={() => deleteItem(item.id)} className="text-sm font-bold text-red-500">Delete</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}