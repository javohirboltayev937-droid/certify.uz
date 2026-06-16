const BACKEND = 'https://certify-uz.onrender.com'

async function handler(req, { params }) {
  const { path } = await params
  const url = `${BACKEND}/api/${path.join('/')}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`

  const headers = {}
  req.headers.forEach((v, k) => {
    if (!['host', 'connection'].includes(k)) headers[k] = v
  })

  const init = { method: req.method, headers }
  if (!['GET', 'HEAD'].includes(req.method)) {
    init.body = await req.text()
  }

  const res = await fetch(url, init)
  const body = await res.text()

  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
