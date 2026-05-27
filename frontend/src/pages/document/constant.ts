import type { Document } from "../../types/documen";

export const documentsData: Document[] = [
  { id: '1', user_id: 'u1', title: 'Extrato Março', filename: 'extrato_marco_2026.csv', content_type: 'text/csv', storage_path: '', text: 'Data,Descrição,Valor\n26/03,Almoço,-R$45.00', created_at: '10-04-2026' },
  { id: '2', user_id: 'u1', title: 'Fatura Fevereiro', filename: 'fatura_fevereiro_2026.pdf', content_type: 'application/pdf', storage_path: '', text: 'Conteúdo simulado extraído do PDF da Fatura de Fevereiro.', created_at: '10-04-2026' },
  { id: '3', user_id: 'u1', title: 'Comprovante PIX', filename: 'comprovante_15-03.pdf', content_type: 'application/pdf', storage_path: '', text: 'Comprovante de Transferência Bancária via PIX realizada com sucesso.', created_at: '10-04-2026' },
  { id: '4', user_id: 'u1', title: 'Relatório Mensal', filename: 'relatorio_mensal_2026.xlsx', content_type: 'spreadsheet', storage_path: '', text: 'Linhas consolidadas do fechamento operacional anual.', created_at: '10-04-2026' },
  { id: '5', user_id: 'u1', title: 'Contrato Social', filename: 'contrato_social_assinado.pdf', content_type: 'application/pdf', storage_path: '', text: 'Contrato de abertura da empresa com assinaturas digitais.', created_at: '11-04-2026' },
  { id: '6', user_id: 'u1', title: 'Recibo Aluguel', filename: 'recibo_aluguel_04_2026.png', content_type: 'image/png', storage_path: '', text: 'Recibo referente ao pagamento do aluguel comercial.', created_at: '12-04-2026' },
  { id: '7', user_id: 'u1', title: 'Nota Fiscal 405', filename: 'nf_405_servicos.pdf', content_type: 'application/pdf', storage_path: '', text: 'Nota fiscal emitida referente a serviços de consultoria em TI.', created_at: '13-04-2026' },
  { id: '8', user_id: 'u1', title: 'Holerite Abril', filename: 'holerite_abril_2026.pdf', content_type: 'application/pdf', storage_path: '', text: 'Demonstrativo de pagamento de salário e benefícios.', created_at: '14-04-2026' },
  { id: '9', user_id: 'u1', title: 'Termo de Uso', filename: 'termo_de_uso_v2.txt', content_type: 'text/plain', storage_path: '', text: 'Atualização das políticas e termos de privacidade da plataforma.', created_at: '15-04-2026' },
  { id: '10', user_id: 'u1', title: 'Orçamento Reforma', filename: 'orcamento_reforma_escritorio.xlsx', content_type: 'spreadsheet', storage_path: '', text: 'Cotações de materiais e mão de obra para pintura.', created_at: '16-04-2026' },
  { id: '11', user_id: 'u1', title: 'Cópia CNH', filename: 'cnh_motorista.jpeg', content_type: 'image/jpeg', storage_path: '', text: 'Documento de identificação com foto do condutor.', created_at: '17-04-2026' },
  { id: '12', user_id: 'u1', title: 'Certificado Curso', filename: 'certificado_react_avancado.pdf', content_type: 'application/pdf', storage_path: '', text: 'Certificado de conclusão do curso avançado de ecossistema React.', created_at: '18-04-2026' }
];