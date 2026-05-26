'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Certifique-se de que este é o caminho correto para o seu arquivo de config do Firebase
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (!email) {
      setErro('Por favor, digite o seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      // A mágica do Firebase acontece aqui!
      await sendPasswordResetEmail(auth, email);
      setSucesso(true);
      setEmail(''); // Limpa o campo após o sucesso
    } catch (error: any) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      // Tratamento de erros comuns do Firebase
      if (error.code === 'auth/user-not-found') {
        setErro('Não encontrámos nenhuma conta com este e-mail.');
      } else if (error.code === 'auth/invalid-email') {
        setErro('O formato do e-mail é inválido.');
      } else {
        setErro('Ocorreu um erro. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efeito Visual de Fundo para manter o padrão Premium */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-2xl">
          
          <div className="mb-8">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-foreground transition-colors mb-6 focus-ring rounded-lg">
              <ArrowLeft size={16} /> Voltar para o Login
            </Link>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Recuperar Senha</h1>
            <p className="text-foreground/60 text-sm">
              Digite o e-mail associado à sua conta. Vamos enviar-lhe um link para redefinir a sua senha.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {sucesso ? (
              <motion.div 
                key="sucesso"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success/10 border border-success/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-bold text-success">E-mail enviado!</h3>
                <p className="text-sm text-success/80">
                  Verifique a sua caixa de entrada (e a pasta de SPAM!) e siga as instruções para criar uma nova senha.
                </p>
              </motion.div>
            ) : (
              <motion.div key="formulario" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <form onSubmit={handleRecuperarSenha} className="space-y-5">
                  
                  <div>
                    <label className="text-xs font-bold text-foreground/60 mb-2 block uppercase tracking-wider">
                      Seu E-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/40">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemplo@email.com" 
                        required
                        className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-colors focus-ring"
                      />
                    </div>
                  </div>

                  {erro && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                      <AlertCircle size={16} className="shrink-0" />
                      <p>{erro}</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || !email}
                    className="w-full bg-foreground text-background dark:bg-white dark:text-black font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Enviar link de recuperação'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}