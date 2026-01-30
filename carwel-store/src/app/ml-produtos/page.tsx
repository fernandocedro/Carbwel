export default async function MlProdutosPage() {
  // chama sua rota server
  const r = await fetch("http://localhost:3000/api/ml/products", {
    cache: "no-store",
  });

  const data = await r.json();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-extrabold">Produtos do Mercado Livre</h1>

      <div className="mt-4 flex gap-3">
        <a
          className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          href="/api/ml/login"
        >
          Conectar minha conta
        </a>

        <a
          className="rounded-xl border px-4 py-2 hover:bg-neutral-50"
          href="/api/ml/products"
          target="_blank"
        >
          Ver JSON
        </a>
      </div>

      <pre className="mt-6 overflow-auto rounded-xl bg-neutral-900 p-4 text-sm text-white">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
