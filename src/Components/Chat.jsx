import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, borrarMensaje } from '../firebase/auth.js';
import './chat.css';

const Chat = ({ chat, 
                setChat, 
                setStart, 
                idContacto, 
                nombreColorContacto,
                userConfig
              }) => {
  const ahora = new Date();
  const dia = `${String(ahora.getDate()).padStart(2, '0')}/${String(ahora.getMonth()+1).padStart(2, '0')}/${ahora.getFullYear()}`;
  const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

  const [valorInput, setValorInput] = useState('');
  const chatRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Detecta si el usuario scrolleó manualmente hacia arriba
  const handleScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    // margen de 10px para móviles
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    setAutoScroll(isAtBottom);
  };

  // Hace scroll hacia el final solo si el usuario está abajo
  useEffect(() => {
    const el = chatRef.current;
    if (autoScroll && el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chat, autoScroll]);

  // Observa cambios de tamaño (útil cuando aparece teclado en móviles)
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (autoScroll) {
        el.scrollTop = el.scrollHeight;
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [autoScroll]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valorInput.trim()) return;

    //const mensajesPrevios = chat[0][idContacto] || [];

    sendMessage({
      id: Date.now(),
      user: userConfig[0].telefono,
      msj: valorInput,
      dia,
      hora
    }, idContacto);

    setValorInput('');

    // Forzar scroll al fondo después de enviar mensaje
    setTimeout(() => {
      const el = chatRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  };  

  return (
    <div className="contenedor-level">
      <div className="box-level">
        <div className='box-name'>
          <p className="foto-perfil" style={idContacto ? {backgroundColor: nombreColorContacto.color }: {} }></p>
          <p>{idContacto ? nombreColorContacto.nombre : 'Bienvenido a Mi Chat'}</p>
          {
            idContacto && 
              <button
                className='borrar-mensaje'
                type='button'
                title='Borrar mensajes'
                onClick={() => { 
                  borrarMensaje(idContacto)
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="black">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
              </button>
          }
        </div>
        <div
          className="text-box"
          ref={chatRef}
          onScroll={handleScroll}
        >
          {
            idContacto !== null ?
            chat.length > 0 && chat[0][idContacto]?.length > 0 ? (
              chat[0][idContacto].map((msj) =>
                msj.user !== userConfig[0].telefono ? (
                  <p className="contacto" key={msj.id}>{msj.msj}</p>
                ) : (
                  <p className="usuario" key={msj.id}>{msj.msj}</p>
                )
              )
            ) 
            : 
            (
            <p></p>
            )
            :
            <div className="contenedor-logo">
              <img src="./img/logomichat.webp" alt="Logo" className='logo'/>
            </div>
          }
        </div>

        <form onSubmit={handleSubmit} className="form-level">
          <input
            type="text"
            name="texto"
            id="sendText"
            value={valorInput}
            onChange={(e) => setValorInput(e.target.value)}
            placeholder="Escribe un mensaje..."
          
          />
          <button type="submit" className="btn-level">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="white"
            >
              <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;