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
        console.log(tiles2D);
    };
    return Puzzle;
}());
var myTiles = [
    [1, 2, 3],
    [4, 0, 6],
    [7, 8, 5]
];
console.log("Hello");
var myBoard = new Puzzle(myTiles);
myBoard.possibleMoves().forEach(function (move) {
    move.print();
});
