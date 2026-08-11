/* AbiLearn — Firebase Initialization
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a project (or open an existing one)
 * 3. Project Settings → Your apps → Add web app
 * 4. Copy the config object values below
 * 5. Enable Authentication → Sign-in method → Email/Password
 * 6. Create a Firestore database (Start in production mode)
 * 7. Deploy firestore.rules from this project
 *
 * The Firebase API key is NOT secret — security comes from Firestore Rules.
 */
(function () {
  var firebaseConfig = {
    apiKey:            "REPLACE_WITH_YOUR_API_KEY",
    authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
    projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
    storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
    messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
    appId:             "REPLACE_WITH_YOUR_APP_ID"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window._fauth = firebase.auth();
  window._fdb   = firebase.firestore();

  window._fdb.enablePersistence({ synchronizeTabs: true }).catch(function () {
    // Persistence unavailable (multiple tabs or unsupported browser) — fine, continue online.
  });
})();
