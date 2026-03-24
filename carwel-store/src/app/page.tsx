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
    // URL Base apenas com o seu ID de vendedor
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    // A mágica acontece aqui: só adicionamos a busca se o usuário digitou algo ou clicou em categoria
    const termoLimpo = q.trim();
    if (termoLimpo !== "") {
      url += `&q=${encodeURIComponent(termoLimpo)}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    return { products: data.results || [], total: data.paging?.total || 0 };
  } catch (error) {
    return { products: [], total: 0 };
  }
}

export default async function Home(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
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
              <p className="text-blue-600 font-bold">{total.toLocaleString('pt-BR')} anúncios</p>
            </div>
          </div>
          
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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

// --- Componentes Essenciais (NÃO APAGUE) ---

function LoadingState() {
  return <div className="py-20 text-center font-bold text-neutral-400 animate-pulse">Carregando estoque...</div>;
}

function EmptyState() {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-3xl">
      <p className="text-neutral-400">Nenhum produto encontrado.</p>
      <Link href="/" className="text-blue-600 font-bold mt-2 inline-block">Ver tudo</Link>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white">
      <img src={product.thumbnail?.replace("-I.jpg", "-W.jpg")} className="w-full aspect-square object-contain mb-4" />
      <h3 className="text-xs font-bold uppercase h-10 line-clamp-2">{product.title}</h3>
      <p className="text-xl font-black text-blue-700 mt-2">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      </p>
      <a href={product.permalink} target="_blank" className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg text-xs font-bold uppercase">Comprar</a>
    </div>
  );
}

function Pagination({ currentPage, totalPages, query }: { currentPage: number, totalPages: number, query: string }) {
  return (
    <div className="mt-10 flex justify-center gap-4">
      <Link href={`/?q=${query}&page=${currentPage - 1}`} className={`p-3 border rounded ${currentPage <= 1 ? 'hidden' : ''}`}>Anterior</Link>
      <span className="p-3 font-bold">{currentPage}</span>
      <Link href={`/?q=${query}&page=${currentPage + 1}`} className={`p-3 bg-blue-600 text-white rounded ${currentPage >= totalPages ? 'hidden' : ''}`}>Próxima</Link>
    </div>
  );
}
