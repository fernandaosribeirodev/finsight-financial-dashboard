'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Plane, ShieldAlert, Car, Home, Target } from 'lucide-react';
import { NovaMeta } from '@/types';

const schema = z.object({
  titulo: z.string().min(2, 'Digite o nome da meta.'),
  valorAlvo: z.coerce.number().positive('O valor deve ser maior que zero.'),
  dataAlvo: z.string().min(1, 'Defina o prazo final.'),
  icone: z.enum(['viagem', 'reserva', 'carro', 'casa', 'outros']),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NovaMeta) => Promise<void>;
}

export function MetaModal({ isOpen, onClose, onSave }: Props) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { icone: 'reserva', dataAlvo: '' }
  });

  const iconeSelecionado = watch('icone');

  useEffect(() => {
    if (isOpen) reset({ titulo: '', valorAlvo: undefined, dataAlvo: '', icone: 'reserva' });
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    await onSave({
      titulo: data.titulo,
      valorAlvo: data.valorAlvo,
      valorAtual: 0, // Toda meta começa zerada
      dataAlvo: data.dataAlvo,
      icone: data.icone,
    });
    onClose();
  };

  const iconesOptions = [
    { id: 'reserva', label: 'Reserva', icon: ShieldAlert },
    { id: 'viagem', label: 'Viagem', icon: Plane },
    { id: 'casa', label: 'Casa', icon: Home },
    { id: 'carro', label: 'Veículo', icon: Car },
    { id: 'outros', label: 'Outros', icon: Target },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-background border border-border rounded-3xl p-6 shadow-2xl relative z-10 glass">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold">Nova Caixinha (Meta)</h3>
              <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/50"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground/60 mb-2 block">Escolha um ícone</label>
                <div className="flex gap-2 justify-between">
                  {iconesOptions.map((opt) => (
                    <label key={opt.id} className="cursor-pointer flex-1">
                      <input type="radio" value={opt.id} className="sr-only peer" {...register('icone')} />
                      <div className="py-3 rounded-xl border border-border flex flex-col items-center gap-1 text-foreground/50 transition-all peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary">
                        <opt.icon size={18} />
                        <span className="text-[9px] font-bold uppercase">{opt.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground/60 mb-1 block">Para o que você está guardando?</label>
                <input type="text" placeholder="Ex: Viagem para a praia" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('titulo')} />
                {errors.titulo && <p className="text-xs text-destructive mt-1">{errors.titulo.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Qual o valor alvo? (R$)</label>
                  <input type="number" step="0.01" placeholder="0,00" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('valorAlvo')} />
                  {errors.valorAlvo && <p className="text-xs text-destructive mt-1">{errors.valorAlvo.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-1 block">Até quando?</label>
                  <input type="date" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus-ring" {...register('dataAlvo')} />
                  {errors.dataAlvo && <p className="text-xs text-destructive mt-1">{errors.dataAlvo.message}</p>}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background font-bold text-sm py-4 rounded-xl mt-2 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Criar Meta'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}