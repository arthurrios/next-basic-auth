import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'
import { User } from '@/entities/user'

interface NextRequestWithUser extends NextRequest {
  user: User
}

export function withAuth(
  handler: (request: NextRequestWithUser) => Promise<unknown>,
) {
  return async (request: NextRequest) => {
    const user = await auth()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const requestWithUser = request as NextRequestWithUser
    requestWithUser.user = user

    return handler(requestWithUser)
  }
}

export function withAuthorization(
  handler: (request: NextRequestWithUser) => Promise<unknown>,
) {
  return async (request: NextRequestWithUser) => {
    console.log('withAuthorization', request.user.email)

    return handler(request)
  }
}
