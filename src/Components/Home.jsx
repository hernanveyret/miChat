import React, { useState, useEffect } from 'react';
import ConfirmDelete from './ConfirmDelete';
import './home.css';

const Home = ({ 
              contactos,
              setUseForm,
              setIdContacto,
              idtelefonoUsuario,
              setNombreColorContacto,
              chat,
              setUserConfig,
              setIsHome,
              setIsChat,
              isMovile,
              setIsEdit,
              setEditContactoUsuario,
              setIdEditContacto
            }) => {

const [ isDelete, setIsDelete ] = useState(false);
const [ nombre, setNombre ] = useState(null);
const [ telefono, setTelefono ] = useState(null);
const [ color, setColor ] = useState(null);
const [ id, setId ] = useState(null);

  const FormEdit = () => {
    return (
      <div className="form-edit">
        <div className='contenedor-form'>
          <h2>Editar contacto</h2>
      <form 
        
        className='form-app' > 
        <input type="text" placeholder='Ingrese su nombre...' onChange={(e) => setNombre(e.target.value)}/>
        <input type='' placeholder='Ingrese su número de telefono' onChange={(e) => setTelefono(e.target.value)}/>
        { !contactoUsuario && <input type="color" id="colorContacto" onChange={(e) => setColor(e.target.value)}/>}
        <input type='submit' value='CARGAR' className='btn-cargar'/>
      </form>
    </div>
      </div>
    )
  }  
 
  return (
    <div className='contenedor-home'>
      {
        isDelete &&
          <ConfirmDelete
            setUserConfig={setUserConfig}
            id={id}
            setIsDelete={setIsDelete}
            setIdContacto={setIdContacto}
          />
      }
      <nav>
        <button
          title='Agregar Contacto'
          className='btn-nav'
          onClick={() => { setUseForm(true) } }
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
          height="24px" 
          viewBox="0 -960 960 960" 
          width="24px" 
          fill="white">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        </button>
        <button 
          title='Buscar Contacto'
          className='btn-nav'
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
          height="24px" viewBox="0 -960 960 960" 
          width="24px" 
          fill="white">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
        </button>
      </nav>
      {
        contactos &&
          contactos.map((contacto, i) => (
            <div className='contacto-box' key={i} 
              onClick={() => { 
                setIdContacto(chat[0][idtelefonoUsuario + contacto.telefono] ? idtelefonoUsuario + contacto.telefono : contacto.telefono + idtelefonoUsuario);
                setNombreColorContacto({ nombre: contacto.nombre, color: contacto.color })
                if(isMovile){
                  setIsChat(true)
                  setIsHome(false)
                }
              }}
            >
              <div className='circulo' style={{ backgroundColor: contacto.color }}></div>
              <p>{contacto.nombre}</p>
              <div className='option-contactos'>
                <button
                type='button'
                title='Editar contacto'                
                onClick={(e) => { 
                  e.stopPropagation();
                  setIdEditContacto(contacto.id)
                  setEditContactoUsuario(false)
                  setIsEdit(true)
                }}
                  
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="#FFFFFF">
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                </svg>
              </button>  
              <button
                type='button'
                title='Borrar contacto'
                onClick={(e) => { 
                  e.stopPropagation();
                  setId(contacto.id);
                  setIsDelete(true);
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="#FFFFFF">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
              </button>
            </div>
            </div>    
          )) 
      }
      
    </div>
  )
}
export default Home;