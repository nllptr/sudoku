var cell_size = 50;
var block_size = 3 * cell_size;
var cell_border = "#8B97A0";
var cell_number = "#346184";
var cell_number_selected = "#BFC1C2";
//var cell_number_selected = "#FF0000";
var cell_fill = "#BFC1C2";
var cell_fill_selected = "#346184";
var thick_lines = "#084D81";
var selection = {x: 0, y: 0};
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
    for(bX = 0; bX < board.length; bX++) {
        for(bY = 0; bY < board[0].length; bY++) {
            var number = board[bY][bX];
                if(selection.x === bX && selection.y === bY)
                    drawCell(ctx, x + bX * cell_size, y + bY * cell_size, number, true);
                else
                    drawCell(ctx, x + bX * cell_size, y + bY * cell_size, number);
        }
    }
    drawThickLines(ctx);
}

function drawThickLines(ctx) {
    // Draw thick lines
    ctx.lineWidth = cell_size / 10;
    ctx.strokeStyle = thick_lines;
    for(bX = 1; bX < board.length; bX++) {
        ctx.moveTo(bX * block_size, 0);
        ctx.lineTo(bX * block_size, 3 * block_size);
        for(bY = 1; bY < board[0].length; bY++) {
            ctx.moveTo(0, bY *  block_size);
            ctx.lineTo(3 * block_size, bY *  block_size);
        }
    }
    ctx.stroke();
}

function createEmptyBoard() {
    var board = Array(9);
    // Create board rows
    var i = 0;
    for(x = 0; x < board.length; x++) {
        board[x] = Array(9);
        // Create board columns
        for(y = 0; y < board[x].length; y++) {
            board[x][y] = ""; //i % 9 + 1;
            i++;
        }
    }
    console.log(board);
    return board;
}

function randomizeBoard(board) {
    for(i = 0; i < 30; i++) {
        //TODO
    }
}

function checkValid(x, y) {
    var collisions = new Array();
    //check row
    for(i = 0; i < board[x].length; i++) {
        if(x != i) {
            if(board[x][y] === board[x][i]) {
                collisions.push({"x": x,"y": i});
            }
        }
    }
    //check column
    for(i = 0; i < board.length; i++) {
        
    }
    //check box

    return collisions;
}

function processKeys(e) {
    console.log("Key pressed: " + e.keyCode);
    switch(e.keyCode) {
        case 38:
            console.log("Pressed up");
            if(selection.y > 0) selection.y--;
            break;
        case 40:
            console.log("Pressed down");
            if(selection.y < board[0].length - 1) selection.y++;
            break;
        case 37:
            console.log("Pressed left");
            if(selection.x > 0) selection.x--;
            break;
        case 39:
            console.log("Pressed right");
            if(selection.x < board.length - 1) selection.x++;
            break;
        case 27:
            console.log("Pressed escape");
            selection.type = "none";
            break;
    }
    if(e.keyCode >= 49 && e.keyCode <= 57) {
            console.log("Pressed " + String.fromCharCode(e.keyCode));
            board[selection.y][selection.x] = String.fromCharCode(e.keyCode);
    }
    console.log(selection);
    drawBoard(ctx, 0, 0, board);
    drawThickLines(ctx);

    console.log(checkValid(selection.x, selection.y));
}

main();