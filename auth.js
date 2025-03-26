// Firebase Configuration (UNCHANGED)
const firebaseConfig = {
  apiKey: "AIzaSyDXNKBbWiPKmj43D_kzFsiIm08OF7Bqxn4",
  authDomain: "roar-dihan.firebaseapp.com",
  projectId: "roar-dihan",
  storageBucket: "roar-dihan.appspot.com",
  messagingSenderId: "149164919743",
  appId: "1:149164919743:web:93763912e382ae84562f0a"
};

// Initialize Firebase (UNCHANGED)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// DOM Elements (ONLY ADDED NEW PROFILE ELEMENTS)
const authButton = document.getElementById('auth-button');
const authDropdown = document.getElementById('auth-dropdown');
const authDropdownContent = document.getElementById('auth-dropdown-content');
const userProfile = document.getElementById('user-profile');
const profilePicture = document.getElementById('profile-picture'); // NEW
const dropdownProfilePic = document.getElementById('dropdown-profile-pic'); // NEW
const dropdownUsername = document.getElementById('dropdown-username'); // NEW
const dropdownEmail = document.getElementById('dropdown-email'); // NEW
const emailForm = document.getElementById('email-form');
const authOptions = document.querySelector('.auth-options');

// Toggle Dropdown Visibility (UNCHANGED)
authButton.addEventListener('click', (e) => {
  e.stopPropagation();
  authDropdownContent.style.display = 
    authDropdownContent.style.display === 'block' ? 'none' : 'block';
});

// ONLY UPDATED THE AUTH STATE LISTENER FOR PROFILE PICTURE
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in - ONLY CHANGED THIS SECTION
    authDropdown.style.display = 'none';
    userProfile.style.display = 'block';
    
    // Set profile picture (NEW)
    const photoURL = user.photoURL || 'https://i.imgur.com/7EfwxWY.png';
    profilePicture.src = photoURL;
    dropdownProfilePic.src = photoURL;
    
    // Set user info in dropdown (NEW)
    dropdownUsername.textContent = user.displayName || user.email.split('@')[0];
    dropdownEmail.textContent = user.email;
    
    // Close dropdowns (UNCHANGED)
    authDropdownContent.style.display = 'none';
    emailForm.style.display = 'none';
  } else {
    // User is signed out (UNCHANGED)
    authDropdown.style.display = 'block';
    userProfile.style.display = 'none';
  }
});

// EVERYTHING BELOW THIS LINE REMAINS COMPLETELY UNCHANGED >>>>>>>>>

// Google Login (UNCHANGED)
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

// Email Form Toggle (UNCHANGED)
function showEmailForm() {
  authOptions.style.display = 'none';
  emailForm.style.display = 'block';
}

// Email Login (UNCHANGED)
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

// Email Signup (UNCHANGED)
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

// Logout Function (UNCHANGED)
function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log("User signed out");
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error("Sign out error:", error);
      alert("Logout failed. Please try again.");
    });
}

// Profile Dropdown Toggle (ONLY UPDATED THIS SECTION)
userProfile.addEventListener('click', function(e) {
  e.stopPropagation();
  const dropdown = this.querySelector('.profile-dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close dropdowns when clicking outside (UNCHANGED)
document.addEventListener('click', function(e) {
  if (!e.target.closest('.user-auth-box')) {
    authDropdownContent.style.display = 'none';
    emailForm.style.display = 'none';
    authOptions.style.display = 'block';
    document.querySelector('.profile-dropdown').style.display = 'none';
  }
});

console.log("Auth system initialized - Only post-login changes made");