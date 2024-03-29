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

              <h2>Almacenamiento y procesamiento de información</h2>

              <p>SoloTodo almacena la siguiente información de sus visitantes</p>

              <ul>
                <li>Preferencia regional de país y tiendas en donde cotizar</li>
                <li>Correo electrónico en el caso de suscribirse a los cambios de precios de un producto</li>
                <li>Correo electrónico en el caso de registrarse como usuario usando el sistema interno de SoloTodo</li>
                <li>Cotizaciones de PCs desktop hechas por usuarios registrados </li>
              </ul>

              <p>Adicionalmente, los siguientes servicios de terceros usados por SoloTodo
                también pueden almacenar información, sujeto a sus propias políticas de privacidad.</p>

              <h3>Facebook</h3>

              Si utiliza la opción de iniciar sesión en Facebook SoloTodo almacena y procesa la siguiente información de su cuenta

              <ul>
                <li>ID de usuario</li>
                <li>Correo electrónico asociado a la cuenta de Facebook</li>
                <li>Nombre y apellido</li>
              </ul>

              <p>SoloTodo procesa esta información internamente en su base de datos para los siguientes usos</p>

              <ul>
                <li>ID de usuario: Identificar de manera única al usuario en la base de datos de SoloTodo</li>
                <li>Correo electrónico: Enviar correos transaccionales para funcionalidades básicas del sitio (recuperar contraseña, etc).</li>
                <li>Nombre y apellido: Personalizar la experiencia de usuario mostrando su nombre en su panel de usuario</li>
              </ul>

              <h4>Eliminación de datos de usuario</h4>

              <p>Los usuarios de SoloTodo pueden solicitar la eliminación total de los datos asociados a su cuenta desde el siguiente link: <a href="/data_deletion">Eliminación de usuario y datos asociados</a></p>
              <p>El sistema procederá a eliminar todos los datos hasta en 24 horas hábiles</p>

              <h3>Google y Disqus</h3>

              <p>SoloTodo trabaja con Google y Disqus como proveedores de servicios necesarios para la operación del sitio, detallados a contionuación</p>

              <ul>
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

              <p>Si por cualquier motivo se desea eliminar la cuenta del usuario o cualquier información identificable del mismo (alertas de cambios de precio, cotizaciones, etc) se puede solicitar a través del <a href="/data_deletion">formulario de contacto de SoloTodo</a>, en donde será respondida en dos día hábiles o menos </p>

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
