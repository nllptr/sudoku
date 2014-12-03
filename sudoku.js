/*
 * Color palette: http://paletton.com/#uid=33g0u0krPrxh6ySlZtltwlLzxgR
 */

// Game parameters
var DEBUG = true;
var cell_size = 50;
var block_size = 3 * cell_size;

// Colors
var cell_border = "#00534C";
var cell_number = "#086B63";
var cell_number_immutable = "#00534C";
var cell_number_selected = "#865800";
var cell_number_colliding = "#840007";
var cell_fill = "#2D9088";
var cell_fill_selected = "#DB9A1D";
var cell_fill_colliding = "#D81C25";
var thick_lines = "#00534C";

// Global variables
var selection = 0;
//var board;
var game = {board: 'undefined'};
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

function main() {
    var canvas = document.getElementById("sudoku");
    ctx = canvas.getContext("2d");
    createEmptyBoard(game);
    randomizeBoard(game);
    drawBoard(ctx, 0, 0, game);
    canvas.setAttribute("tabindex", "0");
    canvas.addEventListener("keydown", function(e) {
        processKeys(e, game);
    });
    canvas.focus();
}

function drawCell(ctx, x, y, n, selected, colliding) {
    ctx.lineWidth = 1;
    if(selected) {
        ctx.fillStyle = cell_fill_selected;
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
    } else {
        ctx.fillStyle = cell_number;
    }
    ctx.fillText(n, x + cell_size / 2, y + cell_size / 2);
}

function drawBoard(ctx, x, y, game) {
    for(i = 0; i < 81; i++) {
        var cellX = x + Math.floor(i / 9) * cell_size;
        var cellY = y + (i % 9) * cell_size;
        var number = game.board[i];
        if(i == selection) drawCell(ctx, cellX, cellY, number, true, false);
        else drawCell(ctx, cellX, cellY, number, false, false);
    }
    drawThickLines(ctx);
}

function drawThickLines(ctx) {
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

function createEmptyBoard(game) {
    game.board = new Array(81);
    for(i = 0; i < 81; i++) game.board[i] = "";
}

function randomizeBoard(game) {
    for(k = 0; k < 30; k++) {
        var random_cell = Math.floor(Math.random() * 81);
        while(game.board[random_cell] !== "") random_cell = Math.floor(Math.random() * 81);
        if(DEBUG) console.log("Randomized cell: " + random_cell);
        
        var random_number = Math.floor(Math.random() * 9) + 1;
        if(DEBUG) console.log("Generated: " + random_number);
        game.board[random_cell] = random_number;
        var randomize_collisions = getCollisions(game, random_cell);
        if(DEBUG) console.log("Collisions: " + randomize_collisions);
        while(randomize_collisions.length > 0) {
            random_number = Math.floor(Math.random() * 9) + 1;
            if(DEBUG) console.log("Generated new number: " + random_number);
            game.board[random_cell] = random_number;
            randomize_collisions = getCollisions(game, random_cell);
        }
        game.board[random_cell] = random_number;
    }
}

function getCollisions(game, check_index) {
    var collisions = new Array();

    if(game.board[check_index] === "") return collisions;

    //check row
    var row = Math.floor(check_index / 9);
    for(i = (row * 9); i < (row * 9 + 9); i++) {
        if(i != check_index &&
           game.board[i] === game.board[check_index] &&
           game.board[check_index] != "") {
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
           game.board[check_index] != "") {
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
           game.board[check_index] != "") {
            if(collisions.indexOf(box_cell) == -1) {
                if(DEBUG) console.log("Check box: Adding " + box_cell + " to collisions.");
                collisions.push(box_cell);
            }
        }
    }

    return collisions;
}

function checkAll(game) {
    var ok = true;
    for(p = 0; p < 81; p++) {
        var collisions = getCollisions(game, p);
        if(collisions.length > 0) {
            ok = false;
            break;
        }
    }
    if(DEBUG) console.log((ok ? "Board is ok." : "Board is NOT ok."));
}

function processKeys(e, game) {
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
        case 67:
            if(DEBUG) console.log("Pressed C");
            checkAll(game);
            break;
    }
    if(e.keyCode >= 49 && e.keyCode <= 57) {
            if(DEBUG) console.log("Pressed " + String.fromCharCode(e.keyCode));
            game.board[selection] = String.fromCharCode(e.keyCode);
            if(DEBUG) console.log(game.board);
    }
    if(DEBUG) console.log("Selection: " + selection);
    if(DEBUG) console.log("Collisions: " + getCollisions(game, selection));
    drawBoard(ctx, 0, 0, game);
    drawThickLines(ctx);
}

main();