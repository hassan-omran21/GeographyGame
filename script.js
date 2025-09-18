class CountryFlagGame {
    constructor() {
        this.countries = [];
        this.usedCountries = new Set();
        this.currentCountry = null;
        this.score = 0;
        this.timeLeft = 15;
        this.currentMaxTime = 15;
        this.timerInterval = null;
        this.isGameActive = false;
        this.isTypingMode = false;
        this.timerLocked = false;
        this.autocompleteSuggestions = [];
        this.selectedSuggestionIndex = -1;
        
        // Population game properties
        this.populationCountries = [];
        this.usedPopulationCountries = new Set();
        this.currentLeftCountry = null;
        this.currentRightCountry = null;
        this.populationScore = 0;
        this.currentGame = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadCountries();
        this.preparePopulationData();
    }

    initializeElements() {
        // Main menu elements
        this.startScreen = document.getElementById('startScreen');
        this.flagGameBtn = document.getElementById('flagGameBtn');
        this.populationGameBtn = document.getElementById('populationGameBtn');
        
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
        this.timerBar = document.querySelector('.timer-progress');
        this.gameModeToggle = document.getElementById('gameModeToggle');
        this.autocompleteSuggestionsEl = document.getElementById('autocompleteSuggestions');
        
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

        // Multiple choice options
        if (this.multipleChoiceOptions) {
            this.multipleChoiceOptions.addEventListener('click', (e) => {
                console.log('Click detected on:', e.target);
                console.log('Target classList:', e.target.classList);
                console.log('Target dataset:', e.target.dataset);
                
                if (e.target.classList.contains('option')) {
                    const selectedIndex = parseInt(e.target.dataset.index);
                    console.log('Option clicked! Index:', selectedIndex, 'Text:', e.target.textContent);
                    this.handleAnswer(selectedIndex);
                } else {
                    console.log('Click was not on an option button');
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
                this.showGameModeNotification();
                this.timerLocked = true;
            });
        }

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
                    
                    console.log('API Response status:', response.status);
                    console.log('API Response headers:', response.headers);
                    console.log('Response URL:', response.url);
                    console.log('API Response data type:', typeof data);
                    console.log('API Response data length:', data.length);
                    
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
                        console.log('Sample countries:', this.countries.slice(0, 5).map(c => c.name));
                        console.log('Sample flag URLs:', this.countries.slice(0, 3).map(c => c.flag));
                        
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
            { name: 'Israel', flag: 'https://flagcdn.com/w320/il.png' }
        ];

        this.countries = fallbackCountries.filter(country => country.name !== 'Israel');
        console.log('Using fallback countries:', this.countries.length);
        this.updateAvailableCountries();
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
            'Serbia': 8737371, 'Israel': 8655535, 'Switzerland': 8654622,
            'Togo': 8278724, 'Sierra Leone': 7976983, 'Laos': 7275560,
            'Paraguay': 7132538, 'Bulgaria': 6948445, 'Libya': 6871292,
            'Lebanon': 6825445, 'Kyrgyzstan': 6524195, 'El Salvador': 6486205,
            'Nicaragua': 6624554, 'Turkmenistan': 6031200, 'Denmark': 5792202,
            'Finland': 5540720, 'Singapore': 5850342, 'Slovakia': 5459642,
            'Norway': 5421241, 'Oman': 5106626, 'State of Palestine': 5101414,
            'Costa Rica': 5094118, 'Liberia': 5057681, 'Ireland': 4937786,
            'Central African Republic': 4829767, 'New Zealand': 5084300,
            'Mauritania': 4649658, 'Panama': 4314767, 'Kuwait': 4270571,
            'Croatia': 4105267, 'Moldova': 2617820, 'Georgia': 3989167,
            'Eritrea': 3546421, 'Uruguay': 3473730, 'Bosnia and Herzegovina': 3280819,
            'Mongolia': 3278290, 'Armenia': 2963243, 'Jamaica': 2961167,
            'Qatar': 2881053, 'Albania': 2877797, 'Lithuania': 2722289,
            'Namibia': 2540905, 'Gambia': 2416668, 'Botswana': 2351627,
            'Gabon': 2225734, 'Lesotho': 2142249, 'North Macedonia': 2083374,
            'Slovenia': 2078938, 'Guinea-Bissau': 1968001, 'Latvia': 1886198,
            'Bahrain': 1701575, 'Equatorial Guinea': 1402985, 'Trinidad and Tobago': 1399488,
            'Estonia': 1321910, 'Timor-Leste': 1318445, 'Mauritius': 1271768,
            'Cyprus': 1207359, 'Eswatini': 1160164, 'Djibouti': 988000,
            'Fiji': 896444, 'Comoros': 869601, 'Guyana': 786552,
            'Bhutan': 771608, 'Solomon Islands': 686884, 'Montenegro': 621718,
            'Luxembourg': 625978, 'Suriname': 586634, 'Cape Verde': 555987,
            'Maldives': 540544, 'Malta': 441543, 'Brunei': 437479,
            'Belize': 397628, 'Bahamas': 393244, 'Iceland': 364134,
            'Vanuatu': 307145, 'Barbados': 287375, 'São Tomé and Príncipe': 219159,
            'Samoa': 198414, 'Saint Lucia': 183627, 'Kiribati': 119449,
            'Micronesia': 115023, 'Grenada': 112523, 'Seychelles': 98347,
            'Tonga': 105695, 'Saint Vincent and the Grenadines': 110940,
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

    isEmojiFlag(flag) {
        // Check if the flag is an emoji (contains emoji characters)
        return /[\u{1F1E6}-\u{1F1FF}]/u.test(flag);
    }

    getFlagUrl(countryName) {
        // This would ideally use the same API as the flag game
        // For now, using a placeholder approach
        return `https://flagcdn.com/w320/${this.getCountryCode(countryName)}.png`;
    }

    getCountryCode(countryName) {
        // Simplified country code mapping - in a real app, you'd use a proper mapping
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
        
        return codeMap[countryName] || 'un'; // Default to UN flag if not found
    }

    showFlagGamePopup() {
        // Create overlay for game mode selection
        const overlay = document.createElement('div');
        overlay.className = 'game-mode-overlay';
        overlay.innerHTML = `
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
        `;
        
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

    startFlagGame(mode) {
        // Hide main menu
        this.startScreen.classList.remove('active');
        
        // Initialize flag game with selected mode
        this.isTypingMode = mode === 'typing';
        this.currentGame = 'flag';
        this.startGame();
    }

    startPopulationGame() {
        // Hide main menu
        this.startScreen.classList.remove('active');
        
        // Initialize population game
        this.currentGame = 'population';
        this.startPopulationGameInternal();
    }

    startGame() {
        this.score = 0;
        this.usedCountries.clear();
        this.isGameActive = true;
        this.timerLocked = false;
        
        this.updateScore();
        this.showGameScreen();
        this.nextQuestion();
    }

    startPopulationGameInternal() {
        this.populationScore = 0;
        this.usedPopulationCountries.clear();
        this.isGameActive = true;
        
        this.updatePopulationScore();
        this.showPopulationGameScreen();
        this.nextPopulationQuestion();
    }

    showGameScreen() {
        this.gameScreen.classList.add('active');
        this.updateGameMode();
    }

    showPopulationGameScreen() {
        this.populationGameScreen.classList.add('active');
    }

    showStartScreen() {
        this.startScreen.classList.add('active');
        
        // Hide other game screens
        if (this.gameScreen) this.gameScreen.classList.remove('active');
        if (this.populationGameScreen) this.populationGameScreen.classList.remove('active');
        
        // Remove any overlays
        const overlays = document.querySelectorAll('.game-over-overlay, .population-game-over-overlay');
        overlays.forEach(overlay => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
    }

    showGameOverScreen() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
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
        `;
        
        document.body.appendChild(overlay);
        
        // Add close button functionality
        document.getElementById('gameOverClose').addEventListener('click', () => {
            document.body.removeChild(overlay);
            // Show the correct answer if it was hidden
            this.showCorrectAnswerAfterGameOver();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (this.currentGame === 'population') {
                this.startPopulationGameInternal();
            } else {
                this.startGame();
            }
        });
        
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.showStartScreen();
        });
    }

    updateAvailableCountries() {
        this.availableCountries = this.countries.filter(country => 
            !this.usedCountries.has(country.name)
        );
    }

    nextQuestion() {
        console.log('nextQuestion called, isGameActive:', this.isGameActive);
        if (!this.isGameActive) {
            console.log('Game not active, returning from nextQuestion');
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

        // Update game mode if needed
        if (!this.timerLocked) {
            this.updateGameMode();
        }

        // Select random country
        const randomIndex = Math.floor(Math.random() * this.availableCountries.length);
        this.currentCountry = this.availableCountries[randomIndex];
        this.usedCountries.add(this.currentCountry.name);

        // Update flag
        console.log('Setting flag image:', this.currentCountry.flag);
        this.flagImage.src = this.currentCountry.flag;
        
        // Add error handling for flag images
        this.flagImage.onerror = () => {
            console.error('Failed to load flag image:', this.currentCountry.flag);
            // Try fallback flag URL
            const fallbackUrl = `https://flagcdn.com/w320/${this.getCountryCode(this.currentCountry.name)}.png`;
            console.log('Trying fallback URL:', fallbackUrl);
            this.flagImage.src = fallbackUrl;
        };

        // Generate options
        console.log('Game mode - isTypingMode:', this.isTypingMode);
        if (!this.isTypingMode) {
            this.generateOptions();
        } else {
            console.log('In typing mode, not generating options');
        }

        // Start timer
        this.startTimer();
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timeLeft = this.isTypingMode ? 20 : 15;
        this.currentMaxTime = this.timeLeft;
        this.timerLocked = false;
        this.updateTimer();

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();

            if (this.timeLeft <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    updateTimer() {
        if (this.timeLeftElement) {
            this.timeLeftElement.textContent = this.timeLeft;
        }

        if (this.timerBar && !this.timerLocked) {
            const progress = (this.timeLeft / this.currentMaxTime) * 100;
            this.timerBar.style.width = progress + '%';
            
            if (this.timeLeft <= 5) {
                this.timerBar.style.backgroundColor = '#dc3545';
            } else if (this.timeLeft <= 10) {
                this.timerBar.style.backgroundColor = '#ffc107';
            } else {
                this.timerBar.style.backgroundColor = '#28a745';
            }
        }
    }

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
        this.shuffleArray(options);

        // Update DOM
        this.multipleChoiceOptions.innerHTML = '';
        console.log('Generating options:', options);
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.dataset.index = index;
            this.multipleChoiceOptions.appendChild(button);
            console.log('Created button:', option, 'with index:', index);
        });
        
        console.log('Total buttons created:', this.multipleChoiceOptions.children.length);
    }

    handleAnswer(selectedIndex) {
        console.log('handleAnswer called with index:', selectedIndex);
        
        if (!this.isGameActive) {
            console.log('Game not active, returning');
            return;
        }

        clearInterval(this.timerInterval);
        this.isGameActive = false;

        const options = Array.from(this.multipleChoiceOptions.querySelectorAll('.option'));
        console.log('Found options:', options.length);
        console.log('Options text:', options.map(opt => opt.textContent));
        
        const selectedAnswer = options[selectedIndex].textContent;
        console.log('Selected answer:', selectedAnswer);
        console.log('Correct answer:', this.currentCountry.name);
        
        const isCorrect = selectedAnswer === this.currentCountry.name;
        console.log('Is correct:', isCorrect);

        if (isCorrect) {
            // Show correct answer in green
            options[selectedIndex].classList.add('correct');
            
            this.score++;
            this.updateScore();
            
            // Wait a moment to show the green highlight, then move to next question
            console.log('Setting timeout to move to next question...');
            setTimeout(() => {
                console.log('Timeout fired, re-enabling game and calling nextQuestion');
                this.isGameActive = true; // Re-enable the game
                this.nextQuestion();
            }, 1000);
        } else {
            // Show incorrect answer in red and correct answer in green
            options[selectedIndex].classList.add('incorrect');
            
            // Find and highlight the correct answer
            options.forEach((option, index) => {
                if (option.textContent === this.currentCountry.name) {
                    option.classList.add('correct');
                }
            });
            
            this.showCorrectAnswer();
        }
    }

    handleTypingAnswer() {
        if (!this.isGameActive) return;

        const userAnswer = this.countryInput.value.trim().toLowerCase();
        const correctAnswer = this.currentCountry.name.toLowerCase();
        const isCorrect = userAnswer === correctAnswer;

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

    handleAllFlagsCompleted() {
        this.showGameCompletionScreen();
    }

    showGameCompletionScreen() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
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
        `;
        
        document.body.appendChild(overlay);
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.startGame();
        });
        
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.showStartScreen();
        });
    }

    handleTimeout() {
        clearInterval(this.timerInterval);
        this.isGameActive = false;
        this.showGameOverScreen();
    }

    updateScore() {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score;
        }
    }

    showGameModeNotification() {
        const notification = document.createElement('div');
        notification.className = 'game-mode-notification';
        notification.textContent = `${this.isTypingMode ? 'Typing' : 'Multiple Choice'} mode will apply on the next round`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
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
        // This method is called when user clicks X on game over screen
        // It ensures the correct answer is visible
        const questionElement = document.querySelector('.question h2');
        if (questionElement && this.currentCountry) {
            questionElement.innerHTML = `❌ Wrong! The correct answer was: <strong>${this.currentCountry.name}</strong>`;
            questionElement.style.color = '#dc3545';
        }
    }

    updateGameMode() {
        if (this.isTypingMode) {
            this.multipleChoiceOptions.style.display = 'none';
            this.typingInput.style.display = 'flex';
            this.countryInput.focus();
        } else {
            this.multipleChoiceOptions.style.display = 'grid';
            this.typingInput.style.display = 'none';
        }
        
        this.updateTimer();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

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
                    // First time pressing down, go to first suggestion
                    this.selectedSuggestionIndex = 0;
                } else {
                    this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, this.autocompleteSuggestions.length - 1);
                }
                this.highlightSuggestion();
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (this.selectedSuggestionIndex <= 0) {
                    // Go back to input field
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

    // Population Game Methods
    nextPopulationQuestion() {
        if (!this.isGameActive) return;

        // Get two random unused countries
        this.currentLeftCountry = this.getRandomUnusedCountry();
        this.currentRightCountry = this.getRandomUnusedCountry();

        // Update display
        console.log('Setting left flag:', this.currentLeftCountry.flag);
        this.leftFlag.src = this.currentLeftCountry.flag;
        this.leftCountryName.textContent = this.currentLeftCountry.name;
        this.leftPopulation.textContent = this.formatPopulation(this.currentLeftCountry.population);

        console.log('Setting right flag:', this.currentRightCountry.flag);
        this.rightFlag.src = this.currentRightCountry.flag;
        this.rightCountryName.textContent = this.currentRightCountry.name;
        
        // Update question text with actual country names
        const questionElement = document.getElementById('populationQuestion');
        if (questionElement) {
            questionElement.textContent = `Does ${this.currentRightCountry.name} have higher or lower population than ${this.currentLeftCountry.name}?`;
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
        if (!this.isGameActive) return;

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
                
                // The question text will be updated in slideCountries() after animation
                setTimeout(() => {
                    questionElement.style.color = '#333';
                }, 2000);
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
                
                // Show game over after 2 seconds (same timing as flag game)
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
                questionElement.style.color = '#333'; // Ensure color is reset
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
        // Create overlay for population game over
        const overlay = document.createElement('div');
        overlay.className = 'population-game-over-overlay';
        overlay.innerHTML = `
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
        `;
        
        document.body.appendChild(overlay);
        
        // Add close button functionality
        document.getElementById('populationGameOverClose').addEventListener('click', () => {
            document.body.removeChild(overlay);
            // Show the correct answer if it was hidden
            this.showPopulationCorrectAnswerAfterGameOver();
        });
        
        // Add event listeners
        document.getElementById('populationPlayAgain').addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.startPopulationGameInternal();
        });
        
        document.getElementById('populationMainMenu').addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.showStartScreen();
        });
    }

    showPopulationCorrectAnswerAfterGameOver() {
        // This method is called when user clicks X on population game over screen
        // It ensures the correct answer is visible
        const questionElement = document.getElementById('populationQuestion');
        if (questionElement && this.currentLeftCountry && this.currentRightCountry) {
            const leftCountryName = this.currentLeftCountry.name;
            const rightCountryName = this.currentRightCountry.name;
            const leftPopulation = this.formatPopulation(this.currentLeftCountry.population);
            const rightPopulation = this.formatPopulation(this.currentRightCountry.population);
            
            questionElement.innerHTML = `❌ Wrong! ${leftCountryName} has ${leftPopulation} and ${rightCountryName} has ${rightPopulation}`;
            questionElement.style.color = '#e53e3e';
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountryFlagGame();
}); 