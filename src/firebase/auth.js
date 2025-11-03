import { GoogleAuthProvider } from "firebase/auth";
import { collection,
         onSnapshot, 
         deleteField,
         addDoc,
         deleteDoc,
         doc, 
         setDoc,
         updateDoc, 
         getDocs,
         arrayUnion, 
         arrayRemove,
        } from "firebase/firestore";

import {  db } from "./config.js";
const provider = new GoogleAuthProvider();

const chatDocId = "chat_unico"; 

/*
export const sendMessage = async (message, idContacto) => {
  const mensajes = idContacto; // nombre del campo dinámico
  try {
    const chatRef = doc(db, "chat", "mensajesguardado");
    await setDoc(chatRef, {
      [mensajes]: arrayUnion(message)
    }, { merge: true }); // merge:true evita sobreescribir todo el documento
  } catch (error) {
    console.error("⛔ Error al guardar el mensaje:", error);
  }
};
*/
export const sendMessage = async (message, idChatCompleto) => { 
    const miNumero = message.user; 
    const LONGITUD_NUMERO = miNumero.length; 
    
    // Extrae los dos números de la cadena idChatCompleto
    const num1 = idChatCompleto.substring(0, LONGITUD_NUMERO);
    const num2 = idChatCompleto.substring(LONGITUD_NUMERO);
    
    // Generamos el ID de chat consistente (¡la función ahora sí es útil!)
    const generarIdChatConsistente = (n1, n2) => [n1, n2].sort().join('');
    const idChatConsistente = generarIdChatConsistente(num1, num2); 
    
    const currentTokenFCM = localStorage.getItem('fcmToken'); 

    try {
        const chatRef = doc(db, "chat", "mensajesguardado");
        
        // Usamos el ID de chat CONSISTENTE y ORDENADO
        await setDoc(chatRef, {
            [idChatConsistente]: {
                tokens: {
                    [miNumero]: currentTokenFCM 
                },
                mensajes: arrayUnion(message)
            }
        }, { merge: true }); 

    } catch (error) {
        console.error("⛔ Error al guardar el mensaje:", error);
    }
};

export const borrarMensaje = async (idContacto) => {
  try {
    const docRef = doc(db, "chat", "mensajesguardado"); // el documento donde está el campo
    await updateDoc(docRef, {
      [idContacto]: deleteField(), // borra solo el campo con ese ID
    });
  } catch (error) {
    console.error("Error al borrar el mensaje:", error);
  }
};


// Escuchar cambios en tiempo real y descargarlos
export const getData = (callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db,'chat'), snapshot => {
      const usuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    callback(usuarios);
  })
  return unsubscribe;
  } catch (error) {
    callback([]);
  }
};