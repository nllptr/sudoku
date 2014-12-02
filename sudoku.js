var cell_size = 50;
var block_size = 3 * cell_size;
var cell_border = "#8B97A0";
var cell_number = "#346184";
var cell_number_selected = "#BFC1C2";
//var cell_number_selected = "#FF0000";
var cell_fill = "#BFC1C2";
var cell_fill_selected = "#346184";
var thick_lines = "#084D81";
var selection = 0;
var board;
var ctx;

function main() {
    var canvas = document.getElementById("sudoku");
    ctx = canvas.getContext("2d");
    board = createEmptyBoard();
    drawBoard(ctx, 0, 0, board);
    canvas.setAttribute("tabindex", "0");
    canvas.addEventListener("keydown", processKeys, false);
    canvas.focus();
}

function drawCell(ctx, x, y, n, selected) {
    selected = typeof selected !== 'undefined' ? selected : false;
    ctx.lineWidth = 1;
    ctx.fillStyle = selected ? cell_fill_selected : cell_fill;
    ctx.strokeStyle = cell_border;
    ctx.fillRect(x, y, cell_size, cell_size);
    ctx.strokeRect(x, y, cell_size, cell_size);
    ctx.font = "bold " + cell_size * 0.8 + "px sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = selected ? cell_number_selected : cell_number;
    ctx.fillText(n, x + cell_size / 2, y + cell_size / 2);
}

function drawBoard(ctx, x, y, board) {
    for(i = 0; i < 81; i++) {
        var cellX = x + Math.floor(i / 9) * cell_size;
        var cellY = y + (i % 9) * cell_size;
        var number = board[i];
        if(i == selection) drawCell(ctx, cellX, cellY, number, true);
        else drawCell(ctx, cellX, cellY, number);
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

function createEmptyBoard() {
    var board = Array(81);
    for(i = 0; i < 81; i++) board[i] = "";
    return board;
}

function randomizeBoard(board) {
    for(i = 0; i < 30; i++) {
        //TODO
    }
}

function checkValid(n) {
    var collisions = new Array();

    //check row
    var row = Math.floor(n / 9);
    console.log("Row: " + row);
    for(i = (row * 9); i < (row * 9 + 9); i++) {
        if(i != n && board[i] === board[n] && board[n] != "") {
            collisions.push(i);
        }
    }
    
    //check column
    var col = n % 9;
    console.log("Col: " + col);
    for(i = col; i < 73 + col; i += 9) {
        if(i != n && board[i] === board[n] && board[n] != "") {
            collisions.push(i);
        }
    }

    //check box
    

    drawBoard(ctx, 0, 0, board);
    return collisions;
}

function processKeys(e) {
    console.log("Key pressed: " + e.keyCode);
    switch(e.keyCode) {
        case 38:
            console.log("Pressed up");
            if((selection % 9) > 0) selection--;
            break;
        case 40:
            console.log("Pressed down");
            if((selection % 9) < 8) selection++;
            break;
        case 37:
            console.log("Pressed left");
            if(Math.floor(selection / 9) > 0) selection -= 9;
            break;
        case 39:
            console.log("Pressed right");
            if(Math.floor(selection / 9) < 8) selection += 9;
            break;
        case 27:
            console.log("Pressed escape");
            selection.type = "none";
            break;
    }
    if(e.keyCode >= 49 && e.keyCode <= 57) {
            console.log("Pressed " + String.fromCharCode(e.keyCode));
            board[selection] = String.fromCharCode(e.keyCode);
    }
    console.log(selection);
    drawBoard(ctx, 0, 0, board);
    drawThickLines(ctx);

    console.log(checkValid(selection));
}

main();