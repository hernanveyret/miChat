import { GoogleAuthProvider } from "firebase/auth";
import { collection,
         onSnapshot, 
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

export const sendMessage = async (message, idContacto) => {
  console.log('Enviando un mensaje...');
  const mensajes = idContacto; // nombre del campo dinámico
  try {
    const chatRef = doc(db, "chat", "mensajesguardado");
    await setDoc(chatRef, {
      [mensajes]: arrayUnion(message)
    }, { merge: true }); // merge:true evita sobreescribir todo el documento
    console.log("Mensaje guardado correctamente!");
  } catch (error) {
    console.error("⛔ Error al guardar el mensaje:", error);
  }
};

// Borra la categoria o el prodructo seleccionada/o por ID
export const borrarCategoria = async (idContacto) => {
  try {
    const docRef = doc(db,'chat', idContacto);
    await deleteDoc(docRef);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

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