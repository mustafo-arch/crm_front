import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuthStore } from "../../../store/authStore";
import { useState, type FormEvent } from "react";
import { apiClient } from "../../../api/apiClient";
import { Phone, Lock, LogIn, ShieldAlert } from "lucide-react"; // 🔥 Premium ikonkalar
import img from "../../../../public/images.jpg";

type Role = "ADMIN" | "MANAGER" | "TEACHER" | "STUDENT";

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: Role;
  };
}

interface ApiErrorResponse {
  message?: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [phone, setPhone] = useState<string>("+998900001122");
  const [password, setPassword] = useState<string>("Admin@12345");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!phone.trim() || !password.trim()) {
      setError("Iltimos, telefon raqam va parolni kiriting!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        phone: phone.trim(),
        password: password.trim(),
      });

      const { user, accessToken } = response.data;
      setAuth(user, accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;

      if (!axiosError.response) {
        console.warn("⚠️ [API] Mock rejim ishga tushdi.");

        if (password === "123456") {
          const mockUser = {
            id: "usr-silicon-main",
            firstName: "Asilbek",
            lastName: "Lead",
            phone: phone,
            role: "MANAGER" as Role,
          };
          const mockToken = "mock-jwt-access-token-for-team";

          setAuth(mockUser, mockToken);
          navigate(from, { replace: true });
        } else {
          setError(
            "Telefon raqam yoki parol xato! (Vaqtinchalik test paroli: 123456)",
          );
        }
      } else {
        const errorMessage =
          axiosError.response.data?.message ||
          "Tizimga kirishda xatolik yuz berdi!";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. ASOSIY FON: To'q fonda va orqada neon nurlar oqimi bor
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden select-none transition-colors duration-300">

      <img
        src={img}
        className="absolute w-full h-full object-cover brightness-[0.4]"
        alt=""
      />

      {/* 🔥 AMBIENT GLOW EFFECT (Orqadagi daxshat chiroyli nurlar) */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 2. SHAFFOF GLASS-CARD OYNASI */}
      <div className="relative w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 md:p-10 transition-all duration-300 hover:border-primary/30">
        {/* LOGOTIP VA SARLAVHA */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-lg shadow-primary/30 mb-4 animate-bounce duration-1000">
            <span className="text-white font-black text-2xl italic tracking-tighter">
              T
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-main tracking-tight uppercase">
            TeamSoft{" "}
            <span className="text-primary font-medium text-lg tracking-widest block text-[11px] mt-0.5 opacity-80">
              Management System
            </span>
          </h1>
        </div>

        {/* XATOLIK PANELINI CHIROYLI QILISH */}
        {error && (
          <div className="mb-6 flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-semibold transition-all">
            <ShieldAlert size={16} className="shrink-0 animate-wiggle" />
            <span>{error}</span>
          </div>
        )}

        {/* FORMA */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TELEFON INPUT */}
          <div className="space-y-1.5">
            <label
              className="block text-xs font-bold text-text-muted uppercase tracking-wider pl-1"
              htmlFor="login-phone"
            >
              Telefon raqam / Login
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/50 group-focus-within:text-primary transition-colors">
                <Phone size={18} />
              </div>
              <input
                id="login-phone"
                type="text"
                autoComplete="username"
                placeholder="+998 (90) 123-4567"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-border/80 rounded-2xl text-text-main placeholder:text-text-muted/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* PAROL INPUT */}
          <div className="space-y-1.5">
            <label
              className="block text-xs font-bold text-text-muted uppercase tracking-wider pl-1"
              htmlFor="login-password"
            >
              Parol
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/50 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-border/80 rounded-2xl text-text-main placeholder:text-text-muted/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* KIRISH TUGMASI (Kreativ animatsiyali) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Tizim tekshirilmoqda...</span>
              </>
            ) : (
              <>
                <span>Tizimga kirish</span>
                <LogIn
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        {/* FOOTER QISMI */}
        <div className="mt-8 text-center border-t border-border/40 pt-4">
          <span className="text-[11px] text-text-muted font-bold tracking-widest uppercase opacity-60">
            TeamSoft Technical School &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
};
