"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MenuIcon } from "./icons";
import { menu } from "./data";
import Link from "next/link";
import { useRouter } from "next/navigation";

function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
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
      if (!rootRef.current || !rootRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
        setAllOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const items = useMemo(() => menu, []);

  const closeMenus = () => {
    setOpenIndex(null);
    setAllOpen(false);
  };

  /**
   * FUNÇÃO CRUCIAL: Limpa o nome da categoria para a API do ML.
   * Ex: "Suspensão/Direção" -> "Suspensão Direção"
   * Ex: "Bobinas de Ignição" -> "Bobina Ignição"
   */
  const formatQuery = (label: string) => {
    return label
      .replace("/", " ")       // Remove barras
      .replace(" de ", " ")    // Remove preposições comuns
      .replace(" para ", " ")  
      .replace("s ", " ")      // Tenta singularizar termos simples (ajuste conforme necessário)
      .trim();
  };

  const handleSearch = (label: string) => {
    const q = formatQuery(label);
    router.push(`/?q=${encodeURIComponent(q)}`);
    closeMenus();
  };

  return (
    <div ref={rootRef} className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        
        <nav className="hidden items-center gap-8 md:flex">
          {items.map((it, idx) => (
            <div
              key={it.label}
              className="relative"
              onMouseEnter={() => isDesktop && setOpenIndex(idx)}
              onMouseLeave={() => isDesktop && setOpenIndex(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors"
                onClick={() => {
                  if (isDesktop) handleSearch(it.label);
                  else setOpenIndex(openIndex === idx ? null : idx);
                }}
              >
                {it.label}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>

              {openIndex === idx && it.children?.length ? (
                <div className="absolute left-0 top-full z-50 mt-3 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg animate-in fade-in slide-in-from-top-1">
                  {it.children.map((c) => (
                    <Link
                      key={c.label}
                      href={`/?q=${encodeURIComponent(formatQuery(c.label))}`}
                      onClick={closeMenus}
                      className="block rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="ml-auto flex items-center gap-2 text-sm font-extrabold tracking-wide text-red-600 hover:opacity-80 transition-opacity"
          onClick={() => setAllOpen((v) => !v)}
        >
          <MenuIcon className="h-5 w-5" />
          TODAS AS CATEGORIAS
        </button>
      </div>

      {allOpen && (
        <div className="mx-auto max-w-7xl px-4 pb-4 animate-in fade-in zoom-in-95">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
            <div className="grid gap-4 md:grid-cols-4">
              {items.map((it) => (
                <div key={it.label} className="rounded-2xl bg-neutral-50 p-4">
                  <button 
                    onClick={() => handleSearch(it.label)}
                    className="mb-3 text-sm font-extrabold text-slate-900 hover:text-red-600 uppercase text-left w-full"
                  >
                    {it.label}
                  </button>
                  <div className="space-y-2">
                    {it.children?.map((c) => (
                      <Link
                        key={c.label}
                        href={`/?q=${encodeURIComponent(formatQuery(c.label))}`}
                        onClick={closeMenus}
                        className="block rounded-lg px-2 py-1 text-sm text-neutral-600 hover:bg-white hover:text-blue-600 transition-all"
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

Modifique no meu código e me mande 
