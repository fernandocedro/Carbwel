import Image from "next/image";
import { CartIcon } from "./icons";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[140px_1fr_56px] items-center gap-4 px-4 py-4 md:grid-cols-[180px_1fr_72px]">
        {/* Logo */}
        <div className="flex items-center">
          {/* Troque por sua logo real depois */}
          <div className="text-xl font-extrabold tracking-tight text-red-600">
            CARWEL
            <span className="ml-1 text-[10px] font-semibold text-neutral-700">
              AUTO PEÇAS
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="w-full">
          <div className="relative">
            <input
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-neutral-400"
              placeholder="Buscar no estoque..."
            />
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
          </div>
        </div>

        {/* Cart */}
        <button className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-red-600 hover:bg-neutral-50 md:h-12 md:w-12">
          <CartIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
