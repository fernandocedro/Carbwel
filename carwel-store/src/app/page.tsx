import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";

// Função corrigida para buscar os produtos reais da Carbwel
async function getCarbwelProducts() {
  const ACCESS_TOKEN = "APP_USR-567742962988102-030411-c7f404e601f91d7c851a6462c47e53d6-72983036";
  const SELLER_ID = "72983036";

  try {
    const res = await fetch(`https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      next: { revalidate: 60 } // Atualiza o cache a cada minuto
    });

    const data = await res.json();
    
    // Retorna os resultados ou uma lista vazia se houver erro na API
    if (data.error) {
      console.error("Erro da API do Mercado Livre:", data.message);
      return [];
    }

    return data.results || [];
  } catch (error) {
    console.error("Erro de conexão com o Mercado Livre:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getCarbwelProducts();

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <HeroCarousel />
        
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-2xl font-bold mb-6 text-neutral-800">Destaques da Carbwel</h2>
          
          {/* Vitrine de Produtos Reais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="group border p-4 rounded-lg hover:shadow-xl transition-all bg-white flex flex-col justify-between">
                <div>
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
                    <img 
                      src={product.thumbnail.replace("-I.jpg", "-O.jpg")} 
                      alt={product.title}
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2 text-neutral-700">
                    {product.title}
                  </h3>
                  <p className="text-xl font-bold text-blue-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </p>
                </div>
                
                <a 
                  href={product.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 block text-center bg-blue-600 text-white py-2.5 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  Comprar no Mercado Livre
                </a>
              </div>
            ))}
          </div>

          {/* Mensagem caso não encontre nada */}
          {products.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
              <p className="text-neutral-500">Nenhum produto encontrado nos anúncios ativos da Carbwel.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
