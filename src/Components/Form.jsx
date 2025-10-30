import React, { useState, useEffect } from 'react';
import './form.css';

const Form = ({
                contactoUsuario,
                setContactoUsuario,
                setUserConfig,
                setUseForm
}) => {
  const [ colorContacto, setColorContacto ] = useState(null);
  const [ telefonoContacto, setTelefonoContacto ] = useState(null);
  const [ nombreContacto, setNombreContacto ] = useState(null)
  
  // carga los datos iniciales del usuario
  const cargarInfoUser = (e) => {
    e.preventDefault();
    console.log('cargar datos de usuario')
    setUserConfig([
    { 
      id: Date.now(),
      nombre: nombreContacto,
      telefono: telefonoContacto,
      option: false,
      contactos: []
    }]);
    setContactoUsuario(false)
    setUseForm(false) ;
  }

  // Agrega nuevos contactos
  const agregarContactos = (e) => {
    e.preventDefault();
    console.log('cargar datos de contacto')
    const newContacto = {
      id: Date.now(),
      nombre: nombreContacto,
      telefono: telefonoContacto,
      color: colorContacto
    }
    console.log(newContacto)
    setUserConfig((prev) => {
      const user = { ...prev[0] };
      user.contactos = [...user.contactos, newContacto];
      return [user];
    });
    setUseForm(false) ;
  }

  return (
    <div className='contenedor-form'>
      { !contactoUsuario ? <h1>Agregar nuevo contacto</h1> : <h1>Ingrese sus datos</h1>}
      <form 
        onSubmit={(e) => !contactoUsuario ? agregarContactos(e) : cargarInfoUser(e) }  
       className='form-app' > 
        <input type="text" placeholder='Ingrese su nombre...' onChange={(e) => setNombreContacto(e.target.value)}/>
        <input type='' placeholder='Ingrese su número de telefono' onChange={(e) => setTelefonoContacto(e.target.value)}/>
        { !contactoUsuario && <input type="color" id="colorContacto" onChange={(e) => setColorContacto(e.target.value)}/>}
        <input type='submit' value='CARGAR' className='btn-cargar'/>
      </form>
    </div>
  )
};
export default Form;