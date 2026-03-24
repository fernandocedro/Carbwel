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
      { label: "Kits de Reparo", slug: "Reparo" }, // "Reparo" costuma trazer agulhas e juntas juntas
      { label: "Válvulas e Boias", slug: "Valvula" }, // Teste 'Valvula' em vez de 'Agulha'
      { label: "Componentes", slug: "Kit" }, // 'Kit' é o termo mais forte da sua API
    ],
  },
  {
    label: "Injeção",
    slug: "Injecao",
    children: [
      { label: "Bicos Injetores", slug: "Bico Injetor" },
      { label: "Bombas Elétricas", slug: "Bomba" },
      { label: "Sensores", slug: "Sensor" },
    ],
  },
  {
    label: "Ignição",
    slug: "Ignicao",
    children: [
      { label: "Bobinas", slug: "Bobina" },
      { label: "Cabos e Velas", slug: "Cabo" }, // 'Cabo' traz o conjunto completo
    ],
  },
  {
    label: "Filtros",
    slug: "Filtro",
    children: [
      { label: "Filtros de Ar", slug: "Filtro Ar" },
      { label: "Filtros de Combustível", slug: "Filtro" },
    ],
  },
];
