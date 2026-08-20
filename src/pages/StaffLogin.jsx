import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'stock' ? '/staff/stock' : '/staff/sales-chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="mb-1 text-2xl font-bold text-white">Staff Login</h1>
      <p className="mb-6 text-sm text-slate-400">Access the inner sales assistant and stock management tools.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-pp-navy-3 bg-pp-navy-2 p-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-pp-gold px-4 py-2 text-sm font-semibold text-pp-navy hover:bg-pp-gold-2 disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Log In'}
        </button>

        <p className="text-center text-xs text-slate-500">
          Default seeded admin: admin@powerpalazzo.com / admin123
        </p>
      </form>
    </div>
  );
}
