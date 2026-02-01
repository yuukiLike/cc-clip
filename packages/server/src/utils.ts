import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'

export function generateCode(): string {
  return nanoid(6)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
