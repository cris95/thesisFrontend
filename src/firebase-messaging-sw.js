importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyB_1BqTn_X2q3HC9u_izOFIB4fCcuWpsfs",
    authDomain: "dashboard-f3b58.firebaseapp.com",
    databaseURL: "https://dashboard-f3b58.firebaseio.com",
    projectId: "dashboard-f3b58",
    storageBucket: "dashboard-f3b58.appspot.com",
    messagingSenderId: "580064635722",
    appId: "1:580064635722:web:695481382cd92ba5fa6fb3",
    measurementId: "G-3TTK11Y1L0"
});
const messaging = firebase.messaging();