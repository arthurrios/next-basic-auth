import { env } from '@/config/env'
import { JwtPayload, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prismaClient } from './prismaClient'
import { User } from '@/entities/user'

export async function getAccessToken() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')

  return accessToken?.value
}

export async function verifyJwt(): Promise<null | string> {
  const cookieStore = await cookies()
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  try {
    const { sub: userId } = verify(accessToken, env.JWT_SECRET) as JwtPayload

    if (!userId) {
      return null
    }

    return userId
  } catch {
    return null
  }
}

export async function auth(): Promise<null | User> {
  const userId = await verifyJwt()

  if (!userId) {
    return null
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  })

  return user
}
