import React from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function AdminUsers() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const [rows, setRows] = React.useState([])
  const [err, setErr] = React.useState('')

  const load = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, { headers: { Authorization: token }})
      setRows(res.data)
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load users')
    }
  }
  React.useEffect(()=>{ load() }, [])

  const updateRole = async (id, newRole) => {
    try {
      await axios.patch(`${API}/admin/users/${id}`, { role: newRole }, { headers: { Authorization: token }})
      load()
    } catch (e) {
      alert(e.response?.data?.error || 'Update failed')
    }
  }

  if (role !== 'Admin') return <div className="p-6">You must be Admin.</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Admin • Users</h2>
            <p className="text-sm opacity-70">Change roles and review accounts.</p>
          </div>
        </div>
        {err && <div className="mt-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">{err}</div>}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(u => (
                <tr key={u._id || u.id} className="border-t border-white/10">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.role}</td>
                  <td className="py-2 pr-4">
                    <select
                      className="input w-40"
                      defaultValue={u.role}
                      onChange={(e)=>updateRole(u._id || u.id, e.target.value)}
                    >
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td className="py-2">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
