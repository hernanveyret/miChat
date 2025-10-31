import React, { useState, useEffect } from 'react';
import './menu.css';

const Menu = ({
              setIsMenu,
              setIsEdit,
              setEditContactoUsuario
              }) => {
  return (
    <div className='menu'>
      <button
        type='button'
        className='btn-menu'
        onClick={() => {
          setEditContactoUsuario(true)
          setIsMenu(false); 
          setIsEdit(true);
        }}
      >Editar datos de usuario</button>
    </div>
  )
}
export default Menu;