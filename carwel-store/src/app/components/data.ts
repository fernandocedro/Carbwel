export type MenuItem = {
  label: string;
  slug?: string;
  href?: string;
  children?: { label: string; slug: string; href?: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Motor e Carburação",
    children: [
      { label: "Carburadores", slug: "Carburador" },
      { label: "Kits de Reparo", slug: "Kit+Reparo" },
      { label: "Bombas de Combustível", slug: "Bomba+Combustivel" },
      { label: "Bombas de Água", slug: "Bomba+Agua" },
      { label: "Bobinas de Ignição", slug: "Bobina" },
      { label: "Cabos de Vela", slug: "Cabo+Vela" },
      { label: "Injetores", slug: "Injetor" },
      { label: "Juntas", slug: "Junta" },
      { label: "Giclês", slug: "Gicle" },
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
    label: "Suspensão e Direção",
    children: [
      { label: "Pivôs", slug: "Pivo" },
      { label: "Bieletas", slug: "Bieleta" },
      { label: "Terminais de Direção", slug: "Terminal+Direcao" },
      { label: "Rolamentos", slug: "Rolamento" },
    ],
  },
  {
    label: "Acessórios",
    children: [
      { label: "Engates de Reboque", slug: "Engate" },
      { label: "Irrigação e Jardim", slug: "Irrigacao" },
    ],
  },
];
