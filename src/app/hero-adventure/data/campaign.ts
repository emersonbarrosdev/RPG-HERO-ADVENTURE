import { CampaignNode } from '../models/campaign.model';

export const CAMPAIGN: CampaignNode[] = [
  {
    id: 'grukhar-border', index: 0, act: 'ATO I', title: 'A Fronteira Verde', region: 'Bosque de Sylvarin', type: 'battle',
    subtitle: 'Os primeiros machados Grukhar cruzaram as raízes sagradas.',
    story: 'O Coração de Aeloria, relíquia que mantém o Véu fechado, foi partido em cinco selos. O primeiro rastro leva ao bosque dos Altos Elfos, onde saqueadores orcs avançam sob estandartes que não pertencem a nenhum clã conhecido.',
    background: 'assets/background-mythical-forest.jpg', goldReward: 22, cardReward: true,
    enemies: [
      { id: 'orc-raider', name: 'Rask', race: 'Orc Grukhar', title: 'Saqueador', sigil: '⚒', maxHp: 34,
        pattern: [
          { type: 'attack', name: 'Machado Serrado', damage: 8 },
          { type: 'defend', name: 'Pele de Ferro', block: 8 },
          { type: 'attack', name: 'Investida', damage: 11 },
        ] },
      { id: 'orc-hunter', name: 'Morga', race: 'Orc Grukhar', title: 'Caçadora', sigil: '✣', maxHp: 27,
        pattern: [
          { type: 'attack', name: 'Azagaia', damage: 6 },
          { type: 'weak', name: 'Grito de Caça', statusValue: 1, statusTurns: 1 },
          { type: 'attack', name: 'Azagaia Dupla', damage: 9 },
        ] },
    ],
    afterVictory: 'Entre os corpos, há uma moeda cinzenta gravada com um eclipse. Alguém está pagando os Grukhar para atacar Sylvarin.',
  },
  {
    id: 'elders-grove', index: 1, act: 'ATO I', title: 'O Conselho das Folhas', region: 'Sylvarin', type: 'event',
    subtitle: 'Os anciões élficos oferecem ajuda — mas nada em Aeloria é gratuito.',
    story: 'A câmara viva de Sylvarin se abre. Os anciões reconhecem a marca do Eclipse Cinzento e oferecem três caminhos antes que você siga para o coração do cerco.',
    background: 'assets/background-mythical-forest.jpg',
    choices: [
      { id: 'heal', label: 'Beber da Fonte Verde', description: 'Recupere 30% da Vida Máxima.', effect: 'heal', value: 30 },
      { id: 'gold', label: 'Aceitar o Tributo Élfico', description: 'Receba 55 de ouro para a campanha.', effect: 'gold', value: 55 },
      { id: 'card', label: 'Aprender a Marca Lunar', description: 'Adicione Marca Lunar ao seu deck.', effect: 'card', cardId: 'lunar-mark' },
    ],
  },
  {
    id: 'roots-ambush', index: 2, act: 'ATO I', title: 'Raízes em Chamas', region: 'Estrada da Árvore-Mãe', type: 'elite',
    subtitle: 'O fogo abriu caminho para uma tropa de choque Grukhar.',
    story: 'Quanto mais perto da Árvore-Mãe, mais organizada parece a invasão. O inimigo não saqueia ao acaso: ele procura alguma coisa enterrada sob as raízes.',
    background: 'assets/background-mythical-forest.jpg', goldReward: 38, cardReward: true,
    enemies: [
      { id: 'orc-berserker', name: 'Drog', race: 'Orc Grukhar', title: 'Berserker', sigil: '☠', maxHp: 52,
        pattern: [
          { type: 'attack', name: 'Corte Brutal', damage: 11 },
          { type: 'attack', name: 'Fúria Crescente', damage: 14 },
          { type: 'defend', name: 'Couro de Guerra', block: 12 },
        ] },
      { id: 'bone-shaman', name: 'Yrr', race: 'Orc Grukhar', title: 'Xamã de Ossos', sigil: '◈', maxHp: 39,
        pattern: [
          { type: 'weak', name: 'Olho do Corvo', statusValue: 1, statusTurns: 2 },
          { type: 'attack', name: 'Estilhaço Rúnico', damage: 8 },
          { type: 'poison', name: 'Fumaça de Osso', damage: 4, statusValue: 3, statusTurns: 3 },
        ] },
    ],
    afterVictory: 'O xamã carrega um mapa para um círculo de raízes antigas. Kargul, campeão dos Grukhar, já está lá.',
  },
  {
    id: 'kargul-boss', index: 3, act: 'ATO I', title: 'Kargul Quebra-Raízes', region: 'Círculo da Árvore-Mãe', type: 'boss',
    subtitle: 'O primeiro selo está preso ao machado do campeão orc.',
    story: 'Kargul não veio conquistar Sylvarin. Veio arrancar o Selo Verde do coração da floresta. Antes do duelo, ele revela que recebeu ordens de um homem chamado Maelkor — o Cinzento.',
    background: 'assets/background-mythical-forest.jpg', goldReward: 80, cardReward: true, relicReward: true,
    enemies: [
      { id: 'kargul', name: 'Kargul', race: 'Orc Grukhar', title: 'Quebra-Raízes', sigil: '♜', maxHp: 126,
        pattern: [
          { type: 'attack', name: 'Machado do Cerco', damage: 13 },
          { type: 'defend', name: 'Pele de Ferro', block: 16 },
          { type: 'attack', name: 'Golpe Demolidor', damage: 20 },
          { type: 'weak', name: 'Rugido Grukhar', statusValue: 1, statusTurns: 2 },
        ] },
    ],
    afterVictory: 'O Selo Verde responde ao toque. Aelwyn reconhece nele a assinatura de uma magia proibida de Nhal’Veyl. Para encontrar Maelkor, vocês precisarão atravessar o território dos elfos sombrios.',
  },
  {
    id: 'moonwell', index: 4, act: 'ATO II', title: 'Poço da Lua', region: 'Fronteira de Nhal’Veyl', type: 'rest',
    subtitle: 'Uma noite de silêncio antes de entrar no reino dos exilados.',
    story: 'O antigo poço ainda reflete duas luas: uma clara, outra negra. Aqui você pode descansar ou fortalecer uma carta antes de seguir.',
    background: 'assets/background.jpg',
  },
  {
    id: 'nhal-sentinels', index: 5, act: 'ATO II', title: 'Os Sentinelas do Véu', region: 'Ruínas de Nhal’Veyl', type: 'battle',
    subtitle: 'Os elfos sombrios não perguntam quem cruza suas fronteiras.',
    story: 'Nhal’Veyl não é uma cidade morta. É uma cidade escondida. Sentinelas emergem das ruínas e atacam antes que qualquer palavra seja dita.',
    background: 'assets/background.jpg', goldReward: 34, cardReward: true,
    enemies: [
      { id: 'dark-sentinel', name: 'Sael', race: 'Elfo Sombrio', title: 'Sentinela', sigil: '◐', maxHp: 46,
        pattern: [
          { type: 'attack', name: 'Lâmina Curva', damage: 9 },
          { type: 'poison', name: 'Agulha de Umbra', damage: 4, statusValue: 3, statusTurns: 3 },
          { type: 'defend', name: 'Manto do Véu', block: 10 },
        ] },
      { id: 'dark-sentinel-2', name: 'Nym', race: 'Elfo Sombrio', title: 'Sentinela', sigil: '◇', maxHp: 43,
        pattern: [
          { type: 'weak', name: 'Olhar do Abismo', statusValue: 1, statusTurns: 2 },
          { type: 'attack', name: 'Passo Sombrio', damage: 10 },
          { type: 'attack', name: 'Corte Reverso', damage: 12 },
        ] },
    ],
    afterVictory: 'Uma voz interrompe a luta antes do golpe final. Veyra Nhal, herdeira do Véu, exige um duelo para decidir se vocês são invasores ou aliados.',
  },
  {
    id: 'veyra-duel', index: 6, act: 'ATO II', title: 'O Julgamento de Veyra', region: 'Salão do Eclipse', type: 'elite',
    subtitle: 'Nem toda batalha termina com um cadáver.',
    story: 'Veyra conhece Maelkor. Foi ele quem prometeu aos exilados um reino além do Véu. Ela não acredita que vocês sejam diferentes dos humanos que os expulsaram — e pretende testar isso com a lâmina.',
    background: 'assets/background.jpg', goldReward: 45, cardReward: true,
    enemies: [
      { id: 'veyra', name: 'Veyra Nhal', race: 'Elfa Sombria', title: 'Lâmina do Véu', sigil: '◐', maxHp: 92,
        pattern: [
          { type: 'poison', name: 'Agulha de Umbra', damage: 5, statusValue: 4, statusTurns: 3 },
          { type: 'attack', name: 'Duas Luas', damage: 13 },
          { type: 'defend', name: 'Passo sem Sombra', block: 14 },
          { type: 'attack', name: 'Corte do Eclipse', damage: 18 },
        ] },
    ],
    afterVictory: 'Veyra abaixa a lâmina. Maelkor não quer libertar Nhal’Veyl: quer usar a guerra entre os povos para reunir os cinco selos. Ela entrega o Selo Lunar e se junta à aliança.',
  },
  {
    id: 'veil-council', index: 7, act: 'ATO II', title: 'Conselho do Véu', region: 'Nhal’Veyl', type: 'event',
    subtitle: 'Altos elfos e elfos sombrios sentam-se à mesma mesa pela primeira vez em gerações.',
    story: 'A verdade sobre Maelkor força antigos inimigos a negociar. Você pode pedir força, conhecimento ou recursos para a marcha final.',
    background: 'assets/background.jpg',
    choices: [
      { id: 'max', label: 'Ritual de Duas Luas', description: '+10 Vida Máxima e cure 10. Custa 40 ouro.', effect: 'maxHp', value: 10, cost: 40 },
      { id: 'gold', label: 'Tesouro dos Exilados', description: 'Receba 75 de ouro.', effect: 'gold', value: 75 },
      { id: 'card', label: 'Segredo de Umbra', description: 'Adicione Pacto de Umbra ao deck. Custa 35 ouro.', effect: 'card', cardId: 'umbra-pact', cost: 35 },
    ],
  },
  {
    id: 'drakmar-warband', index: 8, act: 'ATO III', title: 'A Hoste de Drakmar', region: 'Montanhas Cinzentas', type: 'elite',
    subtitle: 'Maelkor reuniu quem ainda acredita em suas promessas.',
    story: 'Orcs dissidentes, cultistas humanos e xamãs do Véu fecham a passagem para a Cidadela de Cinzas. A batalha será contra um grupo, não um campeão solitário.',
    background: 'assets/background-mythical-forest.jpg', goldReward: 60, cardReward: true,
    enemies: [
      { id: 'war-chief', name: 'Urzog', race: 'Orc Grukhar', title: 'Chefe de Guerra', sigil: '⚒', maxHp: 72,
        pattern: [
          { type: 'attack', name: 'Machado de Drakmar', damage: 13 },
          { type: 'defend', name: 'Totem de Ferro', block: 14 },
          { type: 'attack', name: 'Golpe do Trovão', damage: 17 },
        ] },
      { id: 'veil-cultist', name: 'Sereth', race: 'Elfo Sombrio', title: 'Hierofante Renegado', sigil: '●', maxHp: 61,
        pattern: [
          { type: 'weak', name: 'Névoa Negra', statusValue: 1, statusTurns: 2 },
          { type: 'poison', name: 'Sopro do Véu', damage: 4, statusValue: 5, statusTurns: 3 },
          { type: 'drain', name: 'Eco Cinzento', damage: 9 },
        ] },
      { id: 'grey-knight', name: 'Varos', race: 'Humano', title: 'Cavaleiro Cinzento', sigil: '†', maxHp: 64,
        pattern: [
          { type: 'defend', name: 'Escudo de Cinzas', block: 12 },
          { type: 'attack', name: 'Espada do Eclipse', damage: 12 },
          { type: 'attack', name: 'Perfuração', damage: 15 },
        ] },
    ],
    afterVictory: 'O caminho para a cidadela se abre. Nos documentos de Sereth está a última crueldade do plano: o quinto selo nunca foi roubado. Ele está escondido na relíquia do próprio campeão que iniciou esta jornada.',
  },
  {
    id: 'maelkor-final', index: 9, act: 'ATO III', title: 'O Eclipse Cinzento', region: 'Cidadela de Cinzas', type: 'boss',
    subtitle: 'Maelkor esperou que alguém reunisse os selos por ele.',
    story: 'No coração da cidadela, Maelkor revela o último fragmento oculto na arma ancestral do campeão. A jornada inteira foi uma trilha desenhada para trazer os cinco selos ao mesmo lugar. Mas ele não previu uma coisa: humanos, altos elfos, elfos sombrios e orcs dissidentes chegaram juntos.',
    background: 'assets/background.jpg', goldReward: 100, cardReward: false, relicReward: false,
    enemies: [
      { id: 'maelkor', name: 'Maelkor', race: 'Humano do Véu', title: 'O Cinzento', sigil: '◉', maxHp: 215,
        pattern: [
          { type: 'attack', name: 'Lança de Cinzas', damage: 14 },
          { type: 'weak', name: 'Palavra do Eclipse', statusValue: 1, statusTurns: 2 },
          { type: 'defend', name: 'Muralha do Véu', block: 20 },
          { type: 'drain', name: 'Roubo de Essência', damage: 12 },
          { type: 'poison', name: 'Chuva Cinzenta', damage: 6, statusValue: 5, statusTurns: 3 },
          { type: 'attack', name: 'Eclipse Total', damage: 24 },
        ] },
    ],
    afterVictory: 'O Coração de Aeloria é reunido, mas não retorna ao antigo relicário. Os quatro povos decidem guardar um selo cada um e deixar o quinto em um lugar sem trono. O Véu permanece fechado não por uma arma, mas por um pacto que ninguém controla sozinho.',
  },
];
