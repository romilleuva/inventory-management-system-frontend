import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Indoor Driver', 'Outdoor Driver', 'Smart Driver', 'COB LED', 'Raw Material', 'Other'];

const emptyForm = {
  name: '',
  sku: '',
  category: 'Other',
  unit: 'pcs',
  quantityInStock: 0,
  reorderLevel: 10,
  unitPrice: 0,
  supplier: '',
  location: 'Main Warehouse',
};

function Field({ label, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export default function StockManagement() {
  const { user } = useAuth();
  const canEdit = user.role === 'admin' || user.role === 'stock';
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await client.get('/materials', {
        params: { search: search || undefined, lowStock: lowStockOnly || undefined },
      });
      setMaterials(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, lowStockOnly]);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(material) {
    setForm({
      name: material.name,
      sku: material.sku,
      category: material.category,
      unit: material.unit,
      quantityInStock: material.quantityInStock,
      reorderLevel: material.reorderLevel,
      unitPrice: material.unitPrice,
      supplier: material.supplier || '',
      location: material.location || '',
    });
    setEditingId(material._id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await client.put(`/materials/${editingId}`, form);
      } else {
        await client.post('/materials', form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save material');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this material?')) return;
    await client.delete(`/materials/${id}`);
    load();
  }

  async function handleAdjust(id, type) {
    const quantity = Number(prompt(`Quantity to move ${type === 'in' ? 'IN' : 'OUT'}:`, '1'));
    if (!quantity || quantity <= 0) return;
    try {
      await client.post(`/materials/${id}/adjust`, { type, quantity, reason: 'Manual adjustment' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to adjust stock');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Material Stock Management</h1>
          <p className="text-sm text-slate-400">
            Track materials, quantities and reorder levels.
            {!canEdit && ' You have view-only access for your role.'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={startCreate}
            className="rounded-md bg-pp-gold px-4 py-2 text-sm font-semibold text-pp-navy hover:bg-pp-gold-2"
          >
            + Add Material
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search materials…"
          className="rounded-md border border-pp-navy-4 bg-pp-navy-2 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-pp-gold"
        />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
          Low stock only
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-pp-navy-3">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-pp-navy-2 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Reorder Lvl</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3">Supplier</th>
              {canEdit && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={canEdit ? 8 : 7} className="px-4 py-6 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : materials.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 8 : 7} className="px-4 py-6 text-center text-slate-500">
                  No materials found.
                </td>
              </tr>
            ) : (
              materials.map((m) => (
                <tr key={m._id} className="border-t border-pp-navy-3 hover:bg-pp-navy-2/60">
                  <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                  <td className="px-4 py-3 text-slate-400">{m.sku}</td>
                  <td className="px-4 py-3 text-slate-300">{m.category}</td>
                  <td className={`px-4 py-3 font-semibold ${m.quantityInStock <= m.reorderLevel ? 'text-red-400' : 'text-slate-100'}`}>
                    {m.quantityInStock} {m.unit}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{m.reorderLevel}</td>
                  <td className="px-4 py-3 text-slate-400">₹{m.unitPrice?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-400">{m.supplier || '—'}</td>
                  {canEdit && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2 text-xs">
                        <button onClick={() => handleAdjust(m._id, 'in')} className="rounded border border-pp-navy-4 px-2 py-1 hover:border-pp-gold hover:text-pp-gold">
                          Stock In
                        </button>
                        <button onClick={() => handleAdjust(m._id, 'out')} className="rounded border border-pp-navy-4 px-2 py-1 hover:border-pp-gold hover:text-pp-gold">
                          Stock Out
                        </button>
                        <button onClick={() => startEdit(m)} className="rounded border border-pp-navy-4 px-2 py-1 hover:border-pp-gold hover:text-pp-gold">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(m._id)} className="rounded border border-pp-navy-4 px-2 py-1 text-red-400 hover:border-red-400">
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-xl border border-pp-navy-3 bg-pp-navy-2 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">{editingId ? 'Edit Material' : 'Add Material'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Material Name" className="col-span-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
                />
              </Field>
              <Field label={editingId ? 'SKU (code)' : 'SKU (code) — optional, auto-generated if left blank'}>
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  disabled={!!editingId}
                  placeholder={editingId ? '' : 'Leave blank to auto-generate'}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-pp-gold disabled:opacity-50"
                />
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Unit of Measure">
                <input
                  placeholder="pcs, kg…"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
                />
              </Field>
              <Field label="Unit Price (₹)">
                <input
                  type="number"
                  value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
                />
              </Field>
              <Field label="Quantity In Stock">
                <input
                  type="number"
                  value={form.quantityInStock}
                  onChange={(e) => setForm({ ...form, quantityInStock: Number(e.target.value) })}
                  disabled={!!editingId}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold disabled:opacity-50"
                />
              </Field>
              <Field label="Reorder Level (low-stock alert below this)">
                <input
                  type="number"
                  value={form.reorderLevel}
                  onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
                />
              </Field>
              <Field label="Supplier">
                <input
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
                />
              </Field>
              <Field label="Warehouse Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white outline-none focus:border-pp-gold"
                />
              </Field>
            </div>
            {editingId && (
              <p className="mt-2 text-xs text-slate-500">
                SKU and Quantity In Stock can't be edited here — use Stock In / Stock Out to change quantity.
              </p>
            )}

            {error && (
              <p className="mt-3 rounded-md border border-red-500 bg-red-950/50 px-3 py-2 text-sm font-medium text-red-300">
                ⚠ Not saved: {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-pp-navy-4 px-4 py-2 text-sm text-slate-200 hover:border-pp-gold hover:text-pp-gold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-pp-gold px-4 py-2 text-sm font-semibold text-pp-navy hover:bg-pp-gold-2"
              >
                {editingId ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
