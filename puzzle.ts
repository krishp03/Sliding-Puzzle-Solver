import {MinPQ} from './min-pq.js'
import {SearchNode} from './min-pq.js'

export class Puzzle {

    tiles: number[];
    dimension: number;
    blankIndex: number;
    blankRow: number;
    blankCol: number;

    constructor(tiles: number[][]){
        this.tiles = [];
        this.blankIndex = -1;
        this.blankRow = -1;
        this.blankCol = -1;
        this.dimension = tiles.length;

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

    manhattan(){
        let manhattan: number = 0;
        const tiles2D = this.tiles2DCopy(); 
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                const tile: number = tiles2D[i][j];
                if (tile == 0)
                    continue;
                manhattan += (this.vertDist(tile, i) + this.horDist(tile, j));
            }
        }

        return manhattan;
    }

    private vertDist(tile: number, row: number){
        return Math.abs(Math.floor((tile - 1) / this.dimension - row));
    }

    private horDist(tile: number, col: number ){
        return Math.abs((tile - 1) % this.dimension - col);
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
        tiles2D.forEach(tile => {
            console.log(tile);
        })
        console.log("\n");
    }

    solvePuzzle(): Puzzle[]{
        if(!this.isSolveable)
            throw console.error("Not Solveable");
        const pq = new MinPQ();
        const initNode: SearchNode = new SearchNode(null, this, 0);

        pq.insert(initNode);
        
        let currNode: SearchNode = initNode;
        let currPuzzle: Puzzle = this;

        while (!currPuzzle.isSolved()) {
            const possibleMoves = currPuzzle.possibleMoves();

            possibleMoves.forEach(move => {
                const newMoves = currNode.movesMade + 1;
                if (currNode.movesMade == 0) {
                    pq.insert(new SearchNode(currNode, move, newMoves));
                }
                else if (!move.equals(currNode.previous.currPuzzle)) {
                    pq.insert(new SearchNode(currNode, move, newMoves));
                }
            })
            currNode = pq.rmMin();
            currPuzzle = currNode.currPuzzle;
        }

        const minMoves = currNode.movesMade;

        const path: Puzzle[] = [];
        while (currNode != null) {
            path.push(currNode.currPuzzle);
            currNode = currNode.previous;
        }

        const steps: Puzzle[] = [];
        while(path.length > 0)
            steps.push(path.pop());
        return steps;
    }

}

const myPuzzle = new Puzzle([[3, 7, 8], 
                             [6, 2, 4], 
                             [1, 0, 5]]);
const steps = myPuzzle.solvePuzzle();
steps.forEach(step => {
    step.print();
});
