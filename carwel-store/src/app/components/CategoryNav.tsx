"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MenuIcon } from "./icons";
import { menu } from "./data";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hook para detectar Desktop com segurança (evita erros de Hydration no Next.js)
function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(min-width: ${breakpoint + 1}px)`);
    const update = () => setIsDesktop(mq.matches);
    
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isDesktop;
}

export default function CategoryNav() {
  const isDesktop = useIsDesktop(768);
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Fecha menus ao clicar fora do componente
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
        setAllOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const items = useMemo(() => (Array.isArray(menu) ? menu : []), []);

  const closeMenus = () => {
    setOpenIndex(null);
    setAllOpen(false);
  };

  /**
   * FORMATAÇÃO DE QUERY:
   * Otimizado para o motor de busca do Mercado Livre. 
   * Removemos caracteres especiais e preposições que podem "sujar" a busca.
   */
  const formatQuery = (label: string) => {
    if (!label) return "";
    return label
      .replace(/\//g, " ")       // Troca barras por espaços
      .replace(/[^a-zA-Z0-9À-ÿ\s]/g, "") // Remove caracteres especiais
      .replace(/\b(de|para|com|e|o|a)\b/gi, "") // Remove preposições
      .replace(/\s+/g, " ")      // Remove espaços duplos
      .trim();
  };

  const handleSearch = (label: string) => {
    const q = formatQuery(label);
    if (!q) return;
    closeMenus();
    // Navega para a home com a query e reseta para a página 1 automaticamente
    router.push(`/?q=${encodeURIComponent(q)}`, { scroll: true });
  };

  return (
    <div ref={rootRef} className="border-b border-neutral-200 bg-white sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        
        {/* Navegação Principal */}
        <nav className="hidden items-center gap-6 md:flex">
          {items.map((it, idx) => (
            <div
              key={it.label || idx}
              className="relative"
              onMouseEnter={() => isDesktop && setOpenIndex(idx)}
              onMouseLeave={() => isDesktop && setOpenIndex(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-tight"
                onClick={() => handleSearch(it.label)}
              >
                {it.label}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Individual */}
              {openIndex === idx && it.children && it.children.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  {it.children.map((c: any) => (
                    <button
                      key={c.label}
                      onClick={() => handleSearch(c.label)}
                      className="block w-full text-left rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Botão Menu Geral */}
        <button
          type="button"
          className="ml-auto flex items-center gap-2 text-[11px] font-black tracking-tighter text-blue-700 hover:text-red-600 transition-colors"
          onClick={() => setAllOpen((v) => !v)}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="hidden sm:inline">TODAS AS CATEGORIAS</span>
        </button>
      </div>

      {/* Mega Menu */}
      {allOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white border-b shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <div className="mx-auto max-w-7xl p-8">
            <div className="grid gap-8 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {items.map((it) => (
                <div key={it.label} className="space-y-4">
                  <button 
                    onClick={() => handleSearch(it.label)}
                    className="text-[12px] font-black text-blue-900 hover:text-red-600 uppercase text-left w-full border-b border-neutral-100 pb-2 transition-colors"
                  >
                    {it.label}
                  </button>
                  <div className="flex flex-col gap-2">
                    {it.children?.map((c: any) => (
                      <button
                        key={c.label}
                        onClick={() => handleSearch(c.label)}
                        className="text-[12px] text-left text-neutral-500 hover:text-blue-600 transition-colors"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
