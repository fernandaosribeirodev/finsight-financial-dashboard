'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowUpCircle, ArrowDownCircle, CreditCard, Wallet } from 'lucide-react';
import { NovaTransacao } from '@/types';
import { useCartoes } from '@/hooks/useCartoes'; // A MÁGICA DA INTEGRAÇÃO AQUI!

const tagsPorCategoria = {
  Entrada: ['Salário', 'Bônus / 13º', 'Rendimentos', 'Vendas', 'Outros'],
  Essencial: ['Moradia (Aluguel, Luz, Água)', 'Mercado', 'Transporte / Combustível', 'Saúde / Farmácia', 'Educação', 'Investimento (Pague-se Primeiro)'],
  'Não Essencial': ['Delivery / iFood', 'Restaurantes', 'Lazer e Passeios', 'Assinaturas (Netflix, Spotify)', 'Compras e Roupas', 'Cuidados Pessoais', 'Outros']
};

const schema = z.object({
  tipo: z.enum(['Entrada', 'Saida']),
  titulo: z.string().min(2, 'Digite um título válido.'),
  valor: z.coerce.number().positive('O valor deve ser maior que zero.'),
  categoria: z.enum(['Essencial', 'Não Essencial']).nullable().optional(),
  tag: z.string().min(1, 'Selecione uma tag.'),
  data: z.string().min(1, 'A data é obrigatória.'),
  // Novos campos de integração
  metodoPagamento: z.enum(['Pix/Dinheiro', 'CartaoCredito']).default('Pix/Dinheiro'),
  cartaoId: z.string().nullable().optional(),
  parcelas: z.coerce.number().min(1).max(24).default(1),
}).superRefine((data, ctx) => {
  if (data.tipo === 'Saida' && !data.categoria) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Classifique este gasto.', path: ['categoria'] });
  }
  if (data.tipo === 'Saida' && data.metodoPagamento === 'CartaoCredito' && !data.cartaoId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Selecione um cartão.', path: ['cartaoId'] });
  }
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NovaTransacao) => Promise<void>;
}

export function TransactionModal({ isOpen, onClose, onSave }: Props) {
  // Puxamos os cartões do usuário para listar no select
  const { cartoes } = useCartoes();

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      tipo: 'Saida',
      data: new Date().toISOString().split('T')[0],
      categoria: 'Essencial',
      metodoPagamento: 'Pix/Dinheiro',
      parcelas: 1
    }
  });

  const tipoSelecionado = watch('tipo');
  const categoriaSelecionada = watch('categoria');
  const metodoPagamentoSelecionado = watch('metodoPagamento');

  useEffect(() => {
    if (isOpen) {
      reset({
        tipo: 'Saida',
        data: new Date().toISOString().split('T')[0],
        categoria: 'Essencial',
        titulo: '',
        valor: undefined,
        tag: '',
        metodoPagamento: 'Pix/Dinheiro',
        cartaoId: null,
        parcelas: 1
      });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (tipoSelecionado === 'Entrada') {
      setValue('categoria', null);
      setValue('metodoPagamento', 'Pix/Dinheiro');
    }
  }, [tipoSelecionado, setValue]);

  useEffect(() => {
    setValue('tag', '');
  }, [tipoSelecionado, categoriaSelecionada, setValue]);

  let opcoesDeTags: string[] = [];
  if (tipoSelecionado === 'Entrada') opcoesDeTags = tagsPorCategoria.Entrada;
  else if (categoriaSelecionada === 'Essencial') opcoesDeTags = tagsPorCategoria.Essencial;
  else if (categoriaSelecionada === 'Não Essencial') opcoesDeTags = tagsPorCategoria['Não Essencial'];

  const onSubmit = async (data: FormData) => {
    await onSave({
      titulo: data.titulo,
      valor: data.valor,
      tipo: data.tipo,
      categoria: data.tipo === 'Entrada' ? null : data.categoria!,
      tag: data.tag,
      data: data.data,
      metodoPagamento: data.tipo === 'Entrada' ? 'Pix/Dinheiro' : data.metodoPagamento,
      cartaoId: data.metodoPagamento === 'CartaoCredito' ? data.cartaoId : null,
      parcelas: data.metodoPagamento === 'CartaoCredito' ? data.parcelas : 1,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-background border border-border rounded-3xl p-6 shadow-2xl relative z-10 glass max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold">Novo Registo</h3>
              <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/50 hover:text-foreground"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-2 p-1 bg-foreground/5 rounded-xl border border-border/50">
                <label className="cursor-pointer text-center">
                  <input type="radio" value="Entrada" className="sr-only peer" {...register('tipo')} />
                  <div className="py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all text-foreground/50 peer-checked:bg-success/10 peer-checked:text-success peer-checked:shadow-sm"><ArrowUpCircle size={16} /> Receita</div>
                </label>
                <label className="cursor-pointer text-center">
                  <input type="radio" value="Saida" className="sr-only peer" {...register('tipo')} />
                  <div className="py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all text-foreground/50 peer-checked:bg-destructive/10 peer-checked:text-destructive peer-checked:shadow-sm"><ArrowDownCircle size={16} /> Gasto</div>
                </label>
              </div>

              {tipoSelecionado === 'Saida' && (
                <>
                  {/* INTEGRAÇÃO: PIX OU CARTÃO */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Forma de Pagamento</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="cursor-pointer">
                        <input type="radio" value="Pix/Dinheiro" className="sr-only peer" {...register('metodoPagamento')} />
                        <div className="p-3 border border-border rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all peer-checked:border-foreground peer-checked:bg-foreground/5 peer-checked:text-foreground">
                          <Wallet size={16} /> Pix / Saldo
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input type="radio" value="CartaoCredito" className="sr-only peer" {...register('metodoPagamento')} />
                        <div className="p-3 border border-border rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary">
                          <CreditCard size={16} /> Cartão
                        </div>
                      </label>
                    </div>
                  </div>

                  {metodoPagamentoSelecionado === 'CartaoCredito' && (
                    <div className="grid grid-cols-3 gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-primary/70 mb-1 block">Qual Cartão?</label>
                        <select className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus-ring" {...register('cartaoId')}>
                          <option value="">Selecione...</option>
                          {cartoes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                        {errors.cartaoId && <p className="text-xs text-destructive mt-1">{errors.cartaoId.message}</p>}
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs font-bold text-primary/70 mb-1 block">Parcelas</label>
                        <select className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus-ring" {...register('parcelas')}>
                          {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Classificação do Gasto</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="cursor-pointer">
                        <input type="radio" value="Essencial" className="sr-only peer" {...register('categoria')} />
                        <div className="p-3 border border-border rounded-xl text-center text-sm font-medium transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary">
                          Essencial<p className="text-[10px] text-foreground/40 mt-1 font-normal">Sobrevivência</p>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input type="radio" value="Não Essencial" className="sr-only peer" {...register('categoria')} />
                        <div className="p-3 border border-border rounded-xl text-center text-sm font-medium transition-all peer-checked:border-warning peer-checked:bg-warning/5 peer-checked:text-warning">
                          Não Essencial<p className="text-[10px] text-foreground/40 mt-1 font-normal">Estilo de Vida</p>
                        </div>
                      </label>
                    </div>
                    {errors.categoria && <p className="text-xs text-destructive">{errors.categoria.message}</p>}
                  </div>
                </>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Título</label>
                  <input type="text" placeholder="Ex: Conta de Luz, Salário..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('titulo')} />
                  {errors.titulo && <p className="text-xs text-destructive mt-1">{errors.titulo.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/60 mb-1 block">Valor Total (R$)</label>
                    <input type="number" step="0.01" placeholder="0,00" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('valor')} />
                    {errors.valor && <p className="text-xs text-destructive mt-1">{errors.valor.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60 mb-1 block">Data da Compra</label>
                    <input type="date" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('data')} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Grupo Específico</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('tag')}>
                    <option value="">Selecione...</option>
                    {opcoesDeTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                  </select>
                  {errors.tag && <p className="text-xs text-destructive mt-1">{errors.tag.message}</p>}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-foreground text-background font-bold text-sm py-4 rounded-xl mt-2 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Registar Transação'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}