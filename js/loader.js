document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainMenu = document.getElementById('main-menu');
    const progressBar = document.getElementById('loading-progress');
    const progressText = document.getElementById('loading-text');

    // Yüklenecek tüm asset'lerin yolları
    const assetsToLoad = [
        'assets/images/background.jpg',
        'assets/images/office-background.jpg',
        'assets/images/loading-background.jpg',
        'assets/images/table-image.png',
        'assets/images/file-image.png',
        'assets/images/tablet-image.png',
        'assets/audio/background-music.mp3',
        ...Array.from({length: 22}, (_, i) => `assets/images/avatars/avatar${i + 1}.png`)
    ];

    let loadedAssets = 0;
    const totalAssets = assetsToLoad.length;

    // İlerleme çubuğunu güncelle
    function updateProgress(progress) {
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `Yükleniyor... ${Math.round(progress)}%`;
        }
    }

    // Asset'leri yükle
    function loadAsset(url) {
        return new Promise((resolve, reject) => {
            if (url.endsWith('.mp3')) {
                // Ses dosyası için
                const audio = new Audio();
                audio.oncanplaythrough = resolve;
                audio.onerror = reject;
                audio.src = url;
            } else {
                // Resim dosyası için
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            }
        });
    }

    // Tüm asset'leri yükle
    async function loadAllAssets() {
        const loadPromises = assetsToLoad.map(url => {
            return loadAsset(url)
                .then(() => {
                    loadedAssets++;
                    const progress = (loadedAssets / totalAssets) * 100;
                    updateProgress(progress);
                })
                .catch(error => {
                    console.error(`Asset yüklenemedi: ${url}`, error);
                });
        });

        try {
            await Promise.all(loadPromises);
            goToMainMenu();
        } catch (error) {
            console.error('Asset yükleme hatası:', error);
            // Hata durumunda da ana menüye geç
            goToMainMenu();
        }
    }

    // Ana menüye geç
    function goToMainMenu() {
        // Son bir kez 100% göster
        updateProgress(100);
        
        // Kısa bir gecikme ile ana menüye geç
        setTimeout(() => {
            if (loadingScreen && mainMenu) {
                loadingScreen.style.display = 'none';
                mainMenu.style.display = 'block';
            }
        }, 500);
    }

    // Yükleme başlat
    loadAllAssets();

    // Yedek olarak 10 saniye sonra otomatik geç
    setTimeout(() => {
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.log('Zaman aşımı - Ana menüye geçiliyor');
            goToMainMenu();
        }
    }, 10000);
});