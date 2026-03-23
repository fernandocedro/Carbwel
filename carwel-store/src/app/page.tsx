export const dynamic = 'force-dynamic';
export const preferredRegion = 'sao1';

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";

async function getCarbwelProducts() {
  const SELLER_ID = "72983036";
  const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN;

  try {
    // 1. Buscamos os IDs dos anúncios ativos (Rota privada que evita o erro 403)
    const res = await fetch(`https://api.mercadolibre.com/users/${SELLER_ID}/items/search?status=active`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'CarbwelSite/1.0'
      }
    });

    if (!res.ok) {
      const errorDetail = await res.json().catch(() => ({}));
      console.error(`Erro na Home: ${res.status}`, errorDetail);
      return [];
    }

    const searchData = await res.json();
    const itemIds = searchData.results || [];

    if (itemIds.length === 0) return [];

    // 2. Buscamos os detalhes das primeiras 20 peças para exibir com foto e preço
    const idsString = itemIds.slice(0, 20).join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${idsString}`, {
       headers: { 
         'Authorization': `Bearer ${ACCESS_TOKEN}`,
         'User-Agent': 'CarbwelSite/1.0'
       }
    });

    const itemsData = await itemsRes.json();
    
    // Retornamos apenas os itens que o Mercado Livre respondeu com sucesso
    return itemsData
      .filter((i: any) => i.code === 200)
      .map((i: any) => i.body);

  } catch (error) {
    console.error("Erro na conexão com Mercado Livre:", error);
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Destaques da Carbwel</h2>
            <span className="text-sm text-neutral-500">{products.length} anúncios encontrados</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="group border p-4 rounded-lg hover:shadow-xl transition-all bg-white flex flex-col justify-between">
                <div>
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-md bg-gray-50">
                    <img 
                      src={product.thumbnail?.replace("-I.jpg", "-O.jpg")} 
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
              <p className="text-neutral-500 font-medium">Sincronizando estoque da Carbwel...</p>
              <p className="text-xs text-neutral-400 mt-2 italic text-blue-600">
                Acesse /api/ml/login para validar o token se os produtos não aparecerem.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
