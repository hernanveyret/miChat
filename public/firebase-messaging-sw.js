/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

// 🔹 Tu configuración de Firebase (la misma que en config.js)
firebase.initializeApp({
 apiKey: "AIzaSyCszkHdHiUl0u_Z3Any2KHDxbnvTzv02ps",
  authDomain: "michat-2096f.firebaseapp.com",
  projectId: "michat-2096f",
  storageBucket: "michat-2096f.firebasestorage.app",
  messagingSenderId: "441120482443",
  appId: "1:441120482443:web:4f98c7a9bb63017214a08e"
});

// 🔹 Inicializá messaging
const messaging = firebase.messaging();

// 🔹 Manejá mensajes cuando la app está en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('📨 Mensaje recibido en segundo plano:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
