import express from 'express'
import cors from 'cors'

export const loggerMiddleware = (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  console.log('________________________________________________\n')
  console.log(
    `${req.method.padEnd(8, ' ')}${req.path.padEnd(24, ' ')}${JSON.stringify(
      req.query
    )}`
  )
  console.log('Origin: ', req.headers.origin)
  if (req.headers.origin !== 'SSR') {
    console.log('Cookie: ', req.headers.cookie)
    console.log('Session: ', req.session?.passport?.user || null)
  }
  next()
}

export const corsMiddleware = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || process.env.ALLOWED_ORIGINS === '*') {
      return callback(null, true)
    }
    if (process.env.ALLOWED_ORIGINS!.indexOf(origin) === -1) {
      return callback(
        new Error(
          "This server's CORS policy does not allow access from the specified origin."
        ),
        false
      )
    }
    return callback(null, true)
  },
})

// short-circuits the request and sends 401 if not authenticated
export const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  if (req.isAuthenticated()) {
    console.log('Authenticated request')
    next()
  } else {
    console.log('Unauthenticated request')
    res.status(401).end(`Unable to authenticate request`)
  }
}
