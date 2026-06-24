import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos
export interface Proposta {
  id?: string;
  created_at?: string;
  cliente_nome: string;
  cliente_cnpj: string;
  cliente_responsavel: string;
  cliente_email: string;
  cliente_telefone: string;
  validade: string;
  plano: string;
  plano_preco_mensal: number;
  plano_setup: number;
  servicos_adicionais: string[];
  servicos_total_mensal: number;
  total_mensal: number;
  observacao: string;
  status: 'enviada' | 'visualizada' | 'aceita' | 'recusada';
  slug: string;
}

export interface Aceite {
  id?: string;
  created_at?: string;
  proposta_id: string;
  assinante_nome: string;
  assinante_email: string;
  tipo_assinatura: 'draw' | 'type';
  assinatura_imagem?: string;
  assinatura_texto?: string;
  ip?: string;
  user_agent?: string;
  certificado: string;
  doc_id: string;
  timestamp_aceite: string;
}
