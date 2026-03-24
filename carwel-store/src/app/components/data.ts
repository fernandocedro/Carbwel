export type MenuItem = {
  label: string;
  href?: string;
  children?: { label: string; href?: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Motor",
    children: [
      { label: "Bobinas de ignição para veículos" },
      { label: "Cabos de vela para veículos" },
      { label: "Bombas de água para veículos" },
      { label: "Bombas de combustível para veículos" },
      { label: "Correias dentadas para veículos" },
      { label: "Injetores de combustível para veículos" },
      { label: "Jogos de anéis de pistão para veículos" },
      { label: "Kits de distribuição para veículos" },
      { label: "Polias tensionadoras de correia do motor para veículos" },
      { label: "Coxins de motor para carros e caminhonetes" },
      { label: "Sondas lambda para veículos" },
      { label: "Carburadores para veículos" },
    ],
  },
  {
    label: "Suspensão e Direção",
    children: [
      { label: "Pivôs de suspensão para carros e caminhonetes" },
      { label: "Bieletas para carros e caminhonetes" },
      { label: "Cubos de roda para carros e caminhonetes" },
      { label: "Rolamentos de rodas para veículos" },
      { label: "Terminais ponteiras de direção para veículos" },
    ],
  },
  {
    label: "Câmbio e Embreagem",
    children: [
      { label: "Kits de embreagem para veículos" },
      { label: "Cilindros escravos de embreagem para veículos" },
      { label: "Coxins de caixa de marchas para veículos" },
    ],
  },
  {
    label: "Filtros",
    children: [
      { label: "Filtros de ar para veículos" },
      { label: "Filtros de combustível para veículos" },
      { label: "Filtros de óleo para veículos" },
      { label: "Filtros de cabine para veículos" },
    ],
  },
  {
    label: "Freios",
    children: [
      { label: "Pastilhas de freio para carros e caminhonetes" },
    ],
  },
  {
    label: "Acessórios e Casa",
    children: [
      { label: "Engates completos de reboques para veículos" },
      { label: "Engates receptor de reboque para veículos" },
      { label: "Bolas de engate de reboques para veículos" },
      { label: "Adaptadores para mangueiras" },
      { label: "Pistolas de irrigação para jardim" },
    ],
  },
];
