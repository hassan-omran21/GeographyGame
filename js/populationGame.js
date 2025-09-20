// Population Game Module
class PopulationGame {
    constructor() {
        this.populationCountries = [];
        this.usedPopulationCountries = new Set();
        this.currentLeftCountry = null;
        this.currentRightCountry = null;
        this.populationScore = 0;
        this.lastPopulationClick = 0;
        
        this.gameState = new GameState();
        
        this.initializeElements();
        this.bindEvents();
        this.preparePopulationData();
    }

    initializeElements() {
        // Population game elements
        this.populationGameScreen = document.getElementById('populationGameScreen');
        this.populationScoreElement = document.getElementById('populationScore');
        this.leftFlag = document.getElementById('leftFlag');
        this.rightFlag = document.getElementById('rightFlag');
        this.leftCountryName = document.getElementById('leftCountryName');
        this.rightCountryName = document.getElementById('rightCountryName');
        this.leftPopulation = document.getElementById('leftPopulation');
        this.higherBtn = document.getElementById('higherBtn');
        this.lowerBtn = document.getElementById('lowerBtn');
        this.populationBackToMainMenuBtn = document.getElementById('populationBackToMainMenu');
    }

    bindEvents() {
        // Population game buttons
        if (this.higherBtn) {
            this.higherBtn.addEventListener('click', () => {
                this.handlePopulationGuess('higher');
            });
        }

        if (this.lowerBtn) {
            this.lowerBtn.addEventListener('click', () => {
                this.handlePopulationGuess('lower');
            });
        }

        // Back to main menu button
        if (this.populationBackToMainMenuBtn) {
            this.populationBackToMainMenuBtn.addEventListener('click', () => {
                this.showStartScreen();
            });
        }
    }

    preparePopulationData() {
        // Population data (2023 estimates) - excluding Israel and territories
        const populationData = {
            'China': 1439323776, 'India': 1380004385, 'United States': 334914895,
            'Indonesia': 273523615, 'Pakistan': 220892340, 'Brazil': 212559417,
            'Nigeria': 206139589, 'Bangladesh': 164689383, 'Russia': 145912025,
            'Mexico': 128932753, 'Japan': 125836021, 'Ethiopia': 114963588,
            'Philippines': 109581078, 'Egypt': 102334404, 'Vietnam': 97338579,
            'DR Congo': 89561403, 'Turkey': 84339067, 'Iran': 83992949,
            'Germany': 83783942, 'Thailand': 69799978, 'United Kingdom': 67886011,
            'France': 65273511, 'Italy': 60461826, 'Tanzania': 59734218,
            'South Africa': 59308690, 'Myanmar': 54409800, 'Kenya': 53771296,
            'South Korea': 51269185, 'Colombia': 50882891, 'Spain': 46754778,
            'Uganda': 45741007, 'Argentina': 45195774, 'Algeria': 44616624,
            'Sudan': 43849260, 'Ukraine': 44134693, 'Iraq': 40462701,
            'Afghanistan': 38928346, 'Poland': 37846611, 'Canada': 37742154,
            'Morocco': 36910560, 'Saudi Arabia': 34813871, 'Uzbekistan': 33469203,
            'Peru': 32971854, 'Angola': 32866272, 'Malaysia': 32365999,
            'Mozambique': 31255435, 'Ghana': 31072940, 'Yemen': 29825964,
            'Nepal': 29136808, 'Venezuela': 28435943, 'Madagascar': 27691018,
            'Cameroon': 26545863, 'Côte d\'Ivoire': 26378274, 'North Korea': 25778816,
            'Australia': 25499884, 'Niger': 24206644, 'Taiwan': 23816775,
            'Sri Lanka': 21413249, 'Burkina Faso': 20903273, 'Mali': 20250833,
            'Romania': 19237691, 'Malawi': 19129952, 'Chile': 19116201,
            'Kazakhstan': 18776707, 'Zambia': 18383955, 'Guatemala': 17915568,
            'Ecuador': 17643054, 'Syria': 17500658, 'Netherlands': 17134872,
            'Senegal': 16743927, 'Cambodia': 16718965, 'Chad': 16425864,
            'Somalia': 15893222, 'Zimbabwe': 14862924, 'Guinea': 13132795,
            'Rwanda': 12952218, 'Benin': 12123200, 'Burundi': 11890784,
            'Tunisia': 11818619, 'Bolivia': 11673021, 'Belgium': 11589623,
            'Haiti': 11402528, 'Cuba': 11326616, 'South Sudan': 11193725,
            'Dominican Republic': 10847910, 'Czech Republic': 10708981,
            'Greece': 10423054, 'Jordan': 10203134, 'Portugal': 10196709,
            'Azerbaijan': 10139177, 'Sweden': 10099265, 'Honduras': 9904607,
            'United Arab Emirates': 9890402, 'Hungary': 9660351, 'Tajikistan': 9537645,
            'Belarus': 9449323, 'Austria': 9006398, 'Papua New Guinea': 8947024,
            'Serbia': 8737371, 'Switzerland': 8654622, 'Togo': 8278724,
            'Sierra Leone': 7976983, 'Laos': 7275560, 'Paraguay': 7132538,
            'Bulgaria': 6948445, 'Libya': 6871292, 'Lebanon': 6825445,
            'Kyrgyzstan': 6524195, 'El Salvador': 6486205, 'Nicaragua': 6624554,
            'Turkmenistan': 6031200, 'Denmark': 5792202, 'Finland': 5540720,
            'Singapore': 5850342, 'Slovakia': 5459642, 'Norway': 5421241,
            'Oman': 5106626, 'State of Palestine': 5101414, 'Costa Rica': 5094118,
            'Liberia': 5057681, 'Ireland': 4937786, 'Central African Republic': 4829767,
            'New Zealand': 5084300, 'Mauritania': 4649658, 'Panama': 4314767,
            'Kuwait': 4270571, 'Croatia': 4105267, 'Moldova': 2617820,
            'Georgia': 3989167, 'Eritrea': 3546421, 'Uruguay': 3473730,
            'Bosnia and Herzegovina': 3280819, 'Mongolia': 3278290, 'Armenia': 2963243,
            'Jamaica': 2961167, 'Qatar': 2881053, 'Albania': 2877797,
            'Lithuania': 2722289, 'Namibia': 2540905, 'Gambia': 2416668,
            'Botswana': 2351627, 'Gabon': 2225734, 'Lesotho': 2142249,
            'North Macedonia': 2083374, 'Slovenia': 2078938, 'Guinea-Bissau': 1968001,
            'Latvia': 1886198, 'Bahrain': 1701575, 'Equatorial Guinea': 1402985,
            'Trinidad and Tobago': 1399488, 'Estonia': 1321910, 'Timor-Leste': 1318445,
            'Mauritius': 1271768, 'Cyprus': 1207359, 'Eswatini': 1160164,
            'Djibouti': 988000, 'Fiji': 896444, 'Comoros': 869601,
            'Guyana': 786552, 'Bhutan': 771608, 'Solomon Islands': 686884,
            'Montenegro': 621718, 'Luxembourg': 625978, 'Suriname': 586634,
            'Cape Verde': 555987, 'Maldives': 540544, 'Malta': 441543,
            'Brunei': 437479, 'Belize': 397628, 'Bahamas': 393244,
            'Iceland': 364134, 'Vanuatu': 307145, 'Barbados': 287375,
            'São Tomé and Príncipe': 219159, 'Samoa': 198414, 'Saint Lucia': 183627,
            'Kiribati': 119449, 'Micronesia': 115023, 'Grenada': 112523,
            'Seychelles': 98347, 'Tonga': 105695, 'Saint Vincent and the Grenadines': 110940,
            'Antigua and Barbuda': 97929, 'Andorra': 77265, 'Dominica': 71986,
            'Marshall Islands': 59190, 'Saint Kitts and Nevis': 53199,
            'Monaco': 39242, 'Liechtenstein': 38128, 'San Marino': 33931,
            'Palau': 18094, 'Tuvalu': 11792, 'Nauru': 10824,
            'Vatican City': 825
        };

        // List of territories to exclude (keeping only countries and Palestine)
        const territoriesToExclude = [
            'Hong Kong', 'Réunion', 'Macao', 'Western Sahara', 'French Guiana',
            'New Caledonia', 'French Polynesia', 'Mayotte', 'Curaçao', 'Guam',
            'Jersey', 'Aruba', 'United States Virgin Islands', 'Isle of Man',
            'Cayman Islands', 'Bermuda', 'Northern Mariana Islands', 'Greenland',
            'American Samoa', 'Faroe Islands', 'Sint Maarten', 'Gibraltar',
            'British Virgin Islands', 'Caribbean Netherlands', 'Cook Islands',
            'Anguilla', 'Wallis and Futuna', 'Saint Helena, Ascension and Tristan da Cunha',
            'Saint Pierre and Miquelon', 'Montserrat', 'Falkland Islands', 'Niue',
            'Tokelau'
        ];

        // Convert to array format and filter out Israel and territories
        this.populationCountries = Object.entries(populationData)
            .filter(([name]) => name !== 'Israel' && !territoriesToExclude.includes(name))
            .map(([name, population]) => ({
                name: name,
                population: population,
                flag: this.getFlagUrl(name)
            }));
    }

    getFlagUrl(countryName) {
        return `https://flagcdn.com/w320/${this.getCountryCode(countryName)}.png`;
    }

    getCountryCode(countryName) {
        // Simplified country code mapping
        const codeMap = {
            'China': 'cn', 'India': 'in', 'United States': 'us', 'Indonesia': 'id',
            'Pakistan': 'pk', 'Brazil': 'br', 'Nigeria': 'ng', 'Bangladesh': 'bd',
            'Russia': 'ru', 'Mexico': 'mx', 'Japan': 'jp', 'Ethiopia': 'et',
            'Philippines': 'ph', 'Egypt': 'eg', 'Vietnam': 'vn', 'DR Congo': 'cd',
            'Turkey': 'tr', 'Iran': 'ir', 'Germany': 'de', 'Thailand': 'th',
            'United Kingdom': 'gb', 'France': 'fr', 'Italy': 'it', 'Tanzania': 'tz',
            'South Africa': 'za', 'Myanmar': 'mm', 'Kenya': 'ke', 'South Korea': 'kr',
            'Colombia': 'co', 'Spain': 'es', 'Uganda': 'ug', 'Argentina': 'ar',
            'Algeria': 'dz', 'Sudan': 'sd', 'Ukraine': 'ua', 'Iraq': 'iq',
            'Afghanistan': 'af', 'Poland': 'pl', 'Canada': 'ca', 'Morocco': 'ma',
            'Saudi Arabia': 'sa', 'Uzbekistan': 'uz', 'Peru': 'pe', 'Angola': 'ao',
            'Malaysia': 'my', 'Mozambique': 'mz', 'Ghana': 'gh', 'Yemen': 'ye',
            'Nepal': 'np', 'Venezuela': 've', 'Madagascar': 'mg', 'Cameroon': 'cm',
            'Côte d\'Ivoire': 'ci', 'North Korea': 'kp', 'Australia': 'au',
            'Niger': 'ne', 'Taiwan': 'tw', 'Sri Lanka': 'lk', 'Burkina Faso': 'bf',
            'Mali': 'ml', 'Romania': 'ro', 'Malawi': 'mw', 'Chile': 'cl',
            'Kazakhstan': 'kz', 'Zambia': 'zm', 'Guatemala': 'gt', 'Ecuador': 'ec',
            'Syria': 'sy', 'Netherlands': 'nl', 'Senegal': 'sn', 'Cambodia': 'kh',
            'Chad': 'td', 'Somalia': 'so', 'Zimbabwe': 'zw', 'Guinea': 'gn',
            'Rwanda': 'rw', 'Benin': 'bj', 'Burundi': 'bi', 'Tunisia': 'tn',
            'Bolivia': 'bo', 'Belgium': 'be', 'Haiti': 'ht', 'Cuba': 'cu',
            'South Sudan': 'ss', 'Dominican Republic': 'do', 'Czech Republic': 'cz',
            'Greece': 'gr', 'Jordan': 'jo', 'Portugal': 'pt', 'Azerbaijan': 'az',
            'Sweden': 'se', 'Honduras': 'hn', 'United Arab Emirates': 'ae',
            'Hungary': 'hu', 'Tajikistan': 'tj', 'Belarus': 'by', 'Austria': 'at',
            'Papua New Guinea': 'pg', 'Serbia': 'rs', 'Switzerland': 'ch',
            'Togo': 'tg', 'Sierra Leone': 'sl', 'Laos': 'la', 'Paraguay': 'py',
            'Bulgaria': 'bg', 'Libya': 'ly', 'Lebanon': 'lb', 'Kyrgyzstan': 'kg',
            'El Salvador': 'sv', 'Nicaragua': 'ni', 'Turkmenistan': 'tm',
            'Denmark': 'dk', 'Finland': 'fi', 'Singapore': 'sg', 'Slovakia': 'sk',
            'Norway': 'no', 'Oman': 'om', 'State of Palestine': 'ps',
            'Costa Rica': 'cr', 'Liberia': 'lr', 'Ireland': 'ie',
            'Central African Republic': 'cf', 'New Zealand': 'nz', 'Mauritania': 'mr',
            'Panama': 'pa', 'Kuwait': 'kw', 'Croatia': 'hr', 'Moldova': 'md',
            'Georgia': 'ge', 'Eritrea': 'er', 'Uruguay': 'uy',
            'Bosnia and Herzegovina': 'ba', 'Mongolia': 'mn', 'Armenia': 'am',
            'Jamaica': 'jm', 'Qatar': 'qa', 'Albania': 'al', 'Lithuania': 'lt',
            'Namibia': 'na', 'Gambia': 'gm', 'Botswana': 'bw', 'Gabon': 'ga',
            'Lesotho': 'ls', 'North Macedonia': 'mk', 'Slovenia': 'si',
            'Guinea-Bissau': 'gw', 'Latvia': 'lv', 'Bahrain': 'bh',
            'Equatorial Guinea': 'gq', 'Trinidad and Tobago': 'tt', 'Estonia': 'ee',
            'Timor-Leste': 'tl', 'Mauritius': 'mu', 'Cyprus': 'cy', 'Eswatini': 'sz',
            'Djibouti': 'dj', 'Fiji': 'fj', 'Comoros': 'km', 'Guyana': 'gy',
            'Bhutan': 'bt', 'Solomon Islands': 'sb', 'Montenegro': 'me',
            'Luxembourg': 'lu', 'Suriname': 'sr', 'Cape Verde': 'cv',
            'Maldives': 'mv', 'Malta': 'mt', 'Brunei': 'bn', 'Belize': 'bz',
            'Bahamas': 'bs', 'Iceland': 'is', 'Vanuatu': 'vu', 'Barbados': 'bb',
            'São Tomé and Príncipe': 'st', 'Samoa': 'ws', 'Saint Lucia': 'lc',
            'Kiribati': 'ki', 'Micronesia': 'fm', 'Grenada': 'gd',
            'Seychelles': 'sc', 'Tonga': 'to', 'Saint Vincent and the Grenadines': 'vc',
            'Antigua and Barbuda': 'ag', 'Andorra': 'ad', 'Dominica': 'dm',
            'Marshall Islands': 'mh', 'Saint Kitts and Nevis': 'kn',
            'Monaco': 'mc', 'Liechtenstein': 'li', 'San Marino': 'sm',
            'Palau': 'pw', 'Tuvalu': 'tv', 'Nauru': 'nr', 'Vatican City': 'va'
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
        
        this.populationScore = 0;
        this.usedPopulationCountries.clear();
        this.gameState.startGame('population');
        
        this.updatePopulationScore();
        this.showPopulationGameScreen();
        
        // Reset question text color to black
        const questionElement = document.getElementById('populationQuestion');
        if (questionElement) {
            questionElement.style.color = '#2d3748';
        }
        
        this.nextPopulationQuestion();
    }

    showPopulationGameScreen() {
        this.populationGameScreen.classList.add('active');
    }

    showStartScreen() {
        // This will be handled by the main game controller
        if (window.gameController) {
            window.gameController.showStartScreen();
        }
    }

    nextPopulationQuestion() {
        if (!this.gameState.isGameActive) return;

        // Get two random unused countries
        this.currentLeftCountry = this.getRandomUnusedCountry();
        this.currentRightCountry = this.getRandomUnusedCountry();

        // Update display
        this.leftFlag.src = this.currentLeftCountry.flag;
        this.leftCountryName.textContent = this.currentLeftCountry.name;
        this.leftPopulation.textContent = this.formatPopulation(this.currentLeftCountry.population);

        this.rightFlag.src = this.currentRightCountry.flag;
        this.rightCountryName.textContent = this.currentRightCountry.name;
        
        // Update question text with actual country names
        const questionElement = document.getElementById('populationQuestion');
        if (questionElement) {
            questionElement.textContent = `Does ${this.currentRightCountry.name} have higher or lower population than ${this.currentLeftCountry.name}?`;
            questionElement.style.color = '#2d3748';
        }
        
        // Add error handling for population game flags
        this.leftFlag.onerror = () => {
            console.error('Failed to load left flag:', this.currentLeftCountry.flag);
        };
        this.rightFlag.onerror = () => {
            console.error('Failed to load right flag:', this.currentRightCountry.flag);
        };
    }

    getRandomUnusedCountry() {
        const availableCountries = this.populationCountries.filter(country => 
            !this.usedPopulationCountries.has(country.name)
        );

        if (availableCountries.length === 0) {
            // Reset used countries if all have been used
            this.usedPopulationCountries.clear();
            return this.populationCountries[Math.floor(Math.random() * this.populationCountries.length)];
        }

        const randomIndex = Math.floor(Math.random() * availableCountries.length);
        const selectedCountry = availableCountries[randomIndex];
        this.usedPopulationCountries.add(selectedCountry.name);
        return selectedCountry;
    }

    formatPopulation(population) {
        if (population >= 1000000000) {
            return (population / 1000000000).toFixed(1) + 'B';
        } else if (population >= 1000000) {
            return (population / 1000000).toFixed(1) + 'M';
        } else if (population >= 1000) {
            return (population / 1000).toFixed(1) + 'K';
        }
        return population.toString();
    }

    handlePopulationGuess(guess) {
        if (!this.gameState.isGameActive) return;

        // Check cooldown (1000ms = 1 second)
        const now = Date.now();
        if (now - this.lastPopulationClick < 1000) {
            return;
        }
        this.lastPopulationClick = now;

        const leftPopulation = this.currentLeftCountry.population;
        const rightPopulation = this.currentRightCountry.population;
        
        let isCorrect = false;
        
        if (guess === 'higher') {
            isCorrect = rightPopulation > leftPopulation;
        } else {
            isCorrect = rightPopulation < leftPopulation;
        }

        if (isCorrect) {
            this.populationScore++;
            this.updatePopulationScore();
            this.showPopulationResult(true);
            this.slideCountries();
        } else {
            this.showPopulationResult(false);
        }
    }

    showPopulationResult(isCorrect) {
        if (isCorrect) {
            // Show population popup for the guessed country
            this.showPopulationPopup(this.currentRightCountry.name, this.currentRightCountry.population);
            
            // Show success message briefly
            const questionElement = document.getElementById('populationQuestion');
            if (questionElement) {
                questionElement.textContent = '✅ Correct!';
                questionElement.style.color = '#28a745';
            }
        } else {
            // Show population popup for the guessed country
            this.showPopulationPopup(this.currentRightCountry.name, this.currentRightCountry.population);
            
            // Show wrong answer message with correct population
            const questionElement = document.getElementById('populationQuestion');
            if (questionElement) {
                const leftCountryName = this.currentLeftCountry.name;
                const rightCountryName = this.currentRightCountry.name;
                const leftPopulation = this.formatPopulation(this.currentLeftCountry.population);
                const rightPopulation = this.formatPopulation(this.currentRightCountry.population);
                
                questionElement.innerHTML = `❌ Wrong! ${leftCountryName} has ${leftPopulation} and ${rightCountryName} has ${rightPopulation}`;
                questionElement.style.color = '#e53e3e';
                
                // Reset color to black before showing game over
                setTimeout(() => {
                    questionElement.style.color = '#2d3748';
                }, 1500);
                
                // Show game over after 2 seconds
                setTimeout(() => {
                    this.showPopulationGameOverScreen();
                }, 2000);
            }
        }
    }

    showPopulationPopup(countryName, population) {
        // Create and show a brief population popup
        const popup = document.createElement('div');
        popup.className = 'population-popup';
        popup.innerHTML = `
            <div class="population-popup-content">
                <strong>${countryName}</strong><br>
                Population: ${this.formatPopulation(population)}
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Remove popup after 2 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 2000);
    }

    slideCountries() {
        const leftCard = document.querySelector('.left-country');
        const rightCard = document.querySelector('.right-country');

        // Add animation class to slide leftCard out and move rightCard to left
        leftCard.classList.add('sliding-left');
        rightCard.classList.add('sliding-right-to-left');

        // Clone right card for smooth transition after animation
        const newLeftCard = rightCard.cloneNode(true);
        newLeftCard.classList.remove('right-country', 'sliding-right-to-left');
        newLeftCard.classList.add('left-country');

        // Set correct population for B now that it's the new A
        const popEl = newLeftCard.querySelector('.population');
        popEl.textContent = this.formatPopulation(this.currentRightCountry.population);
        popEl.classList.remove('unknown');

        // Animate
        setTimeout(() => {
            // Replace leftCard with cloned rightCard (now as new left)
            leftCard.replaceWith(newLeftCard);

            // Update references
            this.leftFlag = newLeftCard.querySelector('img');
            this.leftCountryName = newLeftCard.querySelector('.country-name');
            this.leftPopulation = newLeftCard.querySelector('.population');

            // Update currentLeftCountry
            this.currentLeftCountry = this.currentRightCountry;

            // Get new country for the right
            this.currentRightCountry = this.getRandomUnusedCountry();

            // Update rightCard content (no animation for new right card)
            this.rightFlag.src = this.currentRightCountry.flag;
            this.rightCountryName.textContent = this.currentRightCountry.name;
            const rightPop = rightCard.querySelector('.population');
            rightPop.textContent = '?';

            // Update question text with new country names
            const questionElement = document.getElementById('populationQuestion');
            if (questionElement) {
                questionElement.textContent = `Does ${this.currentRightCountry.name} have higher or lower population than ${this.currentLeftCountry.name}?`;
                questionElement.style.color = '#2d3748';
            }

            // Remove animation classes
            rightCard.classList.remove('sliding-right-to-left');
        }, 400); // match CSS animation duration
    }

    updatePopulationScore() {
        if (this.populationScoreElement) {
            this.populationScoreElement.textContent = this.populationScore;
        }
    }

    showPopulationGameOverScreen() {
        // Remove any existing population game over overlay
        GameUtils.removeOverlay('population-game-over-overlay');
        
        // Create overlay for population game over
        const overlay = GameUtils.createOverlay('population-game-over-overlay', `
            <div class="population-game-over-modal">
                <div class="game-over-close" id="populationGameOverClose">×</div>
                <h2>Game Over!</h2>
                <div class="final-score">
                    <p>Final Score: <strong>${this.populationScore}</strong></p>
                </div>
                <div class="population-game-over-buttons">
                    <button id="populationPlayAgain" class="btn btn-primary">Play Again</button>
                    <button id="populationMainMenu" class="btn btn-secondary">Main Menu</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(overlay);
        
        // Add close button functionality
        document.getElementById('populationGameOverClose').addEventListener('click', () => {
            GameUtils.removeOverlay('population-game-over-overlay');
            this.gameState.stopGame();
            this.showPopulationCorrectAnswerAfterGameOver();
        });
        
        // Add event listeners
        document.getElementById('populationPlayAgain').addEventListener('click', () => {
            GameUtils.removeOverlay('population-game-over-overlay');
            this.startGame();
        });
        
        document.getElementById('populationMainMenu').addEventListener('click', () => {
            GameUtils.removeOverlay('population-game-over-overlay');
            this.showStartScreen();
        });
    }

    showPopulationCorrectAnswerAfterGameOver() {
        // This method is called when user clicks X on population game over screen
        const questionElement = document.getElementById('populationQuestion');
        if (questionElement && this.currentLeftCountry && this.currentRightCountry) {
            const leftCountryName = this.currentLeftCountry.name;
            const rightCountryName = this.currentRightCountry.name;
            const leftPopulation = this.formatPopulation(this.currentLeftCountry.population);
            const rightPopulation = this.formatPopulation(this.currentRightCountry.population);
            
            questionElement.innerHTML = `❌ Wrong! ${leftCountryName} has ${leftPopulation} and ${rightCountryName} has ${rightPopulation}`;
            questionElement.style.color = '#e53e3e';
        }
        
        // Add a back to menu button
        this.showBackToMenuButton();
    }

    showBackToMenuButton() {
        // Remove any existing back button
        const existingButton = document.getElementById('backToMenuBtn');
        if (existingButton) {
            existingButton.remove();
        }

        // Create back to menu button
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

        // Add hover effect
        backButton.addEventListener('mouseenter', () => {
            backButton.style.transform = 'translateY(-1px)';
            backButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        backButton.addEventListener('mouseleave', () => {
            backButton.style.transform = 'translateY(0)';
            backButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });

        // Add click handler
        backButton.addEventListener('click', () => {
            this.showStartScreen();
            backButton.remove();
        });

        document.body.appendChild(backButton);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopulationGame;
}
