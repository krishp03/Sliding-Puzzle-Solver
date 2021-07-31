import { Puzzle } from "./puzzle";

//Min PQ implementation using a Binary Heap
export class MinPQ {

    binaryHeap: SearchNode[];

    // Size
    N: number;

    constructor() {
        this.binaryHeap = [];
        this.N = 0;
    }

    size(): number {
        return this.N;
    }

    insert(item: SearchNode) {
        this.binaryHeap[++this.N] = item;
        this.swim(this.N);
    }

    // Heap Helper Functions
    private swim(currIndex: number) {
        while (currIndex > 1 && this.greater(Math.floor(currIndex / 2), currIndex)) {
            this.exchange(currIndex, Math.floor(currIndex / 2));
            currIndex = Math.floor(currIndex / 2);
        }
    }

    private sink(currIndex: number) {
        while (2 * currIndex <= this.N) {
            let child = 2 * currIndex

            if (child < this.N && this.greater(child, child + 1))
                child++;
            if (!this.greater(currIndex, child))
                break
            this.exchange(currIndex, child)
            currIndex = child;
        }
    }

    private delMin(): SearchNode {
        if (!this.isEmpty()) {
            const min = this.binaryHeap[1];
            this.exchange(1, this.N--);
            this.sink(1);
            this.binaryHeap.pop()
            return min;
        }
        throw console.error("No items in the min ordered queue")
    }

    // Array Helper Functions
    private greater(index1: number, index2: number): boolean {
        return (this.binaryHeap[index1].compareTo(this.binaryHeap[index2]) > 0);
    }

    private exchange(index1: number, index2: number) {
        const temp = this.binaryHeap[index1];
        this.binaryHeap[index1] = this.binaryHeap[index2];
        this.binaryHeap[index2] = temp;
    }

    rmMin(): SearchNode {
        return this.delMin();
    }

    isEmpty(): boolean {
        return (this.N === 0);
    }
}

// Search Node Implementation
export class SearchNode{
    previous: SearchNode;
    currPuzzle: Puzzle;
    movesMade: number;
    manhattan: number;

    constructor(previous: SearchNode, currPuzzle: Puzzle, movesMade: number) {
        this.previous = previous;
        this.currPuzzle = currPuzzle;
        this.movesMade = movesMade;
        this.manhattan = currPuzzle.manhattan();
    }

    compareTo(that: SearchNode): number {
        const priorityDiff: number = (this.manhattan+this.movesMade) - (that.manhattan+that.movesMade);
        return priorityDiff;
    }
}