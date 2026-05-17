import { useState } from 'react';

const CORRECT_USER = 'agendahba';
const CORRECT_PASS = 'hba2026';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (user === CORRECT_USER && pass === CORRECT_PASS) {
        onLogin();
      } else {
        setError('Usuário ou senha incorretos.');
        setLoading(false);
      }
    }, 400);
  }

  const inputCls =
    'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agendas de Radiologia</h1>
          <p className="text-slate-400 text-sm mt-1">HBA — Acesso restrito</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Entrar</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Usuário</label>
              <input
                className={inputCls}
                type="text"
                autoComplete="username"
                placeholder="Digite seu usuário"
                value={user}
                onChange={e => { setUser(e.target.value); setError(''); }}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Senha</label>
              <input
                className={inputCls}
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(''); }}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !user || !pass}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all shadow-sm"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
