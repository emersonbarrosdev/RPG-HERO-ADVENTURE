import { CardDefinition } from '../models/card.model';

export const CARDS: CardDefinition[] = [
  // HUMANOS / GUARDIÕES
  {
    id: 'steel-strike', name: 'Golpe de Aço', subtitle: 'Ataque • Humano', type: 'attack', rarity: 'starter', faction: 'human', cost: 1,
    target: 'enemy', icon: '⚔', description: 'Cause 7 de dano.', upgradedDescription: 'Cause 10 de dano.',
    effects: [{ kind: 'damage', value: 7, upgradedValue: 10 }], rewardFor: ['warden'],
  },
  {
    id: 'iron-guard', name: 'Guarda de Ferro', subtitle: 'Defesa • Humano', type: 'skill', rarity: 'starter', faction: 'human', cost: 1,
    target: 'self', icon: '◆', description: 'Receba 7 de Bloqueio.', upgradedDescription: 'Receba 10 de Bloqueio.',
    effects: [{ kind: 'block', value: 7, upgradedValue: 10 }], rewardFor: ['warden'],
  },
  {
    id: 'shield-bash', name: 'Impacto do Escudo', subtitle: 'Ataque • Humano', type: 'attack', rarity: 'starter', faction: 'human', cost: 1,
    target: 'enemy', icon: '⬟', description: 'Cause 6 de dano e aplique 1 Vulnerável.', upgradedDescription: 'Cause 9 de dano e aplique 2 Vulnerável.',
    effects: [{ kind: 'damage', value: 6, upgradedValue: 9 }, { kind: 'vulnerable', value: 1, upgradedValue: 2, duration: 1, upgradedDuration: 2 }], rewardFor: ['warden'],
  },
  {
    id: 'battle-focus', name: 'Foco de Batalha', subtitle: 'Técnica • Humano', type: 'skill', rarity: 'starter', faction: 'human', cost: 0,
    target: 'self', icon: '✦', description: 'Compre 1 carta. Exaure.', upgradedDescription: 'Compre 2 cartas. Exaure.',
    effects: [{ kind: 'draw', value: 1, upgradedValue: 2 }], exhaust: true, rewardFor: ['warden'],
  },
  {
    id: 'rune-edge', name: 'Fio Rúnico', subtitle: 'Ataque • Humano', type: 'attack', rarity: 'uncommon', faction: 'human', cost: 2,
    target: 'enemy', icon: '†', description: 'Cause 15 de dano.', upgradedDescription: 'Cause 20 de dano.',
    effects: [{ kind: 'damage', value: 15, upgradedValue: 20 }], rewardFor: ['warden'],
  },
  {
    id: 'last-stand', name: 'Último Bastião', subtitle: 'Defesa • Humano', type: 'skill', rarity: 'rare', faction: 'human', cost: 2,
    target: 'self', icon: '♜', description: 'Receba 15 de Bloqueio e 3 Espinhos.', upgradedDescription: 'Receba 20 de Bloqueio e 5 Espinhos.',
    effects: [{ kind: 'block', value: 15, upgradedValue: 20 }, { kind: 'thorns', value: 3, upgradedValue: 5, duration: 2, upgradedDuration: 2 }], rewardFor: ['warden'],
  },
  {
    id: 'warden-cleave', name: 'Corte do Guardião', subtitle: 'Ataque • Humano', type: 'attack', rarity: 'common', faction: 'human', cost: 1,
    target: 'all-enemies', icon: '⌁', description: 'Cause 5 de dano a todos os inimigos.', upgradedDescription: 'Cause 8 de dano a todos os inimigos.',
    effects: [{ kind: 'damage', value: 5, upgradedValue: 8 }], rewardFor: ['warden'],
  },
  {
    id: 'unyielding-wall', name: 'Muralha Inabalável', subtitle: 'Defesa • Humano', type: 'skill', rarity: 'uncommon', faction: 'human', cost: 2,
    target: 'self', icon: '▣', description: 'Receba 18 de Bloqueio.', upgradedDescription: 'Receba 24 de Bloqueio.',
    effects: [{ kind: 'block', value: 18, upgradedValue: 24 }], rewardFor: ['warden'],
  },

  // ALTOS ELFOS
  {
    id: 'moon-arrow', name: 'Flecha Lunar', subtitle: 'Ataque • Alto Elfo', type: 'attack', rarity: 'starter', faction: 'high-elf', cost: 1,
    target: 'enemy', icon: '➶', description: 'Cause 7 de dano.', upgradedDescription: 'Cause 10 de dano.',
    effects: [{ kind: 'damage', value: 7, upgradedValue: 10 }], rewardFor: ['moon-ranger'],
  },
  {
    id: 'forest-step', name: 'Passo Silvestre', subtitle: 'Defesa • Alto Elfo', type: 'skill', rarity: 'starter', faction: 'high-elf', cost: 1,
    target: 'self', icon: '❦', description: 'Receba 6 de Bloqueio e compre 1 carta.', upgradedDescription: 'Receba 9 de Bloqueio e compre 1 carta.',
    effects: [{ kind: 'block', value: 6, upgradedValue: 9 }, { kind: 'draw', value: 1 }], rewardFor: ['moon-ranger'],
  },
  {
    id: 'lunar-mark', name: 'Marca Lunar', subtitle: 'Maldição • Alto Elfo', type: 'skill', rarity: 'starter', faction: 'high-elf', cost: 1,
    target: 'enemy', icon: '☽', description: 'Aplique 2 Vulnerável.', upgradedDescription: 'Aplique 3 Vulnerável.',
    effects: [{ kind: 'vulnerable', value: 2, upgradedValue: 3, duration: 2, upgradedDuration: 3 }], rewardFor: ['moon-ranger'],
  },
  {
    id: 'silver-volley', name: 'Rajada de Prata', subtitle: 'Ataque • Alto Elfo', type: 'attack', rarity: 'uncommon', faction: 'high-elf', cost: 2,
    target: 'enemy', icon: '⋙', description: 'Acerte 3 vezes por 4 de dano.', upgradedDescription: 'Acerte 3 vezes por 6 de dano.',
    effects: [{ kind: 'damage', value: 4, upgradedValue: 6, hits: 3 }], rewardFor: ['moon-ranger'],
  },
  {
    id: 'moon-focus', name: 'Foco da Lua', subtitle: 'Técnica • Alto Elfo', type: 'skill', rarity: 'starter', faction: 'high-elf', cost: 0,
    target: 'self', icon: '◌', description: 'Ganhe 1 Energia. Exaure.', upgradedDescription: 'Ganhe 1 Energia e compre 1 carta. Exaure.',
    effects: [{ kind: 'energy', value: 1 }, { kind: 'draw', value: 0, upgradedValue: 1 }], exhaust: true, rewardFor: ['moon-ranger'],
  },
  {
    id: 'sap-healing', name: 'Seiva Ancestral', subtitle: 'Cura • Alto Elfo', type: 'skill', rarity: 'uncommon', faction: 'high-elf', cost: 2,
    target: 'self', icon: '✚', description: 'Cure 9 de Vida.', upgradedDescription: 'Cure 13 de Vida.',
    effects: [{ kind: 'heal', value: 9, upgradedValue: 13 }], rewardFor: ['moon-ranger'],
  },
  {
    id: 'leaf-storm', name: 'Tempestade de Folhas', subtitle: 'Ataque • Alto Elfo', type: 'attack', rarity: 'rare', faction: 'high-elf', cost: 2,
    target: 'all-enemies', icon: '❧', description: 'Cause 9 de dano a todos e aplique 1 Fraco.', upgradedDescription: 'Cause 12 de dano a todos e aplique 2 Fraco.',
    effects: [{ kind: 'damage', value: 9, upgradedValue: 12 }, { kind: 'weak', value: 1, upgradedValue: 2, duration: 1, upgradedDuration: 2 }], rewardFor: ['moon-ranger'],
  },
  {
    id: 'starfall', name: 'Queda Estelar', subtitle: 'Ataque • Alto Elfo', type: 'attack', rarity: 'legendary', faction: 'high-elf', cost: 3,
    target: 'all-enemies', icon: '✧', description: 'Cause 18 de dano a todos. Exaure.', upgradedDescription: 'Cause 25 de dano a todos. Exaure.',
    effects: [{ kind: 'damage', value: 18, upgradedValue: 25 }], exhaust: true, rewardFor: ['moon-ranger'],
  },

  // ELFOS SOMBRIOS
  {
    id: 'shadow-cut', name: 'Corte Sombrio', subtitle: 'Ataque • Elfo Sombrio', type: 'attack', rarity: 'starter', faction: 'dark-elf', cost: 1,
    target: 'enemy', icon: '☾', description: 'Cause 7 de dano.', upgradedDescription: 'Cause 10 de dano.',
    effects: [{ kind: 'damage', value: 7, upgradedValue: 10 }], rewardFor: ['duskblade'],
  },
  {
    id: 'veil-guard', name: 'Guarda do Véu', subtitle: 'Defesa • Elfo Sombrio', type: 'skill', rarity: 'starter', faction: 'dark-elf', cost: 1,
    target: 'self', icon: '◐', description: 'Receba 7 de Bloqueio.', upgradedDescription: 'Receba 10 de Bloqueio.',
    effects: [{ kind: 'block', value: 7, upgradedValue: 10 }], rewardFor: ['duskblade'],
  },
  {
    id: 'venom-blade', name: 'Lâmina Venenosa', subtitle: 'Ataque • Elfo Sombrio', type: 'attack', rarity: 'starter', faction: 'dark-elf', cost: 1,
    target: 'enemy', icon: '⌁', description: 'Cause 4 de dano e aplique 3 Veneno.', upgradedDescription: 'Cause 6 de dano e aplique 5 Veneno.',
    effects: [{ kind: 'damage', value: 4, upgradedValue: 6 }, { kind: 'poison', value: 3, upgradedValue: 5, duration: 3, upgradedDuration: 3 }], rewardFor: ['duskblade'],
  },
  {
    id: 'blood-rune', name: 'Runa de Sangue', subtitle: 'Ataque • Elfo Sombrio', type: 'attack', rarity: 'starter', faction: 'dark-elf', cost: 1,
    target: 'enemy', icon: '◇', description: 'Cause 5 de dano e aplique 3 Sangramento.', upgradedDescription: 'Cause 7 de dano e aplique 5 Sangramento.',
    effects: [{ kind: 'damage', value: 5, upgradedValue: 7 }, { kind: 'bleed', value: 3, upgradedValue: 5, duration: 2, upgradedDuration: 3 }], rewardFor: ['duskblade'],
  },
  {
    id: 'black-mist', name: 'Névoa Negra', subtitle: 'Maldição • Elfo Sombrio', type: 'skill', rarity: 'uncommon', faction: 'dark-elf', cost: 1,
    target: 'all-enemies', icon: '≋', description: 'Aplique 2 Fraco a todos.', upgradedDescription: 'Aplique 3 Fraco a todos.',
    effects: [{ kind: 'weak', value: 2, upgradedValue: 3, duration: 2, upgradedDuration: 3 }], rewardFor: ['duskblade'],
  },
  {
    id: 'silent-execution', name: 'Execução Silenciosa', subtitle: 'Ataque • Elfo Sombrio', type: 'attack', rarity: 'rare', faction: 'dark-elf', cost: 2,
    target: 'enemy', icon: '‡', description: 'Cause 16 de dano.', upgradedDescription: 'Cause 22 de dano.',
    effects: [{ kind: 'damage', value: 16, upgradedValue: 22 }], rewardFor: ['duskblade'],
  },
  {
    id: 'umbra-pact', name: 'Pacto de Umbra', subtitle: 'Técnica • Elfo Sombrio', type: 'skill', rarity: 'rare', faction: 'dark-elf', cost: 0,
    target: 'self', icon: '◉', description: 'Ganhe 1 Energia e compre 1 carta. Exaure.', upgradedDescription: 'Ganhe 2 Energia e compre 1 carta. Exaure.',
    effects: [{ kind: 'energy', value: 1, upgradedValue: 2 }, { kind: 'draw', value: 1 }], exhaust: true, rewardFor: ['duskblade'],
  },
  {
    id: 'eclipse-poison', name: 'Eclipse Venenoso', subtitle: 'Maldição • Elfo Sombrio', type: 'skill', rarity: 'legendary', faction: 'dark-elf', cost: 2,
    target: 'all-enemies', icon: '●', description: 'Aplique 5 Veneno a todos.', upgradedDescription: 'Aplique 8 Veneno a todos.',
    effects: [{ kind: 'poison', value: 5, upgradedValue: 8, duration: 4, upgradedDuration: 4 }], rewardFor: ['duskblade'],
  },

  // ORCS / CARTAS DESBLOQUEADAS NA CAMPANHA
  {
    id: 'grukhar-axe', name: 'Machado Grukhar', subtitle: 'Ataque • Orc', type: 'attack', rarity: 'common', faction: 'orc', cost: 1,
    target: 'enemy', icon: '⚒', description: 'Cause 9 de dano.', upgradedDescription: 'Cause 12 de dano.',
    effects: [{ kind: 'damage', value: 9, upgradedValue: 12 }], unlockAfterNode: 3,
  },
  {
    id: 'war-roar', name: 'Rugido de Guerra', subtitle: 'Técnica • Orc', type: 'skill', rarity: 'uncommon', faction: 'orc', cost: 1,
    target: 'all-enemies', icon: '❢', description: 'Aplique 1 Fraco a todos e compre 1 carta.', upgradedDescription: 'Aplique 2 Fraco a todos e compre 1 carta.',
    effects: [{ kind: 'weak', value: 1, upgradedValue: 2, duration: 1, upgradedDuration: 2 }, { kind: 'draw', value: 1 }], unlockAfterNode: 3,
  },
  {
    id: 'bone-armor', name: 'Armadura de Osso', subtitle: 'Defesa • Orc', type: 'skill', rarity: 'uncommon', faction: 'orc', cost: 1,
    target: 'self', icon: '⬢', description: 'Receba 11 de Bloqueio.', upgradedDescription: 'Receba 15 de Bloqueio.',
    effects: [{ kind: 'block', value: 11, upgradedValue: 15 }], unlockAfterNode: 3,
  },
  {
    id: 'double-axe', name: 'Machados Gêmeos', subtitle: 'Ataque • Orc', type: 'attack', rarity: 'rare', faction: 'orc', cost: 2,
    target: 'enemy', icon: '⚔', description: 'Acerte 2 vezes por 8 de dano.', upgradedDescription: 'Acerte 2 vezes por 11 de dano.',
    effects: [{ kind: 'damage', value: 8, upgradedValue: 11, hits: 2 }], unlockAfterNode: 3,
  },

  // NEUTRAS / RELÍQUIAS DE AELORIA
  {
    id: 'aeloria-spark', name: 'Centelha de Aeloria', subtitle: 'Técnica • Neutra', type: 'skill', rarity: 'common', faction: 'neutral', cost: 0,
    target: 'self', icon: '✧', description: 'Compre 1 carta.', upgradedDescription: 'Compre 2 cartas.',
    effects: [{ kind: 'draw', value: 1, upgradedValue: 2 }],
  },
  {
    id: 'warding-rune', name: 'Runa de Proteção', subtitle: 'Defesa • Neutra', type: 'skill', rarity: 'common', faction: 'neutral', cost: 1,
    target: 'self', icon: '✥', description: 'Receba 8 de Bloqueio.', upgradedDescription: 'Receba 12 de Bloqueio.',
    effects: [{ kind: 'block', value: 8, upgradedValue: 12 }],
  },
  {
    id: 'restoration', name: 'Restauração', subtitle: 'Cura • Neutra', type: 'skill', rarity: 'uncommon', faction: 'neutral', cost: 1,
    target: 'self', icon: '✚', description: 'Cure 6 de Vida.', upgradedDescription: 'Cure 9 de Vida.',
    effects: [{ kind: 'heal', value: 6, upgradedValue: 9 }],
  },
  {
    id: 'chain-of-aster', name: 'Corrente de Aster', subtitle: 'Ataque • Neutra', type: 'attack', rarity: 'rare', faction: 'neutral', cost: 2,
    target: 'all-enemies', icon: '⌘', description: 'Cause 11 de dano a todos.', upgradedDescription: 'Cause 15 de dano a todos.',
    effects: [{ kind: 'damage', value: 11, upgradedValue: 15 }], unlockAfterNode: 6,
  },
  {
    id: 'veil-breaker', name: 'Ruptura do Véu', subtitle: 'Ataque • Neutra', type: 'attack', rarity: 'legendary', faction: 'neutral', cost: 3,
    target: 'enemy', icon: '✹', description: 'Cause 28 de dano. Exaure.', upgradedDescription: 'Cause 38 de dano. Exaure.',
    effects: [{ kind: 'damage', value: 28, upgradedValue: 38 }], exhaust: true, unlockAfterNode: 8,
  },
];
