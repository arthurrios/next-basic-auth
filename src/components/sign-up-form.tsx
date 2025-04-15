'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from './ui/form'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type FormData = z.infer<typeof schema>

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      setIsLoading(true)
      await axios.post('/api/auth/sign-up', formData)

      router.push('/sign-in')
      toast.success('Account created successfully!', {
        description: 'Login to your account',
      })
    } catch {
      toast.error('Error creating account')
      setIsLoading(false)
    }
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sign up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        placeholder="m@jstack.com.br"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {!isLoading && 'Create an account'}
                {isLoading && 'Creating your account...'}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Login with Google
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
