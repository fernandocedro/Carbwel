'use client';
import { useEffect, useState } from 'react';

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/ml/products');
        const data = await res.json();
        
        if (data.ok === false) {
          setError(data.error);
        } else {
          // O Mercado Livre retorna a lista no campo 'results'
          setProducts(data.results || []);
        }
      } catch (err) {
        setError('Erro ao carregar catálogo.');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) return <div className="p-10 text-center">Carregando estoque da Carbwel...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">Aviso: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((item) => (
        <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
          <img 
            src={item.thumbnail.replace('-I.jpg', '-O.jpg')} // Melhora a qualidade da imagem
            alt={item.title}
            className="w-full h-48 object-contain bg-white"
          />
          <div className="p-4">
            <h3 className="font-bold text-sm h-10 overflow-hidden">{item.title}</h3>
            <p className="text-xl font-black text-blue-600 mt-2">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
            </p>
            <a 
              href={item.permalink} 
              target="_blank" 
              className="block text-center bg-yellow-400 hover:bg-yellow-500 font-bold py-2 px-4 rounded mt-4"
            >
              Ver no Mercado Livre
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}