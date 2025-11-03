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
export const sendMessage = async (message, idChat) => {
  // idChat es el campo dinámico (ej: "11340254991134025488")
  try {
    const chatRef = doc(db, "chat", "mensajesguardado");
    
    // Usamos updateDoc para agregar el nuevo mensaje al sub-array 'mensajes'
    // El nombre del campo debe ser dinámico: "ID_CHAT.mensajes"
    await updateDoc(chatRef, {
        [`${idChat}.mensajes`]: arrayUnion(message)
    });
    
    // Opcional: Si necesitas crear el chat de cero, podrías usar setDoc con merge: true

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