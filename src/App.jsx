import React, { useState, useEffect, useEffectEvent } from 'react'
import Home from './Components/Home';
import Chat from './Components/Chat';
import Form from './Components/Form';
import FormEdit from './Components/FormEdit';
import Menu from '../Menu';
import { getData } from './firebase/auth';
import './App.css'

function App() {
const config = localStorage.getItem('configMiChat');
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
const [ editContactoUsuario, setEditContactoUsuario ] = useState(true); // true edita contacto, false edita usuario
const [ useForm, setUseForm ] = useState(userConfig.length > 0 ? userConfig[0].option : true);
// numero de telefono del contacto
const [ idContacto, setIdContacto  ] = useState(null);
const [ idEditContacto, setIdEditContacto ] = useState(null);
const [ nombreColorContacto, setNombreColorContacto ] = useState(null);
const [ isHome, setIsHome ] = useState(true);
const [ isChat, setIsChat ] = useState(false);
const [ width, setWidth ] = useState(window.innerWidth);
const [ isMovile, setIsMovile ] = useState(null);
const [ isEdit, setIsEdit ] = useState(false);
const [ isMenu, setIsMenu ] = useState(false);


// Detecta el tamaño del viewPOrt asi pone el celular en movile o pc
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
        isEdit && 
          <FormEdit 
            userConfig={userConfig}
            setUserConfig={setUserConfig}
            editContactoUsuario={editContactoUsuario}
            setEditContactoUsuario={setEditContactoUsuario}
            setIsEdit={setIsEdit}
            idEditContacto={idEditContacto}
          />
      }
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
            title='Volver'
            onClick={() => { setIsHome(!isHome); setIsChat(!isChat)}}
            className='btn-retorno'
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
        <button
          title='Menu'
          type='button'
          className='btn-menu'
          onClick={() => { setIsMenu(!isMenu)}}  
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
            height="24px" 
            viewBox="0 -960 960 960" 
            width="24px" 
            fill="#000000">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
          </svg>
        </button>

        {
          isMenu && 
            <Menu 
            setIsMenu={setIsMenu}
            setIsEdit={setIsEdit}
            setEditContactoUsuario={setEditContactoUsuario}
            />
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
              setIsEdit={setIsEdit}
              setEditContactoUsuario={setEditContactoUsuario}
              setIdEditContacto={setIdEditContacto}
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
