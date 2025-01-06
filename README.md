# 3D Chess Game

A browser-based 3D chess game built with Three.js featuring AI opponent and multiplayer modes.

## Features

- 3D chess board with detailed piece models
- AI opponent with three difficulty levels:
  - Easy: Mostly random moves with basic capture logic
  - Medium: Considers center control and piece development
  - Hard: Advanced evaluation with position control and tactics
- Two game modes:
  - vs AI: Play against the computer
  - vs Player: Local multiplayer mode
- Free camera mode for viewing the board from any angle
- Game view mode with fixed perspectives
- Visual move highlighting system:
  - Yellow: Selected piece
  - Green: Valid moves to empty squares
  - Red: Possible capture moves
- Auto-promotion of pawns to queens
- En passant capture support
- Game over detection with win/lose conditions

## Controls

- Click to select pieces and make moves
- Game View/Free Camera toggle for different perspectives
- Reset game button to start a new match
- Difficulty selection for AI opponent

## Setup

1. Clone the repository
2. Open index.html in a modern web browser
3. No build process required - it's pure JavaScript

## Technologies Used

- Three.js for 3D graphics
- Pure JavaScript for game logic
- CSS for UI styling

## Project Structure

- `chess-engine.js` - Core chess game logic
- `chess-ai.js` - AI opponent implementation
- `game.js` - 3D visualization and user interface
- `index.html` - Main entry point
- `styles.css` - UI styling

## Browser Support

Works in all modern browsers that support WebGL:
- Chrome (recommended)
- Firefox
- Safari
- Edge
⠛⠻⣛⣟⢛⡛⠛⠛⢻⡟⠛⠛⡟⢻⠛⠿⣛⡻⠿⠿⣿⣻⡛⡛⣿⠛⡿⠛⡛⢛⡛⠛⠛⠛⠛⠛⠛⠛⠛⢛⣻⡛⢛⣛⡛⠛⠛⠻⡛⣿⣿⢟⡿⢛⠟⡻⣻⡟⠛⠛⣛⢟⠿⡛⠛
⠀⠀⡈⢻⣧⡑⢤⡘⣄⢳⡀⢰⣷⠀⣆⡴⠋⢠⠀⠀⠈⠳⣵⣱⢸⣽⠃⢰⡇⠀⠹⡄⠀⠀⠀⠀⠀⣠⠾⠋⠀⠀⠀⠙⣿⡶⡀⠀⠀⢿⠁⣡⣶⢃⠜⡵⡻⠁⣠⠞⢀⡴⠊⠁⠀
⠀⠀⠈⢢⠙⢿⢆⠹⣮⣦⢣⠈⡎⢧⡟⠀⢸⢸⠀⠀⠀⠀⠙⢿⣟⡏⠀⣿⢷⠀⢀⣽⠞⠀⠀⣰⠞⠁⣠⠖⠉⣸⣿⠉⠀⠀⠀⠀⠀⠘⣞⡝⡱⢣⠞⢀⢞⣼⣣⣾⠋⢀⠞⢁⠔
⢣⠀⠑⡀⠑⢌⠺⣷⡘⢟⢮⠀⢣⡞⠀⠀⣎⡼⡇⠀⠀⠘⣄⠀⠹⠇⢰⠃⢘⡿⣿⠏⠀⢠⡾⠃⣠⠞⠁⠀⢰⣿⠇⠀⠀⠀⠀⠀⠀⠀⢻⠏⠵⠁⡰⡾⠋⢸⢿⠇⠀⠀⣠⠋⠀
⠀⠙⠢⣝⣦⡀⠑⢌⡻⣎⢮⢧⢸⠁⠀⣸⡟⠙⡶⠀⠀⡆⠸⡷⣤⢧⡾⠀⡏⣴⠏⠀⡴⡟⣡⠞⣁⠀⠀⢀⣸⡿⠀⠀⠀⠀⠀⠀⢸⣯⡍⠀⢀⠾⣛⣭⡽⣧⠋⠀⡴⡿⠁⢀⠜
⠀⠀⡘⢆⠹⡫⢷⣤⣀⣌⣷⡉⣾⠀⢰⡕⠁⠀⠃⠀⠀⠷⣤⡿⠈⢻⡇⢸⢹⠏⠀⣼⢞⡴⢱⠋⡠⠽⢋⣉⡠⠴⠾⢽⣶⠤⠀⠀⠈⣿⣟⡴⣫⣾⡟⢣⣧⠈⣇⣜⡜⡅⣠⢎⡤
⣄⠀⠈⠢⡳⣌⠳⣬⡛⣿⣭⣳⡜⡇⡸⡇⠀⠀⠀⠀⠀⠐⠛⠫⣕⢤⣳⡞⣇⠀⣼⣯⠎⢁⡼⣫⡴⠞⠉⠁⠀⠀⠀⣠⠤⠽⠆⠀⠀⠈⠛⠐⣿⢻⣧⠀⢻⠀⣯⡜⡜⣰⠗⠉⢀
⠈⠳⣄⠀⠻⣮⠳⣌⠙⢿⡻⠮⣝⣧⡇⡇⢀⡠⠤⠤⢄⣀⠀⠀⠀⠙⣤⣇⢻⣿⠿⠋⠳⣿⠞⠁⣰⢶⣤⠀⠀⠀⢸⠁⠀⠀⠀⠀⠀⠀⠀⠀⣏⠀⠉⠀⠸⠀⣿⣞⡼⡁⣠⠖⠁
⠀⠀⠈⠳⣄⠈⠢⡈⢷⣤⡈⠓⠤⣹⠹⠃⡜⠀⣀⠤⠀⠠⢭⣵⣲⣒⣻⢿⡟⢩⣍⠉⠋⠁⠀⠀⢡⠞⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣗⢤⠀⠀⠀⡏⡿⠊⠖⠁⢀⡤
⠀⠀⠀⠀⠈⠢⡀⠈⢆⠙⢿⣦⣄⡈⣇⡄⣧⣰⣷⣀⠀⠀⣎⡠⢜⣏⣵⣾⠤⢮⡈⢦⠀⠀⠀⣠⣯⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠞⣼⠀⠀⢠⠟⢁⣀⣴⡾⠋⣀
⠀⠒⠚⠒⠒⠒⠚⠦⡀⢷⣄⠉⠳⠍⠻⢷⠻⠃⠙⠻⡶⠚⣡⠴⠛⠓⠚⢻⡷⡶⣮⡟⠀⡠⠾⠟⣡⣿⠀⠀⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⠀⣠⣯⣤⡯⠀⠀⡜⢊⡥⣚⢅⡠⠞⠀
⠀⠀⣉⠒⠲⠤⢤⣀⡈⠢⡳⣷⣄⠀⢀⣘⣇⠀⠀⠀⣴⠋⠁⠀⠀⠀⠀⠈⠛⠛⣻⡴⣋⠤⠚⠉⢀⣸⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⢠⠟⣹⠀⠀⢠⡾⢟⡡⣺⠷⠋⠀⠀⠀
⡀⠀⠤⣀⡀⠠⢤⣈⡙⢶⣾⣇⡉⠳⡏⢹⡿⣦⠀⠎⠀⠀⠀⠀⠀⠀⢰⣖⡤⢚⠅⠀⢀⡠⠔⠂⠉⠁⠀⠀⠀⠀⠀⠸⡀⠀⠀⠀⠀⠀⢺⣸⣁⣤⠶⣻⢗⣭⡮⠥⣤⣤⣤⣀⠀
⠈⠹⠶⠦⠭⢑⡢⢄⡉⠛⢿⣿⣿⣦⣧⠘⡝⣦⣧⡀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠧⠤⠚⠁⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⢀⡾⡧⢚⣁⠬⣛⠥⠐⠊⠉⠀⠈⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠑⠮⢕⡀⠘⢿⣿⣿⣧⠱⠘⠿⠱⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡿⢞⣉⣉⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣄⣿⣟⠵⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠐⠲⠶⣒⡒⠚⣷⢦⣈⠛⢽⣦⠀⠸⣶⠻⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢏⡠⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠋⠘⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠑⠮⣉⠛⠢⠴⢿⣦⣌⡛⠓⠹⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡆⠀⢀⣼⠇⠀⠀⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠙⣓⡶⠟⠓⠢⣬⣵⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠜⢀⡤⠋⡼⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠭⠍⢁⣀⠠⢾⣏⣁⡏⠀⢿⡓⠤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠊⣠⠊⠀⢰⢧⠀⠀⠀⠈⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣼⣿⢿⠁⠀⠘⣧⠀⠈⠑⠦⣄⡀⠀⠀⠀⣀⡠⠤⠖⣊⣵⣿⠛⡇⠀⡎⢸⠀⠀⠀⠀⢹⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣶⣾⡿⠛⠉⠀⡸⠀⠀⠀⢻⣗⠦⡀⠀⠀⠙⠻⣟⠛⠒⠒⣨⠽⣻⣿⡇⠀⡇⢰⠃⡼⠀⠀⠀⠀⢸⠢⣍⠲⢤⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣶⣶⣿⣷⠼⠛⠁⠀⢀⣠⢴⡇⠀⠀⡄⠈⡝⣆⠈⠓⠤⣠⡀⠈⠉⠒⣉⠤⠊⣿⣿⠃⢀⡇⡞⢠⢣⠇⠀⠀⠀⠘⣦⡀⠉⠢⢍⠢⢄⠀⢀⣠⣤⣤
⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⡿⠟⠁⠀⣀⠤⣾⡿⢓⢽⠃⠀⠀⢷⠀⢱⠘⡄⠀⠀⠈⣏⠁⠈⠉⠀⠀⢘⣳⠃⢀⡜⡸⠁⡌⣾⠀⠀⠀⠀⠀⢦⣙⣆⠀⠀⠙⠢⣙⠿⣿⣿⣿
⣿⣿⣶⣾⣿⣿⣿⣿⣿⣿⠟⠋⠀⣀⠔⠊⠁⠞⠁⣠⠊⠀⠀⠀⢸⢸⡄⠀⢧⠸⡄⠀⠀⢹⠄⠀⠀⠀⠀⣾⠃⠀⡜⡴⠁⢰⢳⠻⡄⠀⠀⠀⠀⠀⠀⠉⠃⠀⠀⠀⠀⠑⢌⡻⣿
⣿⡏⢸⣿⣿⣿⣿⣿⡟⠁⣠⠔⠋⠀⠀⠀⠀⢀⡜⠁⠀⠀⠀⠀⡎⢸⡇⠀⠈⢆⠘⡄⠀⠀⠁⠀⠀⠀⢰⠃⠀⣼⠜⠀⠀⡎⢸⠀⢣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⣙⢮
⣶⣧⣼⣿⣿⣿⣿⣿⣿⣮⣥⣥⣤⣤⣤⣤⣤⣮⣤⣤⣤⣤⣤⣼⣤⣼⣧⣤⣤⣬⣦⣬⣦⣤⣤⣤⣤⣤⣮⣤⣼⣯⣤⣤⣼⣤⣼⣤⣼⣦⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣿⣿⣯