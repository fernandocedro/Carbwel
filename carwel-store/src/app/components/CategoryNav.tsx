"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MenuIcon } from "./icons";
import { menu } from "./data";
import { useRouter } from "next/navigation";

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

  // Função de busca flexível para aceitar qualquer parâmetro que venha do dado
  const handleSearch = (item: any) => {
    closeMenus();
    
    // 1. Prioridade para o SLUG (Busca por texto que funciona 100%)
    if (item.slug) {
      return router.push(`/?q=${encodeURIComponent(item.slug)}`, { scroll: true });
    }
    
    // 2. Segunda prioridade para o ID de categoria
    if (item.categoryId) {
      return router.push(`/?category=${item.categoryId}`, { scroll: true });
    }

    // 3. Fallback final: usa o label/nome limpo
    const fallbackQ = item.label?.replace(/[^a-zA-Z0-9À-ÿ\s]/g, "").trim() || "";
    router.push(`/?q=${encodeURIComponent(fallbackQ)}`, { scroll: true });
  };

  return (
    <div ref={rootRef} className="border-b border-neutral-200 bg-white sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        
        <nav className="hidden items-center gap-6 md:flex">
          {items.map((it: any, idx: number) => (
            <div
              key={it.label || idx}
              className="relative"
              onMouseEnter={() => isDesktop && setOpenIndex(idx)}
              onMouseLeave={() => isDesktop && setOpenIndex(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-tight"
                onClick={() => handleSearch(it)}
              >
                {it.label}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>

              {openIndex === idx && it.children && (
                <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  {it.children.map((c: any) => (
                    <button
                      key={c.label}
                      onClick={() => handleSearch(c)}
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

        <button
          type="button"
          className="ml-auto flex items-center gap-2 text-[11px] font-black tracking-tighter text-blue-700 hover:text-red-600 transition-colors"
          onClick={() => setAllOpen((v) => !v)}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="hidden sm:inline">TODAS AS CATEGORIAS</span>
        </button>
      </div>

      {allOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white border-b shadow-2xl animate-in slide-in-from-top-2 duration-300 overflow-y-auto max-h-[80vh]">
          <div className="mx-auto max-w-7xl p-8">
            <div className="grid gap-8 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {items.map((it: any) => (
                <div key={it.label} className="space-y-4">
                  <button 
                    onClick={() => handleSearch(it)}
                    className="text-[12px] font-black text-blue-900 hover:text-red-600 uppercase text-left w-full border-b border-neutral-100 pb-2 transition-colors"
                  >
                    {it.label}
                  </button>
                  <div className="flex flex-col gap-2">
                    {it.children?.map((c: any) => (
                      <button
                        key={c.label}
                        onClick={() => handleSearch(c)}
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
