class AudioManager {
    constructor() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.musicSlider = document.getElementById('musicSlider');
        this.effectsSlider = document.getElementById('effectsSlider');
        
        // Varsayılan ses seviyelerini ayarla
        this.backgroundMusic.volume = this.musicSlider.value / 100;
        
        // Event listeners
        this.musicSlider.addEventListener('input', () => {
            this.setMusicVolume(this.musicSlider.value);
        });
        
        // Ses tercihlerini local storage'da sakla
        this.musicSlider.addEventListener('change', () => {
            localStorage.setItem('musicVolume', this.musicSlider.value);
        });
    }

    // Müzik ses seviyesini ayarla (0-100 arası)
    setMusicVolume(volume) {
        const normalizedVolume = volume / 100;
        this.backgroundMusic.volume = normalizedVolume;
    }

    // Müziği başlat
    startMusic() {
        // Sayfa etkileşimi sonrası müziği başlat
        const playPromise = this.backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Müzik otomatik başlatılamadı:", error);
            });
        }
    }

    // Müziği duraklat
    pauseMusic() {
        this.backgroundMusic.pause();
    }

    // Müziği devam ettir
    resumeMusic() {
        this.backgroundMusic.play();
    }

    // Ses tercihlerini yükle
    loadAudioPreferences() {
        const savedMusicVolume = localStorage.getItem('musicVolume');
        if (savedMusicVolume !== null) {
            this.musicSlider.value = savedMusicVolume;
            this.setMusicVolume(savedMusicVolume);
        }
    }
}

// AudioManager'ı oluştur ve başlat
const audioManager = new AudioManager();
audioManager.loadAudioPreferences();

// Sayfa etkileşimi sonrası müziği başlat
document.addEventListener('click', () => {
    audioManager.startMusic();
}, { once: true });