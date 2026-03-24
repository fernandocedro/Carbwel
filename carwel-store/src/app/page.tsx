export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

// 1. Função de Busca Robusta
async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * limit;

  try {
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    if (q && q.trim() !== "") {
      url += `&q=${encodeURIComponent(q.trim())}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return { products: [], total: 0 };

    const data = await res.json();
    return { 
      products: data.results || [], 
      total: data.paging?.total || 0 
    };
  } catch (error) {
    return { products: [], total: 0 };
  }
}

// 2. Componente de Página
// No Next.js 15, searchParams DEVE ser uma Promise na definição do tipo
export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; page?: string }> 
}) {
  
  // RESOLVENDO A PROMISE (Obrigatório no Next 15)
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || "";
  const pageStr = resolvedParams?.page || "1";
  
  // Buscando os dados
  const { products, total } = await getCarbwelProducts(query, pageStr);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {/* Hero só na Home */}
      {!query && currentPage === 1 && <HeroCarousel />}
      
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-neutral-800 uppercase">
            {query ? `Busca: ${query}` : "Destaques"}
          </h2>
          <p className="text-blue-600 font-bold">{total.toLocaleString('pt-BR')} anúncios</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <p className="text-neutral-400 font-medium">Nenhum produto encontrado.</p>
            <Link href="/" className="text-blue-600 font-bold mt-2 inline-block">Ver todos</Link>
          </div>
        )}

        {/* Paginação Simples */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-4">
            {currentPage > 1 && (
              <Link href={`/?q=${query}&page=${currentPage - 1}`} className="px-4 py-2 border rounded-lg font-bold">
                Anterior
              </Link>
            )}
            <span className="px-4 py-2 bg-neutral-100 rounded-lg font-bold">{currentPage}</span>
            {currentPage < totalPages && (
              <Link href={`/?q=${query}&page=${currentPage + 1}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
                Próxima
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// 3. Card de Produto (Sem frescuras para não quebrar)
function ProductCard({ product }: { product: any }) {
  const img = product.thumbnail?.replace("-I.jpg", "-W.jpg") || "";

  return (
    <div className="border p-4 rounded-xl shadow-sm hover:shadow-md bg-white flex flex-col justify-between">
      <div>
        <div className="aspect-square relative mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          <img src={img} alt="" className="max-h-full object-contain p-2" />
        </div>
        <h3 className="text-[13px] font-bold text-neutral-700 uppercase line-clamp-2 h-10 mb-2 leading-tight">
          {product.title}
        </h3>
        <p className="text-xl font-black text-blue-700">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
      <a 
        href={product.permalink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg font-bold text-[10px] uppercase"
      >
        Comprar no ML
      </a>
    </div>
  );
}
