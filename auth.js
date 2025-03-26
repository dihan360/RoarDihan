// auth.js - Complete Optimized Version
const firebaseConfig = {
  apiKey: "AIzaSyDXNKBbWiPKmj43D_kzFsiIm08OF7Bqxn4",
  authDomain: "roar-dihan.firebaseapp.com",
  projectId: "roar-dihan",
  storageBucket: "roar-dihan.appspot.com",
  messagingSenderId: "149164919743",
  appId: "1:149164919743:web:93763912e382ae84562f0a"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// DOM Elements
const authButton = document.getElementById('auth-button');
const userProfile = document.getElementById('user-profile');
const username = document.getElementById('username');
const userAvatar = document.getElementById('user-avatar');
const authDropdown = document.getElementById('auth-dropdown-content');
const emailForm = document.getElementById('email-form');
const authOptions = document.querySelector('.auth-options');

// Auth State Listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User logged in
    authButton.style.display = 'none';
    userProfile.style.display = 'block';
    username.textContent = user.displayName || user.email.split('@')[0];
    userAvatar.src = user.photoURL || 'default-avatar.png';
    
    // Close all dropdowns
    if (authDropdown) authDropdown.style.display = 'none';
    if (emailForm) emailForm.style.display = 'none';
    if (authOptions) authOptions.style.display = 'block';
  } else {
    // User logged out
    authButton.style.display = 'block';
    userProfile.style.display = 'none';
  }
});

// Google Login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .catch(error => {
      console.error("Google login error:", error);
      alert("Google login failed. Please try again.");
    });
}

// Email Form Toggle
function showEmailForm() {
  if (authOptions) authOptions.style.display = 'none';
  if (emailForm) emailForm.style.display = 'block';
}

// Email Login
function emailLogin() {
  const email = document.getElementById('auth-email')?.value;
  const password = document.getElementById('auth-password')?.value;
  
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(error => {
      console.error("Email login error:", error);
      alert(error.message);
    });
}

// Email Signup
function emailSignup() {
  const email = document.getElementById('auth-email')?.value;
  const password = document.getElementById('auth-password')?.value;
  
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(error => {
      console.error("Signup error:", error);
      alert(error.message);
    });
}

// Logout
function logout() {
  firebase.auth().signOut()
    .then(() => console.log("User signed out"))
    .catch(error => console.error("Sign out error:", error));
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-auth-box')) {
    if (authDropdown) authDropdown.style.display = 'none';
    if (emailForm) emailForm.style.display = 'none';
    if (authOptions) authOptions.style.display = 'block';
  }
});

// Initialize
console.log("Auth system loaded");