/**
 * PickleTrack Application Framework
 * Handles AuthN JWT authentication, JSON retrieval, frontend search/filter/sort,
 * and saving data to sessionStorage.
 */

const initialMatches = [
    {
        id: 1,
        opponent: "UNA Club Team A",
        date: "2026-06-12",
        yourScore: 11,
        opponentScore: 4,
        category: "Collegiate",
        notes: "Strong serve execution in the third game.",
        isFavorite: false
    },
    {
        id: 2,
        opponent: "Fake County Rec",
        date: "2026-06-10",
        yourScore: 11,
        opponentScore: 9,
        category: "Practice",
        notes: "Worked on drop shots near the kitchen line.",
        isFavorite: true
    }
];

$(document).ready(function() {
    console.log("PickleTrack Engine initialized.");
    
    if (!sessionStorage.getItem('matchData')) {
        sessionStorage.setItem('matchData', JSON.stringify(initialMatches));
    }

    renderCards();
    checkAuthStatus();

    // 1. AuthN Login Handling with Fallback Mode
    $('#signInForm').on('submit', async function(e) {
        e.preventDefault();
        const username = $('#usernameInput').val();
        const password = $('#passwordInput').val();

        try {
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                handleSuccessfulAuth(username, data.token || "mock-jwt-token");
            } else {
                if (password === 'cat') {
                    handleSuccessfulAuth(username, "fallback-jwt-cat-token");
                } else {
                    alert("Authentication Failed. Use password 'cat' for fallback access.");
                }
            }
        } catch (err) {
            if (password === 'cat') {
                handleSuccessfulAuth(username, "offline-fallback-jwt-token");
            } else {
                alert("Offline Auth Error: Password 'cat' required.");
            }
        }
    });

    function handleSuccessfulAuth(user, token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', user);
        checkAuthStatus();
    }

    function checkAuthStatus() {
        const user = localStorage.getItem('authUser');
        if (user) {
            $('#authStatusContainer').html(`
                <div class="text-center py-2">
                    <span class="badge bg-success mb-2">Authenticated</span>
                    <h5>Welcome, <strong>${user}</strong>!</h5>
                    <button id="signOutBtn" class="btn btn-outline-danger btn-sm mt-1">Sign Out</button>
                </div>
            `);
            $('#signOutBtn').on('click', function() {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                location.reload();
            });
        }
    }

    // 2. Render Cards from JSON
    function renderCards() {
        let matches = JSON.parse(sessionStorage.getItem('matchData')) || initialMatches;
        const container = $('#matchContainer');
        container.empty();

        matches.sort((a, b) => (b.isFavorite === a.isFavorite) ? 0 : b.isFavorite ? 1 : -1);

        matches.forEach(match => {
            const favClass = match.isFavorite ? 'favorite-card' : '';
            const heartIcon = match.isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart';

            const cardHtml = `
                <div class="col-md-6 mb-4 card-item" data-id="${match.id}" data-category="${match.category}">
                    <div class="card h-100 shadow-sm border-0 rounded-3 ${favClass}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-primary">${match.category}</span>
                                <button class="btn btn-sm btn-outline-secondary favorite-btn"><i class="bi ${heartIcon}"></i></button>
                            </div>
                            <h5 class="card-title fw-bold" contenteditable="true" data-field="opponent">${match.opponent}</h5>
                            <h6 class="card-subtitle mb-2 text-muted" contenteditable="true" data-field="date">${match.date}</h6>
                            <p class="card-text">
                                <strong>Score:</strong> <span contenteditable="true" data-field="yourScore">${match.yourScore}</span> - <span contenteditable="true" data-field="opponentScore">${match.opponentScore}</span><br>
                                <span class="text-muted" contenteditable="true" data-field="notes">${match.notes}</span>
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-secondary"><i class="bi bi-link-45deg"></i> <a href="https://github.com/addisonflint/charlie-pickle-track" target="_blank">Gist Repository</a></small>
                                <button class="btn btn-sm btn-success save-card-btn"><i class="bi bi-floppy"></i> Save Edits</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(cardHtml);
        });

        attachCardEvents();
    }

    // 3. Search, Filter, & Sort
    $('#searchInput').on('keyup', filterAndSort);
    $('#filterTag').on('change', filterAndSort);
    $('#sortBy').on('change', filterAndSort);

    function filterAndSort() {
        const query = $('#searchInput').val().toLowerCase();
        const tag = $('#filterTag').val();
        const sortOrder = $('#sortBy').val();

        let cards = $('.card-item').toArray();

        cards.forEach(card => {
            const text = $(card).text().toLowerCase();
            const category = $(card).data('category');

            const matchesSearch = text.includes(query);
            const matchesTag = (tag === 'ALL' || category === tag);

            if (matchesSearch && matchesTag) {
                $(card).show();
            } else {
                $(card).hide();
            }
        });

        cards.sort((a, b) => {
            if (sortOrder === 'newest' || sortOrder === 'oldest') {
                const dateA = new Date($(a).find('[data-field="date"]').text());
                const dateB = new Date($(b).find('[data-field="date"]').text());
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            } else if (sortOrder === 'title') {
                const nameA = $(a).find('[data-field="opponent"]').text().toLowerCase();
                const nameB = $(b).find('[data-field="opponent"]').text().toLowerCase();
                return nameA.localeCompare(nameB);
            }
        });

        $('#matchContainer').append(cards);
    }

    // 4. Favorites & Contenteditable Saving
    function attachCardEvents() {
        $('.favorite-btn').off('click').on('click', function() {
            const cardElement = $(this).closest('.card-item');
            const id = cardElement.data('id');
            let matches = JSON.parse(sessionStorage.getItem('matchData'));

            matches = matches.map(m => {
                if (m.id === id) m.isFavorite = !m.isFavorite;
                return m;
            });

            sessionStorage.setItem('matchData', JSON.stringify(matches));
            renderCards();
        });

        $('.save-card-btn').off('click').on('click', function() {
            const cardElement = $(this).closest('.card-item');
            const id = cardElement.data('id');
            
            const updatedMatch = {
                id: id,
                opponent: cardElement.find('[data-field="opponent"]').text(),
                date: cardElement.find('[data-field="date"]').text(),
                yourScore: parseInt(cardElement.find('[data-field="yourScore"]').text()),
                opponentScore: parseInt(cardElement.find('[data-field="opponentScore"]').text()),
                category: cardElement.data('category'),
                notes: cardElement.find('[data-field="notes"]').text(),
                isFavorite: cardElement.find('.favorite-card').length > 0
            };

            let matches = JSON.parse(sessionStorage.getItem('matchData'));
            matches = matches.map(m => m.id === id ? updatedMatch : m);
            sessionStorage.setItem('matchData', JSON.stringify(matches));

            alert("Match card updated and saved to sessionStorage!");
        });
    }

    // 5. Form Submission
    $('#matchLogForm').on('submit', function(e) {
        e.preventDefault();

        const newMatch = {
            id: Date.now(),
            opponent: $('#opponentName').val(),
            date: $('#matchDate').val(),
            yourScore: parseInt($('#yourScore').val()),
            opponentScore: parseInt($('#opponentScore').val()),
            category: $('#categoryTag').val(),
            notes: $('#matchNotes').val(),
            isFavorite: false
        };

        let matches = JSON.parse(sessionStorage.getItem('matchData')) || [];
        matches.push(newMatch);
        sessionStorage.setItem('matchData', JSON.stringify(matches));

        alert("New match logged successfully!");
        window.location.href = "../index.html";
    });
});