import React, {useState} from 'react';
import Head from "next/head";
import {fetchJson} from "../react-utils/utils";
import {toast} from "react-toastify";


export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = JSON.stringify({
            name,
            email,
            subject,
            message
        })
        fetchJson('users/send_contact_email/',{method:"POST",body:formData}).then(json => {
            toast.success('Su mensaje ha sido enviado',{autoClose:false})
        })

    }

    return <>
        <Head>
            <title>Contacto - SoloTodo</title>
        </Head>
        <div className="container-fluid">
            <div className="row pt-3">
                <div className="col-12 col-sm-12 col-md-9 col-lg-7">
                    <div className="card p-3">
                        <div className="flex-column">
                            <h1>Contacto</h1>
                            <p>Antes de contactarnos por favor considere:</p>
                            <ol>
                                <li>SoloTodo no es una tienda, es un comparador de precios, así que <strong> no vendemos
                                    productos.</strong></li>
                                <li>Las tiendas que catalogamos solo operan en su respectivo país y <strong>no hacen
                                    envíos al
                                    extranjero.</strong></li>
                                <li>El formulario de contacto <strong>no es una línea de ayuda o de asesoría personal
                                    en las compras</strong>, puede usar el sistema de comentarios del sitio para dejar
                                    dudas y
                                    consultas.
                                </li>
                            </ol>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="contactNameInput">Su nombre (requerido)</label>
                                    <input type="text" className="form-control" id="contactNameInput" name="contactName"
                                           value={name}
                                           onChange={e => setName(e.target.value)} required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactEmailInput">Su e-mail (requerido)</label>
                                    <input type="email" className="form-control" id="contactEmailInput"
                                           name="contactEmail" value={email} onChange={e => setEmail(e.target.value)}
                                           required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactSubjectInput">Asunto (requerido)</label>
                                    <input type="text" className="form-control" id="contactSubjectInput"
                                           name="contactSubject" value={subject}
                                           onChange={e => setSubject(e.target.value)} required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactMessageInput">Su mensaje (requerido)</label>
                                    <textarea className="form-control" id="contactMessageInput" rows="3"
                                              name="contactMessage" value={message}
                                              onChange={e => setMessage(e.target.value)} required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}