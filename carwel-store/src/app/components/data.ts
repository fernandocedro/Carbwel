export type MenuItem = {
  label: string;
  categoryId?: string;
  href?: string;
  children?: { label: string; categoryId: string; href?: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Motor",
    children: [
      { label: "Bobinas de Ignição", categoryId: "MLB22668" },
      { label: "Jogos de Anéis de Pistão", categoryId: "MLB193961" },
      { label: "Bombas de Água", categoryId: "MLB193952" },
      { label: "Bombas de Combustível", categoryId: "MLB193965" },
      { label: "Correias Dentadas", categoryId: "MLB193945" },
      { label: "Cabos de Vela", categoryId: "MLB193956" },
      { label: "Injetores de Combustível", categoryId: "MLB193962" },
      { label: "Kits de Distribuição", categoryId: "MLB193950" },
      { label: "Polias e Tensores", categoryId: "MLB193953" },
      { label: "Coxins de Motor", categoryId: "MLB193946" },
      { label: "Sondas Lambda", categoryId: "MLB193980" },
      { label: "Carburadores", categoryId: "MLB193958" },
    ],
  },
  {
    label: "Suspensão e Direção",
    children: [
      { label: "Pivôs de Suspensão", categoryId: "MLB193895" },
      { label: "Bieletas", categoryId: "MLB193893" },
      { label: "Cubos de Roda", categoryId: "MLB193922" },
      { label: "Rolamentos de Rodas", categoryId: "MLB193925" },
      { label: "Terminais de Direção", categoryId: "MLB193910" },
    ],
  },
  {
    label: "Câmbio e Embreagem",
    children: [
      { label: "Kits de Embreagem", categoryId: "MLB193836" },
      { label: "Cilindros de Embreagem", categoryId: "MLB193835" },
      { label: "Coxins de Câmbio", categoryId: "MLB193822" },
    ],
  },
  {
    label: "Filtros",
    children: [
      { label: "Filtros de Ar", categoryId: "MLB193933" },
      { label: "Filtros de Combustível", categoryId: "MLB193967" },
      { label: "Filtros de Óleo", categoryId: "MLB193969" },
      { label: "Filtros de Cabine", categoryId: "MLB193935" },
    ],
  },
  {
    label: "Freios",
    children: [
      { label: "Pastilhas de Freio", categoryId: "MLB193911" },
    ],
  },
  {
    label: "Acessórios",
    children: [
      { label: "Engates de Reboque", categoryId: "MLB194165" },
      { label: "Bolas de Engate", categoryId: "MLB194166" },
      { label: "Irrigação e Jardim", categoryId: "MLB191834" },
    ],
  },
];
