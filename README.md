# Eclipse of Aeloria — Card RPG v3.1

RPG de cartas / deckbuilder medieval em Angular 16.

## Regra principal do combate

O combate agora deixa sempre claro **quem está agindo e o que fazer**:

1. Sua rodada começa com uma mão nova e a Energia volta ao máximo.
2. Clique em cartas para jogá-las enquanto tiver Energia.
3. Se houver apenas 1 inimigo vivo, ataques usam esse alvo automaticamente.
4. Se houver vários inimigos, uma carta de ataque pede que você clique em um inimigo destacado.
5. Pressione `ESC` ou clique em **Cancelar alvo** para cancelar uma seleção.
6. Quando terminar, clique em **Encerrar turno** / **Passar a vez**.
7. A fase inimiga aparece na tela e cada inimigo resolve sua intenção separadamente.
8. Você não precisa clicar durante a vez dos inimigos.
9. Quando todos terminarem, a nova mão é comprada automaticamente.

## Correções da v3.1

- Corrigida a sensação de travamento ao encerrar turno.
- A fase inimiga não é mais resolvida instantaneamente: cada inimigo age visivelmente.
- Recarregar a página durante a fase inimiga continua o combate automaticamente.
- Ataques contra um único inimigo não exigem clique de alvo desnecessário.
- Seleção de alvo agora possui instrução persistente e botão de cancelar.
- `ESC` cancela alvo/deck aberto.
- Cartas sem Energia mostram **SEM ENERGIA** e, ao clicar, explicam o motivo.
- Botão de fim de turno permanece acima das cartas e não pode ficar bloqueado por hover/seleção.
- Barra inferior mantém a mesma altura durante jogador/inimigos, evitando saltos no layout.
- Tutorial inicial refeito em quatro passos.
- Home corrigida para caber em `100dvh` sem cortar a Crônica.
- Combate continua sem scroll de página.

## Estrutura do jogo

- Deck inicial de 12 cartas.
- Mão de 6 cartas.
- 3 de Energia base.
- Pilha de compra, descarte e exílio.
- Combates com múltiplos inimigos.
- Intenções inimigas visíveis.
- Veneno, Sangramento, Fraco, Vulnerável e Espinhos.
- Ealdred, Aelwyn e Veyra Nhal como campeões.
- Escolha de cartas após combates.
- Relíquias de chefe.
- Eventos, descanso e upgrade de cartas.
- Autosave em `localStorage`.

## Rodar

```bash
npm install
npm start
```

Abra:

```text
http://localhost:4200
```

Phaser **não é usado** nesta versão.
