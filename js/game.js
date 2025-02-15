document.addEventListener('DOMContentLoaded', function() {
    // Oyun ekranı elemanları
    const gameScreen = document.getElementById('game-screen');
    const backButton = document.getElementById('backButton');
    const itemDetailPopup = document.getElementById('itemDetailPopup');
    const itemDetailTitle = document.getElementById('itemDetailTitle');
    const itemDetailContent = document.getElementById('itemDetailContent');
    const closeItemDetail = document.getElementById('closeItemDetail');
    const clickableItems = document.querySelectorAll('.clickable-item');

    // Ses efektleri
    const clickSound = new Audio('assets/audio/click.mp3');
    const hoverSound = new Audio('assets/audio/hover.mp3');

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

    // Her tıklanabilir öğe için olay dinleyicileri
    clickableItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemType = this.getAttribute('data-type');
            handleItemClick(itemType);
            playSound('click');
        });

        // Hover efekti için ses
        item.addEventListener('mouseenter', () => playSound('hover'));
    });

    // Ses efektlerini çal
    function playSound(soundType) {
        const settings = loadGameSettings();
        const effectsVolume = settings.effects / 100;

        if (soundType === 'click') {
            clickSound.volume = effectsVolume;
            clickSound.play();
        } else if (soundType === 'hover') {
            hoverSound.volume = effectsVolume * 0.5; // Hover sesi daha hafif
            hoverSound.play();
        }
    }

    // Tıklanabilir öğelerin işlenmesi
    function handleItemClick(itemType) {
        let title = '';
        let content = '';

        switch(itemType) {
            case 'calendar':
                title = 'Takvim';
                content = getDynamicCalendarContent();
                break;
            case 'constitution':
                title = 'Anayasa Kitabı';
                content = getConstitutionContent();
                break;
            case 'laptop':
                title = 'Laptop';
                content = getLaptopContent();
                break;
            case 'notebook':
                title = 'Not Defteri';
                content = getNotebookContent();
                break;
            case 'case-files':
                title = 'Dava Dosyaları';
                content = getCaseFilesContent();
                break;
        }

        showItemDetail(title, content);
    }

    // Öğe detaylarını göster
    function showItemDetail(title, content) {
        itemDetailTitle.textContent = title;
        itemDetailContent.innerHTML = content;
        itemDetailPopup.style.display = 'flex';
    }

    // Detay popup'ını kapat
    if (closeItemDetail) {
        closeItemDetail.addEventListener('click', () => {
            itemDetailPopup.style.display = 'none';
        });
    }

    // Popup dışına tıklandığında kapat
    itemDetailPopup.addEventListener('click', (e) => {
        if (e.target === itemDetailPopup) {
            itemDetailPopup.style.display = 'none';
        }
    });

    // Dinamik takvim içeriği
    function getDynamicCalendarContent() {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return `
            <div class="calendar-content">
                <h3>Bugün: ${date.toLocaleDateString('tr-TR', options)}</h3>
                <div class="upcoming-events">
                    <h4>Yaklaşan Görevler</h4>
                    <ul>
                        <li>10:00 - Duruşma</li>
                        <li>14:30 - Müvekkil Görüşmesi</li>
                        <li>16:00 - Dosya İnceleme</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Anayasa kitabı içeriği
    function getConstitutionContent() {
        return `
            <div class="constitution-content">
                <h3>T.C. Anayasası</h3>
                <p>Madde 1- Türkiye Devleti bir Cumhuriyettir.</p>
                <p>Madde 2- Türkiye Cumhuriyeti, toplumun huzuru, millî dayanışma ve adalet anlayışı içinde...</p>
                <div class="constitution-search">
                    <input type="text" placeholder="Madde ara...">
                    <button>Ara</button>
                </div>
            </div>
        `;
    }

    // Laptop içeriği
    function getLaptopContent() {
        return `
            <div class="laptop-content">
                <div class="laptop-menu">
                    <button>E-Posta</button>
                    <button>Dosyalar</button>
                    <button>UYAP</button>
                </div>
                <div class="laptop-display">
                    <p>Lütfen bir menü seçin...</p>
                </div>
            </div>
        `;
    }

    // Not defteri içeriği
    function getNotebookContent() {
        return `
            <div class="notebook-content">
                <div class="note">
                    <h4>15.02.2025</h4>
                    <p>- Duruşma notları alınacak</p>
                    <p>- Müvekkil görüşmesi için hazırlık yapılacak</p>
                    <p>- Dilekçe taslağı hazırlanacak</p>
                </div>
                <button class="add-note">Yeni Not Ekle</button>
            </div>
        `;
    }

    // Dava dosyaları içeriği
    function getCaseFilesContent() {
        return `
            <div class="case-files-content">
                <div class="file-list">
                    <div class="file-item">
                        <h4>Dosya No: 2025/123</h4>
                        <p>Konu: Tazminat Davası</p>
                        <button>Dosyayı Aç</button>
                    </div>
                    <div class="file-item">
                        <h4>Dosya No: 2025/124</h4>
                        <p>Konu: İtiraz Dilekçesi</p>
                        <button>Dosyayı Aç</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Oyun ayarlarını yükle
    function loadGameSettings() {
        const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
            brightness: 100,
            music: 80,
            effects: 100,
            language: 'tr'
        };
        return settings;
    }

    // Profil bilgilerini göster
    function displayProfileInfo() {
        const currentProfile = localStorage.getItem('currentProfile');
        if (currentProfile) {
            const profile = JSON.parse(currentProfile);
            console.log('Aktif profil:', profile.name);
        }
    }

    // Oyun başlatma fonksiyonu
    function startGame() {
        displayProfileInfo();
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

    // Pencere yeniden boyutlandığında oyun alanını güncelle
    window.addEventListener('resize', () => {
        console.log('Pencere yeniden boyutlandırıldı');
    });

    // Oyun durumunu kaydet
    function saveGameState() {
        const gameState = {
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    // Periyodik olarak oyun durumunu kaydet
    setInterval(saveGameState, 60000); // Her 1 dakikada bir

    // Hata yakalama
    window.addEventListener('error', (e) => {
        console.error('Oyun hatası:', e.message);
    });

    // ESC tuşu ile popup'ları kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            itemDetailPopup.style.display = 'none';
        }
    });

    console.log('Game.js yüklendi - ' + new Date().toISOString());
});