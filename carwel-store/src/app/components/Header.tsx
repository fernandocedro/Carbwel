import Link from "next/link";
import Image from "next/image";
import { CartIcon } from "./icons";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[140px_1fr_56px] items-center gap-4 px-4 py-4 md:grid-cols-[180px_1fr_72px]">
        
        {/* Logo com Link para Home */}
        <Link href="/" className="flex items-center group cursor-pointer">
          <div className="flex items-center">
            <img 
              src="../public/images/logo.png" 
              alt="Logo Carbwel" 
              className="h-8 md:h-10 w-auto object-contain"
            />
            <span className="ml-2 text-[10px] font-bold text-neutral-700 leading-tight uppercase hidden sm:block">
              AUTO<br/>PEÇAS
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="w-full">
          <form action="/" method="GET" className="relative">
            <input
              name="q"
              type="text"
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-10 py-3 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-white transition-all"
              placeholder="Buscar no estoque..."
            />
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </form>
        </div>

        {/* Cart */}
        <button className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-red-600 hover:bg-neutral-50 md:h-12 md:w-12 transition-colors">
          <CartIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
