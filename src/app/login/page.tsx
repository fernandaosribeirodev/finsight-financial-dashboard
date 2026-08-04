'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Fluxo Único: Login Clássico com E-mail e Senha
  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/app'); 
    } catch (error: any) {
      console.error("Erro no login:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setServerError('E-mail ou senha incorretos.');
      } else {
        setServerError('Erro ao tentar fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background relative selection:bg-primary/20">
      <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-gradient-mesh opacity-50 dark:opacity-30" />

      <header className="flex items-center justify-between px-6 py-6 w-full max-w-7xl mx-auto absolute top-0 left-0 right-0">
        <Link href="/" className="flex items-center gap-2 group focus-ring rounded-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background transition-transform group-hover:scale-105"><Sparkles size={14} /></div>
          <span className="font-semibold text-lg tracking-tight">FinSight</span>
        </Link>
        <div className="text-sm font-medium text-foreground/60">Não tem conta? <Link href="/cadastro" className="text-foreground hover:underline focus-ring rounded-sm">Cadastre-se</Link></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px]">
          
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Acesse sua conta</h1>
            <p className="text-foreground/60 text-sm">Bem-vindo de volta! Insira suas credenciais abaixo.</p>
          </div>

          <div className="glass p-8 rounded-[2rem] shadow-elegant">
            
            {serverError && (
              <div className="mb-6 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                <AlertCircle size={16} /> 
                <span className="leading-tight">{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Email</label>
                <input type="email" placeholder="voce@email.com" className={`w-full bg-background border ${errors.email ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-3 text-sm focus-ring`} {...register('email')} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-foreground/80">Senha</label>
                  <Link href="/esqueci-senha" className="text-xs text-foreground/50 hover:text-foreground hover:underline focus-ring rounded-sm">Esqueceu a senha?</Link>
                </div>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Sua senha" className={`w-full bg-background border ${errors.password ? 'border-destructive' : 'border-border'} rounded-xl pl-4 pr-10 py-3 text-sm focus-ring`} {...register('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-1 rounded-md focus-ring">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-foreground text-background font-medium text-sm rounded-full py-3.5 mt-2 transition-all flex items-center justify-center gap-2 focus-ring disabled:opacity-50">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Entrar na plataforma →'}
              </button>
            </form>

          </div>
        </motion.div>
      </div>
    </main>
  );
}