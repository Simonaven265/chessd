class ChessEngine {
    constructor() {
        this.board = this.createInitialBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.moves = [];
        this.isGameOver = false;
        this.winner = null;
    }

    createInitialBoard() {
        return [
            ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
            ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
            ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
        ];
    }

    isValidMove(from, to) {
        const [fromX, fromY] = from;
        const [toX, toY] = to;
        const piece = this.board[fromY][fromX];
        const targetPiece = this.board[toY][toX];

        if (!piece || piece[0] !== this.currentPlayer[0]) return false;
        if (targetPiece && targetPiece[0] === piece[0]) return false;

        const pieceType = piece[1].toLowerCase();
        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const direction = piece[0] === 'w' ? -1 : 1;

        switch (pieceType) {
            case 'p':
                if (deltaX === 0 && !targetPiece) {
                    if (deltaY === direction) return true;
                    if ((fromY === 1 && piece[0] === 'b' || fromY === 6 && piece[0] === 'w') && 
                        deltaY === 2 * direction && !this.board[fromY + direction][fromX]) {
                        return true;
                    }
                }
                if (absDeltaX === 1 && deltaY === direction) {
                    if (targetPiece) return true;
                    const lastMove = this.moves[this.moves.length - 1];
                    if (lastMove && lastMove.piece[1] === 'P' && 
                        Math.abs(lastMove.from[1] - lastMove.to[1]) === 2 &&
                        lastMove.to[0] === toX && lastMove.to[1] === fromY) {
                        return true;
                    }
                }
                return false;

            case 'r':
                return (deltaX === 0 || deltaY === 0) && this.isPathClear(from, to);

            case 'n':
                return (absDeltaX === 2 && absDeltaY === 1) || (absDeltaX === 1 && absDeltaY === 2);

            case 'b':
                return absDeltaX === absDeltaY && this.isPathClear(from, to);

            case 'q':
                return (deltaX === 0 || deltaY === 0 || absDeltaX === absDeltaY) && 
                       this.isPathClear(from, to);

            case 'k':
                return absDeltaX <= 1 && absDeltaY <= 1;
        }
        return false;
    }

    isPathClear(from, to) {
        const [fromX, fromY] = from;
        const [toX, toY] = to;
        const deltaX = Math.sign(toX - fromX);
        const deltaY = Math.sign(toY - fromY);
        let x = fromX + deltaX;
        let y = fromY + deltaY;

        while (x !== toX || y !== toY) {
            if (this.board[y][x]) return false;
            x += deltaX;
            y += deltaY;
        }
        return true;
    }

    makeMove(from, to) {
        if (!this.isValidMove(from, to)) return false;
        
        const [fromX, fromY] = from;
        const [toX, toY] = to;
        const piece = this.board[fromY][fromX];
        const targetPiece = this.board[toY][toX];
        
        if (targetPiece && targetPiece[1] === 'K') {
            this.isGameOver = true;
            this.winner = piece[0] === 'w' ? 'white' : 'black';
        }

        if (piece[1].toLowerCase() === 'p' && !this.board[toY][toX] && fromX !== toX) {
            this.board[fromY][toX] = null;
        }

        this.board[toY][toX] = this.board[fromY][fromX];
        this.board[fromY][fromX] = null;
        
        this.moves.push({
            piece,
            from: [fromX, fromY],
            to: [toX, toY]
        });

        if (piece[1].toLowerCase() === 'p' && (toY === 0 || toY === 7)) {
            this.board[toY][toX] = piece[0] + 'Q';
        }

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        return true;
    }
}
