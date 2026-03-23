export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";
import { Suspense } from "react";

// Função de busca que fala com a API do Mercado Livre
async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * limit;

  try {
    // Se q estiver vazio, a API do ML pode se comportar mal com seller_id. 
    // Garantimos que sempre haja um termo ou uma busca limpa pelo vendedor.
    const searchQuery = q.trim() ? `&q=${encodeURIComponent(q)}` : "";
    const url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}${searchQuery}&offset=${offset}&limit=${limit}`;
    
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
        throw new Error(`Erro API: ${res.status}`);
    }

    const searchData = await res.json();
    const products = searchData.results || [];
    const totalItems = searchData.paging?.total || 0;

    return { products, total: totalItems };
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
      
      {/* Só mostra o carrossel na home sem busca e na primeira página */}
      {!query && currentPage === 1 && <HeroCarousel />}
      
      {/* A key no Suspense força o Next.js a atualizar a UI quando a query muda */}
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

// --- Componentes auxiliares mantidos conforme original ---

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="font-bold text-neutral-500">Buscando as melhores peças...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-3xl">
      <p className="text-neutral-400 font-medium">Nenhum produto encontrado.</p>
      <Link href="/" className="text-blue-600 font-bold mt-2 inline-block">Ver todos os produtos</Link>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="group border p-4 rounded-xl shadow-sm hover:shadow-lg transition-all bg-white flex flex-col justify-between border-neutral-100">
      <div>
        <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center p-2">
          <img 
            src={product.thumbnail?.replace("-I.jpg", "-W.jpg")} 
            alt={product.title} 
            className="object-contain max-h-full group-hover:scale-110 transition-transform duration-300" 
          />
        </div>
        <h3 className="text-[13px] font-bold line-clamp-2 h-10 mb-2 text-neutral-600 uppercase leading-tight">{product.title}</h3>
        <p className="text-2xl font-black text-blue-700">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
      <a href={product.permalink} target="_blank" rel="noopener noreferrer" className="mt-5 block text-center bg-blue-600 text-white py-3 rounded-lg font-black text-xs uppercase hover:bg-neutral-900 transition-colors">
        Comprar no Mercado Livre
      </a>
    </div>
  );
}

function Pagination({ currentPage, totalPages, query }: { currentPage: number, totalPages: number, query: string }) {
  const baseHref = `/?q=${encodeURIComponent(query)}`;
  return (
    <div className="mt-16 flex justify-center items-center gap-4 border-t pt-10">
      {currentPage > 1 ? (
        <Link href={`${baseHref}&page=${currentPage - 1}`} className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all">
          ← ANTERIOR
        </Link>
      ) : <div className="opacity-10 px-6 py-3 border-2 border-neutral-400 rounded-xl font-black text-xs">← ANTERIOR</div>}

      <div className="bg-neutral-100 px-6 py-3 rounded-xl font-black text-neutral-600">{currentPage}</div>

      {currentPage < totalPages ? (
        <Link href={`${baseHref}&page=${currentPage + 1}`} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-neutral-900 transition-all shadow-lg shadow-blue-100">
          PRÓXIMA →
        </Link>
      ) : <div className="opacity-10 px-6 py-3 border-2 border-neutral-400 rounded-xl font-black text-xs">PRÓXIMA →</div>}
    </div>
  );
}
