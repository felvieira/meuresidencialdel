
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kcbvdcacgbwigefwacrk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYnZkY2FjZ2J3aWdlZndhY3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjgzMDQsImV4cCI6MjA1NzgwNDMwNH0.K4xcW6V3X9QROQLekB74NbKg3BaShwgMbanrP3olCYI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Types for announcements and attachments
export interface Announcement {
  id?: string;
  matricula: string;
  data: string;
  finalidade: string;
  descricao: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementAttachment {
  id: string;
  announcement_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

// Function to get condominium data by matricula
export const getCondominiumByMatricula = async (matricula: string) => {
  const { data, error } = await supabase
    .from('condominiums')
    .select('*')
    .eq('matricula', matricula)
    .single();
  
  if (error) {
    console.error('Error fetching condominium data:', error);
    return null;
  }
  
  return data;
};

// Function to save condominium data
export const saveCondominiumData = async (formData: any, userEmail: string | null) => {
  const { matricula } = formData;
  
  // Check if record exists
  const { data: existingRecord } = await supabase
    .from('condominiums')
    .select('*')
    .eq('matricula', matricula)
    .single();
  
  let result;
  
  if (existingRecord) {
    // If record exists, update it and log changes
    const { data, error } = await supabase
      .from('condominiums')
      .update(formData)
      .eq('matricula', matricula)
      .select();
    
    if (error) {
      console.error('Error updating condominium:', error);
      throw error;
    }
    
    // Log changes for each field
    for (const key in formData) {
      if (existingRecord[key] !== formData[key] && key !== 'confirmarSenha') {
        await supabase.from('condominium_change_logs').insert({
          matricula,
          campo: key,
          valor_anterior: existingRecord[key]?.toString() || null,
          valor_novo: formData[key]?.toString() || null,
          usuario: userEmail
        });
      }
    }
    
    result = data;
  } else {
    // If record doesn't exist, insert it
    const { data, error } = await supabase
      .from('condominiums')
      .insert(formData)
      .select();
    
    if (error) {
      console.error('Error creating condominium:', error);
      throw error;
    }
    
    result = data;
  }
  
  return result;
};

// Function to get condominium change logs
export const getCondominiumChangeLogs = async (matricula: string) => {
  const { data, error } = await supabase
    .from('condominium_change_logs')
    .select('*')
    .eq('matricula', matricula)
    .order('data_alteracao', { ascending: false });
  
  if (error) {
    console.error('Error fetching change logs:', error);
    throw error;
  }
  
  return data;
};

// Function to get announcements by matricula
export const getAnnouncementsByMatricula = async (matricula: string) => {
  // Use the RPC function to get announcements
  const { data, error } = await supabase
    .rpc('get_announcements_by_matricula', { p_matricula: matricula });
  
  if (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
  
  return data as Announcement[] || [];
};

// Function to get announcement attachments
export const getAnnouncementAttachments = async (announcementId: string) => {
  // Use the RPC function to get attachments
  const { data, error } = await supabase
    .rpc('get_announcement_attachments', { p_announcement_id: announcementId });
  
  if (error) {
    console.error('Error fetching announcement attachments:', error);
    throw error;
  }
  
  return data as AnnouncementAttachment[] || [];
};

// Function to create a new announcement
export const createAnnouncement = async (announcementData: any) => {
  // Use the RPC function to create announcement
  const { data, error } = await supabase
    .rpc('create_announcement', { announcement_data: announcementData });
  
  if (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
  
  return data as Announcement[] || null;
};

// Function to update an announcement
export const updateAnnouncement = async (id: string, announcementData: any) => {
  // Use the RPC function to update announcement
  const { data, error } = await supabase
    .rpc('update_announcement', { 
      p_id: id,
      p_data: announcementData.data,
      p_finalidade: announcementData.finalidade,
      p_descricao: announcementData.descricao
    });
  
  if (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
  
  return data as Announcement[] || null;
};

// Function to delete an announcement
export const deleteAnnouncement = async (id: string) => {
  // Use the RPC function to delete announcement
  const { data, error } = await supabase
    .rpc('delete_announcement', { p_id: id });
  
  if (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
  
  return true;
};
