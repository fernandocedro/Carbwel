import TopBar from "./components/TopBar";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import HeroCarousel from "./components/HeroCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <HeroCarousel />
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-xl font-semibold">Destaques</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Aqui você pode continuar com vitrine, categorias, etc.
          </p>
        </section>
      </main>
    </div>
  );
}
