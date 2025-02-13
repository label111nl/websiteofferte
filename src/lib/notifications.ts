import toast from 'react-hot-toast'

export const notifications = {
  success: {
    loggedIn: () => toast.success('Successfully logged in'),
    registered: () => toast.success('Successfully registered'),
    accountCreated: () => toast.success('Account successfully created'),
  },
  error: {
    loginFailed: () => toast.error('Login failed'),
    registrationFailed: () => toast.error('Registration failed'),
    generic: (message: string) => toast.error(message),
  },
  warning: {
    lowCredits: () => toast('Your credits are running low', {
      icon: '⚠️',
    }),
  }
} 