export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";
import { Suspense } from "react";

// 1. Função de Busca (Melhorada com logs para debug)
async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * limit;

  try {
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    if (q.trim()) {
      url += `&q=${encodeURIComponent(q.trim())}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 } 
    });

    if (!res.ok) throw new Error(`Erro API: ${res.status}`);

    const data = await res.json();
    return { products: data.results || [], total: data.paging?.total || 0 };
  } catch (e) {
    console.error("Erro ao buscar produtos:", e);
    return { products: [], total: 0 };
  }
}

// 2. Componente de Conteúdo (Onde o "await" acontece)
async function ProductListContent({ query, pageStr }: { query: string, pageStr: string }) {
  const { products, total } = await getCarbwelProducts(query, pageStr);
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalPages = Math.ceil(total / 20);

  if (products.length === 0) return <EmptyState />;

  return (
    <>
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 uppercase">
            {query ? `Busca: ${query}` : "Peças em Destaque"}
          </h2>
          <p className="text-blue-600 font-bold">{total.toLocaleString('pt-BR')} anúncios</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} query={query} />
      )}
    </>
  );
}

// 3. Componente Principal (Layout e Suspense)
export default async function Home(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const pageStr = searchParams?.page || "1";
  const currentPage = Math.max(1, parseInt(pageStr) || 1);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {/* Hero só aparece na home sem busca e na primeira página */}
      {!query && currentPage === 1 && <HeroCarousel />}
      
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Suspense key={`${query}-${pageStr}`} fallback={<LoadingState />}>
          <ProductListContent query={query} pageStr={pageStr} />
        </Suspense>
      </main>
    </div>
  );
}

// --- Sub-componentes mantidos para o build ---

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
