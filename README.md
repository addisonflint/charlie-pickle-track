# 🏓 PickleTrack: Match & Stat Vault
> "A polished, JSON-driven application for logging collegiate pickleball match performance, tracking score differentials, and syncing telemetry."

---

## 👤 Authorship & Attribution
* **Author:** Addison Flint
* **GitHub Profile:** [https://github.com/addisonflint](https://github.com/addisonflint)
* **Version:** 2.0.0 (Charlie Milestone)
* **Date:** July 2026
* **ALFA Branch Link:** [ALFA Version Branch](https://github.com/addisonflint/charlie-pickle-track/tree/alfa)
* **Early Concept Wireframe:** [Wireframe Wiki Page](https://github.com/addisonflint/charlie-pickle-track/wiki/charlie%E2%80%90wireframe)

---

## 📖 User Story & Narrative
> **As a** competitive collegiate pickleball player,
> **I want to** store all my match results, filter by opponent or match category, and edit notes inline,
> **So that** I can analyze performance patterns across seasons and sync data across devices.

---

## 🛠️ Stack & Resources
* **Libraries:** Normalize.css, Bootstrap v5.3.3, Bootstrap Icons, jQuery v3.7.1, jQuery UI, Google Fonts (`Plus Jakarta Sans`)
* **APIs & Storage:** Fetch API (AuthN Login), `localStorage`, `sessionStorage`

---

## 💻 Code Snippet & Explanation

```javascript
// Function allowing inline editing on contenteditable DOM elements and updating sessionStorage
$('.save-card-btn').on('click', function() {
    const cardElement = $(this).closest('.card-item');
    const updatedMatch = {
        id: cardElement.data('id'),
        opponent: cardElement.find('[data-field="opponent"]').text(),
        date: cardElement.find('[data-field="date"]').text(),
        yourScore: parseInt(cardElement.find('[data-field="yourScore"]').text()),
        opponentScore: parseInt(cardElement.find('[data-field="opponentScore"]').text())
    };
    
    // Persist to session storage
    sessionStorage.setItem('matchData', JSON.stringify(updatedMatch));
});