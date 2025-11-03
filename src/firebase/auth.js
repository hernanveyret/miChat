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

const generarIdChatConsistente = (num1, num2) => {
// Ordena los números alfabéticamente (o numéricamente) y luego los concatena
    const numerosOrdenados = [num1, num2].sort();
    console.log('num 0',numerosOrdenados[0],'num 1', numerosOrdenados[1])
    return numerosOrdenados[0] + numerosOrdenados[1];
};

// A. La función sendMessage simplificada
// *Asumimos que message.user contiene el teléfono del remitente.*
export const sendMessage = async (message, idContactoDestinatario) => { 
    // 1. Extrae el número del remitente del objeto message
    const miNumero = message.user; 
    
    // 2. Genera el ID Consistente (¡Aquí se usa tu función correctamente!)
    const idChat = generarIdChatConsistente(miNumero, idContactoDestinatario); 
    
    // 3. Obtiene el token
    const currentTokenFCM = localStorage.getItem('fcmToken'); 
    
    // 4. Lógica de guardado (usa setDoc con merge: true para crear/actualizar)
    try {
        const chatRef = doc(db, "chat", "mensajesguardado");
        await setDoc(chatRef, {
            [idChat]: {
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
    //console.log('Usuarios', usuarios)
    callback(usuarios);
  })
  return unsubscribe;
  } catch (error) {
    callback([]);
  }
};