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
      { label: "Kits de Reparo", slug: "Reparo" },
      { label: "Boias", slug: "Boia" },
      { label: "Válvulas de Agulha", slug: "Valvula" },
      { label: "Giclês", slug: "Gicle" },
      { label: "Bicos Injetores", slug: "Injetor" },
    ],
  },
  {
    label: "Ignição",
    slug: "Ignicao",
    children: [
      { label: "Bobinas", slug: "Bobina" },
      { label: "Cabos de Vela", slug: "Cabo" },
      { label: "Velas de Ignição", slug: "Vela" },
      { label: "Distribuidores", slug: "Distribuidor" },
      { label: "Módulos", slug: "Modulo" },
    ],
  },
  {
    label: "Bombas e Filtros",
    slug: "Bomba",
    children: [
      { label: "Bombas de Combustível", slug: "Bomba" },
      { label: "Bombas de Água", slug: "Bomba" },
      { label: "Filtros de Ar", slug: "Filtro" },
      { label: "Filtros de Combustível", slug: "Filtro" },
      { label: "Filtros de Óleo", slug: "Filtro" },
    ],
  },
  {
    label: "Motor e Juntas",
    slug: "Junta",
    children: [
      { label: "Jogos de Juntas", slug: "Junta" },
      { label: "Retentores", slug: "Retentor" },
      { label: "Correias", slug: "Correia" },
      { label: "Coxins", slug: "Coxin" },
    ],
  },
  {
    label: "Acessórios",
    slug: "Engate",
    children: [
      { label: "Engates de Reboque", slug: "Engate" },
      { label: "Irrigação e Jardim", slug: "Irrigacao" },
    ],
  },
];
