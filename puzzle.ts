class Puzzle {

    tiles: number[];
    dimension: number;
    blankIndex: number;
    blankRow: number;
    blankCol: number;

    constructor(tiles: number[][]){
        this.tiles = [];
        this.blankIndex = -1
        this.blankRow = -1
        this.blankCol = -1;
        this.dimension = tiles.length

        let currIndex = 0;
        for(let i=0; i<tiles.length; i++){
            for(let j=0; j<tiles.length; j++){
                if (tiles[i][j] == 0) {
                    this.blankIndex = currIndex;
                    this.blankRow = i;
                    this.blankCol = j;
                }
                this.tiles[currIndex++]= tiles[i][j];
            }
        }

        if(this.blankIndex == -1)
            throw console.error("Invalid Input: No blank space");
            
        
    }

    equals(that: Puzzle): boolean {
        if(this.tiles.length !== that.tiles.length){
            return false;
        }

        for(let i=0; i<this.tiles.length; i++){
            if(that.tiles[i] !== this.tiles[i]){
                return false;
            }
        }

        return true;
    }

    isSolved(): boolean {
        for (let i = 1; i < this.tiles.length; i++) {
            if (this.tiles[i-1] !== i) {
                return false;
            }
        }
        return true;
    }

    isSolveable(): boolean {
        return (this.inversions() % 2 == 0);
    }

    private inversions(): number {
        let inversions = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            if(i === this.blankIndex){
                continue;
            }
            for (let j = i+1; j < this.tiles.length; j++) {
                if(j  === this.blankIndex){
                    continue;
                }
                if(this.tiles[i] > this.tiles[j])
                    inversions++;
            }
        }
        return inversions;
    }

    possibleMoves(): Puzzle[] {
        const neighbors: Puzzle[] = [];
        const tiles2D = this.tiles2DCopy();
        if (this.blankRow - 1 >= 0) {
            const neighbor = this.tiles2DCopy();
            neighbor[this.blankRow - 1][this.blankCol] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow - 1][this.blankCol];
            neighbors.push(new Puzzle(neighbor));
        }

        if (this.blankRow + 1 < this.dimension) {
            const neighbor = this.tiles2DCopy();
            neighbor[this.blankRow + 1][this.blankCol] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow + 1][this.blankCol];
            neighbors.push(new Puzzle(neighbor));
        }

        if (this.blankCol + 1 < this.dimension) {
            const neighbor = this.tiles2DCopy();
            neighbor[this.blankRow][this.blankCol + 1] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow][this.blankCol + 1];
            neighbors.push(new Puzzle(neighbor));
        }

        if (this.blankCol - 1 >= 0) {
            const neighbor = this.tiles2DCopy();
            neighbor[this.blankRow][this.blankCol - 1] = tiles2D[this.blankRow][this.blankCol];
            neighbor[this.blankRow][this.blankCol] = tiles2D[this.blankRow][this.blankCol - 1];
            neighbors.push(new Puzzle(neighbor));
        }

        return neighbors;
    }

    private tiles2DCopy(): number[][] {
        const copy = [];
        let currIndex = 0;
        for(let i = 0; i < this.dimension; i++){
            const rowCopy = [];
            for(let j = 0; j < this.dimension; j++){
                rowCopy.push(this.tiles[currIndex++]);
            }
            copy.push(rowCopy);
        }
        return copy;
    }

    print() {
        const tiles2D = this.tiles2DCopy();
        console.log(tiles2D);
    }

}

const myTiles = [
    [1, 2, 3],
    [4, 0, 6],
    [7, 8, 5]
];

const myBoard = new Puzzle(myTiles);
myBoard.possibleMoves().forEach(move => {
    move.print();
});