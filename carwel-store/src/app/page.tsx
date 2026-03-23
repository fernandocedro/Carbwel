export const dynamic = 'force-dynamic';
export const revalidate = 0; // Força a busca de dados novos a cada clique
export const preferredRegion = 'sao1';

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

async function getCarbwelProducts(q: string = "", page: string = "1") {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const limit = 20;
  const offset = (parseInt(page) - 1) * limit;

  try {
    // Rota com offset para paginação e q para busca
    const url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&q=${q}&offset=${offset}&limit=${limit}`;
    
    const res = await fetch(url, {
      cache: 'no-store', // Crucial para a paginação funcionar
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const searchData = await res.json();
    const itemIds = searchData.results || [];
    const totalItems = searchData.paging?.total || 0;

    if (itemIds.length === 0) return { products: [], total: 0 };

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

// O Next.js passa automaticamente o searchParams para a Home
export default async function Home({ searchParams }: { searchParams: { q?: string; page?: string } }) {
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
      
      {/* A Key aqui embaixo é o segredo: ela muda quando a página ou a busca mudam */}
      <main key={Math.random()}> 
        {!query && currentPage === 1 && <HeroCarousel />}
        
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">
              {query ? `Busca: ${query}` : "Peças em Destaque"}
            </h2>
            <div className="text-right">
                <p className="text-sm text-neutral-500 font-bold">{total.toLocaleString('pt-BR')} itens</p>
                <p className="text-xs text-blue-600">Página {currentPage} de {totalPages}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="group border p-4 rounded-lg shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between">
                <div>
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-md bg-gray-50 flex items-center justify-center">
                    <img 
                      src={product.thumbnail?.replace("-I.jpg", "-O.jpg")} 
                      alt={product.title} 
                      className="object-contain max-h-full" 
                    />
                  </div>
                  <h3 className="text-xs font-semibold line-clamp-2 h-8 mb-2 text-neutral-700 uppercase">{product.title}</h3>
                  <p className="text-lg font-black text-blue-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </p>
                </div>
                <a href={product.permalink} target="_blank" className="mt-4 block text-center bg-blue-600 text-white py-2 rounded font-bold text-xs uppercase hover:bg-blue-800">
                  Ver no Mercado Livre
                </a>
              </div>
            ))}
          </div>

          {/* Paginação Estilizada */}
          <div className="mt-16 flex justify-center items-center gap-6">
            {currentPage > 1 ? (
              <Link 
                href={`/?page=${currentPage - 1}${query ? `&q=${query}` : ""}`}
                className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-md font-bold hover:bg-blue-50"
              >
                ← ANTERIOR
              </Link>
            ) : <div className="w-[120px]"></div>}

            <span className="text-lg font-bold text-neutral-400">{currentPage} / {totalPages}</span>

            {currentPage < totalPages ? (
              <Link 
                href={`/?page=${currentPage + 1}${query ? `&q=${query}` : ""}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-800 shadow-md"
              >
                PRÓXIMA →
              </Link>
            ) : <div className="w-[120px]"></div>}
          </div>
        </section>
      </main>
    </div>
  );
}
