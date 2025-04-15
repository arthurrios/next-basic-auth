import { prismaClient } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hash } from 'bcryptjs'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
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

  const { firstName, lastName, email, password } = data

  const emailAlreadyInUse = await prismaClient.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (emailAlreadyInUse) {
    return NextResponse.json(
      { error: 'Email already in use' },
      {
        status: 409,
      },
    )
  }

  const hashedPassword = await hash(password, 12)

  await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  })

  return new NextResponse(null, { status: 204 })
}
