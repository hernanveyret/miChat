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
         getDoc,
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
export const sendMessage = async (message, idChatConsistente, miNumero) => { 
  /*
  console.log(idChatCompleto)
    const miNumero = message.user; 
    const LONGITUD_NUMERO = miNumero.length; 
    
    // Extrae los dos números de la cadena idChatCompleto
    const num1 = idChatCompleto.substring(0, LONGITUD_NUMERO);
    const num2 = idChatCompleto.substring(LONGITUD_NUMERO);
    
    // Generamos el ID de chat consistente (¡la función ahora sí es útil!)
    const generarIdChatConsistente = (n1, n2) => [n1, n2].sort().join('');
    const idChatConsistente = generarIdChatConsistente(num1, num2); 
  */  
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

export const editarVisto = async (idContacto, user) => {
  try {
    // 1. Referencia al Documento
    // Colección: "chat", Documento: "mensajesguardado"
    const docRef = doc(db, "chat", "mensajesguardado"); 

    // 2. Obtener el Documento
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Accede a la conversación específica usando la clave idContacto
      const conversacion = data[idContacto];

      if (conversacion && Array.isArray(conversacion.mensajes)) {
        // 3. Modificar el Array Localmente
        // Usamos .map para crear un nuevo array con el mensaje actualizado
        const mensajesActualizados = conversacion.mensajes.map(mensaje => {
          
          // Condición: Si el 'user' coincide Y 'check' aún está en false
          if (mensaje.user === user && mensaje.check === false) {
            // Devuelve un nuevo objeto con check: true
            return { ...mensaje, check: true }; 
          }
          
          // Devuelve el mensaje sin cambios si no coincide
          return mensaje; 
        });

        // 4. Actualizar el Campo Anidado en Firestore
        // La sintaxis `${idContacto}.mensajes` le dice a Firestore exactamente qué campo actualizar.
        const campoAActualizar = `${idContacto}.mensajes`;

        await updateDoc(docRef, {
          [campoAActualizar]: mensajesActualizados
        });

       // console.log("✅ Campo 'check' actualizado a true para el usuario:", user);
      } else {
        console.warn(`⚠️ No se encontró la conversación o el array 'mensajes' en ${idContacto}.`);
      }
    } else {
      console.warn("⚠️ No se encontró el documento 'mensajesguardado'.");
    }
  } catch (error) {
    console.error("❌ Error al editar el campo 'visto':", error);
  }
};

/*
export const editVisto = async (idproducto) => {
  try {
    const docRef = doc(db, "chat", "mensajesguardado");
    await setDoc(docRef, {check: true}, { merge: true }); // al poner merge true solo actualiza activate
  } catch (error) {
    console.log('Error al actualizar Activate:', error)
  }
}
*/
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