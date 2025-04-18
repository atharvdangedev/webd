
import { Hono } from 'hono'
import { CookieStore, sessionMiddleware } from "hono-sessions";

const sessionStore = new CookieStore()

const app = new Hono()

app.use('*', sessionMiddleware({
  store: sessionStore,
  encryptionKey: Bun.env.SESSION_ENCRYPTION_KEY,
  expireAfterSeconds: 900,
  sessionCookieName: 'session',
  cookieOptions: {
    path: '/',
    httpOnly: true
  },
}))

app
  .get('/', (c) => {
    const session = c.get('session')
    const userId = session.get('userId')

    console.log('secret: ' + Bun.env.SESSION_ENCRYPTION_KEY)

    console.log("cookie" + JSON.stringify(c.get('session')))

    return c.html(
      <html>
        <body>
          {
            userId ?
              <>
                < div > User: {userId} </div>
                < a href={'/logout'} > Logout </a>
              </>
              : <div>
                <a href={'/login'} > Login </a>
              </div>
          }

        </body>
      </html>
    )

  })
  .get('/login', (c) => {
    let session = c.get('session')
    console.log("cookie" + JSON.stringify(c.get('session')))

    session.set('userId', 123)

    return c.redirect('/')
  })
  .get('/logout', (c) => {
    c.get('session').deleteSession()
    return c.redirect('/')
  })

export default app
