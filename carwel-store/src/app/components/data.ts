export type MenuItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Motor",
    children: [
      { label: "Óleo e Lubrificantes", href: "/motor/oleos" },
      { label: "Filtros", href: "/motor/filtros" },
      { label: "Correias", href: "/motor/correias" },
      { label: "Velas", href: "/motor/velas" },
    ],
  },
  {
    label: "Câmbio",
    children: [
      { label: "Embreagem", href: "/cambio/embreagem" },
      { label: "Óleo de câmbio", href: "/cambio/oleo" },
      { label: "Semi-eixos", href: "/cambio/semi-eixos" },
    ],
  },
  {
    label: "Freios",
    children: [
      { label: "Pastilhas", href: "/freios/pastilhas" },
      { label: "Discos", href: "/freios/discos" },
      { label: "Fluido de freio", href: "/freios/fluidos" },
    ],
  },
  {
    label: "Suspensão/Direção",
    children: [
      { label: "Amortecedores", href: "/suspensao/amortecedores" },
      { label: "Buchas", href: "/suspensao/buchas" },
      { label: "Terminais", href: "/direcao/terminais" },
    ],
  },
];
