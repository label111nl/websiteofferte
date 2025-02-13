import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update transaction status
        const { error: transactionError } = await supabase
          .from('credit_transactions')
          .update({ status: 'completed' })
          .eq('stripe_session_id', session.id)

        if (transactionError) throw transactionError

        // Add credits to user
        const { data: transaction } = await supabase
          .from('credit_transactions')
          .select('user_id, amount')
          .eq('stripe_session_id', session.id)
          .single()

        if (transaction) {
          const { error: creditError } = await supabase.rpc(
            'add_credits',
            { 
              user_id: transaction.user_id,
              amount: transaction.amount
            }
          )

          if (creditError) throw creditError
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update transaction status
        await supabase
          .from('credit_transactions')
          .update({ status: 'expired' })
          .eq('stripe_session_id', session.id)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    )
  }
}) 