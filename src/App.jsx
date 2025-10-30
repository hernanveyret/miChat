import React, { useState, useEffect, useEffectEvent } from 'react'
import Home from './Components/Home';
import Chat from './Components/Chat';
import Form from './Components/Form';
import { getData } from './firebase/auth';
import './App.css'

function App() {
const config = localStorage.getItem('configMiChat')

const [ userConfig, setUserConfig ] = useState(config ? JSON.parse(config) : [{ 
      id: '',
      nombre: '',
      telefono: '',
      option: true,
      contactos: []
    }])
const [ chat, setChat ] = useState([])
const [ loading, setLoading ] = useState(true)
const [ contactoUsuario, setContactoUsuario ] = useState(userConfig.length > 0 ? userConfig[0].option : true); // true agrega contactos - false crea nuevo usuario
const [ useForm, setUseForm ] = useState(userConfig.length > 0 ? userConfig[0].option : true);
// numero de telefono del contacto
const [ idContacto, setIdContacto  ] = useState(null);
const [ nombreColorContacto, setNombreColorContacto ] = useState(null);
const [ isHome, setIsHome ] = useState(true);
const [ isChat, setIsChat ] = useState(false);
const [ width, setWidth ] = useState(window.innerWidth);
const [ isMovile, setIsMovile ] = useState(null)

 useEffect(() => {
  let timeout;
  const handleResize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setWidth(window.innerWidth);
    }, 150);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const movile = () => {
      setIsHome(true)
      setIsChat(false)
    }
    const escritorio = () => {
      setIsHome(true)
      setIsChat(true)
    }

  useEffect(() => {
    width <= 600 ? movile() : escritorio() ;
    width <= 600 ? setIsMovile(true) : setIsMovile(false)
  },[width])

// Muestra las configuraciones de usuario guardadas en localStorage y actualiza cuando hay un cambio
useEffect(() => {
  console.log('configuracion de usuario: ', userConfig)
  localStorage.setItem('configMiChat', JSON.stringify(userConfig))
},[userConfig])

//console.log('contactos: ', contactos)

useEffect(() => {
  //console.log('id contacto', idContacto);
},[idContacto])

  useEffect(() => {
    // Llamamos a getData y guardamos la función para dejar de escuchar luego
    const unsubscribe =  getData((data) => {
      setChat(data); // actualiza el estado cada vez que cambien los datos
      setLoading(false)
    });

    // Cleanup: dejar de escuchar cuando el componente se desmonte
    return () => unsubscribe();
  }, [idContacto]);

  return (
    <div className="contenedor-app">
      {
        useForm &&
        <Form 
          contactoUsuario={contactoUsuario}
          setContactoUsuario={setContactoUsuario}
          setUserConfig={setUserConfig}
          userConfig={userConfig}
          setUseForm={setUseForm}
        />
      }
      <header>
        <h1>Mi Chat</h1>
        {
          isChat &&
          <button
            onClick={() => { setIsHome(!isHome); setIsChat(!isChat)}}
            className='btn-menu'
            >
            <svg xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#000000">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
             </svg>
          </button>
        }
        
      </header>
      <main>
        {
          isHome &&
            <Home 
              contactos={userConfig ? userConfig[0].contactos : []} 
              setUserConfig={setUserConfig}
              userConfig={userConfig}
              setUseForm={setUseForm}
              setIdContacto={setIdContacto}
              idtelefonoUsuario={userConfig[0].telefono} 
              setNombreColorContacto={setNombreColorContacto}
              chat={chat}
              setIsHome={setIsHome}
              setIsChat={setIsChat}
              isMovile={isMovile}
            />
        }
        {
          isChat &&        
            <Chat 
             chat={chat}
             loading={loading}
             idContacto={idContacto}
             nombreColorContacto={nombreColorContacto}
             userConfig={userConfig}
            />
        }
      </main>
      <footer>Hernan Luis Veyret</footer>
    </div>
  )
}

export default App
