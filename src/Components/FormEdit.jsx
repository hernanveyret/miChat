import React, { useState, useEffect } from 'react';
import './form.css';

const FormEdit = ({
                    setUserConfig,
                    userConfig,
                    editContactoUsuario,
                    setEditContactoUsuario,
                    setIsEdit,
                    idEditContacto
}) => {
  const [ colorContacto, setColorContacto ] = useState(null);
  const [ telefonoContacto, setTelefonoContacto ] = useState(null);
  const [ nombreContacto, setNombreContacto ] = useState(null);
  const [ datos, setDatos ] = useState('')

 useEffect(() => {
  if (!editContactoUsuario) {
    const filtro = userConfig[0].contactos.find(
      (contacto) => contacto.id === idEditContacto
    );
    setDatos(filtro);
  } else {
    setDatos(userConfig[0]);
  }
}, [editContactoUsuario, idEditContacto, userConfig]);

  
  
  // cEdita los datos de user
  const editarInfoUser = (e) => {
    e.preventDefault();   
    setUserConfig([
    { 
      id: userConfig[0].id,
      nombre: nombreContacto || userConfig[0].nombre,
      telefono: telefonoContacto || userConfig[0].telefono,
      option: false,
      contactos: userConfig[0].contactos
    }]);
    setEditContactoUsuario(false)
    setIsEdit(false) ;
    
  }

  // Editar COntacto
  const editarContactos = (e) => {
    e.preventDefault();
    const newContacto = {
      id: idEditContacto,
      nombre: nombreContacto,
      telefono: telefonoContacto,
      color: colorContacto
    }  
    
    setUserConfig((prev) => {
      const user = { ...prev[0] };
      user.contactos = 
        user.contactos.map(contacto => contacto.id === idEditContacto 
          ? 
          { ...contacto,
             nombre: nombreContacto || contacto.nombre, 
             telefono: telefonoContacto || contacto.telefono, 
             color: colorContacto || contacto.color 
          } 
          : 
          contacto)
      return [user];
    });
     setIsEdit(false) ;    
  }

  return (
    <div className='contenedor-form'>      
      { !editContactoUsuario ? <h1>Editar contacto</h1> : <h1>Editar sus datos</h1>}
      <form
        onSubmit={(e) => !editContactoUsuario  ? editarContactos(e) : editarInfoUser(e) }  
        className='form-app' > 
        <button
        title='Cerrar'
        type='button'
        className='btn-cerrar-form-edit'
        onClick={(e) => {
          e.stopPropagation();
          setIsEdit(false)
        }}
        >
        <svg xmlns="http://www.w3.org/2000/svg" 
          height="24px" 
          viewBox="0 -960 960 960" 
          width="24px" 
          fill="#000000">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
      </button>
        <input 
          type="text" 
          defaultValue={datos?.nombre}
          onChange={(e) => setNombreContacto(e.target.value)}
        />
        <input 
          type='text' 
          defaultValue={datos?.telefono}
          onChange={(e) => setTelefonoContacto(e.target.value)}
        />
        { !editContactoUsuario && 
          <input 
            type="color" 
            id="colorContacto" 
            defaultValue={datos?.color}
            onChange={(e) => setColorContacto(e.target.value )}/>}
        <input type='submit' value='CARGAR' className='btn-cargar'/>
      </form>
    </div>
  )
};
export default FormEdit;