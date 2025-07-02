'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'' });
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!json.ok) return setError(json.errors?.[0]?.message || 'Registration failed');

    // 自動使用 credentials provider 登入
    await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    router.push('/profile');
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>

        <input className="w-full border p-2 rounded"
               placeholder="First name"
               value={form.firstName}
               onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input className="w-full border p-2 rounded"
               placeholder="Last name"
               value={form.lastName}
               onChange={e => setForm({ ...form, lastName: e.target.value })} />

        <input required type="email"
               className="w-full border p-2 rounded"
               placeholder="Email"
               value={form.email}
               onChange={e => setForm({ ...form, email: e.target.value })} />

        <input required type="password"
               className="w-full border p-2 rounded"
               placeholder="Password"
               value={form.password}
               onChange={e => setForm({ ...form, password: e.target.value })} />

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Sign up
        </button>
      </form>
    </main>
  );
}
