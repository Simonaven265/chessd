class ChessAI {
    constructor(engine) {
        this.engine = engine;
        this.difficulty = 'easy';
        this.pieceValues = {
            'P': 1,
            'N': 3,
            'B': 3,
            'R': 5,
            'Q': 9,
            'K': 100
        };
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    makeMove() {
        const moves = this.getAllPossibleMoves();
        if (moves.length === 0) return null;

        const evaluatedMoves = moves.map(move => ({
            ...move,
            score: this.evaluateMove(move)
        }));

        evaluatedMoves.sort((a, b) => b.score - a.score);
        return evaluatedMoves[0];
    }

    evaluateMove(move) {
        const [fromX, fromY] = move.from;
        const [toX, toY] = move.to;
        let score = 0;

        const targetPiece = this.engine.board[toY][toX];
        if (targetPiece) {
            score += this.pieceValues[targetPiece[1]] * 10;
        }

        switch(this.difficulty) {
            case 'easy':
                score += Math.random() * 20;
                break;
                
            case 'medium':
                score += this.pieceValues[this.engine.board[fromY][fromX][1]] * 0.1;
                score -= Math.abs(3.5 - toX) + Math.abs(3.5 - toY);
                score += Math.random() * 5;
                break;
                
            case 'hard':
                score += this.pieceValues[this.engine.board[fromY][fromX][1]] * 0.2;
                score -= Math.abs(3.5 - toX) + Math.abs(3.5 - toY);
                score += (toY - fromY) * 0.1;
                score += this.evaluateProtection(toX, toY) * 2;
                score += Math.random() * 2;
                break;
        }

        return score;
    }

    getAllPossibleMoves() {
        const moves = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.engine.board[y][x];
                if (piece && piece[0] === 'b') {
                    for (let ty = 0; ty < 8; ty++) {
                        for (let tx = 0; tx < 8; tx++) {
                            if (this.engine.isValidMove([x, y], [tx, ty])) {
                                moves.push({from: [x, y], to: [tx, ty]});
                            }
                        }
                    }
                }
            }
        }
        return moves;
    }
}
