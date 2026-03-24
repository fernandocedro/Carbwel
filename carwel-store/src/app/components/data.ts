export type MenuItem = {
  label: string;
  children?: { label: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Motor",
    children: [
      { label: "Bobina de Ignição" },
      { label: "Vela de Ignição" },
      { label: "Correia Dentada" },
      { label: "Bomba de Água" },
      { label: "Juntas de Motor" },
    ],
  },
  {
    label: "Filtros",
    children: [
      { label: "Filtro de Combustível" },
      { label: "Filtro de Ar" },
      { label: "Filtro de Óleo" },
      { label: "Filtro de Cabine" },
    ],
  },
  {
    label: "Freios",
    children: [
      { label: "Pastilha de Freio" },
      { label: "Disco de Freio" },
      { label: "Cilindro Mestre" },
      { label: "Fluido de Freio" },
    ],
  },
  {
    label: "Suspensão e Direção",
    children: [
      { label: "Amortecedor" },
      { label: "Bandeja Suspensão" },
      { label: "Pivô de Suspensão" },
      { label: "Terminal de Direção" },
      { label: "Bucha de Barra Estabilizadora" },
    ],
  },
  {
    label: "Câmbio",
    children: [
      { label: "Kit Embreagem" },
      { label: "Cabo de Embreagem" },
      { label: "Tulipa e Trizeta" },
      { label: "Junta Homocinética" },
    ],
  },
];
