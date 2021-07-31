"use strict";
exports.__esModule = true;
exports.Puzzle = void 0;
var min_pq_js_1 = require("./min-pq.js");
var min_pq_js_2 = require("./min-pq.js");
var Puzzle = /** @class */ (function () {
    function Puzzle(tiles) {
        this.tiles = [];
        this.blankIndex = -1;
        this.blankRow = -1;
        this.blankCol = -1;
        this.dimension = tiles.length;
        var currIndex = 0;
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles.length; j++) {
                if (tiles[i][j] == 0) {
                    this.blankIndex = currIndex;
                    this.blankRow = i;
                    this.blankCol = j;
                }
                this.tiles[currIndex++] = tiles[i][j];
            }
        }
        if (this.blankIndex == -1)
            throw console.error("Invalid Input: No blank space");
    }
    Puzzle.prototype.equals = function (that) {
        if (this.tiles.length !== that.tiles.length) {
            return false;
        }
        for (var i = 0; i < this.tiles.length; i++) {
            if (that.tiles[i] !== this.tiles[i]) {
                return false;
            }
        }
        return true;
    };
    Puzzle.prototype.isSolved = function () {
        for (var i = 1; i < this.tiles.length; i++) {
            if (this.tiles[i - 1] !== i) {
                return false;
            }
        }
        return true;
    };
    Puzzle.prototype.isSolveable = function () {
        return (this.inversions() % 2 == 0);
    };
    Puzzle.prototype.manhattan = function () {
        var manhattan = 0;
        var tiles2D = this.tiles2DCopy();
        for (var i = 0; i < this.dimension; i++) {
            for (var j = 0; j < this.dimension; j++) {
                var tile = tiles2D[i][j];
                if (tile == 0)
                    continue;
                manhattan += (this.vertDist(tile, i) + this.horDist(tile, j));
            }
        }
        return manhattan;
    };
    Puzzle.prototype.vertDist = function (tile, row) {
        return Math.abs(Math.floor((tile - 1) / this.dimension - row));
    };
    Puzzle.prototype.horDist = function (tile, col) {
        return Math.abs((tile - 1) % this.dimension - col);
    };
    Puzzle.prototype.inversions = function () {
        var inversions = 0;
        for (var i = 0; i < this.tiles.length; i++) {
            if (i === this.blankIndex) {
                continue;
            }
            for (var j = i + 1; j < this.tiles.length; j++) {
                if (j === this.blankIndex) {
                    continue;
                }
                if (this.tiles[i] > this.tiles[j])
                    inversions++;
            }
        }
        return inversions;
    };
    Puzzle.prototype.possibleMoves = function () {
        var neighbors = [];
        var tiles2D = this.tiles2DCopy();
        if (this.blankRow - 1 >= 0) {
            var neighbor = this.tiles2DCopy();
            neighbor[this.blankRow - 1][this.blankCol] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow - 1][this.blankCol];
            neighbors.push(new Puzzle(neighbor));
        }
        if (this.blankRow + 1 < this.dimension) {
            var neighbor = this.tiles2DCopy();
            neighbor[this.blankRow + 1][this.blankCol] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow + 1][this.blankCol];
            neighbors.push(new Puzzle(neighbor));
        }
        if (this.blankCol + 1 < this.dimension) {
            var neighbor = this.tiles2DCopy();
            neighbor[this.blankRow][this.blankCol + 1] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow][this.blankCol + 1];
            neighbors.push(new Puzzle(neighbor));
        }
        if (this.blankCol - 1 >= 0) {
            var neighbor = this.tiles2DCopy();
            neighbor[this.blankRow][this.blankCol - 1] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow][this.blankCol - 1];
            neighbors.push(new Puzzle(neighbor));
        }
        return neighbors;
    };
    Puzzle.prototype.tiles2DCopy = function () {
        var copy = [];
        var currIndex = 0;
        for (var i = 0; i < this.dimension; i++) {
            var rowCopy = [];
            for (var j = 0; j < this.dimension; j++) {
                rowCopy.push(this.tiles[currIndex++]);
            }
            copy.push(rowCopy);
        }
        return copy;
    };
    Puzzle.prototype.print = function () {
        var tiles2D = this.tiles2DCopy();
        tiles2D.forEach(function (tile) {
            console.log(tile);
        });
        console.log("\n");
    };
    Puzzle.prototype.solvePuzzle = function () {
        if (!this.isSolveable)
            throw console.error("Not Solveable");
        var pq = new min_pq_js_1.MinPQ();
        var initNode = new min_pq_js_2.SearchNode(null, this, 0);
        pq.insert(initNode);
        var currNode = initNode;
        var currPuzzle = this;
        while (!currPuzzle.isSolved()) {
            var possibleMoves = currPuzzle.possibleMoves();
            possibleMoves.forEach(function (move) {
                var newMoves = currNode.movesMade + 1;
                if (currNode.movesMade == 0) {
                    pq.insert(new min_pq_js_2.SearchNode(currNode, move, newMoves));
                }
                else if (!move.equals(currNode.previous.currPuzzle)) {
                    pq.insert(new min_pq_js_2.SearchNode(currNode, move, newMoves));
                }
            });
            currNode = pq.rmMin();
            currPuzzle = currNode.currPuzzle;
        }
        var minMoves = currNode.movesMade;
        var path = [];
        while (currNode != null) {
            path.push(currNode.currPuzzle);
            currNode = currNode.previous;
        }
        var steps = [];
        while (path.length > 0)
            steps.push(path.pop());
        return steps;
    };
    return Puzzle;
}());
exports.Puzzle = Puzzle;
var myPuzzle = new Puzzle([[3, 7, 8],
    [6, 2, 4],
    [1, 0, 5]]);
var steps = myPuzzle.solvePuzzle();
steps.forEach(function (step) {
    step.print();
});
