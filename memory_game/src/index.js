const Card = require('./Card');
const Board = require('./Board');
const Game = require('./Game');

const gameElement = document.querySelector('.game');
const restartBtn = document.querySelector('.restart');
const game = new Game(gameElement,restartBtn);
game.init(8); 
game.timer();




