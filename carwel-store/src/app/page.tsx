export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";
import { Suspense } from "react";

async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * limit;

  try {
    // 1. URL base: sempre busca os produtos do seu vendedor
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    // 2. Só injetamos o termo 'q' se ele não for vazio. 
    // Isso garante que na primeira página (sem busca) ele mostre TUDO.
    const searchTerm = q.trim();
    if (searchTerm) {
      url += `&q=${encodeURIComponent(searchTerm)}`;
    }
    
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`Erro API: ${res.status}`);

    const searchData = await res.json();
    return { 
      products: searchData.results || [], 
      total: searchData.paging?.total || 0 
    };
  } catch (error) {
    console.error("Erro na busca:", error);
    return { products: [], total: 0 };
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams; 
  const query = params?.q || "";
  const pageStr = params?.page || "1";
  
  const { products, total } = await getCarbwelProducts(query, pageStr);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {/* Carrossel: Só aparece na Home (sem query) e na página 1 */}
      {!query && currentPage === 1 && <HeroCarousel />}
      
      {/* O Suspense com 'key' garante que o Next.js recarregue os dados ao mudar o filtro */}
      <Suspense key={`${query}-${pageStr}`} fallback={<LoadingState />}>
        <main className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex justify-between items-end mb-8 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 uppercase">
                {query ? `Categoria: ${query}` : "Peças em Destaque"}
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

// Componentes auxiliares (LoadingState, EmptyState, ProductCard, Pagination) permanecem os mesmos...
