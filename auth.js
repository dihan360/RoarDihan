// Firebase Configuration
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
const authDropdown = document.getElementById('auth-dropdown');
const authDropdownContent = document.getElementById('auth-dropdown-content');
const userProfile = document.getElementById('user-profile');
const username = document.getElementById('username');
const emailForm = document.getElementById('email-form');
const authOptions = document.querySelector('.auth-options');

// Toggle Dropdown Visibility
authButton.addEventListener('click', (e) => {
  e.stopPropagation();
  authDropdownContent.style.display = 
    authDropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Auth State Listener
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    authDropdown.style.display = 'none';
    userProfile.style.display = 'block';
    username.textContent = user.displayName || user.email.split('@')[0];
    
    // Close dropdowns
    authDropdownContent.style.display = 'none';
    emailForm.style.display = 'none';
  } else {
    // User is signed out
    authDropdown.style.display = 'block';
    userProfile.style.display = 'none';
  }
});

// Google Login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log("Google login successful", result.user);
    })
    .catch((error) => {
      console.error("Google login error:", error);
      alert(`Login failed: ${error.message}`);
    });
}

// Email Form Toggle
function showEmailForm() {
  authOptions.style.display = 'none';
  emailForm.style.display = 'block';
}

// Email Login
function emailLogin() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Email login successful", userCredential.user);
    })
    .catch((error) => {
      console.error("Email login error:", error);
      alert(`Login failed: ${error.message}`);
    });
}

// Email Signup
function emailSignup() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Signup successful", userCredential.user);
    })
    .catch((error) => {
      console.error("Signup error:", error);
      alert(`Signup failed: ${error.message}`);
    });
}

// Logout Function
function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log("User signed out");
      // Close profile dropdown
      userProfile.classList.remove('active');
      // Redirect to home page after logout
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error("Sign out error:", error);
      alert("Logout failed. Please try again.");
    });
}

// Profile Dropdown Toggle
userProfile.addEventListener('click', function(e) {
  e.stopPropagation();
  this.classList.toggle('active');
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.user-auth-box')) {
    authDropdownContent.style.display = 'none';
    emailForm.style.display = 'none';
    authOptions.style.display = 'block';
    userProfile.classList.remove('active');
  }
});

console.log("Auth system initialized");