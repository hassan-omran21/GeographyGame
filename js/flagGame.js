// Flag Game Module
class FlagGame {
    constructor() {
        this.countries = [];
        this.usedCountries = new Set();
        this.currentCountry = null;
        this.score = 0;
        this.isTypingMode = false;
        this.timerLocked = false;
        this.autocompleteSuggestions = [];
        this.selectedSuggestionIndex = -1;
        
        // Timer removed
        this.gameState = new GameState();
        
        this.initializeElements();
        this.bindEvents();
        this.loadCountries();
    }

    initializeElements() {
        // Game screen elements
        this.gameScreen = document.getElementById('gameScreen');
        this.flagImage = document.getElementById('flagImage');
        this.question = document.querySelector('.question h2');
        this.multipleChoiceOptions = document.getElementById('multipleChoiceOptions');
        this.typingInput = document.getElementById('typingInput');
        this.countryInput = document.getElementById('countryInput');
        this.submitAnswer = document.getElementById('submitAnswer');
        this.scoreElement = document.getElementById('score');
        this.timeLeftElement = document.getElementById('timeLeft');
        this.gameModeToggle = document.getElementById('gameModeToggle');
        this.autocompleteSuggestionsEl = document.getElementById('autocompleteSuggestions');
        this.backToMainMenuBtn = document.getElementById('backToMainMenu');
    }

    bindEvents() {
        // Multiple choice options
        if (this.multipleChoiceOptions) {
            this.multipleChoiceOptions.addEventListener('click', (e) => {
                if (e.target.classList.contains('option')) {
                    const selectedIndex = parseInt(e.target.dataset.index);
                    this.handleAnswer(selectedIndex);
                }
            });
        }

        // Typing input
        if (this.countryInput) {
            this.countryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleTypingAnswer();
                }
            });

            this.countryInput.addEventListener('input', () => {
                this.handleAutocomplete();
            });

            this.countryInput.addEventListener('keydown', (e) => {
                this.handleAutocompleteKeydown(e);
            });
        }

        // Submit button
        if (this.submitAnswer) {
            this.submitAnswer.addEventListener('click', () => {
                this.handleTypingAnswer();
            });
        }

        // Game mode toggle
        if (this.gameModeToggle) {
            this.gameModeToggle.addEventListener('change', () => {
                this.isTypingMode = this.gameModeToggle.checked;
                GameUtils.showNotification(`${this.isTypingMode ? 'Typing' : 'Multiple Choice'} mode will apply on the next round`);
                this.timerLocked = true;
            });
        }

        // Back to main menu button
        if (this.backToMainMenuBtn) {
            this.backToMainMenuBtn.addEventListener('click', () => {
                this.showStartScreen();
            });
        }
    }

    async loadCountries() {
        console.log('Attempting to load countries from API...');
        
        const endpoints = [
            'https://restcountries.com/v3.1/all',
            'https://restcountries.com/v3.1/independent?status=true',
            'https://restcountries.com/v2/all'
        ];

        for (let i = 0; i < endpoints.length; i++) {
            try {
                console.log(`Trying API endpoint ${i + 1}: ${endpoints[i]}`);
                const response = await fetch(endpoints[i]);
                
                if (response.ok) {
                    console.log(`API endpoint ${i + 1} successful!`);
                    const data = await response.json();
                    
                    if (Array.isArray(data)) {
                        this.countries = data.filter(country => 
                            country.name && 
                            country.name.common && 
                            country.flag && 
                            country.name.common !== 'Israel'
                        ).map(country => ({
                            name: country.name.common,
                            flag: this.isEmojiFlag(country.flag) ? this.getFlagUrl(country.name.common) : country.flag
                        }));

                        console.log('Successfully loaded', this.countries.length, 'countries from API');
                        
                        if (this.countries.length > 0) {
                            this.updateAvailableCountries();
                            return;
                        }
                    }
                } else {
                    console.log(`API endpoint ${i + 1} failed with status:`, response.status);
                }
            } catch (error) {
                console.log(`API endpoint ${i + 1} failed:`, error);
            }
        }

        console.log('All API endpoints failed, using fallback countries...');
        this.useFallbackCountries();
    }

    useFallbackCountries() {
        // Fallback countries with flag URLs
        const fallbackCountries = [
            { name: 'United States', flag: 'https://flagcdn.com/w320/us.png' },
            { name: 'China', flag: 'https://flagcdn.com/w320/cn.png' },
            { name: 'India', flag: 'https://flagcdn.com/w320/in.png' },
            { name: 'Brazil', flag: 'https://flagcdn.com/w320/br.png' },
            { name: 'Russia', flag: 'https://flagcdn.com/w320/ru.png' },
            { name: 'Japan', flag: 'https://flagcdn.com/w320/jp.png' },
            { name: 'Germany', flag: 'https://flagcdn.com/w320/de.png' },
            { name: 'France', flag: 'https://flagcdn.com/w320/fr.png' },
            { name: 'United Kingdom', flag: 'https://flagcdn.com/w320/gb.png' },
            { name: 'Italy', flag: 'https://flagcdn.com/w320/it.png' },
            { name: 'Canada', flag: 'https://flagcdn.com/w320/ca.png' },
            { name: 'Australia', flag: 'https://flagcdn.com/w320/au.png' },
            { name: 'Spain', flag: 'https://flagcdn.com/w320/es.png' },
            { name: 'Mexico', flag: 'https://flagcdn.com/w320/mx.png' },
            { name: 'South Korea', flag: 'https://flagcdn.com/w320/kr.png' },
            { name: 'Netherlands', flag: 'https://flagcdn.com/w320/nl.png' },
            { name: 'Switzerland', flag: 'https://flagcdn.com/w320/ch.png' },
            { name: 'Sweden', flag: 'https://flagcdn.com/w320/se.png' },
            { name: 'Norway', flag: 'https://flagcdn.com/w320/no.png' },
            { name: 'Denmark', flag: 'https://flagcdn.com/w320/dk.png' },
            { name: 'Finland', flag: 'https://flagcdn.com/w320/fi.png' },
            { name: 'Poland', flag: 'https://flagcdn.com/w320/pl.png' },
            { name: 'Turkey', flag: 'https://flagcdn.com/w320/tr.png' },
            { name: 'Iran', flag: 'https://flagcdn.com/w320/ir.png' },
            { name: 'Egypt', flag: 'https://flagcdn.com/w320/eg.png' },
            { name: 'South Africa', flag: 'https://flagcdn.com/w320/za.png' },
            { name: 'Nigeria', flag: 'https://flagcdn.com/w320/ng.png' },
            { name: 'Kenya', flag: 'https://flagcdn.com/w320/ke.png' },
            { name: 'Thailand', flag: 'https://flagcdn.com/w320/th.png' },
            { name: 'Vietnam', flag: 'https://flagcdn.com/w320/vn.png' },
            { name: 'Indonesia', flag: 'https://flagcdn.com/w320/id.png' },
            { name: 'Malaysia', flag: 'https://flagcdn.com/w320/my.png' },
            { name: 'Philippines', flag: 'https://flagcdn.com/w320/ph.png' },
            { name: 'Pakistan', flag: 'https://flagcdn.com/w320/pk.png' },
            { name: 'Bangladesh', flag: 'https://flagcdn.com/w320/bd.png' },
            { name: 'Argentina', flag: 'https://flagcdn.com/w320/ar.png' },
            { name: 'Chile', flag: 'https://flagcdn.com/w320/cl.png' },
            { name: 'Colombia', flag: 'https://flagcdn.com/w320/co.png' },
            { name: 'Peru', flag: 'https://flagcdn.com/w320/pe.png' },
            { name: 'Venezuela', flag: 'https://flagcdn.com/w320/ve.png' },
            { name: 'Ukraine', flag: 'https://flagcdn.com/w320/ua.png' },
            { name: 'Belgium', flag: 'https://flagcdn.com/w320/be.png' },
            { name: 'Austria', flag: 'https://flagcdn.com/w320/at.png' },
            { name: 'Greece', flag: 'https://flagcdn.com/w320/gr.png' },
            { name: 'Portugal', flag: 'https://flagcdn.com/w320/pt.png' },
            { name: 'Ireland', flag: 'https://flagcdn.com/w320/ie.png' },
            { name: 'New Zealand', flag: 'https://flagcdn.com/w320/nz.png' },
            { name: 'Singapore', flag: 'https://flagcdn.com/w320/sg.png' },
        ];

        this.countries = fallbackCountries.filter(country => country.name !== 'Israel');
        console.log('Using fallback countries:', this.countries.length);
        this.updateAvailableCountries();
    }

    isEmojiFlag(flag) {
        return /[\u{1F1E6}-\u{1F1FF}]/u.test(flag);
    }

    getFlagUrl(countryName) {
        return `https://flagcdn.com/w320/${this.getCountryCode(countryName)}.png`;
    }

    getCountryCode(countryName) {
        const codeMap = {
            'China': 'cn', 'India': 'in', 'United States': 'us', 'Indonesia': 'id',
            'Pakistan': 'pk', 'Brazil': 'br', 'Nigeria': 'ng', 'Bangladesh': 'bd',
            'Russia': 'ru', 'Mexico': 'mx', 'Japan': 'jp', 'Ethiopia': 'et',
            'Philippines': 'ph', 'Egypt': 'eg', 'Vietnam': 'vn', 'DR Congo': 'cd', 'Republic of Congo': 'cg', 'Congo': 'cg', 'Congo, Republic of the': 'cg',
            'Turkey': 'tr', 'Iran': 'ir', 'Germany': 'de', 'Thailand': 'th',
            'United Kingdom': 'gb', 'France': 'fr', 'Italy': 'it', 'Tanzania': 'tz',
            'South Africa': 'za', 'Myanmar': 'mm', 'Kenya': 'ke', 'South Korea': 'kr',
            'Colombia': 'co', 'Spain': 'es', 'Uganda': 'ug', 'Argentina': 'ar',
            'Algeria': 'dz', 'Sudan': 'sd', 'Ukraine': 'ua', 'Iraq': 'iq',
            'Afghanistan': 'af', 'Poland': 'pl', 'Canada': 'ca', 'Morocco': 'ma',
            'Saudi Arabia': 'sa', 'Uzbekistan': 'uz', 'Peru': 'pe', 'Angola': 'ao',
            'Malaysia': 'my', 'Mozambique': 'mz', 'Ghana': 'gh', 'Yemen': 'ye',
            'Nepal': 'np', 'Venezuela': 've', 'Madagascar': 'mg', 'Cameroon': 'cm',
            'Côte d\'Ivoire': 'ci', 'North Korea': 'kp', 'Australia': 'au', 'Niger': 'ne',
            'Taiwan': 'tw', 'Sri Lanka': 'lk', 'Burkina Faso': 'bf', 'Mali': 'ml',
            'Romania': 'ro', 'Malawi': 'mw', 'Chile': 'cl', 'Kazakhstan': 'kz',
            'Zambia': 'zm', 'Guatemala': 'gt', 'Ecuador': 'ec', 'Syria': 'sy',
            'Netherlands': 'nl', 'Senegal': 'sn', 'Cambodia': 'kh', 'Chad': 'td',
            'Somalia': 'so', 'Zimbabwe': 'zw', 'Guinea': 'gn', 'Rwanda': 'rw',
            'Benin': 'bj', 'Burundi': 'bi', 'Tunisia': 'tn', 'Bolivia': 'bo',
            'Belgium': 'be', 'Haiti': 'ht', 'Cuba': 'cu', 'South Sudan': 'ss',
            'Dominican Republic': 'do', 'Czech Republic': 'cz', 'Greece': 'gr',
            'Jordan': 'jo', 'Portugal': 'pt', 'Azerbaijan': 'az', 'Sweden': 'se',
            'Honduras': 'hn', 'United Arab Emirates': 'ae', 'Hungary': 'hu',
            'Tajikistan': 'tj', 'Belarus': 'by', 'Austria': 'at', 'Papua New Guinea': 'pg',
            'Serbia': 'rs', 'Switzerland': 'ch', 'Togo': 'tg', 'Sierra Leone': 'sl',
            'Hong Kong': 'hk', 'Laos': 'la', 'Paraguay': 'py', 'Bulgaria': 'bg',
            'Libya': 'ly', 'Lebanon': 'lb', 'Kyrgyzstan': 'kg', 'El Salvador': 'sv',
            'Nicaragua': 'ni', 'Turkmenistan': 'tm', 'Denmark': 'dk', 'Finland': 'fi',
            'Singapore': 'sg', 'Slovakia': 'sk', 'Norway': 'no', 'Oman': 'om',
            'State of Palestine': 'ps', 'Costa Rica': 'cr', 'Liberia': 'lr',
            'Ireland': 'ie', 'Central African Republic': 'cf', 'New Zealand': 'nz',
            'Mauritania': 'mr', 'Panama': 'pa', 'Kuwait': 'kw', 'Croatia': 'hr',
            'Moldova': 'md', 'Georgia': 'ge', 'Eritrea': 'er', 'Uruguay': 'uy',
            'Bosnia and Herzegovina': 'ba', 'Mongolia': 'mn', 'Armenia': 'am',
            'Jamaica': 'jm', 'Qatar': 'qa', 'Albania': 'al', 'Lithuania': 'lt',
            'Namibia': 'na', 'Gambia': 'gm', 'Botswana': 'bw', 'Gabon': 'ga',
            'Lesotho': 'ls', 'North Macedonia': 'mk', 'Slovenia': 'si',
            'Guinea-Bissau': 'gw', 'Latvia': 'lv', 'Bahrain': 'bh',
            'Equatorial Guinea': 'gq', 'Trinidad and Tobago': 'tt', 'Estonia': 'ee',
            'Timor-Leste': 'tl', 'Mauritius': 'mu', 'Cyprus': 'cy', 'Eswatini': 'sz',
            'Djibouti': 'dj', 'Fiji': 'fj', 'Réunion': 're', 'Comoros': 'km',
            'Guyana': 'gy', 'Bhutan': 'bt', 'Solomon Islands': 'sb', 'Macao': 'mo',
            'Montenegro': 'me', 'Luxembourg': 'lu', 'Western Sahara': 'eh',
            'Suriname': 'sr', 'Cape Verde': 'cv', 'Maldives': 'mv', 'Malta': 'mt',
            'Brunei': 'bn', 'Belize': 'bz', 'Bahamas': 'bs', 'Iceland': 'is',
            'Vanuatu': 'vu', 'French Guiana': 'gf', 'New Caledonia': 'nc',
            'French Polynesia': 'pf', 'Barbados': 'bb', 'Mayotte': 'yt',
            'São Tomé and Príncipe': 'st', 'Samoa': 'ws', 'Curaçao': 'cw',
            'Saint Lucia': 'lc', 'Guam': 'gu', 'Kiribati': 'ki', 'Micronesia': 'fm',
            'Grenada': 'gd', 'Jersey': 'je', 'Seychelles': 'sc', 'Tonga': 'to',
            'Aruba': 'aw', 'Saint Vincent and the Grenadines': 'vc',
            'United States Virgin Islands': 'vi', 'Antigua and Barbuda': 'ag',
            'Isle of Man': 'im', 'Andorra': 'ad', 'Dominica': 'dm',
            'Cayman Islands': 'ky', 'Bermuda': 'bm', 'Marshall Islands': 'mh',
            'Northern Mariana Islands': 'mp', 'Greenland': 'gl', 'American Samoa': 'as',
            'Saint Kitts and Nevis': 'kn', 'Faroe Islands': 'fo', 'Sint Maarten': 'sx',
            'Monaco': 'mc', 'Liechtenstein': 'li', 'San Marino': 'sm', 'Gibraltar': 'gi',
            'British Virgin Islands': 'vg', 'Caribbean Netherlands': 'bq', 'Palau': 'pw',
            'Cook Islands': 'ck', 'Anguilla': 'ai', 'Tuvalu': 'tv', 'Wallis and Futuna': 'wf',
            'Nauru': 'nr', 'Saint Helena, Ascension and Tristan da Cunha': 'sh',
            'Saint Pierre and Miquelon': 'pm', 'Montserrat': 'ms', 'Falkland Islands': 'fk',
            'Niue': 'nu', 'Tokelau': 'tk', 'Vatican City': 'va'
        };
        
        const code = codeMap[countryName] || 'un';
        
        if (countryName.toLowerCase().includes('congo')) {
            if (countryName.toLowerCase().includes('democratic') || countryName.toLowerCase().includes('dr')) {
                return 'cd';
            } else {
                return 'cg';
            }
        }
        
        return code;
    }

    startGame() {
        // Clear any existing overlays
        GameUtils.removeOverlay('game-over-overlay');
        GameUtils.removeOverlay('population-game-over-overlay');
        
        this.score = 0;
        this.usedCountries.clear();
        this.gameState.startGame('flag');
        this.timerLocked = false;
        
        this.updateScore();
        this.showGameScreen();
        this.nextQuestion();
    }

    showGameScreen() {
        this.gameScreen.classList.add('active');
        this.updateGameMode();
    }

    showStartScreen() {
        // This will be handled by the main game controller
        if (window.gameController) {
            window.gameController.showStartScreen();
        }
    }

    nextQuestion() {
        if (!this.gameState.isGameActive) {
            return;
        }

        this.updateAvailableCountries();
        
        if (this.availableCountries.length === 0) {
            this.handleAllFlagsCompleted();
            return;
        }

        // Clear previous question display
        this.question.innerHTML = 'What country does this flag belong to?';
        this.question.style.color = '#333';

        // Clear input field and styling
        if (this.countryInput) {
            this.countryInput.value = '';
            this.countryInput.classList.remove('correct', 'incorrect');
        }

        // Clear option button styling
        const options = this.multipleChoiceOptions.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });

        // Reset timer lock for new question
        this.timerLocked = false;
        
        // Update game mode display
        this.updateGameMode();

        // Select random country
        const randomIndex = Math.floor(Math.random() * this.availableCountries.length);
        this.currentCountry = this.availableCountries[randomIndex];
        this.usedCountries.add(this.currentCountry.name);

        // Update flag
        this.flagImage.src = this.currentCountry.flag;
        
        // Add error handling for flag images
        this.flagImage.onerror = () => {
            console.error('Failed to load flag image:', this.currentCountry.flag);
            const fallbackUrl = `https://flagcdn.com/w320/${this.getCountryCode(this.currentCountry.name)}.png`;
            this.flagImage.src = fallbackUrl;
        };

        // Generate options
        if (!this.isTypingMode) {
            this.generateOptions();
        }

        // Timer removed - no timer needed
    }

    // Timer methods removed

    generateOptions() {
        const correctAnswer = this.currentCountry.name;
        const options = [correctAnswer];

        // Get 3 random wrong answers
        const availableWrongAnswers = this.countries
            .filter(country => country.name !== correctAnswer)
            .map(country => country.name);

        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * availableWrongAnswers.length);
            const wrongAnswer = availableWrongAnswers.splice(randomIndex, 1)[0];
            options.push(wrongAnswer);
        }

        // Shuffle options
        GameUtils.shuffleArray(options);

        // Update DOM
        this.multipleChoiceOptions.innerHTML = '';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.dataset.index = index;
            this.multipleChoiceOptions.appendChild(button);
        });
    }

    handleAnswer(selectedIndex) {
        if (!this.gameState.isGameActive) {
            return;
        }

        this.gameState.stopGame();

        const options = Array.from(this.multipleChoiceOptions.querySelectorAll('.option'));
        const selectedAnswer = options[selectedIndex].textContent;
        const isCorrect = selectedAnswer === this.currentCountry.name;

        if (isCorrect) {
            options[selectedIndex].classList.add('correct');
            this.score++;
            this.updateScore();
            
            setTimeout(() => {
                this.gameState.startGame('flag');
                this.nextQuestion();
            }, 1000);
        } else {
            options[selectedIndex].classList.add('incorrect');
            
            // Find and highlight the correct answer
            options.forEach((option) => {
                if (option.textContent === this.currentCountry.name) {
                    option.classList.add('correct');
                }
            });
            
            this.showCorrectAnswer();
        }
    }

    handleTypingAnswer() {
        if (!this.gameState.isGameActive) return;

        const userAnswer = this.countryInput.value.trim();
        
        if (userAnswer === '') {
            return;
        }

        const userAnswerLower = userAnswer.toLowerCase();
        const correctAnswer = this.currentCountry.name.toLowerCase();
        const isCorrect = userAnswerLower === correctAnswer;

        if (isCorrect) {
            this.countryInput.classList.add('correct');
            this.score++;
            this.updateScore();
            
            setTimeout(() => {
                this.countryInput.classList.remove('correct');
                this.nextQuestion();
            }, 500);
        } else {
            this.countryInput.classList.add('incorrect');
            this.showCorrectAnswer();
        }

        this.hideAutocomplete();
    }

    handleTimeout() {
        this.gameState.stopGame();
        this.showGameOverScreen();
    }

    handleAllFlagsCompleted() {
        this.showGameCompletionScreen();
    }

    showGameCompletionScreen() {
        const overlay = GameUtils.createOverlay('game-over-overlay', `
            <div class="game-over-modal">
                <h2>Congratulations!</h2>
                <div class="final-score">
                    <p>You've completed all flags!</p>
                    <p>Final Score: <strong>${this.score}</strong></p>
                </div>
                <div class="game-over-buttons">
                    <button id="playAgainBtn" class="btn btn-primary">Play Again</button>
                    <button id="mainMenuBtn" class="btn btn-secondary">Main Menu</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(overlay);
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            GameUtils.removeOverlay('game-over-overlay');
            this.startGame();
        });
        
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            GameUtils.removeOverlay('game-over-overlay');
            this.showStartScreen();
        });
    }

    showGameOverScreen() {
        GameUtils.removeOverlay('game-over-overlay');
        
        const overlay = GameUtils.createOverlay('game-over-overlay', `
            <div class="game-over-modal">
                <div class="game-over-close" id="gameOverClose">×</div>
                <h2>Game Over!</h2>
                <div class="final-score">
                    <p>Final Score: <strong>${this.score}</strong></p>
                </div>
                <div class="game-over-buttons">
                    <button id="playAgainBtn" class="btn btn-primary">Play Again</button>
                    <button id="mainMenuBtn" class="btn btn-secondary">Main Menu</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(overlay);
        
        // Add close button functionality
        document.getElementById('gameOverClose').addEventListener('click', () => {
            GameUtils.removeOverlay('game-over-overlay');
            this.gameState.stopGame();
            this.showCorrectAnswerAfterGameOver();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            GameUtils.removeOverlay('game-over-overlay');
            this.startGame();
        });
        
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            GameUtils.removeOverlay('game-over-overlay');
            this.showStartScreen();
        });
    }

    showCorrectAnswer() {
        const questionElement = document.querySelector('.question h2');
        const correctCountry = this.currentCountry ? this.currentCountry.name : 'Unknown';
        questionElement.innerHTML = `❌ Wrong! The correct answer was: <strong>${correctCountry}</strong>`;
        questionElement.style.color = '#dc3545';
        
        setTimeout(() => {
            this.showGameOverScreen();
        }, 2000);
    }

    showCorrectAnswerAfterGameOver() {
        const questionElement = document.querySelector('.question h2');
        if (questionElement && this.currentCountry) {
            questionElement.innerHTML = `❌ Wrong! The correct answer was: <strong>${this.currentCountry.name}</strong>`;
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

    updateAvailableCountries() {
        this.availableCountries = this.countries.filter(country => 
            !this.usedCountries.has(country.name)
        );
    }

    updateScore() {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score;
        }
    }

    updateGameMode() {
        if (!this.timerLocked) {
            if (this.isTypingMode) {
                this.multipleChoiceOptions.style.display = 'none';
                this.typingInput.style.display = 'flex';
                this.countryInput.focus();
                this.multipleChoiceOptions.innerHTML = '';
            } else {
                this.multipleChoiceOptions.style.display = 'grid';
                this.typingInput.style.display = 'none';
                
                if (this.countryInput) {
                    this.countryInput.value = '';
                    this.countryInput.classList.remove('correct', 'incorrect');
                }
                
                if (this.gameState.isGameActive && this.currentCountry) {
                    this.generateOptions();
                }
            }
        }
        
        // Timer update removed
    }

    // Autocomplete functionality
    handleAutocomplete() {
        const input = this.countryInput.value.toLowerCase();
        if (input.length < 2) {
            this.hideAutocomplete();
            return;
        }

        const suggestions = this.countries
            .filter(country => country.name.toLowerCase().includes(input))
            .slice(0, 5);

        this.showAutocomplete(suggestions);
    }

    showAutocomplete(suggestions) {
        this.autocompleteSuggestions = suggestions;
        this.selectedSuggestionIndex = -1;

        if (suggestions.length === 0) {
            this.hideAutocomplete();
            return;
        }

        this.autocompleteSuggestionsEl.innerHTML = '';
        suggestions.forEach((country, index) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-suggestion';
            div.textContent = country.name;
            div.addEventListener('click', () => {
                this.countryInput.value = country.name;
                this.hideAutocomplete();
            });
            this.autocompleteSuggestionsEl.appendChild(div);
        });

        this.autocompleteSuggestionsEl.style.display = 'block';
    }

    hideAutocomplete() {
        this.autocompleteSuggestionsEl.style.display = 'none';
        this.selectedSuggestionIndex = -1;
    }

    handleAutocompleteKeydown(e) {
        if (this.autocompleteSuggestionsEl.style.display === 'none') return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (this.selectedSuggestionIndex === -1) {
                    this.selectedSuggestionIndex = 0;
                } else {
                    this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, this.autocompleteSuggestions.length - 1);
                }
                this.highlightSuggestion();
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (this.selectedSuggestionIndex <= 0) {
                    this.selectedSuggestionIndex = -1;
                    this.hideAutocomplete();
                    this.countryInput.focus();
                } else {
                    this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, 0);
                    this.highlightSuggestion();
                }
                break;
            case 'Tab':
                if (this.selectedSuggestionIndex >= 0) {
                    e.preventDefault();
                    this.countryInput.value = this.autocompleteSuggestions[this.selectedSuggestionIndex].name;
                    this.hideAutocomplete();
                }
                break;
            case 'Escape':
                this.hideAutocomplete();
                this.countryInput.focus();
                break;
            case 'Enter':
                if (this.selectedSuggestionIndex >= 0) {
                    e.preventDefault();
                    this.countryInput.value = this.autocompleteSuggestions[this.selectedSuggestionIndex].name;
                    this.hideAutocomplete();
                    this.handleTypingAnswer();
                }
                break;
        }
    }

    highlightSuggestion() {
        const suggestions = this.autocompleteSuggestionsEl.querySelectorAll('.autocomplete-suggestion');
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('highlighted', index === this.selectedSuggestionIndex);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlagGame;
}
