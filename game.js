class ChessGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.engine = new ChessEngine();
        this.ai = new ChessAI(this.engine);
        this.pieces = [];
        this.selectedPiece = null;
        this.highlightedSquares = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.controls = null;
        this.clickableObjects = [];
        
        this.cameraMode = 'game';
        this.gameCamera = {
            position: new THREE.Vector3(0, 12, 0.1),
            target: new THREE.Vector3(0, 0, 0)
        };
        this.currentCamera = {
            position: new THREE.Vector3(),
            target: new THREE.Vector3()
        };
        
        this.gameMode = 'ai';
        this.blackPlayerCamera = new THREE.Vector3(0, 10, -8);
        this.whitePlayerCamera = new THREE.Vector3(0, 10, 8);
        this.textureLoader = new THREE.TextureLoader();
        this.gptTexture = this.textureLoader.load('textures/gpt-logo.png');
        this.newGamePressCount = 0;
        this.playerColor = 'white';
        this.init();
        this.setupGameResetButton();
        this.setupGameModeSelector();
        this.setupPerfectButton();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.setupLights();
        this.createBoard();
        this.createPieces();
        this.setupControls();
        this.setupCameraModes();
        this.animate();
    }

    setupGameModeSelector() {
        const buttons = document.querySelectorAll('#game-mode-select .mode-button');
        const aiDifficulty = document.getElementById('ai-difficulty');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.setGameMode(button.dataset.gamemode);
                buttons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                aiDifficulty.style.display = button.dataset.gamemode === 'ai' ? 'flex' : 'none';
                
                this.resetGame();
            });
        });

        const difficultyButtons = document.querySelectorAll('.difficulty-button');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                difficultyButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                this.ai.setDifficulty(button.dataset.difficulty);
                this.resetGame();
            });
        });
    }

    setGameMode(mode) {
        this.gameMode = mode;
    }

    setupCameraModes() {
        const buttons = document.querySelectorAll('.mode-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.setCameraMode(button.dataset.mode);
                buttons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    setCameraMode(mode) {
        this.cameraMode = mode;
        
        if (mode === 'game') {
            this.currentCamera.position.copy(this.camera.position);
            this.currentCamera.target.copy(this.controls.target);
            
            if (this.gameMode === 'pvp') {
                const cameraPos = this.engine.currentPlayer === 'white' ? 
                    this.whitePlayerCamera : this.blackPlayerCamera;
                this.camera.position.copy(cameraPos);
                this.camera.lookAt(0, -2, 0);
            } else {
                this.camera.position.set(0, 12, 0);
                this.camera.lookAt(0, 0, 0);
            }
            
            this.controls.target.set(0, 0, 0);
            this.controls.enabled = false;
        } else {
            this.controls.enabled = true;
            
            if (this.currentCamera.position.lengthSq() > 0) {
                this.camera.position.copy(this.currentCamera.position);
                this.controls.target.copy(this.currentCamera.target);
            } else {
                this.camera.position.set(0, 15, 15);
                this.controls.target.set(0, 0, 0);
            }
            
            this.controls.enableRotate = true;
            this.controls.enableZoom = true;
            this.controls.enablePan = true;
            this.controls.minDistance = 5;
            this.controls.maxDistance = 50;
        }
        
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }

    setupCamera() {
        this.camera.position.set(0, 12, 0);
        this.camera.lookAt(0, 0, 0);
    }

    createPiece(piece, x, z) {
        const color = piece[0] === 'w' ? 0xcccccc : 0x333333;
        const pieceType = piece[1].toLowerCase();
        let model;

        if (pieceType === 'p' && piece[0] === 'b') {
            const geometry = this.createPawnGeometry();
            const material = new THREE.MeshPhongMaterial({ 
                color: color,
                shininess: 50
            });
            model = new THREE.Mesh(geometry, material);

            const logoGeo = new THREE.PlaneGeometry(0.4, 0.4);
            const logoMat = new THREE.MeshBasicMaterial({
                map: this.gptTexture,
                color: 0xffffff,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const frontLogo = new THREE.Mesh(logoGeo, logoMat);
            frontLogo.position.set(0, 0.65, 0.25);
            model.add(frontLogo);

            const backLogo = new THREE.Mesh(logoGeo, logoMat);
            backLogo.position.set(0, 0.65, -0.25);
            backLogo.rotation.y = Math.PI;
            model.add(backLogo);
        } else {
            const geometry = this.createDetailedPieceGeometry(pieceType);
            const material = new THREE.MeshPhongMaterial({ 
                color: color,
                shininess: 50
            });
            model = new THREE.Mesh(geometry, material);
        }

        model.position.set(
            (x - 3.5) * 1.5,
            0.1,
            (z - 3.5) * 1.5
        );
        model.userData = { isPiece: true, boardX: x, boardZ: z };
        this.scene.add(model);
        this.clickableObjects.push(model);
        this.pieces.push({mesh: model, type: piece, position: [x, z]});
    }

    createDetailedPieceGeometry(type) {
        switch(type) {
            case 'p': return this.createPawnGeometry();
            case 'r': return this.createRookGeometry();
            case 'n': return this.createKnightGeometry();
            case 'b': return this.createBishopGeometry();
            case 'q': return this.createQueenGeometry();
            case 'k': return this.createKingGeometry();
            default: return new THREE.CylinderGeometry(0.2, 0.4, 1, 16);
        }
    }

    createPawnGeometry() {
        const shapes = [];
        
        shapes.push(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 16));
        
        const stem = new THREE.CylinderGeometry(0.15, 0.25, 0.4, 16);
        stem.translate(0, 0.3, 0);
        shapes.push(stem);
        
        const head = new THREE.SphereGeometry(0.25, 16, 16);
        head.translate(0, 0.65, 0);
        shapes.push(head);
        
        return this.mergeGeometries(shapes);
    }

    createRookGeometry() {
        const shapes = [];
        
        shapes.push(new THREE.CylinderGeometry(0.35, 0.4, 0.2, 16));
        
        const body = new THREE.CylinderGeometry(0.3, 0.35, 0.6, 16);
        body.translate(0, 0.4, 0);
        shapes.push(body);
        
        const crown = new THREE.CylinderGeometry(0.4, 0.3, 0.3, 16);
        crown.translate(0, 0.85, 0);
        shapes.push(crown);
        
        for (let i = 0; i < 4; i++) {
            const battlement = new THREE.BoxGeometry(0.15, 0.2, 0.15);
            battlement.translate(0.2 * Math.cos(i * Math.PI/2), 1.1, 0.2 * Math.sin(i * Math.PI/2));
            shapes.push(battlement);
        }
        
        return this.mergeGeometries(shapes);
    }

    createKnightGeometry() {
        const shapes = [];
        
        shapes.push(new THREE.CylinderGeometry(0.35, 0.4, 0.2, 16));
        
        const body = new THREE.CylinderGeometry(0.25, 0.35, 0.6, 16);
        body.translate(0, 0.4, 0);
        shapes.push(body);
        
        const head = new THREE.BoxGeometry(0.3, 0.5, 0.7);
        head.translate(0, 0.9, 0.1);
        head.rotateX(Math.PI / 6);
        shapes.push(head);
        
        const mane = new THREE.BoxGeometry(0.3, 0.3, 0.4);
        mane.translate(0, 0.8, -0.2);
        shapes.push(mane);
        
        return this.mergeGeometries(shapes);
    }

    createBishopGeometry() {
        const shapes = [];
        
        shapes.push(new THREE.CylinderGeometry(0.35, 0.4, 0.2, 16));
        
        const body = new THREE.CylinderGeometry(0.2, 0.35, 0.7, 16);
        body.translate(0, 0.45, 0);
        shapes.push(body);
        
        const head = new THREE.SphereGeometry(0.25, 16, 16);
        head.translate(0, 0.95, 0);
        shapes.push(head);
        
        const crossV = new THREE.BoxGeometry(0.1, 0.3, 0.1);
        crossV.translate(0, 1.2, 0);
        shapes.push(crossV);
        
        const crossH = new THREE.BoxGeometry(0.25, 0.1, 0.1);
        crossH.translate(0, 1.15, 0);
        shapes.push(crossH);
        
        return this.mergeGeometries(shapes);
    }

    createQueenGeometry() {
        const shapes = [];
        
        shapes.push(new THREE.CylinderGeometry(0.4, 0.45, 0.2, 16));
        
        const body = new THREE.CylinderGeometry(0.25, 0.4, 0.9, 16);
        body.translate(0, 0.55, 0);
        shapes.push(body);
        
        const crown = new THREE.CylinderGeometry(0.4, 0.25, 0.3, 16);
        crown.translate(0, 1.15, 0);
        shapes.push(crown);
        
        for (let i = 0; i < 8; i++) {
            const point = new THREE.ConeGeometry(0.08, 0.2, 8);
            point.translate(
                0.25 * Math.cos(i * Math.PI/4),
                1.35,
                0.25 * Math.sin(i * Math.PI/4)
            );
            shapes.push(point);
        }
        
        return this.mergeGeometries(shapes);
    }

    createKingGeometry() {
        const shapes = [];
        
        shapes.push(new THREE.CylinderGeometry(0.4, 0.45, 0.2, 16));
        
        const body = new THREE.CylinderGeometry(0.25, 0.4, 0.9, 16);
        body.translate(0, 0.55, 0);
        shapes.push(body);
        
        const crown = new THREE.CylinderGeometry(0.35, 0.25, 0.3, 16);
        crown.translate(0, 1.15, 0);
        shapes.push(crown);
        
        const crossV = new THREE.BoxGeometry(0.12, 0.4, 0.12);
        crossV.translate(0, 1.5, 0);
        shapes.push(crossV);
        
        const crossH = new THREE.BoxGeometry(0.3, 0.12, 0.12);
        crossH.translate(0, 1.45, 0);
        shapes.push(crossH);
        
        return this.mergeGeometries(shapes);
    }

    mergeGeometries(geometries) {
        const bufferGeometries = geometries.map(g => g instanceof THREE.BufferGeometry ? g : new THREE.BufferGeometry().fromGeometry(g));
        return THREE.BufferGeometryUtils.mergeBufferGeometries(bufferGeometries);
    }

    createBoard() {
        const boardGeometry = new THREE.BoxGeometry(12, 0.5, 12);
        const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x805030 });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        this.scene.add(board);

        for (let x = 0; x < 8; x++) {
            for (let z = 0; z < 8; z++) {
                const color = (x + z) % 2 === 0 ? 0xffffff : 0x000000;
                const square = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, 0.1, 1.5),
                    new THREE.MeshPhongMaterial({ color })
                );
                square.position.set((x - 3.5) * 1.5, 0.3, (z - 3.5) * 1.5);
                square.userData = { isSquare: true, boardX: x, boardZ: z };
                this.scene.add(square);
                this.clickableObjects.push(square);
            }
        }
    }

    loadPieceModels() {
        const pieces = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
        const modelPath = './models/';
        
        this.loadingCount = pieces.length;
        
        pieces.forEach(piece => {
            this.loader.load(
                `${modelPath}${piece}.gltf`,
                (gltf) => {
                    this.pieceModels[piece] = gltf.scene;
                    this.loadingCount--;
                    if (this.loadingCount === 0) {
                        this.createPieces();
                    }
                },
                undefined,
                (error) => {
                    console.error(`Error loading model ${piece}:`, error);
                    this.loadingCount--;
                    this.useSimpleGeometry = true;
                    if (this.loadingCount === 0) {
                        this.createPieces();
                    }
                }
            );
        });

        setTimeout(() => {
            if (this.loadingCount > 0) {
                this.loadingCount = 0;
                this.useSimpleGeometry = true;
                this.createPieces();
            }
        }, 5000);
    }

    getPieceTypeFromCode(code) {
        const pieceType = code[1].toLowerCase();
        switch (pieceType) {
            case 'p': return 'pawn';
            case 'r': return 'rook';
            case 'n': return 'knight';
            case 'b': return 'bishop';
            case 'q': return 'queen';
            case 'k': return 'king';
            default: return 'pawn';
        }
    }

    setupRenderer() {
        const container = document.getElementById('chess-board');
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 15, 5);
        this.scene.add(directionalLight);

        const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
        secondaryLight.position.set(-5, 10, -5);
        this.scene.add(secondaryLight);
    }

    createPieces() {
        this.pieces = [];
        for (let x = 0; x < 8; x++) {
            for (let z = 0; z < 8; z++) {
                const piece = this.engine.board[z][x];
                if (piece) {
                    this.createPiece(piece, x, z);
                }
            }
        }
    }

    getPieceScale(type) {
        switch(type) {
            case 'p': return { x: 0.4, y: 0.8, z: 0.4 };
            case 'r': return { x: 0.5, y: 1.0, z: 0.5 };
            case 'n': return { x: 0.5, y: 1.1, z: 0.5 };
            case 'b': return { x: 0.5, y: 1.2, z: 0.5 };
            case 'q': return { x: 0.6, y: 1.4, z: 0.6 };
            case 'k': return { x: 0.6, y: 1.6, z: 0.6 };
            default: return { x: 0.5, y: 1.0, z: 0.5 };
        }
    }

    getSimplePieceGeometry(type) {
        switch(type) {
            case 'p':
                return new THREE.CylinderGeometry(0.2, 0.4, 1, 12);
            case 'r':
                return new THREE.BoxGeometry(0.6, 1, 0.6);
            case 'n':
                const knightGeo = new THREE.CylinderGeometry(0.2, 0.4, 1, 4);
                knightGeo.rotateY(Math.PI / 4);
                return knightGeo;
            case 'b':
                return new THREE.ConeGeometry(0.4, 1.2, 16);
            case 'q':
                return new THREE.CylinderGeometry(0.2, 0.5, 1.4, 16);
            case 'k':
                const kingGeo = new THREE.CylinderGeometry(0.2, 0.5, 1.6, 16);
                const cross = new THREE.BoxGeometry(0.2, 0.4, 0.2);
                cross.translate(0, 0.8, 0);
                return THREE.BufferGeometryUtils.mergeBufferGeometries([kingGeo, cross]);
            default:
                return new THREE.BoxGeometry(0.4, 1, 0.4);
        }
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        this.controls.enabled = false;
        
        this.renderer.domElement.addEventListener('click', (event) => this.handleClick(event));
    }

    handleClick(event) {
        if (this.cameraMode !== 'game') return;
        if (this.gameMode === 'ai' && this.engine.currentPlayer[0] !== this.playerColor[0]) return;

        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            
            if (clickedObject.userData.isSquare) {
                const boardPos = [clickedObject.userData.boardX, clickedObject.userData.boardZ];
                
                if (this.selectedPiece) {
                    this.tryMove(boardPos);
                } else {
                    this.selectPiece(boardPos);
                }
            } else {
                const boardPos = this.getBoardPosition(clickedObject.position);
                this.selectPiece(boardPos);
            }
        } else {
            this.clearHighlights();
            this.selectedPiece = null;
        }
    }

    getBoardPosition(position) {
        const x = Math.round(position.x / 1.5 + 3.5);
        const z = Math.round(position.z / 1.5 + 3.5);
        return [x, z];
    }

    selectPiece(pos) {
        const [x, y] = pos;
        const piece = this.engine.board[y][x];
        
        if (piece && piece[0] === this.engine.currentPlayer[0]) {
            this.clearHighlights();
            this.selectedPiece = { pos: [x, y], piece };
            
            const selectedHighlight = new THREE.Mesh(
                new THREE.CircleGeometry(0.7, 32),
                new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                })
            );
            selectedHighlight.position.set((x - 3.5) * 1.5, 0.32, (y - 3.5) * 1.5);
            selectedHighlight.rotation.x = -Math.PI / 2;
            this.scene.add(selectedHighlight);
            this.highlightedSquares.push(selectedHighlight);
            
            this.highlightValidMoves();
        }
    }

    tryMove(to) {
        const from = this.selectedPiece.pos;
        if (this.engine.makeMove(from, to)) {
            this.updatePiecePosition(from, to);
            this.clearHighlights();
            this.selectedPiece = null;
            
            if (this.engine.isGameOver) {
                this.showGameOver(this.engine.winner);
                return;
            }
            
            if (this.gameMode === 'ai' && this.engine.currentPlayer !== this.playerColor) {
                setTimeout(() => {
                    const aiMove = this.ai.makeMove();
                    if (aiMove) {
                        this.engine.makeMove(aiMove.from, aiMove.to);
                        this.updatePiecePosition(aiMove.from, aiMove.to);
                        
                        if (this.engine.isGameOver) {
                            this.showGameOver(this.engine.winner);
                        }
                    }
                }, 500);
            } else if (this.gameMode === 'pvp' && this.cameraMode === 'game') {
                const cameraPos = this.engine.currentPlayer === 'white' ? 
                    this.whitePlayerCamera : this.blackPlayerCamera;
                this.camera.position.copy(cameraPos);
                this.camera.lookAt(0, 0, 0);
            }
        }
        this.selectedPiece = null;
        this.clearHighlights();
    }

    updatePiecePosition(from, to) {
        const [fromX, fromY] = from;
        const [toX, toY] = to;
        
        const capturedPiece = this.pieces.find(p => 
            p.position[0] === toX && p.position[1] === toY
        );
        if (capturedPiece) {
            this.scene.remove(capturedPiece.mesh);
            this.pieces = this.pieces.filter(p => p !== capturedPiece);
        }

        const piece = this.pieces.find(p => 
            p.position[0] === fromX && p.position[1] === fromY
        );
        if (piece) {
            piece.position = [toX, toY];
            piece.mesh.position.set(
                (toX - 3.5) * 1.5,
                piece.mesh.position.y,
                (toY - 3.5) * 1.5
            );
        }

        const turnDisplay = document.getElementById('turn-display');
        if (this.gameMode === 'pvp') {
            const color = this.engine.currentPlayer === 'white' ? '#FFFFFF' : '#000000';
            const background = this.engine.currentPlayer === 'white' ? '#2c3e50' : '#95a5a6';
            turnDisplay.innerHTML = `<span style="color: ${color}; background: ${background}; padding: 5px 10px; border-radius: 4px;">${this.engine.currentPlayer.toUpperCase()}'s Turn</span>`;
        } else {
            turnDisplay.textContent = this.engine.currentPlayer === 'white' ? 
                'Your Turn (White)' : 'AI Thinking...';
        }
    }

    highlightValidMoves() {
        this.clearHighlights();
        const [fromX, fromY] = this.selectedPiece.pos;

        const selectedHighlight = new THREE.Mesh(
            new THREE.CircleGeometry(0.7, 32),
            new THREE.MeshBasicMaterial({
                color: 0xffeb3b,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
                depthTest: false
            })
        );
        selectedHighlight.position.set(
            (fromX - 3.5) * 1.5, 
            0.35,  
            (fromY - 3.5) * 1.5
        );
        selectedHighlight.rotation.x = -Math.PI / 2;
        this.scene.add(selectedHighlight);
        this.highlightedSquares.push(selectedHighlight);

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.engine.isValidMove([fromX, fromY], [x, y])) {
                    const isCapture = this.engine.board[y][x] !== null;
                    const highlight = new THREE.Mesh(
                        new THREE.CircleGeometry(0.4, 32),
                        new THREE.MeshBasicMaterial({
                            color: isCapture ? 0xff4444 : 0x4CAF50,
                            transparent: true,
                            opacity: 0.7,
                            side: THREE.DoubleSide,
                            depthTest: false
                        })
                    );
                    highlight.position.set(
                        (x - 3.5) * 1.5, 
                        0.35,  
                        (y - 3.5) * 1.5
                    );
                    highlight.rotation.x = -Math.PI / 2;
                    this.scene.add(highlight);
                    this.highlightedSquares.push(highlight);
                }
            }
        }
    }

    clearHighlights() {
        this.highlightedSquares.forEach(highlight => {
            this.scene.remove(highlight);
        });
        this.highlightedSquares = [];
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setupGameResetButton() {
        const resetButton = document.getElementById('reset-game');
        resetButton.addEventListener('click', () => {
            this.newGamePressCount++;
            if (this.newGamePressCount >= 5) {
                this.showChillOutMessage();
                this.newGamePressCount = 0;
            } else {
                this.resetGame();
            }
        });
    }

    showChillOutMessage() {
        const chillOutMessage = document.getElementById('chill-out-message');
        chillOutMessage.style.display = 'block';
    }

    resetGame() {
        this.engine = new ChessEngine();
        this.ai = new ChessAI(this.engine);
        
        this.pieces.forEach(piece => {
            this.scene.remove(piece.mesh);
            this.clickableObjects = this.clickableObjects.filter(obj => obj !== piece.mesh);
        });
        this.pieces = [];
        this.clearHighlights();
        this.selectedPiece = null;
        
        this.createPieces();
        
        if (this.cameraMode === 'game') {
            this.camera.position.set(0, 12, 0);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
        
        if (this.gameMode === 'pvp' && this.cameraMode === 'game') {
            this.camera.position.copy(this.whitePlayerCamera);
            this.camera.lookAt(0, 0, 0);
        }
        
        if (this.gameMode === 'ai' && this.cameraMode === 'game') {
            const cameraPos = this.playerColor === 'white' ? 
                this.whitePlayerCamera : this.blackPlayerCamera;
            this.camera.position.copy(cameraPos);
            this.camera.lookAt(0, 0, 0);
            
            if (this.playerColor === 'black') {
                setTimeout(() => {
                    const aiMove = this.ai.makeMove();
                    if (aiMove) {
                        this.engine.makeMove(aiMove.from, aiMove.to);
                        this.updatePiecePosition(aiMove.from, aiMove.to);
                    }
                }, 500);
            }
        }
        
        const turnDisplay = document.getElementById('turn-display');
        if (this.gameMode === 'pvp') {
            turnDisplay.innerHTML = '<span style="color: #FFFFFF; background: #2c3e50; padding: 5px 10px; border-radius: 4px;">WHITE\'s Turn</span>';
        } else {
            turnDisplay.textContent = 'Your Turn (White)';
        }
        
        this.controls.update();
        document.getElementById('game-over').style.display = 'none';
    }

    showGameOver(winner) {
        const gameOver = document.getElementById('game-over');
        const gameOverText = document.getElementById('game-over-text');
        
        if (this.gameMode === 'pvp') {
            const loser = winner === 'white' ? 'BLACK' : 'WHITE';
            const winnerFormatted = winner.toUpperCase();
            gameOverText.innerHTML = `PLAYER ${winnerFormatted} DOMINATED PLAYER ${loser}`;
        } else {
            gameOverText.textContent = winner === 'white' ? 'Nice ngl' : 'cmV0YXJk';
        }
        
        gameOver.className = winner === 'white' ? 'win' : 'lose';
        gameOver.style.display = 'block';
    }

    setupPerfectButton() {
        const perfectButton = document.getElementById('perfect-button');
        const perfectVideoModal = document.getElementById('perfect-video-modal');
        const perfectVideo = document.getElementById('perfect-video');
        const closeVideoButton = document.getElementById('close-video-button');

        perfectButton.addEventListener('click', () => {
            perfectVideoModal.style.display = 'block';
            perfectVideo.play();
        });

        closeVideoButton.addEventListener('click', () => {
            perfectVideo.pause();
            perfectVideoModal.style.display = 'none';
        });

        perfectVideo.addEventListener('ended', () => {
            perfectVideoModal.style.display = 'none';
        });
    }
}

const game = new ChessGame();
