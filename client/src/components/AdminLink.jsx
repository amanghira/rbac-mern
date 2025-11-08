import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminLink() {
  const role = localStorage.getItem('role')
  if (role !== 'Admin') return null
  return (
    <Link to="/admin/users" className="btn btn-ghost">Admin Users</Link>
  )
}
