export type MenuItem = {
  label: string;
  children?: { label: string }[];
};

export const menu: MenuItem[] = [
  {
    label: "Motor",
    children: [
      { label: "Anel de Pistao" },
      { label: "Anti Chama" },
      { label: "Bomba de Oleo" },
      { label: "Bronzina" },
      { label: "Carter" },
      { label: "Comando de Valvula" },
      { label: "Correia" },
      { label: "Coxim de Motor" },
      { label: "Filtro de Oleo" },
      { label: "Flange" },
      { label: "Interruptor" },
      { label: "Junta de Motor" },
      { label: "Kit Distribuicao" },
      { label: "Pistao" },
      { label: "Retentor" },
      { label: "Rolamento" },
      { label: "Tucho" },
      { label: "Valvula" },
    ],
  },
  {
    label: "Cambio",
    children: [
      { label: "Atuador" },
      { label: "Cabo de Cambio" },
      { label: "Cilindro de Embreagem" },
      { label: "Coifa" },
      { label: "Coxim de Cambio" },
      { label: "Cruzeta" },
      { label: "Disco de Embreagem" },
      { label: "Homocinetica" },
      { label: "Kit Embreagem" },
      { label: "Semi Eixo" },
      { label: "Tulipa e Trizeta" },
    ],
  },
  {
    label: "Freios",
    children: [
      { label: "Cilindro de Freio" },
      { label: "Disco de Freio" },
      { label: "Pastilha de Freio" },
      { label: "Patin de Freio" },
      { label: "Sensor de Freio" },
      { label: "Servo Freio" },
      { label: "Tambor de Freio" },
    ],
  },
  {
    label: "Suspensao e Direcao",
    children: [
      { label: "Amortecedor" },
      { label: "Articulacao" },
      { label: "Bandeja" },
      { label: "Barra Estabilizadora" },
      { label: "Bieleta" },
      { label: "Braco" },
      { label: "Bucha" },
      { label: "Cubo de Roda" },
      { label: "Mola" },
      { label: "Pivo" },
      { label: "Terminal de Direcao" },
    ],
  },
  {
    label: "Injecao e Ignicao",
    children: [
      { label: "Bico Injetor" },
      { label: "Bobina de Ignicao" },
      { label: "Bomba de Combustivel" },
      { label: "Cabo de Vela" },
      { label: "Carburador" },
      { label: "Regulador de Pressao" },
      { label: "Sensor" },
      { label: "Sonda Lambda" },
    ],
  },
  {
    label: "Arrefecimento",
    children: [
      { label: "Bomba de Agua" },
      { label: "Mangueira" },
      { label: "Radiador" },
      { label: "Reservatorio" },
      { label: "Valvula Termostatica" },
    ],
  },
  {
    label: "Eletrica",
    children: [
      { label: "Alternador" },
      { label: "Motor de Partida" },
      { label: "Rele" },
      { label: "Chave de Seta" },
      { label: "Chicote" },
    ],
  },
];
