export type MenuItem = {
  label: string;
  slug?: string; // Usaremos slug para a busca
  href?: string;
  children?: { label: string; slug: string; href?: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Alimentação e Carburação",
    children: [
      { label: "Carburadores", slug: "Carburador" },
      { label: "Kits de Reparo", slug: "Kit+Reparo" },
      { label: "Bombas de Combustível", slug: "Bomba+Combustivel" },
      { label: "Bicos Injetores", slug: "Bico+Injetor" },
      { label: "Boias de Tanque/Carb", slug: "Boia" },
      { label: "Válvulas de Agulha", slug: "Valvula+Agulha" },
      { label: "Giclês", slug: "Gicle" },
    ],
  },
  {
    label: "Ignição",
    children: [
      { label: "Bobinas de Ignição", slug: "Bobina" },
      { label: "Cabos de Vela", slug: "Cabo+Vela" },
      { label: "Velas de Ignição", slug: "Vela" },
      { label: "Distribuidores", slug: "Distribuidor" },
      { label: "Módulos de Ignição", slug: "Modulo+Ignicao" },
    ],
  },
  {
    label: "Motor e Arrefecimento",
    children: [
      { label: "Bombas de Água", slug: "Bomba+Agua" },
      { label: "Jogos de Juntas", slug: "Junta" },
      { label: "Correias Dentadas", slug: "Correia" },
      { label: "Coxins", slug: "Coxin" },
      { label: "Sensores e Sondas", slug: "Sensor" },
    ],
  },
  {
    label: "Filtros",
    children: [
      { label: "Filtros de Ar", slug: "Filtro+Ar" },
      { label: "Filtros de Combustível", slug: "Filtro+Combustivel" },
      { label: "Filtros de Óleo", slug: "Filtro+Oleo" },
    ],
  },
  {
    label: "Acessórios e Outros",
    children: [
      { label: "Engates de Reboque", slug: "Engate" },
      { label: "Irrigação e Jardim", slug: "Irrigacao" },
    ],
  },
];
