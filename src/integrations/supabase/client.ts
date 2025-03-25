// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import type { FinancialIncome, FinancialExpense } from '@/hooks/use-finances';

const SUPABASE_URL = "https://kcbvdcacgbwigefwacrk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYnZkY2FjZ2J3aWdlZndhY3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjgzMDQsImV4cCI6MjA1NzgwNDMwNH0.K4xcW6V3X9QROQLekB74NbKg3BaShwgMbanrP3olCYI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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

// Common Areas functions
export const getCommonAreas = async (matricula: string) => {
  try {
    const { data, error } = await supabase
      .from('common_areas')
      .select('*')
      .eq('matricula', matricula)
      .order('name');
    
    if (error) {
      console.error('Error fetching common areas:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCommonAreas:', error);
    throw error;
  }
};

export const getCommonAreaById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('common_areas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching common area:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCommonAreaById:', error);
    return null;
  }
};

export const getReservationsByCommonAreaId = async (commonAreaId: string) => {
  try {
    const { data, error } = await supabase
      .from('common_area_reservations')
      .select(`
        *,
        residents:resident_id (nome_completo, unidade)
      `)
      .eq('common_area_id', commonAreaId)
      .order('reservation_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getReservationsByCommonAreaId:', error);
    throw error;
  }
};

// Announcement functions with type assertions to avoid TypeScript errors
export const getAnnouncements = async (matricula: string) => {
  try {
    // Use type assertion to bypass TypeScript checking
    const { data, error } = await (supabase
      .from('announcements' as any)
      .select('*')
      .eq('matricula', matricula)
      .order('created_at', { ascending: false }) as any);
    
    if (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAnnouncements:', error);
    throw error;
  }
};

export const getAnnouncementById = async (id: string) => {
  try {
    // Use type assertion to bypass TypeScript checking
    const { data, error } = await (supabase
      .from('announcements' as any)
      .select('*')
      .eq('id', id)
      .single() as any);
    
    if (error) {
      console.error('Error fetching announcement:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAnnouncementById:', error);
    return null;
  }
};

export const saveAnnouncement = async (announcementData: any) => {
  try {
    const { id } = announcementData;
    
    if (id) {
      // Update existing announcement
      // Use type assertion to bypass TypeScript checking
      const { data, error } = await (supabase
        .from('announcements' as any)
        .update({
          ...announcementData,
          sent_by_email: announcementData.sent_by_email,
          sent_by_whatsapp: announcementData.sent_by_whatsapp,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select() as any);
      
      if (error) {
        console.error('Error updating announcement:', error);
        throw error;
      }
      
      return data;
    } else {
      // Create new announcement
      // Use type assertion to bypass TypeScript checking
      const { data, error } = await (supabase
        .from('announcements' as any)
        .insert({
          ...announcementData,
          sent_by_email: announcementData.sent_by_email,
          sent_by_whatsapp: announcementData.sent_by_whatsapp,
          created_at: new Date().toISOString()
        })
        .select() as any);
      
      if (error) {
        console.error('Error creating announcement:', error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error in saveAnnouncement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    // Use type assertion to bypass TypeScript checking
    const { error } = await (supabase
      .from('announcements' as any)
      .delete()
      .eq('id', id) as any);
    
    if (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAnnouncement:', error);
    throw error;
  }
};

// Financial functions
export const getFinancialIncomes = async (matricula: string) => {
  try {
    const { data, error } = await supabase
      .from('financial_incomes')
      .select('*')
      .eq('matricula', matricula)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching financial incomes:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFinancialIncomes:', error);
    throw error;
  }
};

export const saveFinancialIncome = async (income: Omit<FinancialIncome, 'created_at'>): Promise<FinancialIncome[]> => {
  try {
    // Don't adjust dates, pass them directly to Supabase
    const { data, error } = income.id
      ? await supabase
          .from('financial_incomes')
          .update({
            matricula: income.matricula,
            category: income.category,
            amount: income.amount,
            reference_month: income.reference_month,
            payment_date: income.payment_date,
            unit: income.unit,
            observations: income.observations,
            updated_at: new Date().toISOString()
          })
          .eq('id', income.id)
          .select()
      : await supabase
          .from('financial_incomes')
          .insert([
            {
              matricula: income.matricula,
              category: income.category,
              amount: income.amount,
              reference_month: income.reference_month,
              payment_date: income.payment_date,
              unit: income.unit,
              observations: income.observations
            }
          ])
          .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving financial income:', error);
    throw error;
  }
};

export const saveFinancialExpense = async (expense: Omit<FinancialExpense, 'created_at'>): Promise<FinancialExpense[]> => {
  try {
    // Don't adjust dates, pass them directly to Supabase
    const { data, error } = expense.id
      ? await supabase
          .from('financial_expenses')
          .update({
            matricula: expense.matricula,
            category: expense.category,
            amount: expense.amount,
            reference_month: expense.reference_month,
            due_date: expense.due_date,
            payment_date: expense.payment_date,
            unit: expense.unit,
            observations: expense.observations,
            updated_at: new Date().toISOString()
          })
          .eq('id', expense.id)
          .select()
      : await supabase
          .from('financial_expenses')
          .insert([
            {
              matricula: expense.matricula,
              category: expense.category,
              amount: expense.amount,
              reference_month: expense.reference_month,
              due_date: expense.due_date,
              payment_date: expense.payment_date,
              unit: expense.unit,
              observations: expense.observations
            }
          ])
          .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving financial expense:', error);
    throw error;
  }
};

export const deleteFinancialIncome = async (id: string) => {
  try {
    // Execute the deletion immediately without additional checks
    const { error } = await supabase
      .from('financial_incomes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting financial income:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFinancialIncome:', error);
    throw error;
  }
};

export const deleteFinancialExpense = async (id: string) => {
  try {
    // Execute the deletion immediately without additional checks
    const { error } = await supabase
      .from('financial_expenses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting financial expense:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFinancialExpense:', error);
    throw error;
  }
};

export const getFinancialBalance = async (matricula: string) => {
  try {
    const { data, error } = await supabase
      .from('financial_balance')
      .select('*')
      .eq('matricula', matricula)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Not found, return default balance
        return { balance: '0', matricula };
      }
      console.error('Error fetching financial balance:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getFinancialBalance:', error);
    throw error;
  }
};

export const updateFinancialBalance = async (matricula: string, balance: string, isManual: boolean = false) => {
  try {
    // Use a direct update with UPSERT for faster processing
    const { data, error } = await supabase
      .from('financial_balance')
      .upsert({
        matricula,
        balance,
        is_manual: isManual,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'matricula',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error updating financial balance:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateFinancialBalance:', error);
    throw error;
  }
};

export const getFinancialExpenses = async (matricula: string) => {
  try {
    const { data, error } = await supabase
      .from('financial_expenses')
      .select('*')
      .eq('matricula', matricula)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching financial expenses:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFinancialExpenses:', error);
    throw error;
  }
};

// Function to get balance adjustment history
export const getBalanceAdjustments = async (matricula: string) => {
  try {
    const { data, error } = await supabase
      .from('balance_adjustments')
      .select('*')
      .eq('matricula', matricula)
      .order('adjustment_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching balance adjustments:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBalanceAdjustments:', error);
    throw error;
  }
};

// Update the PIX key functions to use the new pix_receipt_settings table
export const getPixKey = async (matricula: string) => {
  try {
    const { data, error } = await supabase
      .from('pix_receipt_settings')
      .select('*')
      .eq('matricula', matricula)
      .single();
    
    if (error) {
      console.error('Error fetching PIX key:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPixKey:', error);
    return null;
  }
};

export const savePixKey = async (data: any) => {
  try {
    const { matricula } = data;
    
    // Check if record exists
    const { data: existingRecord } = await supabase
      .from('pix_receipt_settings')
      .select('*')
      .eq('matricula', matricula)
      .single();
    
    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('pix_receipt_settings')
        .update({
          tipochave: data.tipochave,
          chavepix: data.chavepix,
          diavencimento: data.diavencimento,
          jurosaodia: data.jurosaodia,
          updated_at: new Date().toISOString()
        })
        .eq('matricula', matricula);
      
      if (error) {
        console.error('Error updating PIX key:', error);
        throw error;
      }
      
      return { success: true };
    } else {
      // Create new record
      const { error } = await supabase
        .from('pix_receipt_settings')
        .insert({
          matricula,
          tipochave: data.tipochave,
          chavepix: data.chavepix,
          diavencimento: data.diavencimento,
          jurosaodia: data.jurosaodia
        });
      
      if (error) {
        console.error('Error creating PIX key:', error);
        throw error;
      }
      
      return { success: true };
    }
  } catch (error) {
    console.error('Error in savePixKey:', error);
    throw error;
  }
};

export const deletePixKey = async (matricula: string) => {
  try {
    const { error } = await supabase
      .from('pix_receipt_settings')
      .delete()
      .eq('matricula', matricula);
    
    if (error) {
      console.error('Error deleting PIX key:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deletePixKey:', error);
    throw error;
  }
};
