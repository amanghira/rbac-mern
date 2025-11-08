import { randomUUID } from 'node:crypto'

export function correlationId(req, res, next) {
  const incoming = req.header('x-correlation-id')
  const id = incoming || randomUUID()
  req.correlationId = id
  res.setHeader('x-correlation-id', id)
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(JSON.stringify({
      type: 'request_log',
      id,
      ts: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms,
      userId: req.user?.id || null,
      role: req.user?.role || null
    }))
  })
  next()
}
