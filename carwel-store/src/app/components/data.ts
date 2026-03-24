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
      { label: "Kits de Reparo", slug: "Kit Reparo" }, // Vai gerar q=Kit%20Reparo
      { label: "Boias", slug: "Boia" },
      { label: "Válvulas de Agulha", slug: "Valvula Agulha" },
      { label: "Giclês", slug: "Gicle" },
    ],
  },
  {
    label: "Injeção Eletrônica",
    slug: "Injecao",
    children: [
      { label: "Bicos Injetores", slug: "Bico Injetor" }, // Exatamente como você pediu
      { label: "Sensores MAP", slug: "Sensor MAP" },
      { label: "Atuadores", slug: "Atuador" },
      { label: "Sondas Lambda", slug: "Sonda Lambda" },
    ],
  },
  {
    label: "Ignição",
    slug: "Ignicao",
    children: [
      { label: "Bobinas de Ignição", slug: "Bobina" },
      { label: "Cabos de Vela", slug: "Cabo Vela" },
      { label: "Velas de Ignição", slug: "Vela" },
      { label: "Distribuidores", slug: "Distribuidor" },
    ],
  },
  {
    label: "Bombas e Filtros",
    slug: "Bomba",
    children: [
      { label: "Bombas de Combustível", slug: "Bomba Combustivel" },
      { label: "Bombas de Água", slug: "Bomba Agua" },
      { label: "Filtros de Ar", slug: "Filtro Ar" },
      { label: "Filtros de Combustível", slug: "Filtro Combustivel" },
    ],
  },
];
