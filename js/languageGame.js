// Language Game Module
class LanguageGame {
    constructor() {
        this.score = 0;
        this.currentLanguage = null;
        this.currentText = '';
        this.translationService = new TranslationService();
        // Timer removed
        this.gameState = new GameState();
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Language game elements
        this.languageGameScreen = document.getElementById('languageGameScreen');
        this.languageScoreElement = document.getElementById('languageScore');
        this.languageQuestion = document.getElementById('languageQuestion');
        this.languageText = document.getElementById('languageText');
        this.languageOptions = document.getElementById('languageOptions');
        this.languageBackToMainMenuBtn = document.getElementById('languageBackToMainMenu');
        this.timeLeftElement = document.getElementById('languageTimeLeft');
    }

    bindEvents() {
        // Language options
        if (this.languageOptions) {
            this.languageOptions.addEventListener('click', (e) => {
                if (e.target.classList.contains('language-option')) {
                    const selectedIndex = parseInt(e.target.dataset.index);
                    this.handleLanguageAnswer(selectedIndex);
                }
            });
        }

        // Difficulty toggle removed - only text mode now


        // Back to main menu button
        if (this.languageBackToMainMenuBtn) {
            this.languageBackToMainMenuBtn.addEventListener('click', () => {
                this.showStartScreen();
            });
        }
    }

    startGame() {
        // Clear any existing overlays
        GameUtils.removeOverlay('game-over-overlay');
        GameUtils.removeOverlay('population-game-over-overlay');
        GameUtils.removeOverlay('language-game-over-overlay');
        
        
        this.score = 0;
        this.gameState.startGame('language');
        this.timerLocked = false;
        
        this.updateScore();
        this.showLanguageGameScreen();
        this.nextQuestion();
    }

    showLanguageGameScreen() {
        this.languageGameScreen.classList.add('active');
        this.updateDifficultyDisplay();
    }

    showStartScreen() {
        // This will be handled by the main game controller
        if (window.gameController) {
            window.gameController.showStartScreen();
        }
    }

    async nextQuestion() {
        if (!this.gameState.isGameActive) {
            return;
        }

        // Reset timer lock for new question
        this.timerLocked = false;
        
        // Update difficulty display
        this.updateDifficultyDisplay();

        // Reset question text color
        if (this.languageQuestion) {
            this.languageQuestion.style.color = '#2d3748';
        }

        // Get random languages for options (including English)
        const allLanguages = Object.keys(this.translationService.languages);
        const availableLanguages = ['English']; // Always include English
        const otherLanguages = allLanguages.filter(lang => lang !== 'English');
        
        // Add 3 more random languages
        GameUtils.shuffleArray(otherLanguages);
        availableLanguages.push(...otherLanguages.slice(0, 3));
        
        // Shuffle to randomize positions
        GameUtils.shuffleArray(availableLanguages);
        
        // Pick a random target language from the available options
        const randomIndex = Math.floor(Math.random() * availableLanguages.length);
        this.currentLanguage = availableLanguages[randomIndex];

        // Get a random phrase to translate
        const phrase = this.translationService.getRandomPhrase();
        
        try {
            // Translate the phrase to the target language
            const translatedText = await this.translationService.translateText(
                phrase, 
                this.translationService.getLanguageCode(this.currentLanguage)
            );
            
            // Check if translation actually happened (text should be different from original)
            if (translatedText === phrase && this.currentLanguage !== 'English') {
                console.log('Translation failed - text unchanged, falling back to English');
                // Translation failed, use English instead
                this.currentLanguage = 'English';
                this.currentText = phrase;
            } else {
                this.currentText = translatedText;
            }
            
            // Always show text question (no audio mode)
            this.showTextQuestion(this.currentText, availableLanguages);
            
            // Timer removed - no timer needed
            
        } catch (error) {
            console.error('Translation error:', error);
            // Fallback: use English
            this.currentLanguage = 'English';
            this.currentText = phrase;
            
            this.showTextQuestion(this.currentText, availableLanguages);
        }
    }

    showTextQuestion(text, languages) {
        // Show text elements
        this.languageText.style.display = 'block';
        
        // Update question text
        this.languageQuestion.textContent = 'What language is this text written in?';
        
        // Update the text to display
        this.languageText.textContent = text;
        this.languageText.style.fontSize = '2rem';
        this.languageText.style.fontWeight = '600';
        this.languageText.style.color = '#2d3748';
        this.languageText.style.textAlign = 'center';
        this.languageText.style.padding = '20px';
        this.languageText.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        this.languageText.style.borderRadius = '12px';
        this.languageText.style.border = '1px solid #e2e8f0';
        this.languageText.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
        
        // Generate language options
        this.generateLanguageOptions(languages);
    }


    generateLanguageOptions(languages) {
        this.languageOptions.innerHTML = '';
        
        languages.forEach((language, index) => {
            const button = document.createElement('button');
            button.className = 'language-option';
            button.textContent = language;
            button.dataset.index = index;
            button.dataset.language = language;
            this.languageOptions.appendChild(button);
        });
    }


    handleLanguageAnswer(selectedIndex) {
        if (!this.gameState.isGameActive) {
            return;
        }

        this.gameState.stopGame();

        const options = Array.from(this.languageOptions.querySelectorAll('.language-option'));
        const selectedOption = options[selectedIndex];
        const selectedLanguage = selectedOption.dataset.language;
        const isCorrect = selectedLanguage === this.currentLanguage;

        if (isCorrect) {
            selectedOption.classList.add('correct');
            this.score++;
            this.updateScore();
            
            setTimeout(() => {
                this.gameState.startGame('language');
                this.nextQuestion();
            }, 1000);
        } else {
            selectedOption.classList.add('incorrect');
            
            // Find and highlight the correct answer
            options.forEach((option) => {
                if (option.dataset.language === this.currentLanguage) {
                    option.classList.add('correct');
                }
            });
            
            this.showCorrectAnswer();
        }
    }

    handleTimeout() {
        this.gameState.stopGame();
        this.showGameOverScreen();
    }

    showCorrectAnswer() {
        const questionElement = document.getElementById('languageQuestion');
        if (questionElement) {
            questionElement.innerHTML = `❌ Wrong! The correct language was: <strong>${this.currentLanguage}</strong>`;
            questionElement.style.color = '#dc3545';
        }
        
        setTimeout(() => {
            this.showGameOverScreen();
        }, 2000);
    }

    showGameOverScreen() {
        GameUtils.removeOverlay('language-game-over-overlay');
        
        const overlay = GameUtils.createOverlay('language-game-over-overlay', `
            <div class="language-game-over-modal">
                <div class="game-over-close" id="languageGameOverClose">×</div>
                <h2>Game Over!</h2>
                <div class="final-score">
                    <p>Final Score: <strong>${this.score}</strong></p>
                </div>
                <div class="language-game-over-buttons">
                    <button id="languagePlayAgain" class="btn btn-primary">Play Again</button>
                    <button id="languageMainMenu" class="btn btn-secondary">Main Menu</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(overlay);
        
        // Add close button functionality
        document.getElementById('languageGameOverClose').addEventListener('click', () => {
            GameUtils.removeOverlay('language-game-over-overlay');
            this.gameState.stopGame();
            this.showCorrectAnswerAfterGameOver();
        });
        
        // Add event listeners
        document.getElementById('languagePlayAgain').addEventListener('click', () => {
            GameUtils.removeOverlay('language-game-over-overlay');
            this.startGame();
        });
        
        document.getElementById('languageMainMenu').addEventListener('click', () => {
            GameUtils.removeOverlay('language-game-over-overlay');
            this.showStartScreen();
        });
    }

    showCorrectAnswerAfterGameOver() {
        const questionElement = document.getElementById('languageQuestion');
        if (questionElement) {
            questionElement.innerHTML = `❌ Wrong! The correct language was: <strong>${this.currentLanguage}</strong>`;
            questionElement.style.color = '#dc3545';
        }
        
        this.showBackToMenuButton();
    }

    showBackToMenuButton() {
        const existingButton = document.getElementById('backToMenuBtn');
        if (existingButton) {
            existingButton.remove();
        }

        const backButton = GameUtils.createButton('🏠 Back to Main Menu', 'btn btn-secondary back-to-menu-btn', 'backToMenuBtn');
        backButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 12px 20px;
            font-size: 0.9rem;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(139, 69, 19, 0.2);
            color: #4a5568;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(8px);
            transition: all 0.2s ease;
        `;

        backButton.addEventListener('click', () => {
            this.showStartScreen();
            backButton.remove();
        });

        document.body.appendChild(backButton);
    }

    showErrorAndRetry() {
        this.languageQuestion.textContent = 'Error loading question. Retrying...';
        this.languageQuestion.style.color = '#dc3545';
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    // Timer methods removed

    updateDifficultyDisplay() {
        // Always show text mode (no audio functionality)
        this.languageText.style.display = 'block';
    }

    updateScore() {
        if (this.languageScoreElement) {
            this.languageScoreElement.textContent = this.score;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageGame;
}
