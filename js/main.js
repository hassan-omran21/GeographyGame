// Main Game Controller
class GameController {
    constructor() {
        this.flagGame = null;
        this.populationGame = null;
        this.languageGame = null;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeGames();
    }

    initializeElements() {
        // Main menu elements
        this.startScreen = document.getElementById('startScreen');
        this.flagGameBtn = document.getElementById('flagGameBtn');
        this.populationGameBtn = document.getElementById('populationGameBtn');
        this.languageGameBtn = document.getElementById('languageGameBtn');
    }

    bindEvents() {
        // Game selection buttons
        if (this.flagGameBtn) {
            this.flagGameBtn.addEventListener('click', () => {
                this.showFlagGamePopup();
            });
        }

        if (this.populationGameBtn) {
            this.populationGameBtn.addEventListener('click', () => {
                this.startPopulationGame();
            });
        }

        if (this.languageGameBtn) {
            this.languageGameBtn.addEventListener('click', () => {
                this.showLanguageGamePopup();
            });
        }
    }

    initializeGames() {
        // Initialize game modules
        this.flagGame = new FlagGame();
        this.populationGame = new PopulationGame();
        this.languageGame = new LanguageGame();
        
        // Make games accessible to each other for navigation
        this.flagGame.gameController = this;
        this.populationGame.gameController = this;
        this.languageGame.gameController = this;
    }

    showStartScreen() {
        this.startScreen.classList.add('active');
        
        // Hide other game screens
        const gameScreen = document.getElementById('gameScreen');
        const populationGameScreen = document.getElementById('populationGameScreen');
        const languageGameScreen = document.getElementById('languageGameScreen');
        
        if (gameScreen) gameScreen.classList.remove('active');
        if (populationGameScreen) populationGameScreen.classList.remove('active');
        if (languageGameScreen) languageGameScreen.classList.remove('active');
        
        // Remove any overlays
        GameUtils.removeOverlay('game-over-overlay');
        GameUtils.removeOverlay('population-game-over-overlay');
        GameUtils.removeOverlay('language-game-over-overlay');
        
        // Remove back to menu button if it exists
        const backButton = document.getElementById('backToMenuBtn');
        if (backButton) {
            backButton.remove();
        }
        
        // Reset current game
        if (this.flagGame) this.flagGame.gameState.reset();
        if (this.populationGame) this.populationGame.gameState.reset();
        if (this.languageGame) this.languageGame.gameState.reset();
    }

    showFlagGamePopup() {
        // Create overlay for game mode selection
        const overlay = GameUtils.createOverlay('game-mode-overlay', `
            <div class="game-mode-popup">
                <h3>Choose Game Mode</h3>
                <div class="popup-options">
                    <div class="popup-option" data-mode="multiple-choice">
                        <div class="option-title">Multiple Choice</div>
                        <div class="option-desc">Choose from 4 options</div>
                    </div>
                    <div class="popup-option" data-mode="typing">
                        <div class="option-title">Type Answer</div>
                        <div class="option-desc">Type the country name</div>
                    </div>
                </div>
            </div>
        `);
        
        document.body.appendChild(overlay);
        
        // Add event listeners to options
        const options = overlay.querySelectorAll('.popup-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const mode = option.dataset.mode;
                document.body.removeChild(overlay);
                this.startFlagGame(mode);
            });
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    showLanguageGamePopup() {
        // No popup needed - start game directly
        this.startLanguageGame();
    }

    startFlagGame(mode) {
        // Hide main menu
        this.startScreen.classList.remove('active');
        
        // Initialize flag game with selected mode
        if (this.flagGame) {
            this.flagGame.isTypingMode = mode === 'typing';
            this.flagGame.startGame();
        }
    }

    startPopulationGame() {
        // Hide main menu
        this.startScreen.classList.remove('active');
        
        // Initialize population game
        if (this.populationGame) {
            this.populationGame.startGame();
        }
    }

    startLanguageGame() {
        // Hide main menu
        this.startScreen.classList.remove('active');
        
        // Initialize language game
        if (this.languageGame) {
            this.languageGame.startGame();
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up global game controller
    window.gameController = new GameController();
});
