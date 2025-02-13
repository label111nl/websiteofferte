import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn } from '@/lib/auth'
import { notifications } from '@/lib/notifications'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type FormValues = z.infer<typeof schema>

const validateEmail = ({ value }: { value: string }) => {
  const result = schema.shape.email.safeParse(value);
  return result.success ? undefined : result.error.message;
};

const validatePassword = ({ value }: { value: string }) => {
  const result = schema.shape.password.safeParse(value);
  return result.success ? undefined : result.error.message;
};

export function LoginForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn(value.email, value.password)
        notifications.success.loggedIn()
      } catch (error) {
        notifications.error.loginFailed()
      }
    }
  })

  return (
    <form.Provider>
      <form onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <form.Field
              name="email"
              validators={{
                onChange: validateEmail
              }}
            >
              {(field) => (
                <>
                  <Input
                    id="email"
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <span className="text-red-500 text-sm">
                      {field.state.meta.errors.join(', ')}
                    </span>
                  )}
                </>
              )}
            </form.Field>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <form.Field
              name="password"
              validators={{
                onChange: validatePassword
              }}
            >
              {(field) => (
                <>
                  <Input
                    id="password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <span className="text-red-500 text-sm">
                      {field.state.meta.errors.join(', ')}
                    </span>
                  )}
                </>
              )}
            </form.Field>
          </div>

          <Button 
            type="submit"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </form.Provider>
  )
}
