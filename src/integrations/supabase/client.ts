
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kcbvdcacgbwigefwacrk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYnZkY2FjZ2J3aWdlZndhY3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjgzMDQsImV4cCI6MjA1NzgwNDMwNH0.K4xcW6V3X9QROQLekB74NbKg3BaShwgMbanrP3olCYI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Define our own interface for condominium data
export interface Condominium {
  id?: string;
  matricula: string;
  cnpj?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  nomeCondominio?: string;
  
  // Informações Representante Legal
  nomeLegal?: string;
  emailLegal?: string;
  telefoneLegal?: string;
  enderecoLegal?: string;
  
  // Informações Financeiras
  banco?: string;
  agencia?: string;
  conta?: string;
  pix?: string;
  
  // Plano / Contrato
  planoContratado?: string;
  valorPlano?: string;
  formaPagamento?: string;
  vencimento?: string;
  desconto?: string;
  valorMensal?: string;
  
  // Segurança
  senha?: string;
  confirmarSenha?: string;
  
  created_at?: string;
  updated_at?: string;
  welcome_email_sent?: boolean;
}

// Interface para registro de mudanças (change log)
export interface ChangeLog {
  id: string;
  matricula: string;
  campo: string;
  valor_anterior: string | null;
  valor_novo: string | null;
  data_alteracao: string;
  usuario: string | null;
}

// Function to map our client-side property names to match database column names
const mapToDatabaseColumns = (data: Partial<Condominium>) => {
  return {
    matricula: data.matricula,
    cnpj: data.cnpj,
    cep: data.cep,
    rua: data.rua,
    numero: data.numero,
    complemento: data.complemento,
    bairro: data.bairro,
    cidade: data.cidade,
    estado: data.estado,
    nomecondominio: data.nomeCondominio,
    nomelegal: data.nomeLegal,
    emaillegal: data.emailLegal,
    telefonelegal: data.telefoneLegal,
    enderecolegal: data.enderecoLegal,
    banco: data.banco,
    agencia: data.agencia,
    conta: data.conta,
    pix: data.pix,
    planocontratado: data.planoContratado,
    valorplano: data.valorPlano,
    formapagamento: data.formaPagamento,
    vencimento: data.vencimento,
    desconto: data.desconto,
    valormensal: data.valorMensal,
    senha: data.senha,
    welcome_email_sent: data.welcome_email_sent
  };
};

// Define database row type to match Supabase schema
type CondominiumRow = {
  id: string;
  matricula: string;
  cnpj?: string | null;
  cep?: string | null;
  rua?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  nomecondominio?: string | null;
  nomelegal?: string | null;
  emaillegal?: string | null;
  telefonelegal?: string | null;
  enderecolegal?: string | null;
  banco?: string | null;
  agencia?: string | null;
  conta?: string | null;
  pix?: string | null;
  planocontratado?: string | null;
  valorplano?: string | null;
  formapagamento?: string | null;
  vencimento?: string | null;
  desconto?: string | null;
  valormensal?: string | null;
  senha?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  welcome_email_sent?: boolean | null;
};

// Função para buscar registros de mudanças (change logs) por matrícula
export const getCondominiumChangeLogs = async (matricula: string): Promise<ChangeLog[] | null> => {
  try {
    console.log("Buscando logs de alterações para a matrícula:", matricula);
    
    if (!matricula || matricula.trim() === '') {
      console.log("Matrícula vazia, retornando null");
      return null;
    }
    
    // Busca os registros de alteração ordenados pelo mais recente
    // Use type assertion to bypass strict type checking
    const { data, error } = await (supabase
      .from('condominium_change_logs' as any)
      .select('*')
      .eq('matricula', matricula)
      .order('data_alteracao', { ascending: false }));
    
    console.log("Resultado da consulta de logs:", { data, error });
    
    if (error) {
      console.error("Erro na consulta de logs:", error);
      return null;
    }
    
    // Se não encontrou dados ou a consulta retornou um array vazio
    if (!data || data.length === 0) {
      console.log("Nenhum log encontrado para a matricula:", matricula);
      return [];
    }
    
    // Explicitly cast the data to ChangeLog[] type
    return data as unknown as ChangeLog[];
  } catch (error) {
    console.error("Erro em getCondominiumChangeLogs:", error);
    return null;
  }
};

// Função para comparar alterações entre dados antigos e novos
interface FieldChange {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

const compareCondominiumChanges = (oldData: Condominium, newData: Condominium): FieldChange[] => {
  const changes: FieldChange[] = [];
  
  // Mapeamento de nomes de campos para exibição mais amigável
  const fieldDisplayNames: Record<string, string> = {
    cnpj: 'CNPJ',
    cep: 'CEP',
    rua: 'Rua',
    numero: 'Número',
    complemento: 'Complemento',
    bairro: 'Bairro',
    cidade: 'Cidade',
    estado: 'Estado',
    nomeCondominio: 'Nome do Condomínio',
    nomeLegal: 'Nome do Representante',
    emailLegal: 'Email do Representante',
    telefoneLegal: 'Telefone do Representante',
    enderecoLegal: 'Endereço do Representante',
    banco: 'Banco',
    agencia: 'Agência',
    conta: 'Conta',
    pix: 'PIX',
    planoContratado: 'Plano Contratado',
    valorPlano: 'Valor do Plano',
    formaPagamento: 'Forma de Pagamento',
    vencimento: 'Vencimento',
    desconto: 'Desconto',
    valorMensal: 'Valor Mensal',
  };
  
  // Verifica cada campo para detectar mudanças
  Object.keys(newData).forEach(key => {
    // Ignorar confirmarSenha e outros campos que não queremos rastrear
    if (key === 'confirmarSenha' || key === 'id' || key === 'welcome_email_sent' || 
        key === 'created_at' || key === 'updated_at' || key === 'matricula') {
      return;
    }
    
    // Trata senha de forma especial - não mostra o valor, apenas indica que foi alterada
    if (key === 'senha') {
      if (oldData[key] !== newData[key] && newData[key]) {
        changes.push({
          field: 'Senha',
          oldValue: '********',
          newValue: '********'
        });
      }
      return;
    }
    
    // Para outros campos, compara normalmente
    if (oldData[key as keyof Condominium] !== newData[key as keyof Condominium]) {
      changes.push({
        field: fieldDisplayNames[key] || key,
        oldValue: oldData[key as keyof Condominium]?.toString() || null,
        newValue: newData[key as keyof Condominium]?.toString() || null
      });
    }
  });
  
  return changes;
};

// Função para enviar e-mail de boas-vindas
export const sendWelcomeEmail = async (condominiumData: Condominium) => {
  try {
    const response = await supabase.functions.invoke('send-welcome-email', {
      body: {
        emailLegal: condominiumData.emailLegal,
        matricula: condominiumData.matricula,
        senha: condominiumData.senha,
        nomeCondominio: condominiumData.nomeCondominio,
        nomelegal: condominiumData.nomeLegal
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar e-mail de boas-vindas:', error);
    throw error;
  }
};

// Condominium data functions
export const saveCondominiumData = async (data: Condominium) => {
  console.log("Saving condominium data:", data);
  
  try {
    // Verificar se o condomínio já existe
    const existingCondominium = await getCondominiumByMatricula(data.matricula);
    const isNewCondominium = !existingCondominium;
    
    console.log("Is new condominium:", isNewCondominium);
    
    // Remove confirmarSenha from data and map to database column names
    const { confirmarSenha, ...dataWithoutConfirmar } = data;
    
    // Map our client-side property names to database column names
    const dataToSave = mapToDatabaseColumns({
      ...dataWithoutConfirmar,
      // Se for novo cadastro, define welcome_email_sent como false
      welcome_email_sent: existingCondominium?.welcome_email_sent || false
    });
    
    console.log("Data to save:", dataToSave);
    
    // Se não for novo cadastro, registrar as alterações no log
    if (!isNewCondominium && existingCondominium) {
      const changes = compareCondominiumChanges(existingCondominium, data);
      
      // Salvar logs de alterações
      if (changes.length > 0) {
        console.log("Changes detected, adding to change logs:", changes);
        
        for (const change of changes) {
          await (supabase
            .from('condominium_change_logs' as any)
            .insert({
              matricula: data.matricula,
              campo: change.field,
              valor_anterior: change.oldValue,
              valor_novo: change.newValue,
              data_alteracao: new Date().toISOString(),
              usuario: 'Sistema' // Pode ser substituído pelo usuário atual quando houver autenticação
            }));
        }
      }
    }
    
    let savedData;
    let error;
    
    // Fix: Use update instead of upsert for existing condominium to avoid duplicated key error
    if (isNewCondominium) {
      // For new condominiums, use insert
      ({ data: savedData, error } = await supabase
        .from('condominiums' as any)
        .insert([dataToSave])
        .select());
    } else {
      // For existing condominiums, use update with the matricula as the filter
      ({ data: savedData, error } = await supabase
        .from('condominiums' as any)
        .update(dataToSave)
        .eq('matricula', data.matricula)
        .select());
    }
    
    if (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }
    
    console.log("Saved data:", savedData);
    
    // Ensure we have data before accessing it
    if (!savedData || savedData.length === 0) {
      throw new Error('No data returned from insert/update operation');
    }

    // Safely cast the data to the correct type
    // First check that we actually have an array with objects
    if (!Array.isArray(savedData)) {
      throw new Error('Expected array of data but got something else');
    }
    
    // Type assertion for the saved data
    const typedSavedData = savedData as unknown as CondominiumRow[];
    
    // Se for um novo condomínio e tiver e-mail, envia e-mail de boas-vindas
    if (isNewCondominium && data.emailLegal) {
      try {
        await sendWelcomeEmail(data);
        
        // Atualiza o flag de e-mail enviado
        await supabase
          .from('condominiums' as any)
          .update({ welcome_email_sent: true })
          .eq('matricula', data.matricula);
          
      } catch (emailError) {
        console.error('Erro ao enviar e-mail de boas-vindas:', emailError);
        // Não interrompe o fluxo principal se o envio de e-mail falhar
      }
    }
    
    // Map the data back to our client-side model
    const result: Condominium = {
      id: typedSavedData[0].id,
      matricula: typedSavedData[0].matricula,
      cnpj: typedSavedData[0].cnpj || undefined,
      cep: typedSavedData[0].cep || undefined,
      rua: typedSavedData[0].rua || undefined,
      numero: typedSavedData[0].numero || undefined,
      complemento: typedSavedData[0].complemento || undefined,
      bairro: typedSavedData[0].bairro || undefined,
      cidade: typedSavedData[0].cidade || undefined,
      estado: typedSavedData[0].estado || undefined,
      nomeCondominio: typedSavedData[0].nomecondominio || undefined,
      nomeLegal: typedSavedData[0].nomelegal || undefined,
      emailLegal: typedSavedData[0].emaillegal || undefined,
      telefoneLegal: typedSavedData[0].telefonelegal || undefined,
      enderecoLegal: typedSavedData[0].enderecolegal || undefined,
      banco: typedSavedData[0].banco || undefined,
      agencia: typedSavedData[0].agencia || undefined,
      conta: typedSavedData[0].conta || undefined,
      pix: typedSavedData[0].pix || undefined,
      planoContratado: typedSavedData[0].planocontratado || undefined,
      valorPlano: typedSavedData[0].valorplano || undefined,
      formaPagamento: typedSavedData[0].formapagamento || undefined,
      vencimento: typedSavedData[0].vencimento || undefined,
      desconto: typedSavedData[0].desconto || undefined,
      valorMensal: typedSavedData[0].valormensal || undefined,
      senha: typedSavedData[0].senha || undefined,
      created_at: typedSavedData[0].created_at || undefined,
      updated_at: typedSavedData[0].updated_at || undefined,
      welcome_email_sent: typedSavedData[0].welcome_email_sent || undefined
    };
    
    return result;
  } catch (error) {
    console.error("Detailed error in saveCondominiumData:", error);
    throw error;
  }
};

export const getCondominiumByMatricula = async (matricula: string) => {
  try {
    console.log("Iniciando busca de condomínio por matrícula:", matricula);
    
    // Debug logs
    console.log("Matricula sendo buscada:", matricula);
    console.log("Tipo da matrícula:", typeof matricula);
    console.log("Comprimento da matrícula:", matricula ? matricula.length : 0);
    console.log("Matrícula é vazia?", !matricula);
    
    if (!matricula || matricula.trim() === '') {
      console.log("Matrícula vazia, retornando null");
      return null;
    }
    
    // Limpa a matrícula antes de pesquisar
    const cleanMatricula = matricula.trim();
    console.log("Matrícula limpa:", cleanMatricula);
    
    // Verificando que a tabela existe
    const { data: tableData, error: tableError } = await supabase
      .from('condominiums' as any)
      .select('count')
      .limit(1);
      
    console.log("Verificação da tabela:", { data: tableData, error: tableError });
    
    if (tableError) {
      console.error("Erro ao verificar tabela:", tableError);
      return null;
    }
    
    // Consulta todos para depuração
    const { data: allCondominiums, error: allError } = await supabase
      .from('condominiums' as any)
      .select('matricula');
      
    console.log("Todas as matrículas disponíveis:", { data: allCondominiums, error: allError });
    
    if (allError) {
      console.error("Erro ao listar matrículas:", allError);
      return null;
    }
    
    // Busca exata pela matrícula
    const { data, error } = await supabase
      .from('condominiums' as any)
      .select('*')
      .eq('matricula', cleanMatricula);
    
    console.log("Resultado da consulta:", { data, error });
    
    if (error) {
      console.error("Erro na consulta:", error);
      return null;
    }
    
    // Se não encontrou dados ou a consulta retornou um array vazio
    if (!data || data.length === 0) {
      console.log("Nenhum dado encontrado para a matrícula:", cleanMatricula);
      
      // Buscar usando like para tentar encontrar correspondências parciais
      const { data: similarData, error: similarError } = await supabase
        .from('condominiums' as any)
        .select('*')
        .ilike('matricula', `%${cleanMatricula}%`);
        
      console.log("Resultado da busca por correspondência parcial:", { data: similarData, error: similarError });
      
      if (similarError || !similarData || similarData.length === 0) {
        return null;
      }
      
      // Usar o primeiro resultado encontrado
      const condominiumData = similarData[0];
      
      if (!condominiumData) {
        return null;
      }
      
      return mapRowToCondominium(condominiumData);
    }
    
    // Pega o primeiro item se existir
    if (Array.isArray(data) && data.length > 0) {
      const condominiumData = data[0];
      console.log("Dados do condomínio encontrado:", condominiumData);
      
      if (!condominiumData) {
        console.log("Dados do condomínio são nulos, retornando null");
        return null;
      }
      
      return mapRowToCondominium(condominiumData);
    }
    
    console.log("Nenhum condomínio encontrado após o processamento");
    return null;
  } catch (error) {
    console.error("Erro em getCondominiumByMatricula:", error);
    return null;
  }
};

// Função auxiliar para mapear os dados do banco para o modelo do cliente
function mapRowToCondominium(row: any): Condominium {
  return {
    id: row.id,
    matricula: row.matricula,
    cnpj: row.cnpj || undefined,
    cep: row.cep || undefined,
    rua: row.rua || undefined,
    numero: row.numero || undefined,
    complemento: row.complemento || undefined,
    bairro: row.bairro || undefined,
    cidade: row.cidade || undefined,
    estado: row.estado || undefined,
    nomeCondominio: row.nomecondominio || undefined,
    nomeLegal: row.nomelegal || undefined,
    emailLegal: row.emaillegal || undefined,
    telefoneLegal: row.telefonelegal || undefined,
    enderecoLegal: row.enderecolegal || undefined,
    banco: row.banco || undefined,
    agencia: row.agencia || undefined,
    conta: row.conta || undefined,
    pix: row.pix || undefined,
    planoContratado: row.planocontratado || undefined,
    valorPlano: row.valorplano || undefined,
    formaPagamento: row.formapagamento || undefined,
    vencimento: row.vencimento || undefined,
    desconto: row.desconto || undefined,
    valorMensal: row.valormensal || undefined,
    senha: row.senha || undefined,
    created_at: row.created_at || undefined,
    updated_at: row.updated_at || undefined,
    welcome_email_sent: row.welcome_email_sent || undefined
  };
}
