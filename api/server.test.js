const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('sanity', () => {
  expect(true).toBeTruthy()
})

describe('[POST] /api/auth/register', () => {
  it('responds with proper status on success', async () => {
  const res = await request(server).post('/api/auth/register').send({ username: 'batman', password: 'pass' })
  expect(res.status).toBe(201)
  })
  it('returns proper response body', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: 'batman', password: 'pass' })
    expect(res.body).toMatchObject({ id: 1, username: 'batman'})
})
})

describe('[POST] /api/auth/login', () => {
  it('responds with proper message on login failure', async () => {
  const res = await request(server).post('/api/auth/login').send({ username: 'superman', password: 'pass' })
  expect(res.body.message).toMatch(/invalid credentials/i)
  })
  it('responds with proper status on login failure', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'superman', password: 'pass' })
    expect(res.status).toBe(401)
    })
})