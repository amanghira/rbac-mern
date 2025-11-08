import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import cuLogo from './assets/cu-logo.png'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function Protected({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function Header() {
  const role = localStorage.getItem('role')
  const nav = useNavigate()
  const logout = () => { localStorage.clear(); nav('/login') }
  return (
    <div className="sticky top-0 z-20 cu-dark-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={cuLogo} alt="Chandigarh University" className="h-10 w-auto rounded-md bg-white p-1"/>
          <div>
            <div className="text-lg font-bold leading-tight">Chandigarh University</div>
            <div className="text-xs text-dim">RBAC Dashboard • MERN + Docker</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="badge">Dept: CSE (AIML)</span>
          <span className="badge">Students: Aman (UID 23BAI70155)</span>
          <span className="badge">Om Prakash Yadav (UID 23BAI70669)</span>
          <span className="badge">Supervisor: Mr. Jagjit Singh</span>
          <button className="btn btn-soft ml-2" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  )
}

function Login() {
  const nav = useNavigate()
  const [email, setEmail] = React.useState('admin@demo.io')
  const [password, setPassword] = React.useState('Passw0rd!')
  const [err, setErr] = React.useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      nav('/')
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed')
    }
  }
  return (
    <div className="min-h-screen">
      <div className="cu-dark-gradient py-10 text-white">
        <div className="mx-auto max-w-6xl px-4 flex items-center gap-3">
          <img src={cuLogo} alt="CU" className="h-12 w-auto rounded bg-white p-1"/>
          <div>
            <div className="text-2xl font-bold leading-tight">Chandigarh University</div>
            <div className="text-sm text-dim">Discover. Learn. Empower.</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 -mt-8">
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Sign in</h2>
            <p className="text-dim text-sm">Use the seeded demo users to explore role-based features.</p>
          </div>
          {err && <div className="mb-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-100 px-3 py-2 text-sm">{err}</div>}
          <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-dim mb-1">Email</label>
              <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-dim mb-1">Password</label>
              <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="md:col-span-2">
              <button className="btn btn-primary">Sign in</button>
            </div>
          </form>
          <p className="mt-4 text-xs text-dim">Demo: admin@demo.io, editor@demo.io, viewer@demo.io — passwords: <b>Passw0rd!</b></p>
        </div>
      </div>
    </div>
  )
}

function Posts() {
  const [posts, setPosts] = React.useState([])
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')

  const load = async () => {
    const res = await axios.get(`${API}/posts`)
    setPosts(res.data)
  }
  React.useEffect(()=>{ load() }, [])

  const create = async () => {
    try {
      await axios.post(`${API}/posts`, { title, body }, { headers: { Authorization: token }})
      setTitle(''); setBody(''); load()
    } catch (e) {
      alert(e.response?.data?.error || 'Create failed')
    }
  }
  const canCreate = role === 'Admin' || role === 'Editor'

  const del = async (id) => {
    try {
      await axios.delete(`${API}/posts/${id}`, { headers: { Authorization: token } })
      load()
    } catch (e) {
      alert(e.response?.data?.error || 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Posts</h2>
              <p className="text-dim text-sm">Role-based permissions are active for your login.</p>
            </div>
            {canCreate && (
              <button onClick={create} className="btn btn-primary">Create Post</button>
            )}
          </div>
          {canCreate && (
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <input className="input" placeholder="Post title" value={title} onChange={e=>setTitle(e.target.value)} />
              <input className="input" placeholder="Post body" value={body} onChange={e=>setBody(e.target.value)} />
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {posts.map(p => (
            <div key={p.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-dim mt-1">{p.body}</p>
                </div>
                <button onClick={()=>del(p.id)} className="btn btn-soft">Delete</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-dim">No posts yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/*" element={<Protected><Posts/></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
