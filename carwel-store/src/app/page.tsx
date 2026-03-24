export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

// 1. Função de Busca que consome a SUA API interna
async function getCarbwelProducts(q: string = "", page: string = "1") {
  try {
    const baseUrl = "https://carbwel.vercel.app";
    const url = `${baseUrl}/api/ml/products?q=${encodeURIComponent(q)}&page=${page}`;

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) throw new Error("Erro ao carregar API interna");

    const data = await res.json();

    return { 
      products: data.results || data.products || (Array.isArray(data) ? data : []), 
      total: data.paging?.total || data.total || (Array.isArray(data) ? data.length : 0) 
    };
  } catch (error) {
    console.error("Erro na ponte da API:", error);
    return { products: [], total: 0 };
  }
}

// 2. Componente de Página
export default async function Home(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await props.searchParams;
  const query = params?.q || "";
  const pageStr = params?.page || "1";
  
  const { products, total } = await getCarbwelProducts(query, pageStr);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Cálculos para o contador de produtos
  const startItem = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {!query && currentPage === 1 && <HeroCarousel />}
      
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 border-b pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 uppercase">
              {query ? `Busca: ${query}` : "Peças em Destaque"}
            </h2>
            <p className="text-blue-600 font-bold">{total.toLocaleString('pt-BR')} anúncios encontrados</p>
          </div>
        </div>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* SEÇÃO DE PAGINAÇÃO APRIMORADA */}
            <div className="mt-16 border-t pt-10 flex flex-col items-center gap-6">
              {/* Contador de Itens */}
              <div className="text-sm text-neutral-500 font-medium">
                Mostrando <span className="text-neutral-900 font-bold">{startItem}</span> a{" "}
                <span className="text-neutral-900 font-bold">{endItem}</span> de{" "}
                <span className="text-blue-600 font-bold">{total.toLocaleString('pt-BR')}</span> produtos
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {/* Botão Anterior */}
                  {currentPage > 1 ? (
                    <Link 
                      href={`/?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                      className="px-5 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      ← Anterior
                    </Link>
                  ) : (
                    <div className="px-5 py-2.5 border-2 border-neutral-100 text-neutral-300 rounded-xl font-black text-[10px] uppercase cursor-not-allowed">
                      ← Anterior
                    </div>
                  )}

                  {/* Indicador de Páginas */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                    <span className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-sm font-black text-sm">
                      {currentPage}
                    </span>
                    <span className="px-2 text-neutral-400 font-bold text-xs uppercase tracking-tighter">de</span>
                    <span className="px-4 py-2 text-neutral-600 font-black text-sm">
                      {totalPages}
                    </span>
                  </div>

                  {/* Botão Próxima */}
                  {currentPage < totalPages ? (
                    <Link 
                      href={`/?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-neutral-900 transition-all shadow-lg shadow-blue-100"
                    >
                      Próxima →
                    </Link>
                  ) : (
                    <div className="px-5 py-2.5 border-2 border-neutral-100 text-neutral-300 rounded-xl font-black text-[10px] uppercase cursor-not-allowed">
                      Próxima →
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-neutral-50">
            <p className="text-neutral-400 font-medium text-lg">Nenhum produto encontrado.</p>
            <Link href="/" className="text-blue-600 font-bold mt-4 inline-block hover:underline">
              Ver todos os produtos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

// 3. Card de Produto
function ProductCard({ product }: { product: any }) {
  const imageUrl = product.thumbnail?.replace("-I.jpg", "-W.jpg") || "/placeholder.png";

  return (
    <div className="group border p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all bg-white flex flex-col justify-between border-neutral-100 h-full">
      <div>
        <div className="aspect-square relative mb-4 overflow-hidden rounded-xl bg-neutral-50 flex items-center justify-center p-4">
          <img src={imageUrl} alt={product.title} className="object-contain max-h-full group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h3 className="text-[13px] font-bold text-neutral-600 uppercase line-clamp-2 h-10 mb-2 leading-tight">
          {product.title}
        </h3>
        <p className="text-2xl font-black text-blue-700">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
      <a href={product.permalink} target="_blank" rel="noopener noreferrer" className="mt-6 block text-center bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase hover:bg-neutral-900 transition-colors">
        Comprar no ML
      </a>
    </div>
  );
}
