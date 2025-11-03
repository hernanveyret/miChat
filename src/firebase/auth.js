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
    return numerosOrdenados[1];
};
export const sendMessage = async (message, miNumero, idContactoDestinatario) => { // idContactoDestinatario es el número del otro
    // Asegúrate de que message.user contenga el número de teléfono del remitente
    //const miNumero = message.user; // Asumo que el objeto message tiene una propiedad 'user' para el remitente
    const idChat = generarIdChatConsistente(miNumero, idContactoDestinatario); // Usa la nueva función
    try {
        const chatRef = doc(db, "chat", "mensajesguardado");
        await updateDoc(chatRef, {
            [`${idChat}.mensajes`]: arrayUnion(message)
        });
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