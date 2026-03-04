import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";

// Função para buscar os produtos reais da Carbwel no Mercado Livre
async function getCarbwelProducts() {
  const ACCESS_TOKEN = "APP_USR-567742962988102-030411-9cfb370bd645c72b8745399201d11a9f-72983036";
  const SELLER_ID = "72983036";

  try {
    const res = await fetch(`https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      next: { revalidate: 3600 } // Atualiza os dados a cada hora
    });

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
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
          <h2 className="text-2xl font-bold mb-6">Destaques da Carbwel</h2>
          
          {/* Vitrine de Produtos Reais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="border p-4 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="aspect-square relative mb-4">
                  <img 
                    src={product.thumbnail.replace("-I.jpg", "-O.jpg")} 
                    alt={product.title}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">{product.title}</h3>
                <p className="text-lg font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </p>
                <a 
                  href={product.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
                >
                  Ver no Mercado Livre
                </a>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-neutral-500">Nenhum produto encontrado no momento.</p>
          )}
        </section>
      </main>
    </div>
  );
}
