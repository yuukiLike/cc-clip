import Router from '@koa/router'
import redis from './redis.js'
import { generateCode, hashPassword, verifyPassword } from './utils.js'

const router = new Router({ prefix: '/api' })

// 创建剪贴
router.post('/clip', async (ctx) => {
  const { content, password } = ctx.request.body as {
    content?: string
    password?: string
  }

  if (!content) {
    ctx.status = 400
    ctx.body = { error: '内容不能为空' }
    return
  }

  const code = generateCode()
  const key = `clip:${code}`

  const data: Record<string, string> = {
    content,
    password: password ? await hashPassword(password) : '',
    createdAt: String(Date.now()),
  }

  await redis.hset(key, data)

  ctx.body = { code }
})

// 获取剪贴（GET 用于无密码，POST 用于有密码）
router.get('/clip/:code', async (ctx) => {
  const key = `clip:${ctx.params.code}`
  const data = await redis.hgetall(key)

  if (!data.content) {
    ctx.status = 404
    ctx.body = { error: '内容不存在或已删除' }
    return
  }

  if (data.password) {
    ctx.status = 403
    ctx.body = { error: '此内容需要密码', hasPassword: true }
    return
  }

  ctx.body = {
    content: data.content,
    hasPassword: false,
    createdAt: Number(data.createdAt),
  }
})

router.post('/clip/:code', async (ctx) => {
  const key = `clip:${ctx.params.code}`
  const data = await redis.hgetall(key)

  if (!data.content) {
    ctx.status = 404
    ctx.body = { error: '内容不存在或已删除' }
    return
  }

  const { password } = ctx.request.body as { password?: string }

  if (data.password) {
    if (!password || !(await verifyPassword(password, data.password))) {
      ctx.status = 403
      ctx.body = { error: '密码错误', hasPassword: true }
      return
    }
  }

  ctx.body = {
    content: data.content,
    hasPassword: !!data.password,
    createdAt: Number(data.createdAt),
  }
})

// 删除剪贴
router.delete('/clip/:code', async (ctx) => {
  const key = `clip:${ctx.params.code}`
  const data = await redis.hgetall(key)

  if (!data.content) {
    ctx.status = 404
    ctx.body = { error: '内容不存在' }
    return
  }

  const { password } = ctx.request.body as { password?: string }

  if (data.password) {
    if (!password || !(await verifyPassword(password, data.password))) {
      ctx.status = 403
      ctx.body = { error: '密码错误' }
      return
    }
  }

  await redis.del(key)
  ctx.body = { ok: true }
})

export default router
