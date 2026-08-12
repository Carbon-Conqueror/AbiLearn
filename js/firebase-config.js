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
    apiKey:            "AIzaSyD7WkQpQia10Ukjg58Jwf_3mQ6SJyvfkNQ",
    authDomain:        "abilearn-89c92.firebaseapp.com",
    projectId:         "abilearn-89c92",
    storageBucket:     "abilearn-89c92.firebasestorage.app",
    messagingSenderId: "969943670968",
    appId:             "1:969943670968:web:d93dd9c9a7be91435a144d"
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
