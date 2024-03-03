export let ssr = false;

import { writable } from 'svelte/store';
import { writableSync } from '$lib/synced-store.js';

export const getUID = (n) => {
  let id = '';
  for (let i = 0; i < n; i++) {
    id += '0123456789abcdef'[Math.floor(Math.random() * 16)];
  }
  return id;
};

export let players = writableSync([
  {
    id: getUID(8),
    name: 'David',
    color: '#dc2626',
    balance: 200,
    currentBet: 0,
    hasFolded: false,
  },
  {
    id: getUID(8),
    name: 'Sameer',
    color: '#4f56ff',
    balance: 200,
    currentBet: 0,
    hasFolded: false,
  },
]);

export let gameState = writable({
  currentPlayerIdx: 0, // idx of current player
  currentHand: 0, // 0-3: regular, flop, turn, river
  round: 0, // Current round playing
  minimumBet: 0,
  pot: 0, // Stores total bets
  didRoundEnd: false,
  atRoundEnd: false,
  roundWinner: -1,
});

export let blinds = writable(0);
export let raiseValue = writable(0);
export let initBalance = writable(0);
