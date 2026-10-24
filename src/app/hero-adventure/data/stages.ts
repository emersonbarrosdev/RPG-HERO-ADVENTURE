import { EnemyMoveType } from '../models/battle.model';

export interface EnemyMoveDefinition {
  type: EnemyMoveType;
  name: string;
  multiplier?: number;
  value?: number;
  statusPotency?: number;
}

export interface StageDefinition {
  id: string;
  chapter: string;
  title: string;
  region: string;
  subtitle: string;
  story: string;
  objective: string;
  background: string;
  theme: 'forest' | 'ruins' | 'mountain' | 'moon' | 'citadel';
  dialogue: { speaker: string; text: string }[];
  afterVictory: string;
  unlockCardId?: string;
  rewardRelicIds: string[];
  enemy: {
    name: string;
    title: string;
    faction: string;
    hp: number;
    attack: number;
    defense: number;
    xp: number;
    pattern: EnemyMoveDefinition[];
  };
}

export const STAGES: StageDefinition[] = [
  {
    id: 'roots-of-war', chapter: 'Capítulo I', title: 'Raízes da Guerra', region: 'Bosque de Sylvarin',
    subtitle: 'Uma floresta élfica sitiada por machados orcs.',
    story: 'Há quatro séculos, o Coração de Aeloria mantém fechado o Véu — a fronteira entre o mundo dos vivos e o Reino Cinzento. Na Noite do Tratado, o relicário foi quebrado e seus cinco selos desapareceram. Ealdred, último Guardião de Greywatch, segue o primeiro fragmento até Sylvarin, onde os clãs Grukhar queimam as árvores sagradas.',
    objective: 'Rompa o cerco Grukhar e encontre o primeiro selo.',
    background: 'assets/background-mythical-forest.jpg', theme: 'forest',
    dialogue: [
      { speaker: 'Aelwyn', text: 'Se a Árvore-Mãe cair, o bosque inteiro morre com ela.' },
      { speaker: 'Kargul', text: 'O humano trouxe uma espada. Ótimo. Eu precisava de outra para minha coleção.' },
      { speaker: 'Ealdred', text: 'Então venha buscá-la.' },
    ],
    afterVictory: 'Com Kargul derrotado, Aelwyn encontra o Selo Verde entre os despojos. Ela decide acompanhar Ealdred: os orcs não agiam sozinhos.',
    unlockCardId: 'aelwyn-arrow', rewardRelicIds: ['oak-heart', 'moon-rune', 'warden-sigil'],
    enemy: { name: 'Kargul Quebra-Raízes', title: 'Campeão Orc', faction: 'Clã Grukhar', hp: 118, attack: 18, defense: 4, xp: 70,
      pattern: [
        { type: 'attack', name: 'Machado Curto', multiplier: 1 },
        { type: 'guard', name: 'Pele de Ferro', value: 16 },
        { type: 'heavy', name: 'Machado Demolidor', multiplier: 1.55 },
      ] },
  },
  {
    id: 'veil-ruins', chapter: 'Capítulo II', title: 'As Ruínas do Véu', region: 'Nhal’Veyl',
    subtitle: 'Sob a pedra quebrada, os elfos sombrios ainda escutam a noite.',
    story: 'As marcas encontradas em Kargul levam às ruínas de Nhal’Veyl, antiga cidade dos elfos sombrios. A história de Valedorn os chama de traidores; a história deles diz que foram abandonados. Entre colunas partidas, Ealdred encontra Veyra Nhal — assassina, herdeira e guardiã do segundo selo.',
    objective: 'Descubra quem está manipulando Nhal’Veyl e sobreviva a Veyra.',
    background: 'assets/background.jpg', theme: 'ruins',
    dialogue: [
      { speaker: 'Veyra', text: 'Vocês nos enterraram aqui e chamaram isso de paz.' },
      { speaker: 'Aelwyn', text: 'Não viemos repetir a guerra antiga.' },
      { speaker: 'Ealdred', text: 'Então nos diga quem quer abrir o Véu.' },
    ],
    afterVictory: 'Veyra poderia continuar lutando, mas baixa a lâmina. O verdadeiro inimigo é Maelkor, antigo conselheiro de Valedorn, que prometeu aos exilados um novo reino. Ela entrega o Selo Lunar — e uma arma proibida.',
    unlockCardId: 'veil-blade', rewardRelicIds: ['blackglass', 'red-vial', 'moon-rune'],
    enemy: { name: 'Veyra Nhal', title: 'Lâmina do Crepúsculo', faction: 'Elfos Sombrios', hp: 148, attack: 21, defense: 7, xp: 100,
      pattern: [
        { type: 'poison', name: 'Agulha de Umbra', multiplier: 0.72, statusPotency: 5 },
        { type: 'attack', name: 'Duas Luas', multiplier: 1.08 },
        { type: 'heavy', name: 'Passo Sem Sombra', multiplier: 1.48 },
      ] },
  },
  {
    id: 'drakmar-pass', chapter: 'Capítulo III', title: 'O Passo de Drakmar', region: 'Montanhas Cinzentas',
    subtitle: 'Onde o frio preserva ossos e juramentos.',
    story: 'Maelkor enviou o terceiro selo ao norte, para os xamãs Grukhar. Ealdred e Aelwyn atravessam Drakmar sob uma tempestade que não é natural. No alto do desfiladeiro, Urzog fala com vozes que vêm do outro lado do Véu.',
    objective: 'Quebre o ritual de Urzog antes que a passagem seja tomada pela Umbra.',
    background: 'assets/background-mythical-forest.jpg', theme: 'mountain',
    dialogue: [
      { speaker: 'Urzog', text: 'O Cinzento nos mostrou um mundo onde os orcs nunca mais se ajoelham.' },
      { speaker: 'Ealdred', text: 'Ele mostrou o mundo que quer usar para devorar vocês.' },
      { speaker: 'Urzog', text: 'Então prove isso com sangue.' },
    ],
    afterVictory: 'O Selo de Pedra interrompe a tempestade. Entre as runas do ritual, Aelwyn descobre o destino dos dois últimos fragmentos: o Santuário da Lua Negra e a Cidadela de Cinzas.',
    rewardRelicIds: ['orc-talisman', 'oak-heart', 'red-vial'],
    enemy: { name: 'Urzog Voz-da-Pedra', title: 'Xamã de Guerra', faction: 'Clã Grukhar', hp: 182, attack: 24, defense: 9, xp: 125,
      pattern: [
        { type: 'guard', name: 'Totem de Osso', value: 24 },
        { type: 'attack', name: 'Cajado de Guerra', multiplier: 1.05 },
        { type: 'drain', name: 'Eco do Véu', multiplier: 0.9 },
        { type: 'heavy', name: 'Trovão de Drakmar', multiplier: 1.62 },
      ] },
  },
  {
    id: 'black-moon', chapter: 'Capítulo IV', title: 'A Lua Negra', region: 'Santuário de Aster-Nhal',
    subtitle: 'A verdade sobre a guerra antiga repousa sob a lua sem luz.',
    story: 'O quarto selo permanece em um templo que pertenceu aos dois povos élficos antes da divisão. Sereth, sacerdote de Nhal’Veyl, tenta fundir o fragmento à Umbra. Ali, Ealdred descobre que Maelkor provocou o ataque que separou elfos e elfos sombrios décadas antes — a guerra sempre foi parte do plano.',
    objective: 'Impeça Sereth de corromper o quarto selo.',
    background: 'assets/background.jpg', theme: 'moon',
    dialogue: [
      { speaker: 'Sereth', text: 'A verdade chegou tarde demais. O ódio já fez o trabalho por nós.' },
      { speaker: 'Aelwyn', text: 'Então nós o desfaremos.' },
      { speaker: 'Sereth', text: 'Vocês ainda acreditam que existe um “nós”. Que belo erro.' },
    ],
    afterVictory: 'O Selo Sombrio é purificado. Veyra reaparece com sobreviventes de Nhal’Veyl e abre o caminho para a cidadela. Pela primeira vez em gerações, elfos da luz e da sombra marcham para o mesmo lado.',
    rewardRelicIds: ['blackglass', 'warden-sigil', 'orc-talisman'],
    enemy: { name: 'Sereth Nhal', title: 'Hierofante da Lua Negra', faction: 'Culto do Véu', hp: 216, attack: 27, defense: 11, xp: 155,
      pattern: [
        { type: 'poison', name: 'Névoa Negra', multiplier: 0.7, statusPotency: 7 },
        { type: 'guard', name: 'Manto do Vazio', value: 30 },
        { type: 'drain', name: 'Liturgia Sombria', multiplier: 1.0 },
        { type: 'heavy', name: 'Eclipse', multiplier: 1.72 },
      ] },
  },
  {
    id: 'ashen-citadel', chapter: 'Capítulo V', title: 'A Cidadela de Cinzas', region: 'Greywatch',
    subtitle: 'A última fortaleza era o primeiro destino desde o início.',
    story: 'Maelkor retorna a Greywatch, lugar onde Ealdred jurou proteger o relicário. Com quatro selos reunidos, o Guardião entende a armadilha: o quinto fragmento nunca foi roubado. Ele estava escondido em sua própria espada. Maelkor precisava apenas que Ealdred trouxesse todos os outros até ele.',
    objective: 'Derrote Maelkor antes que o Eclipse abra o Véu para sempre.',
    background: 'assets/background.jpg', theme: 'citadel',
    dialogue: [
      { speaker: 'Maelkor', text: 'Você atravessou reinos para me entregar exatamente o que eu precisava.' },
      { speaker: 'Ealdred', text: 'Não. Eu trouxe todos que você tentou dividir.' },
      { speaker: 'Aelwyn', text: 'E desta vez você enfrenta mais do que um Guardião.' },
    ],
    afterVictory: 'A Coroa de Cinzas se parte. O Véu se fecha não pela força de um único reino, mas pelos cinco selos reunidos e pelas alianças que Maelkor não conseguiu destruir. Aeloria sobrevive — diferente, ferida e finalmente capaz de escrever outra história.',
    rewardRelicIds: ['aeloria-heart', 'dawn-edge', 'eclipse-eye'],
    enemy: { name: 'Maelkor, o Cinzento', title: 'Senhor da Coroa de Cinzas', faction: 'Domínio Cinzento', hp: 280, attack: 31, defense: 14, xp: 250,
      pattern: [
        { type: 'attack', name: 'Lâmina Cinzenta', multiplier: 1.05 },
        { type: 'drain', name: 'Marca do Véu', multiplier: 1.05 },
        { type: 'guard', name: 'Coroa de Cinzas', value: 38 },
        { type: 'heavy', name: 'Queda de Aeloria', multiplier: 1.88 },
      ] },
  },
];
