export const dynamic = 'force-dynamic';
export const preferredRegion = 'sao1';

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

async function getCarbwelProducts(q = "", page = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const offset = (parseInt(page) - 1) * limit;

  try {
    // Rota que aceita busca (q) e paginação (offset)
    const url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&q=${q}&offset=${offset}&limit=${limit}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const searchData = await res.json();
    const itemIds = searchData.results || [];
    const totalItems = searchData.paging?.total || 0;

    if (itemIds.length === 0) return { products: [], total: 0 };

    // Busca detalhes dos 20 itens da página atual
    const idsString = itemIds.join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {
       headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const itemsData = await itemsRes.json();
    const products = itemsData.filter((i: any) => i.code === 200).map((i: any) => i.body);

    return { products, total: totalItems };
  } catch (error) {
    return { products: [], total: 0 };
  }
}

export default async function Home({ searchParams }: { searchParams: any }) {
  // Aguardamos os parâmetros da URL (q e page)
  const query = searchParams?.q || "";
  const page = searchParams?.page || "1";
  
  const { products, total } = await getCarbwelProducts(query, page);
  
  const currentPage = parseInt(page);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      <main key={`${query}-${page}`}> {/* Chave para forçar o recarregamento ao mudar de página */}
        {!query && <HeroCarousel />}
        
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">
              {query ? `Resultados para: ${query}` : "Destaques da Carbwel"}
            </h2>
            <span className="text-sm text-neutral-500 font-bold text-blue-600">
              {total.toLocaleString('pt-BR')} anúncios
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="group border p-4 rounded-lg hover:shadow-xl transition-all flex flex-col justify-between bg-white">
                <div>
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-md bg-gray-50">
                    <img 
                      src={product.thumbnail.replace("-I.jpg", "-O.jpg")} 
                      alt={product.title} 
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2 text-neutral-700">{product.title}</h3>
                  <p className="text-xl font-bold text-blue-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </p>
                </div>
                <a href={product.permalink} target="_blank" className="mt-4 block text-center bg-blue-600 text-white py-2.5 rounded-md font-bold hover:bg-blue-700 transition-colors">
                  Comprar no ML
                </a>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link 
                    href={`/?page=${currentPage - 1}${query ? `&q=${query}` : ""}`}
                    className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors"
                  >
                    ← Anterior
                  </Link>
                )}
                
                {currentPage < totalPages && (
                  <Link 
                    href={`/?page=${currentPage + 1}${query ? `&q=${query}` : ""}`}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Próxima Página →
                  </Link>
                )}
              </div>
              <p className="text-neutral-500 text-sm">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </p>
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-xl border-neutral-200">
              <p className="text-neutral-500 font-medium">Nenhum produto encontrado para sua busca.</p>
              <Link href="/" className="text-blue-600 underline mt-2 inline-block">Ver todos os produtos</Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
