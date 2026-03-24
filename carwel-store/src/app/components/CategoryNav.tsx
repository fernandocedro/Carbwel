"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MenuIcon } from "./icons"; // Certifique-se que esses arquivos existem
import { menu } from "./data";
import Link from "next/link";
import { useRouter } from "next/navigation";

function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    // Proteção para evitar erro no servidor (SSR)
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

  // Fecha menus ao clicar fora
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

  // Garante que 'items' seja sempre um array, mesmo que 'menu' falhe
  const items = useMemo(() => (Array.isArray(menu) ? menu : []), []);

  const closeMenus = () => {
    setOpenIndex(null);
    setAllOpen(false);
  };

  const formatQuery = (label: string) => {
    if (!label) return "";
    return label
      .replace(/\//g, " ")       // Remove todas as barras
      .replace(/\sde\s/gi, " ")  // Remove preposições
      .replace(/\spara\s/gi, " ")
      .trim();
  };

  const handleSearch = (label: string) => {
    const q = formatQuery(label);
    closeMenus();
    // No Next 15, passamos a URL e o scroll opcional
    router.push(`/?q=${encodeURIComponent(q)}`, { scroll: true });
  };

  return (
    <div ref={rootRef} className="border-b border-neutral-200 bg-white sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        
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
                className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-tight"
                onClick={() => {
                  if (isDesktop) handleSearch(it.label);
                  else setOpenIndex(openIndex === idx ? null : idx);
                }}
              >
                {it.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Individual */}
              {openIndex === idx && it.children && it.children.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                  {it.children.map((c: any) => (
                    <Link
                      key={c.label}
                      href={`/?q=${encodeURIComponent(formatQuery(c.label))}`}
                      onClick={closeMenus}
                      className="block rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Botão Todas as Categorias */}
        <button
          type="button"
          className="ml-auto flex items-center gap-2 text-xs font-black tracking-tighter text-blue-700 hover:opacity-70 transition-opacity"
          onClick={() => setAllOpen((v) => !v)}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="hidden sm:inline">TODAS AS CATEGORIAS</span>
        </button>
      </div>

      {/* Painel Geral de Categorias */}
      {allOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white border-b shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl p-6">
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {items.map((it) => (
                <div key={it.label} className="space-y-3">
                  <button 
                    onClick={() => handleSearch(it.label)}
                    className="text-[11px] font-black text-blue-900 hover:text-blue-600 uppercase text-left w-full border-b pb-1"
                  >
                    {it.label}
                  </button>
                  <div className="flex flex-col gap-1">
                    {it.children?.map((c: any) => (
                      <Link
                        key={c.label}
                        href={`/?q=${encodeURIComponent(formatQuery(c.label))}`}
                        onClick={closeMenus}
                        className="text-[11px] text-neutral-500 hover:text-blue-600 transition-colors"
                      >
                        {c.label}
                      </Link>
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
