export type MenuItem = {
  label: string;
  slug?: string;
  categoryId?: string;
  children?: { label: string; slug: string; categoryId?: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Carburação",
    slug: "Carburador",
    children: [
      { label: "Carburadores", slug: "Carburador" },
      { label: "Kits de Reparo", slug: "Kit Reparo" },
      { label: "Boias de Carburador", slug: "Boia" },
      { label: "Válvulas de Agulha", slug: "Valvula Agulha" },
      { label: "Giclês", slug: "Gicle" },
    ],
  },
  {
    label: "Injeção Eletrônica",
    slug: "Injecao",
    children: [
      { label: "Bicos Injetores", slug: "Bico Injetor" },
      { label: "Sensores", slug: "Sensor" },
      { label: "Sondas Lambda", slug: "Sonda Lambda" },
      { label: "Módulos de Injeção", slug: "Modulo" },
    ],
  },
  {
    label: "Ignição",
    slug: "Ignicao",
    children: [
      { label: "Bobinas", slug: "Bobina" },
      { label: "Cabos de Vela", slug: "Cabo Vela" },
      { label: "Velas de Ignição", slug: "Vela" },
      { label: "Distribuidores", slug: "Distribuidor" },
    ],
  },
  {
    label: "Filtros e Bombas",
    slug: "Filtro",
    children: [
      { label: "Filtros de Ar", slug: "Filtro Ar" },
      { label: "Filtros de Combustível", slug: "Filtro Combustivel" },
      { label: "Bombas de Combustível", slug: "Bomba Combustivel" },
      { label: "Bombas de Água", slug: "Bomba Agua" },
    ],
  },
  {
    label: "Motor",
    slug: "Junta",
    children: [
      { label: "Jogos de Juntas", slug: "Junta" },
      { label: "Correias", slug: "Correia" },
      { label: "Coxins", slug: "Coxin" },
      { label: "Retentores", slug: "Retentor" },
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
