/*
 * Color palette: http://paletton.com/#uid=33g0u0krPrxh6ySlZtltwlLzxgR
 */

// Game parameters
var DEBUG = false;
var cell_size = 50;
var block_size = 3 * cell_size;

// Colors
var cell_border = "#00534C";
var cell_number = "#086B63";
var cell_number_locked = "#00534C";
var cell_number_selected = "#865800";
var cell_number_colliding = "#840007";
var cell_fill = "#2D9088";
var cell_fill_selected = "#DB9A1D";
var cell_fill_colliding = "#D81C25";
var thick_lines = "#00534C";

// Global variables
var selection = 0;
//var board;
var game = {board: 'undefined', locked: 'undefined'};
var ctx;
var boxes = [[  0,  1,  2,  9, 10, 11, 18, 19, 20],
             [  3,  4,  5, 12, 13, 14, 21, 22, 23],
             [  6,  7,  8, 15, 16, 17, 24, 25, 26],
             [ 27, 28, 29, 36, 37, 38, 45, 46, 47],
             [ 30, 31, 32, 39, 40, 41, 48, 49, 50],
             [ 33, 34, 35, 42, 43, 44, 51, 52, 53],
             [ 54, 55, 56, 63, 64, 65, 72, 73, 74],
             [ 57, 58, 59, 66, 67, 68, 75, 76, 77],
             [ 60, 61, 62, 69, 70, 71, 78, 79, 80]];

var main = function() {
    var canvas = document.getElementById("sudoku");
    ctx = canvas.getContext("2d");
    var solved = false;
    while(!solved) {
        createEmptyBoard(game);
        solved = generateSolution(game);
    }
    digHoles(game);
    drawBoard(ctx, 0, 0, game);
    canvas.setAttribute("tabindex", "0");
    canvas.addEventListener("keydown", function(e) {
        processKeys(e, game);
    });
    canvas.focus();
}

var drawCell = function(ctx, x, y, n, selected, colliding, locked) {
    ctx.lineWidth = 1;
    if(selected) {
        ctx.fillStyle = cell_fill_selected;
    } else if(colliding && locked) {
        ctx.fillStyle = cell_fill;
    } else if(colliding) {
        ctx.fillStyle = cell_fill_colliding;
    } else {
        ctx.fillStyle = cell_fill;
    }
    ctx.strokeStyle = cell_border;
    ctx.fillRect(x, y, cell_size, cell_size);
    ctx.strokeRect(x, y, cell_size, cell_size);
    ctx.font = "bold " + cell_size * 0.8 + "px sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    if(colliding) {
        ctx.fillStyle = cell_number_colliding;
    } else if(selected) {
        ctx.fillStyle = cell_number_selected;
    } else if(locked) {
        ctx.fillStyle = cell_number_locked;
    } else {
        ctx.fillStyle = cell_number;
    }
    ctx.fillText(n, x + cell_size / 2, y + cell_size / 2);
}

var drawBoard = function(ctx, x, y, game) {
    for(cell = 0; cell < 81; cell++) {
        var cellX = x + Math.floor(cell / 9) * cell_size;
        var cellY = y + (cell % 9) * cell_size;
        var number = (game.board[cell] !== 0 ? game.board[cell] : "");
        var selected = (cell == selection) ? true : false;
        var colliding = (getCollisions(game, cell).length > 0 ? true : false);
        var locked = (game.locked[cell] !== 0 ? true : false);
        drawCell(ctx, cellX, cellY, number, selected, colliding, locked);
    }
    drawThickLines(ctx);
}

var drawThickLines = function(ctx) {
    ctx.lineWidth = cell_size / 10;
    ctx.strokeStyle = thick_lines;
    for(i = 0; i < 4; i++) {
        ctx.moveTo(0, i * block_size);
        ctx.lineTo(3 * block_size, i * block_size);
    }
    for(i = 0; i < 4; i++) {
        ctx.moveTo(i * block_size, 0);
        ctx.lineTo(i * block_size, 3 * block_size);
    }
    ctx.stroke();
}

var createEmptyBoard = function(game) {
    game.board = new Array(81);
    for(i = 0; i < 81; i++) game.board[i] = 0;
    game.locked = new Array(81);
    for(i = 0; i < 81; i++) game.locked[i] = 0;
}

var generateSolution = function(game) {
    var untried = new Array(81);
    for(i = 0; i < 81; i++) {
        untried[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    var i = 0;
    while(i < 81) {
        var nextToTry;
        if(untried[i].length > 0) {
            nextToTry = untried[i].splice([Math.floor(Math.random() * untried[i].length)], 1)[0];
        }
        game.board[i] = nextToTry;
        if(getCollisions(game, i).length > 0) {
            if(untried[i].length > 0) {
                continue;
            } else {
                untried[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                i--;
                if(i < 0) {
                    return false;
                }
            }
        } else {
            i++;
        }
    }
    return true;
}

var digHoles = function(game) {
    for(i = 0; i < 30; i++) {
        var randomPick = Math.floor(Math.random() * game.board.length);
        game.locked[randomPick] = game.board[randomPick];
    }
    for(i = 0; i < 81; i++) {
        if(game.locked[i] === 0) game.board[i] = 0;
    }
}

var getCollisions = function(game, check_index) {
    var collisions = new Array();

    if(game.board[check_index] === 0) return collisions;

    //check row
    var row = Math.floor(check_index / 9);
    for(i = (row * 9); i < (row * 9 + 9); i++) {
        if(i != check_index &&
           game.board[i] === game.board[check_index] &&
           game.board[check_index] !== 0) {
            if(collisions.indexOf(i) === -1) {
                if(DEBUG) console.log("Check row: Adding " + i + " to collisions.");
                collisions.push(i);
            }
        }
    }
    
    //check column
    var col = check_index % 9;
    for(i = col; i < 73 + col; i += 9) {
        if(i != check_index &&
           game.board[i] === game.board[check_index] &&
           game.board[check_index] !== 0) {
            if(collisions.indexOf(i) == -1) {
                if(DEBUG) console.log("Check column: Adding " + i + " to collisions.");
                collisions.push(i);
            }
        }
    }

    //check box
    var box_index;
    for(i = 0; i < 9; i++) {
        if(boxes[i].indexOf(check_index) != -1) {
            box_index = i;
            break;
        }
    }
    if(DEBUG) console.log("Box index for " + check_index + ": " + box_index);
    for(j = 0; j < 9; j++) {
        var box_cell = boxes[box_index][j];
        if(box_cell != check_index &&
           game.board[box_cell] === game.board[check_index] &&
           game.board[check_index] !== 0) {
            if(collisions.indexOf(box_cell) == -1) {
                if(DEBUG) console.log("Check box: Adding " + box_cell + " to collisions.");
                collisions.push(box_cell);
            }
        }
    }

    return collisions;
}

var checkAll = function(game) {
    var ok = true;
    for(p = 0; p < 81; p++) {
        var collisions = getCollisions(game, p);
        if(collisions.length > 0) {
            ok = false;
            break;
        }
    }
    if(DEBUG) console.log((ok ? "Board is ok." : "Board is NOT ok."));
    return ok;
}

var processKeys = function(e, game) {
    switch(e.keyCode) {
        case 38:
            if(DEBUG) console.log("Pressed up");
            if((selection % 9) > 0) selection--;
            break;
        case 40:
            if(DEBUG) console.log("Pressed down");
            if((selection % 9) < 8) selection++;
            break;
        case 37:
            if(DEBUG) console.log("Pressed left");
            if(Math.floor(selection / 9) > 0) selection -= 9;
            break;
        case 39:
            if(DEBUG) console.log("Pressed right");
            if(Math.floor(selection / 9) < 8) selection += 9;
            break;
        case 27:
            if(DEBUG) console.log("Pressed escape");
            selection.type = "none";
            break;
        case 46:
            if(DEBUG) console.log("Pressed delete");
            if(game.locked[selection] === 0) game.board[selection] = 0;
            break;
        case 67:
            if(DEBUG) console.log("Pressed C");
            alert((checkAll(game) ? "Board is ok" : "Board is NOT ok"));
            break;
    }
    if(e.keyCode >= 49 && e.keyCode <= 57) {
            if(DEBUG) console.log("Pressed " + String.fromCharCode(e.keyCode));
            if(game.locked[selection] === 0) game.board[selection] = parseInt(String.fromCharCode(e.keyCode));
            if(DEBUG) console.log(game.board);
    }
    if(DEBUG) console.log("Selection: " + selection);
    if(DEBUG) console.log(game.board);
    if(DEBUG) console.log("Collisions: " + getCollisions(game, selection));
    drawBoard(ctx, 0, 0, game);
    drawThickLines(ctx);
}

main();