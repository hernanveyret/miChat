const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Función que se dispara cada vez que el documento de mensajes se actualiza
exports.enviarNotificacionDeChat = functions.firestore
    .document('chat/mensajesguardado')
    .onUpdate(async (change, context) => {
        const dataAntes = change.before.data();
        const dataDespues = change.after.data();
        
        // Asume que los números de teléfono tienen una longitud consistente (ej: 10)
        const LONGITUD_NUMERO = 10; 

        let nuevoMensaje = null;
        let idChat = null;
        
        // 1. Identificar el chat que se actualizó y el nuevo mensaje
        for (const chatKey in dataDespues) {
            const mensajesAntes = dataAntes[chatKey]?.mensajes || [];
            const mensajesDespues = dataDespues[chatKey]?.mensajes;
            
            // Verificamos si la longitud del array de mensajes creció
            if (mensajesDespues && mensajesDespues.length > mensajesAntes.length) {
                nuevoMensaje = mensajesDespues[mensajesDespues.length - 1]; // El último es el nuevo
                idChat = chatKey; 
                break;
            }
        }
        
        if (!nuevoMensaje || !idChat) {
            console.log('No se detectó un nuevo mensaje en el formato esperado.');
            return null;
        }

        const remitenteId = nuevoMensaje.user; // El número de teléfono que envió el mensaje
        const texto = nuevoMensaje.msj;
        
        // 2. Determinar el ID del destinatario
        // Dividimos el ID de chat consistente (que es num1 + num2)
        const num1 = idChat.substring(0, LONGITUD_NUMERO); 
        const num2 = idChat.substring(LONGITUD_NUMERO); 
        
        // El destinatario es el número que NO es el remitente
        const destinatarioId = (remitenteId === num1) ? num2 : num1;

        // 3. Obtener el Token FCM del destinatario
        const tokens = dataDespues[idChat]?.tokens;
        const fcmToken = tokens ? tokens[destinatarioId] : null;
        
        if (!fcmToken) {
            console.log(`El destinatario (${destinatarioId}) aún no tiene un token guardado.`);
            return null;
        }
        
        // 4. Enviar la notificación
        const payload = {
            notification: {
                title: `💬 Mensaje de ${remitenteId}`, 
                body: texto,
                icon: '/icon-192x192.png'
            },
            token: fcmToken // Token del dispositivo receptor
        };

        try {
            const response = await admin.messaging().send(payload);
            console.log('Notificación enviada con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al enviar la notificación:', error);
            return null;
        }
    });