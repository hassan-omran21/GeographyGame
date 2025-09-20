// Shared utilities and common game logic
class GameUtils {
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    static createOverlay(className, content) {
        const overlay = document.createElement('div');
        overlay.className = className;
        overlay.innerHTML = content;
        return overlay;
    }

    static removeOverlay(className) {
        const overlay = document.querySelector(`.${className}`);
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    static showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.className = 'game-mode-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }

    static formatScore(score) {
        return score.toString().padStart(2, '0');
    }

    static createButton(text, className, id = null) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = className;
        if (id) button.id = id;
        return button;
    }

    static formatTime(seconds) {
        return seconds.toString().padStart(2, '0');
    }

    static animateElement(element, animationClass, duration = 300) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
}

// Common game state management
class GameState {
    constructor() {
        this.currentGame = null;
        this.isGameActive = false;
        this.score = 0;
        this.timerInterval = null;
    }

    reset() {
        this.currentGame = null;
        this.isGameActive = false;
        this.score = 0;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startGame(gameType) {
        this.currentGame = gameType;
        this.isGameActive = true;
        this.score = 0;
    }

    stopGame() {
        this.isGameActive = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Timer utility
class GameTimer {
    constructor(callback, duration = 15) {
        this.callback = callback;
        this.duration = duration;
        this.timeLeft = duration;
        this.interval = null;
    }

    start() {
        this.timeLeft = this.duration;
        this.interval = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                this.stop();
                this.callback();
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset(newDuration = null) {
        this.stop();
        if (newDuration) {
            this.duration = newDuration;
        }
        this.timeLeft = this.duration;
    }

    getTimeLeft() {
        return this.timeLeft;
    }

    getProgress() {
        return (this.timeLeft / this.duration) * 100;
    }
}

// Translation service using MyMemory API (free alternative to Google Translate)
class TranslationService {
    constructor() {
        this.baseUrl = 'https://api.mymemory.translated.net/get';
        this.languages = {
            'English': 'en',
            'Arabic': 'ar',
            'Chinese (Simplified)': 'zh',
            'Spanish': 'es',
            'French': 'fr',
            'German': 'de',
            'Italian': 'it',
            'Portuguese': 'pt',
            'Russian': 'ru',
            'Japanese': 'ja',
            'Korean': 'ko',
            'Dutch': 'nl',
            'Swedish': 'sv',
            'Norwegian': 'no',
            'Danish': 'da',
            'Finnish': 'fi',
            'Polish': 'pl',
            'Turkish': 'tr',
            'Greek': 'el',
            'Hebrew': 'he',
            'Hindi': 'hi',
            'Thai': 'th',
            'Vietnamese': 'vi',
            'Indonesian': 'id',
            'Malay': 'ms',
            'Czech': 'cs',
            'Hungarian': 'hu',
            'Romanian': 'ro',
            'Bulgarian': 'bg',
            'Croatian': 'hr',
            'Slovak': 'sk',
            'Slovenian': 'sl',
            'Lithuanian': 'lt',
            'Latvian': 'lv',
            'Estonian': 'et',
            'Ukrainian': 'uk',
            'Belarusian': 'be',
            'Serbian': 'sr',
            'Macedonian': 'mk',
            'Albanian': 'sq',
            'Bosnian': 'bs',
            'Montenegrin': 'me',
            'Icelandic': 'is',
            'Welsh': 'cy',
            'Irish': 'ga',
            'Basque': 'eu',
            'Catalan': 'ca',
            'Galician': 'gl',
            'Maltese': 'mt',
            'Georgian': 'ka',
            'Armenian': 'hy',
            'Azerbaijani': 'az',
            'Kazakh': 'kk',
            'Uzbek': 'uz',
            'Kyrgyz': 'ky',
            'Tajik': 'tg',
            'Turkmen': 'tk',
            'Mongolian': 'mn',
            'Bengali': 'bn',
            'Punjabi': 'pa',
            'Gujarati': 'gu',
            'Marathi': 'mr',
            'Tamil': 'ta',
            'Telugu': 'te',
            'Kannada': 'kn',
            'Malayalam': 'ml',
            'Sinhala': 'si',
            'Nepali': 'ne',
            'Urdu': 'ur',
            'Persian': 'fa',
            'Pashto': 'ps',
            'Kurdish': 'ku',
            'Swahili': 'sw',
            'Amharic': 'am',
            'Yoruba': 'yo',
            'Igbo': 'ig',
            'Hausa': 'ha',
            'Zulu': 'zu',
            'Afrikaans': 'af',
            'Filipino': 'tl',
            'Cebuano': 'ceb',
            'Javanese': 'jv',
            'Sundanese': 'su',
            'Burmese': 'my',
            'Khmer': 'km',
            'Lao': 'lo',
            'Tibetan': 'bo',
            'Uyghur': 'ug'
        };
        
        this.samplePhrases = [
            'Hello, how are you today? I hope you are having a wonderful time and enjoying the beautiful weather outside.',
            'Good morning! I would like to order a cup of coffee and some fresh pastries for breakfast, please.',
            'Have a nice day! I am looking forward to meeting you again soon and continuing our interesting conversation.',
            'Thank you very much for your help. I really appreciate your kindness and patience with me today.',
            'What is your name and where do you come from? I would love to learn more about your country and culture.',
            'Where are you from originally? I am curious about different places around the world and their traditions.',
            'I love this place very much. The atmosphere is wonderful and the people here are incredibly friendly.',
            'See you later! I will be back tomorrow morning to continue working on our important project together.',
            'How much does it cost to travel to your country? I am planning a vacation and would like to know the prices.',
            'Excuse me, please. Could you tell me where I can find the nearest train station or bus stop?',
            'I don\'t understand what you are saying. Could you please speak more slowly or use simpler words?',
            'Can you help me with this problem? I have been trying to solve it for hours but cannot find the answer.',
            'Nice to meet you! I am very excited to work with you and learn from your experience and knowledge.',
            'What time is it right now? I need to catch the next bus and don\'t want to be late for my appointment.',
            'I\'m hungry and would like to find a good restaurant nearby. Do you have any recommendations for me?',
            'This is beautiful! I have never seen such amazing architecture and stunning natural landscapes before.',
            'I\'m learning languages because I want to travel around the world and communicate with people everywhere.',
            'Do you speak English fluently? I am trying to practice my conversation skills and improve my pronunciation.',
            'I\'m sorry for the confusion. Let me explain the situation more clearly so we can understand each other better.',
            'Congratulations on your achievement! You have worked very hard and deserve this wonderful success.'
        ];
    }

    async translateText(text, targetLang) {
        try {
            const url = `${this.baseUrl}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.responseStatus === 200 && data.responseData) {
                return data.responseData.translatedText;
            }
            throw new Error('Translation failed');
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Return original text as fallback
        }
    }

    getRandomPhrase() {
        return this.samplePhrases[Math.floor(Math.random() * this.samplePhrases.length)];
    }

    getRandomLanguages(count = 6) {
        const languageNames = Object.keys(this.languages);
        GameUtils.shuffleArray(languageNames);
        return languageNames.slice(0, count);
    }

    getLanguageCode(languageName) {
        return this.languages[languageName] || 'en';
    }

    getLanguageName(code) {
        for (const [name, langCode] of Object.entries(this.languages)) {
            if (langCode === code) {
                return name;
            }
        }
        return 'Unknown';
    }
}

// Text-to-Speech service using browser's built-in speech synthesis
class TTSService {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.loadVoices();
        
        // Load voices when they become available
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
    }

    speak(text, language = 'en-US') {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Try to find a voice for the specified language
            const voice = this.voices.find(v => v.lang.startsWith(language.split('-')[0]));
            if (voice) {
                utterance.voice = voice;
            }
            
            utterance.lang = language;
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(event.error);
            
            this.synthesis.speak(utterance);
        });
    }

    stop() {
        this.synthesis.cancel();
    }

    isSupported() {
        return 'speechSynthesis' in window;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameUtils, GameState, GameTimer, TranslationService, TTSService };
}
