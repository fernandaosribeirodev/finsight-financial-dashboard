'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CreditCard } from 'lucide-react';
import { NovoCartao } from '@/types';

const schema = z.object({
  nome: z.string().min(2, 'Dê um apelido ao cartão (ex: Nubank Principal).'),
  bandeira: z.enum(['Mastercard', 'Visa', 'Elo', 'Amex', 'Outra']),
  limiteTotal: z.coerce.number().positive('O limite deve ser maior que zero.'),
  diaFechamento: z.coerce.number().min(1).max(31),
  diaVencimento: z.coerce.number().min(1).max(31),
  cor: z.string().min(4, 'Selecione uma cor.'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NovoCartao) => Promise<void>;
}

// Cores premium inspiradas nos principais bancos
const CORES_BANCOS = [
  { id: '#8A05BE', label: 'Nubank' },
  { id: '#1E1E1E', label: 'Black/C6' },
  { id: '#EC7000', label: 'Itaú' },
  { id: '#FF7A00', label: 'Inter' },
  { id: '#0066CC', label: 'Azul' },
  { id: '#10B981', label: 'Verde' },
];

export function CartaoModal({ isOpen, onClose, onSave }: Props) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { bandeira: 'Mastercard', cor: '#8A05BE' }
  });

  const corSelecionada = watch('cor');

  useEffect(() => {
    if (isOpen) reset({ nome: '', limiteTotal: undefined, diaFechamento: undefined, diaVencimento: undefined, bandeira: 'Mastercard', cor: '#8A05BE' });
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    await onSave(data);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-background border border-border rounded-3xl p-6 shadow-2xl relative z-10 glass max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary" size={20} />
                <h3 className="font-display text-xl font-bold">Novo Cartão</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/50"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Preview Dinâmico do Cartão */}
              <div 
                className="w-full h-32 rounded-2xl p-4 flex flex-col justify-between text-white shadow-lg transition-colors duration-300 relative overflow-hidden"
                style={{ backgroundColor: corSelecionada }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex justify-between items-start relative z-10">
                  <span className="font-bold tracking-wider">{watch('nome') || 'Apelido do Cartão'}</span>
                  <span className="font-display italic font-bold opacity-80">{watch('bandeira')}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] uppercase opacity-70 mb-0.5">Limite Total</p>
                  <p className="font-display font-bold text-xl">R$ {watch('limiteTotal') || '0,00'}</p>
                </div>
              </div>

              {/* Seletor de Cores */}
              <div>
                <label className="text-xs font-bold text-foreground/60 mb-2 block">Cor do Cartão</label>
                <div className="flex gap-2">
                  {CORES_BANCOS.map((cor) => (
                    <button
                      key={cor.id}
                      type="button"
                      onClick={() => setValue('cor', cor.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${corSelecionada === cor.id ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: cor.id }}
                      title={cor.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground/60 mb-1 block">Nome / Apelido</label>
                <input type="text" placeholder="Ex: Nubank Principal" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('nome')} />
                {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Bandeira</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('bandeira')}>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Visa">Visa</option>
                    <option value="Elo">Elo</option>
                    <option value="Amex">Amex</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Limite Total (R$)</label>
                  <input type="number" step="0.01" placeholder="0,00" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('limiteTotal')} />
                  {errors.limiteTotal && <p className="text-xs text-destructive mt-1">{errors.limiteTotal.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Dia de Fechamento</label>
                  <input type="number" min="1" max="31" placeholder="Ex: 25" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('diaFechamento')} />
                  {errors.diaFechamento && <p className="text-xs text-destructive mt-1">{errors.diaFechamento.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Dia de Vencimento</label>
                  <input type="number" min="1" max="31" placeholder="Ex: 5" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('diaVencimento')} />
                  {errors.diaVencimento && <p className="text-xs text-destructive mt-1">{errors.diaVencimento.message}</p>}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background font-bold text-sm py-4 rounded-xl mt-2 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Adicionar Cartão'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}