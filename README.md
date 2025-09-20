# Geography Quest - Country Game

A fun and educational web-based game that tests your knowledge of world geography through three different game modes.

## Features

### 🏳️ Flag Challenge
- **Multiple Choice Mode**: Choose from 4 country options based on flag images
- **Type Answer Mode**: Type the country name directly with autocomplete suggestions
- 15-second timer for multiple choice, 20 seconds for typing mode
- 195+ countries with real flag images

### 👥 Population Game
- Compare countries by population size
- Higher or Lower gameplay mechanics
- Real population data from 2023
- Smooth sliding animations between questions
- No time limit - focus on accuracy

### 🗣️ Language Game (NEW!)
- **Easy Mode**: Identify written text in different languages
- **Hard Mode**: Identify spoken phrases using text-to-speech
- 4 multiple choice options
- 20-25 languages supported including:
  - Arabic, Chinese, Spanish, French, German
  - Italian, Portuguese, Russian, Japanese, Korean
  - Dutch, Swedish, Norwegian, Danish, Finnish
  - And many more!
- 20-second timer for easy mode, 25 seconds for hard mode

## Technical Implementation

### Architecture
The codebase has been refactored into a clean modular structure:

```
js/
├── utils.js          # Shared utilities and services
├── flagGame.js       # Flag game logic
├── populationGame.js # Population game logic
├── languageGame.js   # Language game logic
└── main.js          # Main game controller
```

### Translation & TTS Services
- **Translation**: Uses MyMemory API (free alternative to Google Translate)
- **Text-to-Speech**: Browser's built-in Web Speech API
- **Language Support**: 40+ languages with proper language codes

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Error Handling**: Graceful fallbacks for API failures
- **Accessibility**: Keyboard navigation and screen reader friendly
- **Performance**: Optimized loading and efficient memory usage

## How to Play

1. **Start the Game**: Open `index.html` in your web browser
2. **Choose Game Mode**: Select from Flag Challenge, Population Game, or Language Game
3. **Select Difficulty**: For Flag and Language games, choose your preferred difficulty
4. **Play**: Answer questions correctly to increase your score
5. **Challenge Yourself**: Try all three game modes for a complete geography experience!

## Installation

No installation required! Simply:
1. Download all files to a folder
2. Open `index.html` in a modern web browser
3. Start playing!

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## API Dependencies

- **RestCountries API**: For country and flag data
- **MyMemory API**: For text translation (free tier)
- **Web Speech API**: For text-to-speech (browser built-in)

## Future Enhancements

- Leaderboard system
- Additional game modes (capitals, currencies, etc.)
- Multiplayer support
- Progressive Web App features
- Offline mode with cached data

## Contributing

Feel free to contribute improvements, bug fixes, or new features!

## License

This project is open source and available under the MIT License.
