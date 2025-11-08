import { z } from 'zod'

export const schemas = {
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),
  createPost: z.object({
    title: z.string().min(1).max(120),
    body: z.string().min(1).max(1000)
  }),
  updateUserRole: z.object({
    role: z.enum(['Admin','Editor','Viewer'])
  })
}

export const validate =
  (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.issues })
    }
    next()
  }
