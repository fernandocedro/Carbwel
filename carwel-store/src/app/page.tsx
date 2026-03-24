export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

// 1. Função de Busca interna - MELHORADA
async function getCarbwelProducts(q: string = "", page: string = "1", category: string = "") {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://carbwel.vercel.app";
    
    // Usando URLSearchParams para garantir que a URL seja montada sem erros de caracteres
    const params = new URLSearchParams({
      q: q,
      page: page,
      category: category,
      _t: Date.now().toString() // Força a API a ignorar caches antigos
    });

    const url = `${baseUrl}/api/ml/products?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error("Erro ao carregar API interna");

    const data = await res.json();

    return { 
      products: data.results || [], 
      total: data.total || 0 
    };
  } catch (error) {
    console.error("Erro na ponte da API:", error);
    return { products: [], total: 0 };
  }
}

// 2. Componente de Página Principal
export default async function Home(props: { 
  searchParams: Promise<{ q?: string; page?: string; category?: string }> 
}) {
  const params = await props.searchParams;
  const query = params?.q || "";
  const category = params?.category || "";
  const pageStr = params?.page || "1";
  
  const { products, total } = await getCarbwelProducts(query, pageStr, category);
  
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const itemsPerPage = 20; 
  const totalPages = Math.ceil(total / itemsPerPage);

  const startItem = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  const getPaginationUrl = (newPage: number) => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (category) p.set('category', category);
    p.set('page', newPage.toString());
    return `/?${p.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      
      {/* Só mostra o Banner se não houver busca, categoria ou página ativa */}
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
                  {currentPage > 1 && (
                    <Link href={getPaginationUrl(currentPage - 1)} className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition-all">
                      ← Anterior
                    </Link>
                  )}

                  <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100">
                    <span className="w-10 h-10 flex items-center justify-center bg-white text-blue-700 rounded-xl font-black text-sm border border-neutral-100 shadow-sm">
                      {currentPage}
                    </span>
                    <span className="px-2 text-neutral-400 font-bold text-[10px] uppercase">de</span>
                    <span className="w-12 h-10 flex items-center justify-center text-neutral-600 font-black text-sm">
                      {totalPages}
                    </span>
                  </div>

                  {currentPage < totalPages && (
                    <Link href={getPaginationUrl(currentPage + 1)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-neutral-900 transition-all shadow-xl shadow-blue-100">
                      Próxima →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-neutral-100 rounded-[40px] bg-neutral-50/50">
            <p className="text-neutral-400 font-bold text-lg mb-4">Nenhum produto encontrado.</p>
            <Link href="/" className="bg-white border border-neutral-200 px-8 py-3 rounded-full text-blue-600 font-black text-xs uppercase">
              Limpar filtros
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// 3. Componente Card
function ProductCard({ product }: { product: any }) {
  // Melhora a qualidade da imagem trocando o sufixo do ML
  const imageUrl = product.thumbnail?.replace("-I.jpg", "-W.jpg") || "/placeholder.png";
  return (
    <div className="group border border-neutral-100 p-5 rounded-[32px] shadow-sm hover:shadow-2xl transition-all bg-white flex flex-col justify-between h-full">
      <div>
        <div className="aspect-square relative mb-5 overflow-hidden rounded-[24px] bg-neutral-50 flex items-center justify-center p-6">
          <img src={imageUrl} alt={product.title} className="object-contain max-h-full group-hover:scale-110 transition-transform duration-500" />
        </div>
        <h3 className="text-[13px] font-bold text-neutral-700 uppercase line-clamp-2 h-10 mb-3 leading-tight">{product.title}</h3>
        <p className="text-2xl font-black text-blue-700 tracking-tighter">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
      <a href={product.permalink} target="_blank" rel="noopener noreferrer" className="mt-8 block text-center bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase hover:bg-neutral-900 transition-all">
        Comprar no Mercado Livre
      </a>
    </div>
  );
}

// 4. Rodapé
function Footer() {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 pt-12 pb-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-neutral-400 text-[10px] uppercase font-black">
          © {new Date().getFullYear()} Carbwel Auto Peças - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
