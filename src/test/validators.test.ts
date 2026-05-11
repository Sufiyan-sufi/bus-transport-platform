import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema } from '@/validators'

describe('Validators Sanity Check', () => {
  it('should validate correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should fail on invalid login data', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: '123',
    })
    expect(result.success).toBe(false)
  })

  it('should validate correct signup data', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      role: 'EMPLOYEE',
    })
    expect(result.success).toBe(true)
  })
})
