// App.jsx - Asegúrate de que tienes importados 'doc', 'setDoc', y 'db'
// import { doc, setDoc } from "firebase/firestore";

useEffect(() => {
    // ... (Código para solicitar permisos y obtener el token) ...

    Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
            const token = await getToken(messaging, { 
                vapidKey: 'BFbh7niLE9zXDYZYaFNK31MDO-vr7B9ufEYPxwc9Cbe2ZBYIxEk57s4dI06THgDhBVIVp4Sg1Z41tXvyqME1z-g'
            });
            console.log("✅ Token del dispositivo:", token);
            
            // 💡 LÓGICA PARA GUARDAR EL TOKEN EN LA ESTRUCTURA DE CHAT
            const miTelefono = userConfig[0].telefono; 
            const contactos = userConfig[0].contactos || [];
            const chatRef = doc(db, "chat", "mensajesguardado"); 

            // 1. Recorrer cada chat en el que estás involucrado:
            contactos.forEach(async (contacto) => {
                // 2. Crear el ID de chat (Debe coincidir con la clave que usas en Firestore)
                // Asumo que tu lógica es: MiTel + ContactoTel (ajusta si usas orden ascendente)
                const idChat = miTelefono + contacto.telefono; 

                // 3. Usamos setDoc con merge: true para actualizar SOLO el token
                await setDoc(chatRef, {
                    [idChat]: {
                        tokens: {
                            [miTelefono]: token // Guardamos tu token usando tu teléfono como clave
                        }
                    }
                }, { merge: true }); // Crucial para no sobrescribir los mensajes
            });
            // FIN DE LA LÓGICA DE GUARDADO DE TOKEN

        } else {
            console.warn("❌ Permiso de notificaciones denegado");
        }
    });
    // ... (El resto de tu useEffect)
}, [userConfig]);