document.addEventListener('DOMContentLoaded', function() {
    // Oyun ekranı elemanları
    const gameScreen = document.getElementById('game-screen');
    const backButton = document.getElementById('backButton');
    const files = document.querySelectorAll('.file');
    const tablet = document.getElementById('tablet');

    // Geri dönüş butonu için event listener
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Oyun ekranını gizle
            gameScreen.style.display = 'none';
            // Ana menüyü göster
            document.getElementById('main-menu').style.display = 'block';
            // Aktif profili localStorage'dan kaldır
            localStorage.removeItem('currentProfile');
            console.log('Ana menüye dönüldü');
        });
    }

    // Dosyaları sürüklenebilir yap
    files.forEach(file => {
        file.draggable = true;

        file.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', file.id);
            file.classList.add('dragging');
            console.log('Dosya sürüklenmesi başladı:', file.id);
        });

        file.addEventListener('dragend', () => {
            file.classList.remove('dragging');
            console.log('Dosya sürüklenmesi bitti');
        });
    });

    // Masayı drop zone yap
    const table = document.querySelector('.table');
    if (table) {
        table.addEventListener('dragover', (e) => {
            e.preventDefault();
            table.classList.add('drag-over');
        });

        table.addEventListener('dragleave', () => {
            table.classList.remove('drag-over');
        });

        table.addEventListener('drop', (e) => {
            e.preventDefault();
            table.classList.remove('drag-over');
            
            const fileId = e.dataTransfer.getData('text/plain');
            const file = document.getElementById(fileId);
            
            if (file) {
                // Dosyanın yeni pozisyonunu hesapla
                const rect = table.getBoundingClientRect();
                const x = e.clientX - rect.left - (file.offsetWidth / 2);
                const y = e.clientY - rect.top - (file.offsetHeight / 2);

                // Dosyayı yeni pozisyona taşı
                file.style.position = 'absolute';
                file.style.left = `${x}px`;
                file.style.top = `${y}px`;

                console.log('Dosya bırakıldı:', fileId, 'Pozisyon:', {x, y});
            }
        });
    }

    // Tablet için event listener
    if (tablet) {
        tablet.addEventListener('click', () => {
            console.log('Tablete tıklandı');
            // Tablet fonksiyonları buraya eklenecek
        });
    }

    // Profil bilgilerini göster
    function displayProfileInfo() {
        const currentProfile = localStorage.getItem('currentProfile');
        if (currentProfile) {
            const profile = JSON.parse(currentProfile);
            console.log('Aktif profil:', profile.name);
            // Profil bilgilerini oyun ekranında gösterme kodu buraya eklenecek
        }
    }

    // Oyun başlatma fonksiyonu
    function startGame() {
        displayProfileInfo();
        // Oyun başlangıç mantığı buraya eklenecek
        console.log('Oyun başlatıldı');
    }

    // Oyun ekranı görünür olduğunda oyunu başlat
    const gameScreenObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.style.display === 'block') {
                startGame();
            }
        });
    });

    if (gameScreen) {
        gameScreenObserver.observe(gameScreen, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    // Oyun içi ayarları yükle
    function loadGameSettings() {
        const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
            brightness: 100,
            music: 80,
            effects: 100,
            language: 'tr'
        };
        return settings;
    }

    // Ses efektlerini çal
    function playSound(soundType) {
        const settings = loadGameSettings();
        const effectsVolume = settings.effects / 100;

        // Ses efekti oynatma kodu buraya eklenecek
        console.log('Ses efekti çalındı:', soundType, 'Ses seviyesi:', effectsVolume);
    }

    // Pencere yeniden boyutlandığında oyun alanını güncelle
    window.addEventListener('resize', () => {
        // Oyun alanı yeniden boyutlandırma mantığı buraya eklenecek
        console.log('Pencere yeniden boyutlandırıldı');
    });

    // Oyun durumunu kaydet
    function saveGameState() {
        const gameState = {
            // Oyun durumu bilgileri buraya eklenecek
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
        console.log('Oyun durumu kaydedildi');
    }

    // Oyun durumunu yükle
    function loadGameState() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            // Oyun durumunu yükleme mantığı buraya eklenecek
            console.log('Oyun durumu yüklendi:', gameState.lastSaved);
            return gameState;
        }
        return null;
    }

    // Periyodik olarak oyun durumunu kaydet
    setInterval(saveGameState, 60000); // Her 1 dakikada bir

    // Hata yakalama
    window.addEventListener('error', (e) => {
        console.error('Oyun hatası:', e.message);
        // Hata yakalama mantığı buraya eklenecek
    });

    // Sayfanın yüklendiğini konsola yazdır
    console.log('Game.js yüklendi - ' + new Date().toISOString());
});