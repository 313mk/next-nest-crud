"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const toggleComplete = async (item: any) => {
    await fetch(`${API}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !item.completed }),
    });
    fetchItems();
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const filteredItems = items.filter((i: any) => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = items.filter((i: any) => i.completed).length;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-indigo-600 tracking-tight">FocusFlow</h2>
            <p className="text-slate-500 font-medium">Manage tasks with precision</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignup && (
              <input
                className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-black transition-all"
                placeholder="Name"
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              />
            )}
            <input
              className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-black transition-all"
              placeholder="Email"
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            />
            <input
              type="password"
              className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500 text-black transition-all"
              placeholder="Password"
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />
            <button className="w-full rounded-2xl bg-indigo-600 p-4 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-95">
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>
          <button onClick={() => setIsSignup(!isSignup)} className="mt-8 w-full text-center text-sm font-bold text-slate-400 hover:text-indigo-600">
            {isSignup ? "BACK TO LOGIN" : "REQUEST ACCESS"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black text-indigo-600">FF.</h1>
            <input 
              className="hidden md:block w-64 rounded-xl bg-slate-100 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Search your tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Authorized User</p>
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="rounded-full bg-slate-900 p-2 text-white hover:bg-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl p-8">
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-400">TOTAL TASKS</p>
            <p className="text-4xl font-black text-slate-900">{items.length}</p>
          </div>
          <div className="rounded-3xl bg-indigo-600 p-8 shadow-lg shadow-indigo-100">
            <p className="text-sm font-bold text-indigo-100">COMPLETED</p>
            <p className="text-4xl font-black text-white">{completedCount}</p>
          </div>
          <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-400">PENDING</p>
            <p className="text-4xl font-black text-slate-900">{items.length - completedCount}</p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
              <h2 className="mb-6 text-xl font-black">{editingId ? "Edit Item" : "Create New"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task Title"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <textarea
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({...form, priority: p})}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${form.priority === p ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button className="w-full rounded-2xl bg-indigo-600 p-4 font-bold text-white transition-all hover:bg-indigo-700">
                  {editingId ? "SAVE CHANGES" : "ADD TO LIST"}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-8 space-y-4">
            {filteredItems.map((item: any) => (
              <div key={item.id} className={`group flex items-center justify-between rounded-3xl bg-white p-6 border border-slate-200 transition-all hover:border-indigo-200 ${item.completed ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleComplete(item)}
                    className={`h-6 w-6 rounded-full border-2 transition-all flex items-center justify-center ${item.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}
                  >
                    {item.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  <div>
                    <h3 className={`font-black text-slate-800 transition-all ${item.completed ? 'line-through text-slate-400' : ''}`}>{item.name}</h3>
                    <div className="flex gap-3 items-center mt-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${item.priority === 'High' ? 'bg-red-100 text-red-600' : item.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{item.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setEditingId(item.id); setForm(item); }} className="text-xs font-black text-indigo-600 hover:tracking-widest transition-all">EDIT</button>
                  <button onClick={() => deleteItem(item.id)} className="text-xs font-black text-red-500 hover:tracking-widest transition-all">DELETE</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}