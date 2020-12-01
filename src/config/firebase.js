import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyBP44BMmebz0a1fpFAZ1WljobeX5IColgE",
    authDomain: "alphaleak-3144e.firebaseapp.com",
    databaseURL: "https://alphaleak-3144e.firebaseio.com",
    projectId: "alphaleak-3144e",
    storageBucket: "alphaleak-3144e.appspot.com",
    messagingSenderId: "665591901782",
    appId: "1:665591901782:web:347b5cab15dea6ac7b15f7"
};
try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
    }
}
const fire = firebase;
export default fire;

