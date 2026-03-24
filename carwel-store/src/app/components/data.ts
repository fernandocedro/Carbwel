export type MenuItem = {
  label: string;
  slug?: string;
  children?: { label: string; slug: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Carburação",
    slug: "Carburador",
    children: [
      { label: "Carburadores", slug: "Carburador" },
      { label: "Kits de Reparo", slug: "kit" },
      { label: "Componentes", slug: "Agulha Boia Gicle" },
    ],
  },
  {
    label: "Injeção",
    slug: "Injecao",
    children: [
      { label: "Bicos Injetores", slug: "Bico Injetor" },
      { label: "Sensores", slug: "Sensor" },
      { label: "Bombas Elétricas", slug: "Bomba Eletrica" },
    ],
  },
  {
    label: "Ignição",
    slug: "Ignicao",
    children: [
      { label: "Bobinas", slug: "Bobina" },
      { label: "Cabos de Vela", slug: "Cabo Vela" },
      { label: "Velas", slug: "Vela" },
    ],
  },
  {
    label: "Filtros",
    slug: "Filtro",
    children: [
      { label: "Filtros de Ar", slug: "Filtro Ar" },
      { label: "Filtros de Combustível", slug: "Filtro Combustivel" },
      { label: "Filtros de Óleo", slug: "Filtro Oleo" },
    ],
  },
  {
    label: "Acessórios",
    slug: "Acessorio",
    children: [
      { label: "Engates de Reboque", slug: "Engate" },
      { label: "Irrigação e Jardim", slug: "Irrigacao" },
    ],
  },
];
