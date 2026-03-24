export type MenuItem = {
  label: string;
  children?: { label: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Motor",
    children: [
      { label: "Bobina Ignicao" },
      { label: "Vela Ignicao" },
      { label: "Correia Dentada" },
      { label: "Bomba Agua" },
      { label: "Junta Motor" },
    ],
  },
  {
    label: "Filtros",
    children: [
      { label: "Filtro Combustivel" },
      { label: "Filtro Ar" },
      { label: "Filtro Oleo" },
      { label: "Filtro Cabine" },
    ],
  },
  {
    label: "Freios",
    children: [
      { label: "Pastilha Freio" },
      { label: "Disco Freio" },
      { label: "Cilindro Mestre" },
      { label: "Fluido Freio" },
    ],
  },
  {
    label: "Suspensão",
    children: [
      { label: "Amortecedor" },
      { label: "Bandeja Suspensao" },
      { label: "Pivo" },
      { label: "Terminal Direcao" },
      { label: "Bucha Barra" },
    ],
  },
  {
    label: "Câmbio",
    children: [
      { label: "Kit Embreagem" },
      { label: "Cabo Embreagem" },
      { label: "Tulipa Trizeta" },
      { label: "Junta Homocinetica" },
    ],
  },
];
