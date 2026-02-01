import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import router from './router.js'

const app = new Koa()
const PORT = Number(process.env.PORT) || 3001

app.use(cors())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
