import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { signUp } from '@/lib/auth'
import { notifications } from '@/lib/notifications'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  company_name: z.string().min(2),
  company_kvk: z.string().min(8),
  phone: z.string().min(10)
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

const validateCompanyName = ({ value }: { value: string }) => {
  const result = schema.shape.company_name.safeParse(value);
  return result.success ? undefined : result.error.message;
};

const validateCompanyKvk = ({ value }: { value: string }) => {
  const result = schema.shape.company_kvk.safeParse(value);
  return result.success ? undefined : result.error.message;
};

const validatePhone = ({ value }: { value: string }) => {
  const result = schema.shape.phone.safeParse(value);
  return result.success ? undefined : result.error.message;
};

export function RegisterForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      company_name: '',
      company_kvk: '',
      phone: ''
    },
    onSubmit: async ({ value }) => {
      try {
        await signUp(value)
        notifications.success.registered()
      } catch (error) {
        notifications.error.registrationFailed()
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
          <FormField label="Email">
            <form.Field
              name="email"
              validators={{
                onChange: validateEmail
              }}
            >
              {(field) => (
                <>
                  <Input
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
          </FormField>

          <FormField label="Password">
            <form.Field
              name="password"
              validators={{
                onChange: validatePassword
              }}
            >
              {(field) => (
                <>
                  <Input
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
          </FormField>

          <FormField label="Company Name">
            <form.Field
              name="company_name"
              validators={{
                onChange: validateCompanyName
              }}
            >
              {(field) => (
                <>
                  <Input
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
          </FormField>

          <FormField label="KVK Number">
            <form.Field
              name="company_kvk"
              validators={{
                onChange: validateCompanyKvk
              }}
            >
              {(field) => (
                <>
                  <Input
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
          </FormField>

          <FormField label="Phone">
            <form.Field
              name="phone"
              validators={{
                onChange: validatePhone
              }}
            >
              {(field) => (
                <>
                  <Input
                    type="tel"
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
          </FormField>

          <Button 
            type="submit"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </div>
      </form>
    </form.Provider>
  )
} 