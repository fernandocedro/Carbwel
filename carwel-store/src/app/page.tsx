export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

// 1. Função de Busca
async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * limit;

  try {
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    const termoLimpo = q.trim();
    if (termoLimpo !== "") {
      url += `&q=${encodeURIComponent(termoLimpo)}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await res.json();
    return { 
      products: data.results || [], 
      total: data.paging?.total || 0 
    };
  } catch (error) {
    console.error("Erro fetch:", error);
    return { products: [], total: 0 };
  }
}

// 2. Página Principal
export default async function Home(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  // No Next 15, precisamos dar await nos params primeiro
  const sParams = await props.searchParams;
  const query = sParams?.q || "";
  const pageStr = sParams?.page || "1";
  
  // Buscamos os produtos ANTES do return
  const { products, total } = await getCarbwelProducts(query, pageStr);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {/* Hero só aparece na home limpa */}
      {!query && currentPage === 1 && <HeroCarousel />}
      
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 uppercase">
              {query ? `Busca: ${query}` : "Peças em Destaque"}
            </h2>
            <p className="text-blue-600 font-bold">{total.toLocaleString('pt-BR')} anúncios</p>
          </div>
        </div>
        
        {/* Renderização condicional direta */}
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
    </div>
  );
}

// --- Componentes Auxiliares ---

function EmptyState() {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-3xl">
      <p className="text-neutral-400">Nenhum produto encontrado para esta busca.</p>
      <Link href="/" className="text-blue-600 font-bold mt-2 inline-block">Ver todos os produtos</Link>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  // Otimização de imagem do ML para alta resolução
  const imageUrl = product.thumbnail?.replace("-I.jpg", "-W.jpg");

  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="w-full aspect-square relative mb-4 flex items-center justify-center bg-gray-50 rounded-lg">
          <img 
            src={imageUrl} 
            alt={product.title}
            className="max-h-full max-w-full object-contain p-2" 
          />
        </div>
        <h3 className="text-[13px] font-bold uppercase h-10 line-clamp-2 leading-tight text-neutral-700">
          {product.title}
        </h3>
        <p className="text-xl font-black text-blue-700 mt-2">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
      
      <a 
        href={product.permalink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 block text-center bg-blue-600 text-white py-2.5 rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 transition-colors"
      >
        Comprar no Mercado Livre
      </a>
    </div>
  );
}

function Pagination({ currentPage, totalPages, query }: { currentPage: number, totalPages: number, query: string }) {
  const baseHref = `/?q=${encodeURIComponent(query)}`;
  
  return (
    <div className="mt-12 flex justify-center items-center gap-4 border-t pt-8">
      {currentPage > 1 && (
        <Link href={`${baseHref}&page=${currentPage - 1}`} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-bold text-xs">
          ANTERIOR
        </Link>
      )}
      
      <span className="font-bold text-neutral-500">Página {currentPage} de {totalPages}</span>
      
      {currentPage < totalPages && (
        <Link href={`${baseHref}&page=${currentPage + 1}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs">
          PRÓXIMA
        </Link>
      )}
    </div>
  );
}
