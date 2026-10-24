import { RelicDefinition } from '../models/relic.model';

export const RELICS: RelicDefinition[] = [
  { id: 'oak-heart', name: 'Coração de Carvalho', origin: 'Sylvarin', description: '+14 Vida Máxima e cure 14.', effect: 'maxHp', value: 14, icon: '❦' },
  { id: 'ember-crown', name: 'Coroa de Brasa', origin: 'Grukhar', description: '+1 Energia máxima em combate.', effect: 'energy', value: 1, icon: '♛' },
  { id: 'moon-quiver', name: 'Aljava Lunar', origin: 'Altos Elfos', description: 'Compre +1 carta no início de cada turno.', effect: 'draw', value: 1, icon: '☽' },
  { id: 'greywatch-sigil', name: 'Selo de Greywatch', origin: 'Valedorn', description: 'Cartas de Bloqueio recebem +2.', effect: 'blockBonus', value: 2, icon: '✥' },
  { id: 'umbra-vial', name: 'Frasco de Umbra', origin: 'Nhal’Veyl', description: 'Sempre que aplicar Veneno, aplique +1.', effect: 'poisonBonus', value: 1, icon: '◐' },
  { id: 'bone-charm', name: 'Talismã de Osso', origin: 'Clã Grukhar', description: 'Comece cada combate com 8 de Bloqueio.', effect: 'openingBlock', value: 8, icon: '⬢' },
  { id: 'aeloria-core', name: 'Fragmento do Coração', origin: 'Aeloria', description: '+18 Vida Máxima e cure 18.', effect: 'maxHp', value: 18, icon: '✧' },
  { id: 'black-moon', name: 'Lua Negra', origin: 'Santuário de Aster-Nhal', description: 'Compre +1 carta por turno.', effect: 'draw', value: 1, icon: '●' },
];
