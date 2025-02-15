document.addEventListener('DOMContentLoaded', function() {
    // Ana menü butonları
    const continueButton = document.getElementById('continue');
    const newGameButton = document.getElementById('newGame');
    const howToPlayButton = document.getElementById('howToPlay');
    const settingsButton = document.getElementById('settings');
    const exitButton = document.getElementById('exit');

    // Popup elemanları
    const exitPopup = document.getElementById('exitPopup');
    const confirmExitButton = document.getElementById('confirmExit');
    const cancelExitButton = document.getElementById('cancelExit');
    const settingsPopup = document.getElementById('settingsPopup');
    const saveSettingsButton = document.getElementById('saveSettings');
    const cancelSettingsButton = document.getElementById('cancelSettings');
    const createProfilePopup = document.getElementById('createProfilePopup');
    const howToPlayPopup = document.getElementById('howToPlayPopup');
    const closeHowToPlayButton = document.getElementById('closeHowToPlay');

    // Ana menü butonları için event listener'lar
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            const currentProfile = localStorage.getItem('currentProfile');
            if (currentProfile) {
                document.getElementById('main-menu').style.display = 'none';
                document.getElementById('game-screen').style.display = 'block';

                // Oyun ekranında geri dönüş butonu kontrolü
                const gameBackButton = document.getElementById('backButton');
                if (gameBackButton) {
                    gameBackButton.style.display = 'block';
                }
            } else {
                document.getElementById('main-menu').style.display = 'none';
                document.getElementById('profiles-screen').style.display = 'block';
            }
        });
    }

    if (newGameButton) {
        newGameButton.addEventListener('click', () => {
            document.getElementById('main-menu').style.display = 'none';
            if (createProfilePopup) {
                createProfilePopup.style.display = 'flex';
            }
        });
    }

    if (howToPlayButton) {
        howToPlayButton.addEventListener('click', () => {
            if (howToPlayPopup) {
                howToPlayPopup.style.display = 'flex';
            }
        });
    }

    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            if (settingsPopup) {
                settingsPopup.style.display = 'flex';
                loadSettings();
            }
        });
    }

    if (exitButton) {
        exitButton.addEventListener('click', () => {
            if (exitPopup) {
                exitPopup.style.display = 'flex';
            }
        });
    }

    // Çıkış popup'ı için event listener'lar
    if (confirmExitButton) {
        confirmExitButton.addEventListener('click', () => {
            window.close();
        });
    }

    if (cancelExitButton) {
        cancelExitButton.addEventListener('click', () => {
            if (exitPopup) {
                exitPopup.style.display = 'none';
            }
        });
    }

    // Ayarlar popup'ı için event listener'lar
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', () => {
            saveSettings();
            if (settingsPopup) {
                settingsPopup.style.display = 'none';
            }
        });
    }

    if (cancelSettingsButton) {
        cancelSettingsButton.addEventListener('click', () => {
            if (settingsPopup) {
                settingsPopup.style.display = 'none';
            }
        });
    }

    // Nasıl Oynanır popup'ı için event listener
    if (closeHowToPlayButton) {
        closeHowToPlayButton.addEventListener('click', () => {
            if (howToPlayPopup) {
                howToPlayPopup.style.display = 'none';
            }
        });
    }

    // Ayarlar fonksiyonları
    function loadSettings() {
        // Kayıtlı ayarları yükle
        const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
            brightness: 100,
            music: 80,
            effects: 100,
            language: 'tr'
        };

        // Ayarları input elementlerine uygula
        const brightnessSlider = document.getElementById('brightnessSlider');
        const musicSlider = document.getElementById('musicSlider');
        const effectsSlider = document.getElementById('effectsSlider');
        const languageSelect = document.getElementById('languageSelect');

        if (brightnessSlider) {
            brightnessSlider.value = settings.brightness;
            updateSliderValue(brightnessSlider);
        }
        if (musicSlider) {
            musicSlider.value = settings.music;
            updateSliderValue(musicSlider);
            updateAudioVolumes(settings.music, settings.effects);
        }
        if (effectsSlider) {
            effectsSlider.value = settings.effects;
            updateSliderValue(effectsSlider);
        }
        if (languageSelect) {
            languageSelect.value = settings.language;
        }

        // Parlaklık ayarını uygula
        document.documentElement.style.filter = `brightness(${settings.brightness}%)`;
    }

    function saveSettings() {
        const settings = {
            brightness: document.getElementById('brightnessSlider')?.value || 100,
            music: document.getElementById('musicSlider')?.value || 80,
            effects: document.getElementById('effectsSlider')?.value || 100,
            language: document.getElementById('languageSelect')?.value || 'tr'
        };

        localStorage.setItem('gameSettings', JSON.stringify(settings));
        document.documentElement.style.filter = `brightness(${settings.brightness}%)`;
        
        // Ses ayarlarını güncelle
        updateAudioVolumes(settings.music, settings.effects);
    }

    // Slider değer göstergesini güncelle
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        updateSliderValue(slider);
        slider.addEventListener('input', () => updateSliderValue(slider));
    });

    function updateSliderValue(slider) {
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        if (valueDisplay) {
            valueDisplay.textContent = `${slider.value}%`;
        }
    }

    // Tam ekran butonu için event listener
    const fullscreenButton = document.getElementById('toggleFullscreen');
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullscreen);
    }

    // Tam ekran fonksiyonu
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Tam ekran hatası: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Oyun ekranından ana menüye dönüş butonu
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            document.getElementById('game-screen').style.display = 'none';
            document.getElementById('main-menu').style.display = 'block';
            // Aktif profili localStorage'dan kaldır
            localStorage.removeItem('currentProfile');
            console.log('Ana menüye dönüldü');
        });
    }

    // ESC tuşu ile popup'ları kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const popups = [exitPopup, settingsPopup, howToPlayPopup];
            popups.forEach(popup => {
                if (popup && popup.style.display === 'flex') {
                    popup.style.display = 'none';
                }
            });
        }
    });

    // Popup overlay tıklama ile kapatma
    const popups = [exitPopup, settingsPopup, howToPlayPopup];
    popups.forEach(popup => {
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.style.display = 'none';
                }
            });
        }
    });

    // Ses ayarlarını güncelleme fonksiyonu
    function updateAudioVolumes(musicVolume, effectsVolume) {
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (backgroundMusic) {
            backgroundMusic.volume = musicVolume / 100;
        }
    }

    // Sayfa yüklendiğinde ayarları yükle
    loadSettings();

    // Sayfanın yüklendiğini konsola yazdır
    console.log('Menu.js yüklendi - ' + new Date().toISOString());
});