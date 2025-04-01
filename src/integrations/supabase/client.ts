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
export const saveCondominiumData = async (
  data: Record<string, any>, 
  userEmail: string | null, 
  isUpdate: boolean = false
) => {
  try {
    const { matricula } = data;
    
    // Get current data to compare changes
    const { data: existingData } = await supabase
      .from('condominiums')
      .select('*')
      .eq('matricula', matricula)
      .single();
    
    // If this is explicitly an update and we don't find existing data, return error
    if (isUpdate && !existingData) {
      throw new Error('Condomínio não encontrado para atualização.');
    }
    
    let result;
    
    if (existingData) {
      // It's an update - exclude matricula from update data
      const updateData = { ...data };
      delete updateData.matricula; // Prevent changing matricula
      
      result = await supabase
        .from('condominiums')
        .update(updateData)
        .eq('matricula', matricula);
        
      // Log changes for each field that was updated
      const fieldsToLog = [
        'cnpj', 'cep', 'rua', 'numero', 'complemento', 'bairro', 
        'cidade', 'estado', 'nomecondominio', 'nomelegal', 'emaillegal',
        'telefonelegal', 'enderecolegal', 'planocontratado', 'valorplano',
        'formapagamento', 'vencimento', 'desconto', 'valormensal', 
        'tipodocumento', 'ativo'
      ];
      
      for (const field of fieldsToLog) {
        if (existingData[field] !== data[field] && data[field] !== undefined) {
          await supabase.from('condominium_change_logs').insert({
            matricula,
            campo: field,
            valor_anterior: existingData[field]?.toString() || null,
            valor_novo: data[field]?.toString() || null,
            usuario: userEmail
          });
        }
      }
    } else if (!isUpdate) {
      // Only create a new record if isUpdate is false
      result = await supabase
        .from('condominiums')
        .insert(data);
    }

    if (result?.error) {
      throw result.error;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving condominium data:', error);
    throw error;
  }
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
    
    const { data: existingRecord } = await supabase
      .from('pix_receipt_settings')
      .select('*')
      .eq('matricula', matricula)
      .single();
    
    if (existingRecord) {
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

// Business Documents functions
export const getBusinessDocuments = async () => {
  try {
    const { data, error } = await supabase
      .from('business_documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching business documents:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBusinessDocuments:', error);
    throw error;
  }
};

export const getBusinessDocumentById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('business_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching business document:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getBusinessDocumentById:', error);
    return null;
  }
};

export const saveBusinessDocument = async (documentData: {
  title: string;
  date: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('business_documents')
      .insert([documentData])
      .select();
    
    if (error) {
      console.error('Error creating business document:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveBusinessDocument:', error);
    throw error;
  }
};

export const deleteBusinessDocument = async (id: string) => {
  try {
    const { error } = await supabase
      .from('business_documents')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting business document:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBusinessDocument:', error);
    throw error;
  }
};

export const getBusinessDocumentAttachments = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from('business_document_attachments')
      .select('*')
      .eq('document_id', documentId);
    
    if (error) {
      console.error('Error fetching document attachments:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBusinessDocumentAttachments:', error);
    throw error;
  }
};

export const saveBusinessDocumentAttachment = async (attachmentData: {
  document_id: string;
  file_path: string;
  file_type: string;
  file_name: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('business_document_attachments')
      .insert([attachmentData])
      .select();
    
    if (error) {
      console.error('Error creating document attachment:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveBusinessDocumentAttachment:', error);
    throw error;
  }
};

export const deleteBusinessDocumentAttachment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('business_document_attachments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting document attachment:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBusinessDocumentAttachment:', error);
    throw error;
  }
};

// Business Expenses functions
export const getBusinessExpenses = async () => {
  try {
    const { data, error } = await supabase
      .from('business_expenses' as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching business expenses:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBusinessExpenses:', error);
    throw error;
  }
};

export const saveBusinessExpense = async (expenseData: {
  description: string;
  amount: number;
  date: string;
  category: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('business_expenses' as any)
      .insert([expenseData])
      .select();
    
    if (error) {
      console.error('Error creating business expense:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveBusinessExpense:', error);
    throw error;
  }
};

export const updateBusinessExpense = async (id: string, expenseData: {
  description?: string;
  amount?: number;
  date?: string;
  category?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('business_expenses' as any)
      .update({
        ...expenseData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating business expense:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateBusinessExpense:', error);
    throw error;
  }
};

export const deleteBusinessExpense = async (id: string) => {
  try {
    const { error } = await supabase
      .from('business_expenses' as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting business expense:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBusinessExpense:', error);
    throw error;
  }
};
