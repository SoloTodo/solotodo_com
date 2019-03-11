import React from 'react';
import Link from "next/link";

export default class Footer extends React.Component {
  render() {
    return <div className="container-fluid mt-3" id="solotodo-footer">
      <div className="row pb-4">
        <div className="col-12 col-md-4">
          <h3 className="page-header">Acerca de SoloTodo</h3>
          <p>
            Nuestra misión es ayudar a los consumidores a escoger el producto perfecto para sus necesidades y
            presupuesto.
          </p>
          <p>
            <Link href='/tos'>
              <a className="font-weight-bold">Términos y condiciones</a>
            </Link>
          </p>
        </div>

        <div className="col-12 col-md-5">
          <h3 className="page-header">Apariciones en los medios</h3>
          <div className="row">
            <div className="col-4 logo-container">
              <a href="http://www.lun.com/Pages/NewsDetail.aspx?dt=2010-08-19&PaginaId=18&bodyid=0"
                // eslint-disable-next-line
                 target="_blank"
                 rel="noopener nofollow"
              >
                <img src="/static/press-lun.jpg" alt="lun"/>
              </a>
            </div>
            <div className="col-8">
              "Ofrece el llamativo servicio de regatear y encontrar el precio más conveniente de notebooks"
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-4 logo-container">
              <a href="http://tele13.13.cl/noticias/tecnologia/20255.htm"
                // eslint-disable-next-line
                 target="_blank"
                 rel="noopener nofollow"
              >
                <img src="/static/press-c13.png" alt="c13"/>
              </a>
            </div>
            <div className="col-8">
              "Una cotización podía tomar horas buscando y ahora se reduce a minutos"
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <h3 className="page-header">Contacto</h3>
          <address>
            SoloNotebooks EIRL
            <br/>
            Santiago - Chile
            <br/>
          </address>
          <a href="http://blog.solotodo.com/contacto/"
            // eslint-disable-next-line
             className="font-weight-bold"
             rel="noopener nofollow"
          >
            Contáctanos vía web
          </a>
        </div>

      </div>
    </div>
  }
}