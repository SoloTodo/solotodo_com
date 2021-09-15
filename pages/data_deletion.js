import React, {useState} from 'react';
import Head from "next/head";
import {fetchJson} from "../react-utils/utils";
import {toast} from "react-toastify";


export default function DataDeletion() {
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
            toast.success('Su solicitud ha sido enviada',{autoClose:false})
        })

    }

    return <>
        <Head>
            <title>Solicitud de eliminación de cuenta / datos - SoloTodo</title>
        </Head>
        <div className="container-fluid">
            <div className="row pt-3">
                <div className="col-12 col-sm-12 col-md-9 col-lg-7">
                    <div className="card p-3">
                        <div className="flex-column">
                            <h1>Solicitud de eliminación de cuenta / datos</h1>
                            <p>Si desea eliminar su cuenta y/o cualquier dato asociado a ella o su correo electrónico por favor utilice el siguiente formulario. Su solicitud será procesada en dos días hábiles o menos.</p>

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