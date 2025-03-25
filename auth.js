// auth.js - Final Working Version
const firebaseConfig = {
  apiKey: "AIzaSyDXNKBbWiPKmj43D_kzFsiIm08OF7Bqxn4",
  authDomain: "roar-dihan.firebaseapp.com",
  projectId: "roar-dihan",
  storageBucket: "roar-dihan.appspot.com",
  messagingSenderId: "149164919743",
  appId: "1:149164919743:web:93763912e382ae84562f0a"
};

// Safe Firebase Initialization
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK not loaded!');
} else {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.error('Firebase init error:', error);
  }
}

// DOM Elements Cache
const authElements = {
  button: document.getElementById('auth-button'),
  profile: document.getElementById('user-profile'),
  username: document.getElementById('username'),
  avatar: document.getElementById('user-avatar'),
  authOptions: document.querySelector('.auth-options'),
  emailForm: document.getElementById('email-form'),
  emailInput: document.getElementById('auth-email'),
  passwordInput: document.getElementById('auth-password')
};

// Enhanced Auth State Listener
firebase.auth().onAuthStateChanged(user => {
  try {
    if (user) {
      // User logged in
      authElements.button.style.display = 'none';
      authElements.profile.style.display = 'block';
      authElements.username.textContent = user.displayName || user.email.split('@')[0];
      authElements.avatar.src = user.photoURL || 'default-avatar.png';
      console.log('User logged in:', user.email);
    } else {
      // User logged out
      authElements.button.style.display = 'block';
      authElements.profile.style.display = 'none';
      console.log('User logged out');
    }
  } catch (error) {
    console.error('Auth state error:', error);
  }
});

// Improved Google Login
async function googleLogin() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await firebase.auth().signInWithPopup(provider);
    console.log('Google login success:', result.user.email);
    return result;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

// Email Form Toggle
function showEmailForm() {
  authElements.authOptions.style.display = 'none';
  authElements.emailForm.style.display = 'block';
}

// Email Login
async function emailLogin() {
  try {
    await firebase.auth().signInWithEmailAndPassword(
      authElements.emailInput.value,
      authElements.passwordInput.value
    );
  } catch (error) {
    handleAuthError(error);
  }
}

// Email Signup
async function emailSignup() {
  try {
    await firebase.auth().createUserWithEmailAndPassword(
      authElements.emailInput.value,
      authElements.passwordInput.value
    );
  } catch (error) {
    handleAuthError(error);
  }
}

// Logout
function logout() {
  firebase.auth().signOut()
    .then(() => console.log('User signed out'))
    .catch(error => console.error('Sign out error:', error));
}

// Error Handler
function handleAuthError(error) {
  console.error('Auth error:', error.code, error.message);
  
  const errorMessages = {
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already registered',
    'auth/weak-password': 'Password must be at least 6 characters'
  };
  
  alert(errorMessages[error.code] || 'Authentication failed. Please try again.');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Auth system ready');
});