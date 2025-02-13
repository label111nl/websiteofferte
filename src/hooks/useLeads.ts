import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/types'

interface UseLeadsFilters {
  search?: string
  budget_min?: string | number
  budget_max?: string | number
  timeline?: string
  location?: string
  technologies?: string[]
  industry?: string
  project_size?: [number, number]
  has_requirements?: boolean
  has_design?: boolean
}

interface UseLeadsSort {
  field: string
  direction: 'asc' | 'desc'
}

interface UseLeadsOptions {
  filters?: UseLeadsFilters
  sort?: UseLeadsSort
}

export function useLeads(options: UseLeadsOptions = {}) {
  const { filters, sort } = options

  return useQuery({
    queryKey: ['leads', filters, sort],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select(`
          *,
          lead_purchases (
            id,
            marketer_id
          )
        `)

      // Apply text search
      if (filters?.search) {
        query = query.or(
          `company_name.ilike.%${filters.search}%,` +
          `project_description.ilike.%${filters.search}%,` +
          `technical_requirements.ilike.%${filters.search}%`
        )
      }

      // Apply budget range filter
      if (filters?.budget_min) {
        // Extract numeric value from budget_range string (e.g., "€5000 - €10000")
        query = query.gte('budget_range', filters.budget_min)
      }

      if (filters?.budget_max) {
        query = query.lte('budget_range', filters.budget_max)
      }

      // Apply timeline filter
      if (filters?.timeline) {
        query = query.eq('timeline', filters.timeline)
      }

      // Apply location filter
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      // Apply technology filters
      if (filters?.technologies && filters.technologies.length > 0) {
        query = query.contains('technologies', filters.technologies)
      }

      // Apply industry filter
      if (filters?.industry) {
        query = query.eq('industry', filters.industry)
      }

      // Apply project size filter
      if (filters?.project_size) {
        const [min, max] = filters.project_size
        query = query
          .gte('project_size', min)
          .lte('project_size', max)
      }

      // Apply requirement and design filters
      if (filters?.has_requirements) {
        query = query.not('technical_requirements', 'is', null)
      }

      if (filters?.has_design) {
        query = query.not('design_files', 'is', null)
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { 
          ascending: sort.direction === 'asc',
          nullsFirst: false
        })
      } else {
        // Default sort
        query = query.order('created_at', { 
          ascending: false 
        })
      }

      // Execute query
      const { data, error } = await query

      if (error) throw error

      // Post-process the results
      const leads = data.map(lead => ({
        ...lead,
        // Add computed fields
        available_spots: 5 - (lead.lead_purchases?.length || 0),
        is_available: (lead.lead_purchases?.length || 0) < 5
      }))

      return leads as Lead[]
    },
    // Refresh data every minute
    refetchInterval: 60000,
    // Show stale data while revalidating
    staleTime: 30000,
  })
}

// Helper hook for lead details
export function useLeadDetails(leadId: string | undefined) {
  return useQuery({
    queryKey: ['lead', leadId],
    queryFn: async () => {
      if (!leadId) return null

      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          lead_purchases (
            id,
            marketer_id,
            created_at,
            status
          ),
          quotes (
            id,
            status,
            created_at
          )
        `)
        .eq('id', leadId)
        .single()

      if (error) throw error
      return data as Lead
    },
    enabled: Boolean(leadId)
  })
} 