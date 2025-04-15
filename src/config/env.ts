import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}
export const env = _env.data
