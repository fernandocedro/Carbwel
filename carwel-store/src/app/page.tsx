import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";

async function getCarbwelProducts() {
  // SEU TOKEN ATUALIZADO E DESTRAVADO
  const ACCESS_TOKEN = "APP_USR-567742962988102-030412-533d601493e017bbfe6c20ec5c33440f-72983036";
  const SELLER_ID = "72983036";

  try {
    const res = await fetch(`https://api.mercadolibre.com/sites/MLB/search?seller_id=${SELLER_ID}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      cache: 'no-store' 
    });

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro na busca:", error);
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="group border p-4 rounded-lg hover:shadow-xl transition-all bg-white flex flex-col justify-between">
                <div>
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-md bg-gray-50">
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

          {products.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-xl border-neutral-200">
              <p className="text-neutral-500 font-medium">Carregando anúncios ativos da Carbwel...</p>
              <p className="text-xs text-neutral-400 mt-2 italic">Se esta mensagem persistir, verifique o status do deploy na Vercel.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
