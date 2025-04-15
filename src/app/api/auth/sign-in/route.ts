import { prismaClient } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { env } from '@/config/env'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { success, error, data } = schema.safeParse(body)

  if (!success) {
    return NextResponse.json(
      { errorw: error.issues },
      {
        status: 400,
      },
    )
  }

  const { email, password } = data

  const user = await prismaClient.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  })

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      {
        status: 401,
      },
    )
  }

  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      {
        status: 401,
      },
    )
  }

  const accessToken = sign({ sub: user.id }, env.JWT_SECRET, {
    expiresIn: '7d',
  })

  return NextResponse.json({ accessToken }, { status: 200 })
}
