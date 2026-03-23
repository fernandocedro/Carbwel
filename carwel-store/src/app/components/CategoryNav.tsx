"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MenuIcon } from "./icons";
import { menu } from "./data";
import Link from "next/link"; // Importação necessária para navegação interna

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
        setAllOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const items = useMemo(() => menu, []);

  // Função auxiliar para fechar os menus ao clicar em uma categoria
  const closeMenus = () => {
    setOpenIndex(null);
    setAllOpen(false);
  };

  return (
    <div ref={rootRef} className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        
        {/* Menu principal (Motor / Câmbio / etc.) */}
        <nav className="hidden items-center gap-8 md:flex">
          {items.map((it, idx) => (
            <div
              key={it.label}
              className="relative"
              onMouseEnter={() => {
                if (isDesktop) setOpenIndex(idx);
              }}
              onMouseLeave={() => {
                if (isDesktop) setOpenIndex(null);
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-red-600"
                onClick={() => {
                  if (!isDesktop) setOpenIndex(openIndex === idx ? null : idx);
                }}
              >
                {it.label}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>

              {/* Dropdown de Subcategorias */}
              {openIndex === idx && it.children?.length ? (
                <div className="absolute left-0 top-full z-50 mt-3 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
                  {it.children.map((c) => (
                    <Link
                      key={c.label}
                      // Alterado para buscar pela label no parâmetro "q"
                      href={`/?q=${encodeURIComponent(c.label)}`}
                      onClick={closeMenus}
                      className="block rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100 hover:text-blue-600 transition-colors"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        {/* Botão "Todas as categorias" */}
        <button
          type="button"
          className="ml-auto flex items-center gap-2 text-sm font-extrabold tracking-wide text-red-600 hover:opacity-90"
          onClick={() => setAllOpen((v) => !v)}
        >
          <MenuIcon className="h-5 w-5" />
          TODAS AS CATEGORIAS
        </button>
      </div>

      {/* Grid de "Todas as categorias" */}
      {allOpen ? (
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
            <div className="grid gap-3 md:grid-cols-4">
              {items.map((it) => (
                <div key={it.label} className="rounded-2xl bg-neutral-50 p-3">
                  <div className="mb-2 text-sm font-extrabold text-slate-900">
                    {it.label}
                  </div>
                  <div className="space-y-1">
                    {it.children?.map((c) => (
                      <Link
                        key={c.label}
                        // Alterado para buscar pela label no parâmetro "q"
                        href={`/?q=${encodeURIComponent(c.label)}`}
                        onClick={closeMenus}
                        className="block rounded-xl px-2 py-1 text-sm text-neutral-700 hover:bg-white hover:text-blue-600"
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
      ) : null}
    </div>
  );
}
