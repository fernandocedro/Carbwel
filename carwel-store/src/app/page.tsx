export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

// 1. Função de Busca atualizada para aceitar category
async function getCarbwelProducts(q: string = "", page: string = "1", category: string = "") {
  try {
    const baseUrl = "https://carbwel.vercel.app";
    // Adicionamos o parâmetro &category na montagem da URL
    const url = `${baseUrl}/api/ml/products?q=${encodeURIComponent(q)}&page=${page}&category=${category}`;

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) throw new Error("Erro ao carregar API interna");

    const data = await res.json();

    const totalItems = 
      data.paging?.total || 
      data.total || 
      data.paging?.primary_results || 
      (Array.isArray(data) ? data.length : 0);

    return { 
      products: data.results || data.products || (Array.isArray(data) ? data : []), 
      total: totalItems 
    };
  } catch (error) {
    console.error("Erro na ponte da API:", error);
    return { products: [], total: 0 };
  }
}

// 2. Componente de Página Principal corrigido
export default async function Home(props: { searchParams: Promise<{ q?: string; page?: string; category?: string }> }) {
  const params = await props.searchParams;
  const query = params?.q || "";
  const category = params?.category || ""; // NOVO: Captura o ID da categoria da URL
  const pageStr = params?.page || "1";
  
  // Passamos o category para a função de busca
  const { products, total } = await getCarbwelProducts(query, pageStr, category);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const itemsPerPage = 20; 
  const totalPages = Math.ceil(total / itemsPerPage);

  const startItem = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  // Helper para manter os filtros nos links de paginação
  const getPaginationUrl = (newPage: number) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (category) searchParams.set('category', category);
    searchParams.set('page', newPage.toString());
    return `/?${searchParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {/* O carrossel só aparece na home limpa */}
      {!query && !category && currentPage === 1 && <HeroCarousel />}
      
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 border-b border-neutral-100 pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-black text-neutral-800 uppercase tracking-tight">
              {category ? "Filtrando por Categoria" : (query ? `Busca: ${query}` : "Peças em Destaque")}
            </h2>
            <p className="text-blue-600 font-bold text-sm">
               {total.toLocaleString('pt-BR')} anúncios encontrados
            </p>
          </div>
          
          <div className="text-[11px] uppercase font-black text-neutral-400 tracking-widest bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100 shadow-sm">
            Mostrando {startItem.toLocaleString('pt-BR')} — {endItem.toLocaleString('pt-BR')}
          </div>
        </div>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 border-t border-neutral-100 pt-12 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3">
                  {currentPage > 1 ? (
                    <Link 
                      href={getPaginationUrl(currentPage - 1)}
                      className="group flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <span>←</span> Anterior
                    </Link>
                  ) : (
                    <div className="px-6 py-3 border-2 border-neutral-100 text-neutral-300 rounded-2xl font-black text-xs uppercase cursor-not-allowed">
                      ← Anterior
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100 shadow-inner">
                    <span className="w-10 h-10 flex items-center justify-center bg-white text-blue-700 rounded-xl shadow-sm font-black text-sm border border-neutral-100">
                      {currentPage}
                    </span>
                    <span className="px-2 text-neutral-400 font-bold text-[10px] uppercase tracking-tighter">de</span>
                    <span className="w-12 h-10 flex items-center justify-center text-neutral-600 font-black text-sm">
                      {totalPages.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {currentPage < totalPages ? (
                    <Link 
                      href={getPaginationUrl(currentPage + 1)}
                      className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-neutral-900 transition-all shadow-xl shadow-blue-100"
                    >
                      Próxima <span>→</span>
                    </Link>
                  ) : (
                    <div className="px-6 py-3 border-2 border-neutral-100 text-neutral-300 rounded-2xl font-black text-xs uppercase cursor-not-allowed">
                      Próxima →
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-neutral-100 rounded-[40px] bg-neutral-50/50">
            <p className="text-neutral-400 font-bold text-lg mb-4">Nenhum produto encontrado nesta categoria.</p>
            <Link href="/" className="bg-white border border-neutral-200 px-8 py-3 rounded-full text-blue-600 font-black text-xs uppercase shadow-sm hover:shadow-md transition-all">
              Limpar filtros e ver tudo
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Componentes ProductCard e Footer permanecem os mesmos...
