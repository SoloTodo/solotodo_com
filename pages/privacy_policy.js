import React from 'react';
import Head from 'next/head'


class Tos extends React.Component {
  render() {
    return <React.Fragment>
      <Head>
        <title>Política de Privacidad / Privacy Policy - SoloTodo</title>
      </Head>
      <div className="container">
        <div className="row">
          <div className="col-12 mt-2">
            <h1>Política de Privacidad / Privacy Policy</h1>
          </div>

          <div className="col-12">
            <div className="content-card">
              <p>
                Para el correcto funcionamiento de SoloTodo.com el sitio almacena
                información acerca de sus visitantes y usuarios en <em>cookies</em> del
                navegador y en nuestra base de datos interna.
              </p>
              <p>
                Esta página detalla la información guardada por SoloTodo.com y el uso que se le da.
              </p>

              <h2>Información guardada</h2>

              <p>SoloTodo almacena la siguiente información de sus visitantes</p>

              <ul>
                <li>Preferencia regional de país y tiendas en donde cotizar</li>
                <li>Correo electrónico en el caso de suscribirse a los cambios de precios de un producto</li>
                <li>Correo electrónico en el caso de registrarse como usuario usando el sistema interno de SoloTodo</li>
                <li>Correo electrónico, nombre completo e ID de Facebook en el caso de
                  iniciar sesión en SoloTodo usando esta red social</li>
                <li>Cotizaciones de PCs desktop hechas por usuarios registrados </li>
              </ul>

              <p>Adicionalmente, los siguientes servicios de terceros usados por SoloTodo
                también pueden almacenar información, sujeto a sus propias políticas de privacidad.</p>

              <ul>
                <li>Facebook: En el caso de utilizar el inicio de sesión con esta red social</li>
                <li>Google: Como parte de sus plataformas de AdSense (publicidad) y Analytics (métricas de uso del sitio)</li>
                <li>Disqus: Como parte del sistema de comentarios presente en las fichas de producto y cotizaciones del sitio.</li>
              </ul>

              <h2>Sobre el uso de la información guardada</h2>

              <p>
                SoloTodo respeta la privacidad y confidencialidad de nuestros usuarios, comprometiéndonos a las siguientes políticas de uso de información
              </p>

              <ul>
                <li>
                  SoloTodo no compartirá ningún tipo de información identificable (correo electrónico, nombre, usuario de Facebook, etc) con ninguno de nuestros socios comerciales en ningún caso
                </li>

                <li>
                  SoloTodo podrá enviar correos con ofertas o promociones a nuestra base de usuarios (si es que han aceptado recibirlos), y siempre con la opción de desuscribirse de dicha lista de correos.
                </li>

                <li>
                  SoloTodo extrae información estadística sobre el tráfico dentro de SoloTodo.com. Dicha información no contienen ningun dato identificable de ninguno de sus usuarios.
                </li>
              </ul>

              <h2>Solicitud de eliminación de datos y cuenta</h2>

              <p>Si por cualquier motivo se desea eliminar la cuenta del usuario o cualquier información identificable del mismo (alertas de cambios de precio, cotizaciones, etc) se puede solicitar a través del <a href="/contacto">formulario de contacto de SoloTodo</a>, en donde será respondida en dos día hábiles o menos </p>

              <h2>Sobre el acceso a sitios de terceras partes</h2>

              <p>Como parte de su funcionamiento SoloTodo deriva tráfico a sitios de e-commerce de terceras partes, que pueden tener sus propias polícias de privacidad y términos de servicio.
                SoloTodo no se hace responsable de la confidencialidad de la información de sus usuarios una vez que hayan abandonado el sitio de SoloTodo.com. </p>
            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

export default Tos;
