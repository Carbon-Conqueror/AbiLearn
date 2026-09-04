/* AbiLearn — No auth. Site is fully public. All functions are no-ops. */
function getUser() { return null; }
function guardNav(event, url) { if (url) location.href = url; return false; }
function authLogout() {}
function initAuth() {}
function openDashboard() {}
function openSettings() {}
function sendVerificationEmail() {}
function showAuthToast() {}
function closePanel() {}
