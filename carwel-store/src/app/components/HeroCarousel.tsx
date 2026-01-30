"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  titleA: string;
  titleB: string;
  subtitle: string;
  image: string;
};

const slides: Slide[] = [
  {
    titleA: "MOTOR",
    titleB: "ALTA PERFORMANCE",
    subtitle:
      "Pistões, bielas e kits de juntas originais. Mantenha a potência máxima do seu motor.",
    image: "/images/hero-1.jpg",
  },
  {
    titleA: "FREIOS",
    titleB: "SEGURANÇA EM 1º LUGAR",
    subtitle:
      "Pastilhas, discos e fluídos para máxima eficiência em qualquer condição.",
    image: "/images/hero-2.jpg",
  },
  {
    titleA: "SUSPENSÃO",
    titleB: "CONFORTO E ESTABILIDADE",
    subtitle:
      "Amortecedores e componentes de direção para uma condução suave e precisa.",
    image: "/images/hero-3.jpg",
  },
];

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((v) => (v + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[idx];

  return (
    <section className="relative">
      <div className="relative h-[420px] w-full md:h-[520px]">
        <Image src={slide.image} alt="" fill priority className="object-cover" />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-10 md:pb-14">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="h-14 w-1 bg-red-600" />
                <div>
                  <h1 className="text-5xl font-extrabold leading-[0.95] text-white md:text-6xl">
                    {slide.titleA}{" "}
                    <span className="text-red-600">{slide.titleB}</span>
                  </h1>
                  <p className="mt-4 max-w-xl text-sm text-white/90 md:text-base">
                    {slide.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setIdx(i)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      i === idx ? "bg-white" : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          aria-label="Anterior"
          onClick={() => setIdx((v) => (v - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur hover:bg-white/25"
        >
          <span className="text-2xl leading-none">‹</span>
        </button>

        <button
          aria-label="Próximo"
          onClick={() => setIdx((v) => (v + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur hover:bg-white/25"
        >
          <span className="text-2xl leading-none">›</span>
        </button>
      </div>
    </section>
  );
}
