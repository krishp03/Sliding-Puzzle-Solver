"use strict";
exports.__esModule = true;
exports.SearchNode = exports.MinPQ = void 0;
//Min PQ implementation using a Binary Heap
var MinPQ = /** @class */ (function () {
    function MinPQ() {
        this.binaryHeap = [];
        this.N = 0;
    }
    MinPQ.prototype.size = function () {
        return this.N;
    };
    MinPQ.prototype.insert = function (item) {
        this.binaryHeap[++this.N] = item;
        this.swim(this.N);
    };
    // Heap Helper Functions
    MinPQ.prototype.swim = function (currIndex) {
        while (currIndex > 1 && this.greater(Math.floor(currIndex / 2), currIndex)) {
            this.exchange(currIndex, Math.floor(currIndex / 2));
            currIndex = Math.floor(currIndex / 2);
        }
    };
    MinPQ.prototype.sink = function (currIndex) {
        while (2 * currIndex <= this.N) {
            var child = 2 * currIndex;
            if (child < this.N && this.greater(child, child + 1))
                child++;
            if (!this.greater(currIndex, child))
                break;
            this.exchange(currIndex, child);
            currIndex = child;
        }
    };
    MinPQ.prototype.delMin = function () {
        if (!this.isEmpty()) {
            var min = this.binaryHeap[1];
            this.exchange(1, this.N--);
            this.sink(1);
            this.binaryHeap.pop();
            return min;
        }
        throw console.error("No items in the min ordered queue");
    };
    // Array Helper Functions
    MinPQ.prototype.greater = function (index1, index2) {
        return (this.binaryHeap[index1].compareTo(this.binaryHeap[index2]) > 0);
    };
    MinPQ.prototype.exchange = function (index1, index2) {
        var temp = this.binaryHeap[index1];
        this.binaryHeap[index1] = this.binaryHeap[index2];
        this.binaryHeap[index2] = temp;
    };
    MinPQ.prototype.rmMin = function () {
        return this.delMin();
    };
    MinPQ.prototype.isEmpty = function () {
        return (this.N === 0);
    };
    return MinPQ;
}());
exports.MinPQ = MinPQ;
// Search Node Implementation
var SearchNode = /** @class */ (function () {
    function SearchNode(previous, currPuzzle, movesMade) {
        this.previous = previous;
        this.currPuzzle = currPuzzle;
        this.movesMade = movesMade;
        this.manhattan = currPuzzle.manhattan();
    }
    SearchNode.prototype.compareTo = function (that) {
        var priorityDiff = (this.manhattan + this.movesMade) - (that.manhattan + that.movesMade);
        return priorityDiff;
    };
    return SearchNode;
}());
exports.SearchNode = SearchNode;
