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

    // Mapeamento extra-robusto para garantir que pegamos o total de 3000+ produtos
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

// 2. Componente de Página Principal
export default async function Home(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await props.searchParams;
  const query = params?.q || "";
  const pageStr = params?.page || "1";
  
  // Chamada dos dados reais
  const { products, total } = await getCarbwelProducts(query, pageStr);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const itemsPerPage = 20; 
  
  // Calculamos as páginas com base no total real (ex: 3000 / 20 = 150 páginas)
  const totalPages = Math.ceil(total / itemsPerPage);

  // Lógica para o contador numérico (ex: Mostrando 1-20 de 3000)
  const startItem = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {!query && currentPage === 1 && <HeroCarousel />}
      
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Cabeçalho da Listagem */}
        <div className="mb-8 border-b border-neutral-100 pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-black text-neutral-800 uppercase tracking-tight">
              {query ? `Busca: ${query}` : "Peças em Destaque"}
            </h2>
            <p className="text-blue-600 font-bold text-sm">
               {total.toLocaleString('pt-BR')} anúncios encontrados
            </p>
          </div>
          
          <div className="text-[11px] uppercase font-black text-neutral-400 tracking-widest bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100 shadow-sm">
            Mostrando {startItem.toLocaleString('pt-BR')} — {endItem.toLocaleString('pt-BR')}
          </div>
        </div>

        {/* Grid de Produtos */}
        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Navegação de Páginas - Forçada a aparecer se total > 20 */}
            {(totalPages > 1 || total > itemsPerPage) && (
              <div className="mt-20 border-t border-neutral-100 pt-12 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3">
                  {/* Botão Voltar */}
                  {currentPage > 1 ? (
                    <Link 
                      href={`/?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                      className="group flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform">←</span> Anterior
                    </Link>
                  ) : (
                    <div className="px-6 py-3 border-2 border-neutral-100 text-neutral-300 rounded-2xl font-black text-xs uppercase cursor-not-allowed">
                      ← Anterior
                    </div>
                  )}

                  {/* Mostrador Central (Página X de Y) */}
                  <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100 shadow-inner">
                    <span className="w-10 h-10 flex items-center justify-center bg-white text-blue-700 rounded-xl shadow-sm font-black text-sm border border-neutral-100">
                      {currentPage}
                    </span>
                    <span className="px-2 text-neutral-400 font-bold text-[10px] uppercase tracking-tighter">de</span>
                    <span className="w-12 h-10 flex items-center justify-center text-neutral-600 font-black text-sm">
                      {totalPages > 0 ? totalPages.toLocaleString('pt-BR') : '...'}
                    </span>
                  </div>

                  {/* Botão Avançar */}
                  {currentPage < totalPages ? (
                    <Link 
                      href={`/?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                      className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-neutral-900 transition-all shadow-xl shadow-blue-100"
                    >
                      Próxima <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  ) : (
                    <div className="px-6 py-3 border-2 border-neutral-100 text-neutral-300 rounded-2xl font-black text-xs uppercase cursor-not-allowed">
                      Próxima →
                    </div>
                  )}
                </div>

                {currentPage > 1 && (
                  <Link href="/" className="text-[10px] font-black text-neutral-400 uppercase hover:text-blue-600 transition-colors tracking-widest">
                    Voltar para o início
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-neutral-100 rounded-[40px] bg-neutral-50/50">
            <p className="text-neutral-400 font-bold text-lg mb-4">Nenhum produto encontrado.</p>
            <Link href="/" className="bg-white border border-neutral-200 px-8 py-3 rounded-full text-blue-600 font-black text-xs uppercase shadow-sm hover:shadow-md transition-all">
              Limpar filtros e ver tudo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

// 3. Componente Card de Produto (Mantenha o seu original ou use este estilizado)
function ProductCard({ product }: { product: any }) {
  const imageUrl = product.thumbnail?.replace("-I.jpg", "-W.jpg") || "/placeholder.png";

  return (
    <div className="group border border-neutral-100 p-5 rounded-[32px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col justify-between h-full">
      <div>
        <div className="aspect-square relative mb-5 overflow-hidden rounded-[24px] bg-neutral-50 flex items-center justify-center p-6">
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="object-contain max-h-full group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        <h3 className="text-[13px] font-bold text-neutral-700 uppercase line-clamp-2 h-10 mb-3 leading-tight tracking-tight">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-4">
           <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Novo</span>
           <span className="text-[10px] text-neutral-400 font-medium">Estoque disponível</span>
        </div>
        <p className="text-2xl font-black text-blue-700 tracking-tighter">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
      
      <a 
        href={product.permalink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-8 block text-center bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase hover:bg-neutral-900 transition-all shadow-lg shadow-blue-50 tracking-widest"
      >
        Comprar no Mercado Livre
      </a>
    </div>
  );
}
