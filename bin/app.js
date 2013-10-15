'use strict';

var program = require('commander');
var blessed = require('blessed');
var fs = require('fs');
var path = require('path');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Game = require(lib + '/game.js');
var Board = require(lib + '/board.js');
var StringRenderer = require(lib + '/string_renderer');

program
	.version('0.0.0')
	.option('-w, --width <width>', 
		'specify the width of the grid', parseInt, 20)
	.option('-h, --height <height>', 
		'specify the height of the grid', parseInt, 10)
	.option('-c, --config <path>', 'specify the config file to read from')
	.parse(process.argv);

var board = new Board(program.width, program.height);
board.setCell(1, 0, true);
board.setCell(1, 1, true);
board.setCell(1, 2, true);
var game = new Game(board);
var boardRenderer = new StringRenderer();

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  content: '{bold}Loading...{/bold}',
  tags: true,
  style: {
    fg: 'white',
    bg: 'black'
  }
});

box.setContent(boardRenderer.render(board));

// Append our box to the screen.
screen.append(box);

screen.key(['space', 'enter'], function(ch, key) {
	game.tick();
	box.setContent(boardRenderer.render(game.board));
	screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();