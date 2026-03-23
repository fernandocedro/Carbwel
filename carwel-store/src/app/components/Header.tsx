import Link from "next/link";
import Image from "next/image";
import { CartIcon } from "./icons";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[140px_1fr_56px] items-center gap-4 px-4 py-4 md:grid-cols-[180px_1fr_72px]">
        
        {/* Logo com Link para Home - Agora limpa a busca e volta ao início */}
        <Link href="/" className="flex items-center group cursor-pointer">
          <div className="flex items-center">
            {/* AQUI ESTAVA O ERRO: No Next.js não se usa "../public/". 
               Basta colocar "/" seguido do nome do arquivo que está lá dentro.
            */}
            <img 
              src="/logo.webp" 
              alt="Logo Carbwel" 
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="ml-2 text-[10px] font-bold text-neutral-700 leading-tight uppercase hidden sm:block">
              AUTO<br/>PEÇAS
            </span>
          </div>
        </Link>

        {/* Busca funcional integrada com sua Page.tsx */}
        <div className="w-full">
          <form action="/" method="GET" className="relative">
            <input
              name="q" // Este "q" é o que sua getCarbwelProducts espera receber
              type="text"
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-10 py-3 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              placeholder="Buscar no estoque..."
            />
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 20L16 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </form>
        </div>

        {/* Botão de Carrinho */}
        <button className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-red-600 hover:bg-neutral-50 md:h-12 md:w-12 transition-colors">
          <CartIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
