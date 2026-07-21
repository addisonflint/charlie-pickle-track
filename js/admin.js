$(document).ready(function() {
    // Derived Client Metadata
    $('#timeVal').text(new Date().toLocaleString());
    $('#agentVal').text(navigator.userAgent.split(' ')[0]);
    $('#platformVal').text(navigator.platform);

    // localStorage Dump
    const localData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localData[key] = localStorage.getItem(key);
    }
    $('#localStorageDisplay').text(JSON.stringify(localData, null, 2));

    // sessionStorage Copy/Paste JSON Box
    const sessionData = sessionStorage.getItem('matchData') ? JSON.parse(sessionStorage.getItem('matchData')) : [];
    $('#sessionStorageDisplay').val(JSON.stringify(sessionData, null, 2));
});