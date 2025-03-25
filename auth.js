// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // Get from Firebase Console
};
firebase.initializeApp(firebaseConfig);

// DOM Elements
const authButton = document.getElementById('auth-button');
const userProfile = document.getElementById('user-profile');

// Auth State Listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is logged in
    authButton.style.display = 'none';
    userProfile.style.display = 'block';
    document.getElementById('username').textContent = user.displayName || user.email.split('@')[0];
    document.getElementById('user-avatar').src = user.photoURL || 'default-avatar.png';
  } else {
    // User is logged out
    authButton.style.display = 'block';
    userProfile.style.display = 'none';
  }
});

// Auth Functions
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .catch(error => alert(error.message));
}

function showEmailForm() {
  document.querySelector('.auth-options').style.display = 'none';
  document.getElementById('email-form').style.display = 'block';
}

function emailLogin() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));
}

function emailSignup() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));
}

function logout() {
  firebase.auth().signOut();
}