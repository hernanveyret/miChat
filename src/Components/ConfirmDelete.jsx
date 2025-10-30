import React, { useEffect, useState } from 'react';
import './confirmDelete.css';

    const ConfirmDelete = ({  setUserConfig, id, setIsDelete }) => {

      const eliminarContacto = () => {

        setUserConfig((prev) => { 
          if(prev.length === 0) {
            return prev
          }
          const update = { 
            ...prev[0],
            contactos: prev[0].contactos.filter(c => c.id !== id)
          };
          return [update]
        });
          setIsDelete(false)
      
        }

    return (
      <div className="contenedor-confirm">
        <div className="card-confirm">
          <h3>¿ Eliminar contacto ?</h3>
          <div className='nav-btn-eliminar'>
            <button
              onClick={() => eliminarContacto()}
            >SI</button>
            <button
              onClick={() => setIsDelete(false)}
            >NO</button>
          </div>
        </div>
      </div>
    )
  }
  export default ConfirmDelete;