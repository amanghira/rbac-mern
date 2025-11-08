import express from 'express'
import { validate, schemas } from './middleware.validate.js'


// Expect an existing User mongoose model and an auth middleware that attaches req.user
export default function adminRouter({ User, requireRole }) {
  const r = express.Router()

  // Admin-only guard
  r.use(requireRole('Admin'))

  // List all users (email, role, createdAt)
  r.get('/users', async (req, res) => {
    const users = await User.find({}, { email:1, role:1, createdAt:1 }).sort({ createdAt: -1 })
    res.json(users)
  })

  // Update a user's role
  r.patch('/users/:id', validate(schemas.updateUserRole), async (req, res) => {
    const { id } = req.params
    const { role } = req.body
    const user = await User.findByIdAndUpdate(id, { role }, { new:true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ message: 'Role updated', user: { id: user._id, email: user.email, role: user.role } })
  })

  return r
}
