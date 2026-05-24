'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const signupSchema = z.object({
  name: z.string().min(3, 'Nome muito curto.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(8, 'Mínimo de 8 caracteres.'),
  terms: z.boolean().refine((val) => val === true, 'Aceite os termos.'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch('password') || '';
  const strength = passwordValue.length >= 8 ? 25 : 0 
    + (/[A-Z]/.test(passwordValue) ? 25 : 0) 
    + (/[0-9]/.test(passwordValue) ? 25 : 0) 
    + (/[^a-zA-Z0-9]/.test(passwordValue) ? 25 : 0);

  // Fluxo 1: Cadastro clássico com Email e Senha
  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString(),
        uid: user.uid,
      });

      router.push('/app');
    } catch (error: any) {
      console.error("Erro detalhado no cadastro:", error);
      if (error.code === 'auth/email-already-in-use') {
        setServerError('Este e-mail já está cadastrado.');
      } else {
        setServerError(`Erro: ${error.message || 'Não foi possível concluir o cadastro.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fluxo 2: Cadastro/Login rápido com o Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verifica se o usuário do Google já existe no Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'Usuário Google',
          email: user.email,
          createdAt: new Date().toISOString(),
          uid: user.uid,
        });
      }

      router.push('/app');
    } catch (error: any) {
      console.error("Erro Google Login:", error);
      // Ignora o travamento de tela caso o usuário cancele ou feche o pop-up
      if (
        error.code !== 'auth/popup-closed-by-user' && 
        error.code !== 'auth/cancelled-popup-request'
      ) {
        setServerError('Falha na autenticação com o Google. Verifique se o pop-up foi liberado.');
      }
    } finally {
      setGoogleLoading(false);
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
        <div className="text-sm font-medium text-foreground/60">Já tem conta? <Link href="/login" className="text-foreground hover:underline focus-ring rounded-sm">Entrar</Link></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px]">
          
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Crie sua conta</h1>
            <p className="text-foreground/60 text-sm">Comece grátis. Sem cartão de crédito.</p>
          </div>

          <div className="glass p-8 rounded-[2rem] shadow-elegant">
            
            {serverError && (
              <div className="mb-6 flex flex-col gap-2 text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} /> 
                  <span className="font-semibold">{serverError}</span>
                </div>
                {serverError.includes('já está cadastrado') && (
                  <p className="text-xs text-foreground/70 mt-1">
                    Por favor, vá para a{' '}
                    <Link href="/login" className="text-destructive font-bold underline underline-offset-2 hover:text-destructive/80">
                      página de login
                    </Link>{' '}
                    para acessar sua conta.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                type="button" 
                onClick={() => alert('O login com a Apple requer conta de desenvolvedor paga ($99/ano). Em desenvolvimento, use o Google!')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-background text-sm font-medium hover:bg-foreground/5 transition-colors"
              >
                Apple
              </button>
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-background text-sm font-medium hover:bg-foreground/5 transition-colors disabled:opacity-50"
              >
                {googleLoading ? <Loader2 size={16} className="animate-spin" /> : 'Google'}
              </button>
            </div>

            <div className="relative flex items-center py-2 mb-4">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest font-semibold text-foreground/40">Ou continue com email</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Nome completo</label>
                <input type="text" placeholder="Seu nome" className={`w-full bg-background border ${errors.name ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-3 text-sm focus-ring`} {...register('name')} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Email</label>
                <input type="email" placeholder="voce@email.com" className={`w-full bg-background border ${errors.email ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-3 text-sm focus-ring`} {...register('email')} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Senha</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" className={`w-full bg-background border ${errors.password ? 'border-destructive' : 'border-border'} rounded-xl pl-4 pr-10 py-3 text-sm focus-ring`} {...register('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-1">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {passwordValue.length > 0 && (
                  <div className="mt-2 flex gap-1 h-1">
                    <div className={`flex-1 rounded-full ${strength >= 25 ? 'bg-destructive' : 'bg-border transition-colors'}`} />
                    <div className={`flex-1 rounded-full ${strength >= 50 ? 'bg-warning' : 'bg-border transition-colors'}`} />
                    <div className={`flex-1 rounded-full ${strength >= 75 ? 'bg-success/70' : 'bg-border transition-colors'}`} />
                    <div className={`flex-1 rounded-full ${strength >= 100 ? 'bg-success' : 'bg-border transition-colors'}`} />
                  </div>
                )}
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" id="terms" className="mt-0.5 rounded border-border focus:ring-primary/20 bg-background h-4 w-4" {...register('terms')} />
                <label htmlFor="terms" className="text-xs text-foreground/70 cursor-pointer">
                  Concordo com os <Link href="#" className="font-semibold text-foreground hover:underline">Termos</Link> e a <Link href="#" className="font-semibold text-foreground hover:underline">Política de Privacidade</Link>.
                </label>
              </div>
              {errors.terms && <p className="text-xs text-destructive -mt-2">{errors.terms.message}</p>}

              <button type="submit" disabled={isLoading || googleLoading} className="w-full bg-foreground text-background font-medium text-sm rounded-full py-3.5 mt-2 transition-all flex items-center justify-center gap-2 focus-ring disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Criar conta gratuita →'}
              </button>
            </form>

          </div>
        </motion.div>
      </div>
    </main>
  );
}