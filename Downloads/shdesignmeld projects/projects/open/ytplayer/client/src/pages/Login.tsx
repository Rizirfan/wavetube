import { Music2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user, loginWithGoogle } = useAuth();

  if (user) return <Navigate to="/" />;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Decorative blurred orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,36,60,0.18) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,36,60,0.10) 0%, transparent 70%)' }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-[380px] mx-4 rounded-3xl p-8 flex flex-col items-center scale-in"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
          style={{ background: 'var(--primary)', boxShadow: '0 12px 32px rgba(250,36,60,0.4)' }}
        >
          <Music2 size={32} className="text-white" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>
          WaveTube
        </h1>
        <p className="text-[14px] font-medium mb-8" style={{ color: 'var(--text-2)' }}>
          Your music, everywhere.
        </p>

        {/* Google sign-in */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl font-semibold text-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mb-3"
          style={{
            background: 'white',
            color: '#0a0a0a',
            boxShadow: '0 4px 20px rgba(255,255,255,0.12)',
          }}
        >
          {/* Google G mark */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[11px] leading-relaxed mt-4" style={{ color: 'var(--text-3)' }}>
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
