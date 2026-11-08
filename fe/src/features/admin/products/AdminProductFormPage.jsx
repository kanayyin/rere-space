import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../lib/api.js';
import { useToast } from '../../../components/ui/Toast.jsx';
import { TextField, TextArea } from '../../../components/ui/Fields.jsx';
import { Button, buttonClasses } from '../../../components/ui/Button.jsx';

function toRow(option, uid) {
  return { uid, id: option?.id, name: option?.name || '', price: option?.price === undefined ? '' : String(option.price), isActive: option?.isActive ?? true, sortOrder: option?.sortOrder === undefined ? '' : String(option.sortOrder) };
}

function validate(values, rows) {
  const errors = { rows: {} };
  if (values.name.trim().length < 2) errors.name = 'Nama minimal 2 karakter.';
  if (!values.category.trim()) errors.category = 'Kategori wajib diisi.';
  if (rows.length === 0) errors.options = 'Minimal 1 varian.';
  rows.forEach((row) => {
    const e = {};
    if (!row.name.trim()) e.name = 'Nama varian wajib.';
    if (row.price === '' || !/^\d+$/.test(row.price)) e.price = 'Harga berupa angka.';
    if (Object.keys(e).length) errors.rows[row.uid] = e;
  });
  return Object.keys(errors).filter((k) => k !== 'rows').length || Object.keys(errors.rows).length ? errors : null;
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);
  const uid = useRef(0);
  const nextUid = () => `r${++uid.current}`;

  const [values, setValues] = useState({ name: '', category: '', description: '', imageUrl: '', isActive: true, sortOrder: '' });
  const [rows, setRows] = useState([toRow(null, nextUid())]);
  const [errors, setErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/admin/products/${id}`).then((p) => {
      setValues({ name: p.name, category: p.category, description: p.description || '', imageUrl: p.imageUrl || '', isActive: p.isActive, sortOrder: String(p.sortOrder || '') });
      setRows(p.options?.length ? p.options.map((o) => toRow(o, nextUid())) : [toRow(null, nextUid())]);
    }).catch((err) => toast.error(err.message));
  }, [id]);

  function setField(field) { return (e) => setValues((v) => ({ ...v, [field]: e.target.value })); }
  function updateRow(uid, patch) { setRows((r) => r.map((row) => row.uid === uid ? { ...row, ...patch } : row)); }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values, rows);
    setErrors(errs);
    if (errs) return;
    setSubmitting(true);
    setServerError('');
    const payload = {
      name: values.name.trim(), category: values.category.trim(),
      description: values.description.trim() || null, imageUrl: values.imageUrl.trim() || null,
      isActive: values.isActive, sortOrder: Number(values.sortOrder) || 0,
      options: rows.map((row, i) => ({
        ...(row.id ? { id: row.id } : {}),
        name: row.name.trim(), price: Number(row.price),
        isActive: row.isActive, sortOrder: row.sortOrder === '' ? i : Number(row.sortOrder),
      })),
    };
    try {
      if (isEdit) await api.put(`/admin/products/${id}`, payload);
      else await api.post('/admin/products', payload);
      toast.success(isEdit ? 'Produk disimpan ✦' : 'Produk ditambahkan ✦');
      navigate('/admin/produk');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/produk" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-lavender-dark)]">← Produk</Link>
        <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">{isEdit ? 'Edit Produk' : 'Tambah Produk'} ✦</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] space-y-4">
          <h2 className="font-display font-bold text-[var(--color-ink)]">Informasi Produk</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Nama Produk" required value={values.name} onChange={setField('name')} error={errors?.name} placeholder="Mis. Netflix Premium" />
            <TextField label="Kategori" required value={values.category} onChange={setField('category')} error={errors?.category} placeholder="Mis. Streaming" />
          </div>
          <TextArea label="Deskripsi" rows={4} value={values.description} onChange={setField('description')} placeholder="Deskripsi produk..." />
          <TextField label="URL Gambar" value={values.imageUrl} onChange={setField('imageUrl')} placeholder="/products/netflix.jpg" />
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setValues((v) => ({ ...v, isActive: !v.isActive }))}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${values.isActive ? 'bg-[var(--color-lavender-dark)]' : 'bg-[var(--color-border)]'}`}>
              <span className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${values.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm font-semibold text-[var(--color-ink)]">{values.isActive ? 'Bisa dipesan' : 'Tidak bisa dipesan'}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-[var(--color-ink)]">Varian & Harga</h2>
            <Button variant="secondary" size="sm" type="button" onClick={() => setRows((r) => [...r, toRow(null, nextUid())])}>+ Varian</Button>
          </div>
          {errors?.options && <p className="text-sm font-semibold text-red-500">{errors.options}</p>}
          <div className="space-y-3">
            {rows.map((row, i) => {
              const e = errors?.rows?.[row.uid] || {};
              return (
                <div key={row.uid} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label={`Nama varian ${i + 1}`} required value={row.name} onChange={(ev) => updateRow(row.uid, { name: ev.target.value })} error={e.name} placeholder="Mis. 1 Bulan" />
                    <TextField label="Harga (Rp)" required type="number" value={row.price} onChange={(ev) => updateRow(row.uid, { price: ev.target.value })} error={e.price} placeholder="25000" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateRow(row.uid, { isActive: !row.isActive })}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${row.isActive ? 'bg-[var(--color-lavender-dark)]' : 'bg-[var(--color-border)]'}`}>
                        <span className={`inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform ${row.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                      <span className="text-xs font-semibold text-[var(--color-ink-soft)]">{row.isActive ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                    {rows.length > 1 && (
                      <button type="button" onClick={() => setRows((r) => r.filter((x) => x.uid !== row.uid))} className="text-xs text-red-400 hover:text-red-600">Hapus varian</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {serverError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{serverError}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="primary" size="lg" loading={submitting}>Simpan ✦</Button>
          <Link to="/admin/produk" className={buttonClasses({ variant: 'ghost', size: 'lg' })}>Batal</Link>
        </div>
      </form>
    </div>
  );
}
