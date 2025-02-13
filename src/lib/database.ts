import { supabase } from './supabase';
import { Lead } from '../types';
import toast from 'react-hot-toast';

/**
 * Lead Database Service
 * Handles all database operations related to leads
 */
export const LeadService = {
  /**
   * Fetch all leads based on role and filters
   */
  async fetchLeads(isAdmin: boolean = false) {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, only show approved and published leads
      if (!isAdmin) {
        query = query
          .eq('status', 'approved')
          .eq('published', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchLeads:', error);
      toast.error('Error loading leads');
      return [];
    }
  },

  /**
   * Fetch a single lead by ID
   */
  async fetchLeadById(id: string) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Error loading lead details');
      return null;
    }
  },

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string, status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status,
          published: status === 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Lead ${status === 'approved' ? 'approved' : 'rejected'}`);
      return true;
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Error updating lead status');
      return false;
    }
  },

  /**
   * Update lead call status
   */
  async updateCallStatus(id: string, callStatus: 'not_called' | 'called' | 'unreachable') {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          call_status: callStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Call status updated');
      return true;
    } catch (error) {
      console.error('Error updating call status:', error);
      toast.error('Error updating call status');
      return false;
    }
  },

  /**
   * Create a new lead
   */
  async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'status' | 'published'>) {
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          ...leadData,
          status: 'pending',
          published: false,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      toast.success('Lead created successfully');
      return true;
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Error creating lead');
      return false;
    }
  }
};