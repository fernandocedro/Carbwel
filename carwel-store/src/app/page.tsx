export const dynamic = 'force-dynamic';
export const preferredRegion = 'sao1';

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

async function getCarbwelProducts(searchParams: { q?: string; page?: string }) {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");
  const limit = 20; // Quantos itens por página
  const offset = (page - 1) * limit;

  try {
    // Rota de busca com suporte a termo (q) e paginação (offset)
    const url = `https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active&q=${query}&offset=${offset}&limit=${limit}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
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

export default async function Home({ searchParams }: { searchParams: any }) {
  const { products, total } = await getCarbwelProducts(searchParams);
  const currentPage = parseInt(searchParams.page || "1");
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        {/* Só mostra o Banner se não estiver buscando nada */}
        {!searchParams.q && <HeroCarousel />}
        
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">
              {searchParams.q ? `Resultados para: ${searchParams.q}` : "Destaques da Carbwel"}
            </h2>
            <span className="text-sm text-neutral-500">{total} anúncios encontrados</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="group border p-4 rounded-lg hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
                    <img src={product.thumbnail.replace("-I.jpg", "-O.jpg")} alt={product.title} className="object-contain w-full h-full" />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">{product.title}</h3>
                  <p className="text-xl font-bold text-blue-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </p>
                </div>
                <a href={product.permalink} target="_blank" className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-md font-bold">
                  Comprar no ML
                </a>
              </div>
            ))}
          </div>

          {/* Paginação Simplificada */}
          <div className="mt-12 flex justify-center gap-4 items-center">
            {currentPage > 1 && (
              <Link href={`/?page=${currentPage - 1}${searchParams.q ? `&q=${searchParams.q}` : ""}`} className="px-4 py-2 border rounded hover:bg-gray-100">
                Anterior
              </Link>
            )}
            <span className="font-medium">Página {currentPage} de {totalPages}</span>
            {currentPage < totalPages && (
              <Link href={`/?page=${currentPage + 1}${searchParams.q ? `&q=${searchParams.q}` : ""}`} className="px-4 py-2 border rounded hover:bg-gray-100">
                Próxima
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
