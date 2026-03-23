export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";
import { Suspense } from "react";

// 1. Função de busca com fallback para evitar que a tela fique branca
async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * limit;

  try {
    // Se não houver Token, retornamos vazio para não quebrar o build
    if (!ACCESS_TOKEN) {
      console.error("TOKEN ML NÃO ENCONTRADO");
      return { products: [], total: 0 };
    }

    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    if (q && q.trim() !== "") {
      url += `&q=${encodeURIComponent(q.trim())}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const searchData = await res.json();
    return { 
      products: searchData.results || [], 
      total: searchData.paging?.total || 0 
    };
  } catch (error) {
    return { products: [], total: 0 };
  }
}

// 2. Componente Home ajustado para os padrões do Next.js 15
export default async function Home(props: { 
  searchParams: Promise<{ q?: string; page?: string }> 
}) {
  // O segredo do deploy está neste await aqui embaixo:
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const pageStr = searchParams?.page || "1";
  
  const { products, total } = await getCarbwelProducts(query, pageStr);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {!query && currentPage === 1 && <HeroCarousel />}
      
      <Suspense key={`${query}-${pageStr}`} fallback={<LoadingState />}>
        <main className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex justify-between items-end mb-8 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 uppercase">
                {query ? `Busca: ${query}` : "Peças em Destaque"}
              </h2>
              <p className="text-blue-600 font-bold">
                {total.toLocaleString('pt-BR')} anúncios encontrados
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-neutral-400">PÁGINA</span>
              <p className="text-xl font-black text-neutral-800">{currentPage} / {totalPages || 1}</p>
            </div>
          </div>
          
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} query={query} />
          )}
        </main>
      </Suspense>
    </div>
  );
}

// Mantenha suas funções auxiliares (LoadingState, EmptyState, ProductCard, Pagination) abaixo disso.
