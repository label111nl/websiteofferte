import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/types'

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leads').select('*')
      if (error) throw error
      return data as Lead[]
    }
  })
}

export function useUpdateLead() {
  return useMutation({
    mutationFn: async (lead: Partial<Lead>) => {
      const { data, error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', lead.id)
        .single()
      if (error) throw error
      return data
    }
  })
} 