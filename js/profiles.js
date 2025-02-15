class ProfileManager {
    constructor() {
        this.profiles = [];
        this.currentAvatarIndex = 1;
        this.totalAvatars = 22;
        this.loadProfiles();
        this.setupEventListeners();
    }

    loadProfiles() {
        const savedProfiles = localStorage.getItem('gameProfiles');
        this.profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
    }

    saveProfiles() {
        localStorage.setItem('gameProfiles', JSON.stringify(this.profiles));
    }

    addProfile(name, avatar) {
        const newProfile = {
            id: Date.now(),
            name: name,
            avatar: avatar,
            createdAt: new Date().toISOString()
        };
        this.profiles.push(newProfile);
        this.saveProfiles();
        this.renderProfilesList();
    }

    deleteProfile(profileId) {
        this.profiles = this.profiles.filter(profile => profile.id !== profileId);
        this.saveProfiles();
        this.renderProfilesList();
        
        const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
        if (currentProfile && currentProfile.id === profileId) {
            localStorage.removeItem('currentProfile');
        }
    }

    showDeleteConfirmation(profileId, profileName) {
        const deletePopup = document.getElementById('deleteProfilePopup');
        const profileNameSpan = document.getElementById('deleteProfileName');
        const confirmDeleteBtn = document.getElementById('confirmDeleteProfile');
        const cancelDeleteBtn = document.getElementById('cancelDeleteProfile');

        if (deletePopup && profileNameSpan) {
            profileNameSpan.textContent = profileName;
            deletePopup.style.display = 'flex';

            const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
            const newCancelBtn = cancelDeleteBtn.cloneNode(true);
            confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);
            cancelDeleteBtn.parentNode.replaceChild(newCancelBtn, cancelDeleteBtn);

            newConfirmBtn.addEventListener('click', () => {
                this.deleteProfile(profileId);
                deletePopup.style.display = 'none';
            });

            newCancelBtn.addEventListener('click', () => {
                deletePopup.style.display = 'none';
            });
        }
    }

    renderProfilesList() {
        const container = document.getElementById('profiles-container');
        if (!container) return;

        container.innerHTML = '';

        if (this.profiles.length === 0) {
            container.innerHTML = `
                <div class="no-profiles">
                    <p>Henüz hiç profil oluşturulmamış.</p>
                </div>
            `;
            return;
        }

        this.profiles.forEach(profile => {
            const profileElement = document.createElement('div');
            profileElement.className = 'profile-item';
            profileElement.innerHTML = `
                <div class="profile-avatar">
                    <img src="assets/images/avatars/avatar${profile.avatar}.png" alt="${profile.name}">
                </div>
                <div class="profile-info">
                    <h3>${profile.name}</h3>
                    <p>Oluşturulma: ${new Date(profile.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <div class="profile-actions">
                    <button class="select-profile" data-id="${profile.id}">Seç</button>
                    <button class="delete-profile" data-id="${profile.id}" data-name="${profile.name}">Sil</button>
                </div>
            `;
            container.appendChild(profileElement);
        });
    }

    updateAvatar(direction) {
        if (direction === 'next') {
            this.currentAvatarIndex = this.currentAvatarIndex + 1;
            if (this.currentAvatarIndex > this.totalAvatars) {
                this.currentAvatarIndex = 1;
            }
        } else if (direction === 'prev') {
            this.currentAvatarIndex = this.currentAvatarIndex - 1;
            if (this.currentAvatarIndex < 1) {
                this.currentAvatarIndex = this.totalAvatars;
            }
        }
        
        const avatarImg = document.querySelector('.avatar-option img');
        if (avatarImg) {
            avatarImg.src = `assets/images/avatars/avatar${this.currentAvatarIndex}.png`;
            avatarImg.alt = `Avatar ${this.currentAvatarIndex}`;
        }
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const backToMenuButton = document.getElementById('back-to-menu');
            if (backToMenuButton) {
                backToMenuButton.addEventListener('click', () => {
                    document.getElementById('profiles-screen').style.display = 'none';
                    document.getElementById('main-menu').style.display = 'block';
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-profile')) {
                const profileId = Number(e.target.dataset.id);
                const profileName = e.target.dataset.name;
                this.showDeleteConfirmation(profileId, profileName);
            }
            else if (e.target.classList.contains('select-profile')) {
                const profileId = Number(e.target.dataset.id);
                const selectedProfile = this.profiles.find(p => p.id === profileId);
                if (selectedProfile) {
                    localStorage.setItem('currentProfile', JSON.stringify(selectedProfile));
                    document.getElementById('profiles-screen').style.display = 'none';
                    document.getElementById('game-screen').style.display = 'block';
                }
            }
        });

        const prevAvatarButton = document.getElementById('prevAvatar');
        const nextAvatarButton = document.getElementById('nextAvatar');

        if (prevAvatarButton) {
            prevAvatarButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.updateAvatar('prev');
            });
        }

        if (nextAvatarButton) {
            nextAvatarButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.updateAvatar('next');
            });
        }

        const profileNameInput = document.getElementById('profileName');
        const createProfileButton = document.getElementById('createProfile');
        const cancelProfileButton = document.getElementById('cancelProfile');
        const createProfilePopup = document.getElementById('createProfilePopup');
        const mainMenu = document.getElementById('main-menu');

        if (profileNameInput) {
            profileNameInput.addEventListener('input', () => {
                if (createProfileButton) {
                    createProfileButton.disabled = profileNameInput.value.trim().length < 3;
                }
            });
        }

        if (createProfileButton) {
            createProfileButton.addEventListener('click', () => {
                if (profileNameInput && profileNameInput.value.trim().length >= 3) {
                    this.addProfile(profileNameInput.value.trim(), this.currentAvatarIndex);
                    profileNameInput.value = '';
                    createProfileButton.disabled = true;
                    if (createProfilePopup) createProfilePopup.style.display = 'none';
                    if (mainMenu) mainMenu.style.display = 'block';
                    document.getElementById('profiles-screen').style.display = 'block';
                    this.currentAvatarIndex = 1;
                    const avatarImg = document.querySelector('.avatar-option img');
                    if (avatarImg) {
                        avatarImg.src = 'assets/images/avatars/avatar1.png';
                        avatarImg.alt = 'Avatar 1';
                    }
                }
            });
        }

        if (cancelProfileButton) {
            cancelProfileButton.addEventListener('click', () => {
                if (profileNameInput) profileNameInput.value = '';
                if (createProfileButton) createProfileButton.disabled = true;
                if (createProfilePopup) createProfilePopup.style.display = 'none';
                if (mainMenu) mainMenu.style.display = 'block';
                this.currentAvatarIndex = 1;
                const avatarImg = document.querySelector('.avatar-option img');
                if (avatarImg) {
                    avatarImg.src = 'assets/images/avatars/avatar1.png';
                    avatarImg.alt = 'Avatar 1';
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const deletePopup = document.getElementById('deleteProfilePopup');
                if (deletePopup && deletePopup.style.display === 'flex') {
                    deletePopup.style.display = 'none';
                }
                if (createProfilePopup && createProfilePopup.style.display === 'flex') {
                    createProfilePopup.style.display = 'none';
                    if (mainMenu) mainMenu.style.display = 'block';
                    if (profileNameInput) profileNameInput.value = '';
                    if (createProfileButton) createProfileButton.disabled = true;
                    this.currentAvatarIndex = 1;
                    const avatarImg = document.querySelector('.avatar-option img');
                    if (avatarImg) {
                        avatarImg.src = 'assets/images/avatars/avatar1.png';
                        avatarImg.alt = 'Avatar 1';
                    }
                }
            }
        });

        const popups = [document.getElementById('deleteProfilePopup'), createProfilePopup];
        popups.forEach(popup => {
            if (popup) {
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) {
                        popup.style.display = 'none';
                        if (popup === createProfilePopup) {
                            if (mainMenu) mainMenu.style.display = 'block';
                            if (profileNameInput) profileNameInput.value = '';
                            if (createProfileButton) createProfileButton.disabled = true;
                            this.currentAvatarIndex = 1;
                            const avatarImg = document.querySelector('.avatar-option img');
                            if (avatarImg) {
                                avatarImg.src = 'assets/images/avatars/avatar1.png';
                                avatarImg.alt = 'Avatar 1';
                            }
                        }
                    }
                });
            }
        });
    }
}

window.profileManager = new ProfileManager();