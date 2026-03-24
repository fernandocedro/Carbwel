export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

// 1. Função de Busca Corrigida
async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * limit;

  try {
    // Construção robusta da URL
    let url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}&offset=${offset}&limit=${limit}`;
    
    // Importante: Limpar espaços extras da busca que vem do CategoryNav
    const cleanQuery = q.trim();
    if (cleanQuery !== "") {
      url += `&q=${encodeURIComponent(cleanQuery)}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Vital para que a busca funcione em tempo real na Vercel
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Erro API ML:", errorData.message);
      return { products: [], total: 0 };
    }

    const data = await res.json();
    return { 
      products: data.results || [], 
      total: data.paging?.total || 0 
    };
  } catch (error) {
    console.error("Erro de Conexão:", error);
    return { products: [], total: 0 };
  }
}

// 2. Componente de Página (Next.js 15)
export default async function Home(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  // No Next 15, searchParams precisa de await
  const params = await props.searchParams;
  const query = params?.q || "";
  const pageStr = params?.page || "1";
  
  // Chamada da API
  const { products, total } = await getCarbwelProducts(query, pageStr);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {/* HeroCarousel só aparece na Home (sem busca e pág 1) */}
      {!query && currentPage === 1 && <HeroCarousel />}
      
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 border-b pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 uppercase">
              {query ? `Busca: ${query}` : "Peças em Destaque"}
            </h2>
            <p className="text-blue-600 font-bold">{total.toLocaleString('pt-BR')} anúncios</p>
          </div>
        </div>

        {/* Listagem de Produtos */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-neutral-50">
            <p className="text-neutral-400 font-medium text-lg">Nenhum produto encontrado para "{query}".</p>
            <Link href="/" className="text-blue-600 font-bold mt-4 inline-block hover:underline">
              Ver todos os produtos
            </Link>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            {currentPage > 1 && (
              <Link 
                href={`/?q=${encodeURIComponent(query)}&page=${currentPage - 1}`} 
                className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
              >
                Anterior
              </Link>
            )}
            <div className="bg-neutral-100 px-4 py-2 rounded-lg font-bold text-neutral-600">
              {currentPage} / {totalPages}
            </div>
            {currentPage < totalPages && (
              <Link 
                href={`/?q=${encodeURIComponent(query)}&page=${currentPage + 1}`} 
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-neutral-900 transition-all shadow-lg shadow-blue-100"
              >
                Próxima
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// 3. Card de Produto
function ProductCard({ product }: { product: any }) {
  // Otimização de imagem do ML
  const imageUrl = product.thumbnail?.replace("-I.jpg", "-W.jpg") || "/placeholder.png";

  return (
    <div className="group border p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all bg-white flex flex-col justify-between border-neutral-100">
      <div>
        <div className="aspect-square relative mb-4 overflow-hidden rounded-xl bg-neutral-50 flex items-center justify-center p-4">
          <img 
            src={imageUrl} 
            alt={product.title}
            className="object-contain max-h-full group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="text-[13px] font-bold text-neutral-600 uppercase line-clamp-2 h-10 mb-2 leading-tight">
          {product.title}
        </h3>
        <p className="text-2xl font-black text-blue-700">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
      
      <a 
        href={product.permalink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-6 block text-center bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase hover:bg-neutral-900 transition-colors tracking-widest"
      >
        Comprar no ML
      </a>
    </div>
  );
}
