import React from 'react';
import Head from 'next/head'
import TopBanner from "../components/TopBanner";
import AnnouncementAlert from "../components/AnnouncementAlert";

class Tos extends React.Component {
  render() {
    return <React.Fragment>
      <Head>
        <title>Condiciones de servicio - SoloTodo</title>
      </Head>
      <div className="container">
        <div className="row">
          <TopBanner category="Any" />
          <div className="col-12">
            <AnnouncementAlert />

            <h1>Condiciones de servicio</h1>
          </div>

          <div className="col-12">
            <div className="content-card">
              <p>
                La utilización de este sitio web, supone la aceptación plena y sin reservas de
                la totalidad de las condiciones generales de uso que se relacionan a
                continuación, siendo aplicables, igualmente, a la información, aplicaciones y
                servicios a los que se puede acceder a través de la misma.
              </p>

              <ol>
                <li>
                  SoloTodo realiza su mejor esfuerzo para mantener la información
                  actualizada, evitar errores u omisiones. Sin embargo, no asume ningún
                  tipo de responsabilidad respecto a la integridad y exactitud respecto
                  de la misma. Constituyéndose sólo con fines referenciales.
                </li>
                <li>
                  Para el correcto funcionamiento del sitio podrá requerirse el uso de cookies
                </li>
                <li>
                  Los precios y características de los equipos publicados o constituyen
                  en caso alguno parte de una oferta o invitación a contratar. Siendo
                  sólo información de referencia que deberá ser corroborada con los
                  respectivos oferentes en vistas a posibles y futuras operaciones o
                  actos jurídicos, de los que SoloTodo no formará parte, a
                  menos que así lo estipule su representante legítimo.
                </li>
                <li>
                  SoloTodo podrá suprimir, modificar, y actualizar de forma
                  unilateral y arbitraria la información, configuración y contenido del
                  sitio. Así como sus condiciones y términos de uso
                </li>
                <li>
                  El acceso y uso de este sitio web se ajustará a la ley, la moral, las
                  buenas costumbres, el orden público y a las presentes condiciones y
                  términos de uso. De modo que debe abstenerse de usos lesivos contra
                  derechos de terceros.
                </li>
              </ol>

              <h2>Acerca de la extensión para Google Chrome</h2>

              <ol>
                <li>
                  SoloTodo pone a disposición de su comunidad una extensión para el
                  navegador Google Chrome, disponible en <a href="https://chrome.google.com/webstore/detail/solotodo/dnacbdkmnedgahgcogbeecmgjlmkjgpf">este link</a>.
                </li>

                <li>
                  Dicha extensión revisa si se está visualizando la ficha de un
                  producto en las siguientes tiendas:

                  <ul>
                    <li>Falabella Chile</li>
                    <li>Ripley Chile</li>
                    <li>Paris</li>
                    <li>AbcDin</li>
                    <li>La Polar</li>
                    <li>PC Factory</li>
                    <li>Corona</li>
                    <li>Linio Chile</li>
                    <li>Bip</li>
                    <li>HP Online</li>
                    <li>Infor Ingen</li>
                    <li>Magens</li>
                    <li>PC Express</li>
                    <li>Reif Store</li>
                    <li>Sistemax</li>
                    <li>TT Chile</li>
                    <li>Wei</li>
                    <li>Tienda Smart</li>
                    <li>Hites</li>
                    <li>Lider</li>
                    <li>NetNow</li>
                    <li>Vivelo</li>
                    <li>Sodimac</li>
                    <li>Sony Store</li>
                    <li>SpDigital</li>
                    <li>Winpy</li>
                  </ul>

                  Si dicho producto está catalogado en SoloTodo y está disponible
                  a mejor precio en alguna otra tienda, muestra una notificación
                  en su ícono del navegador.
                </li>
                <li>
                  Para proveer esta funcionalidad, la extensión envía continuamente
                  información acerca de la URL siendo visualizada en las tiendas
                  antes mencionadas anteriormente a los servidores de SoloTodo. Acerca de esta
                  información, SoloTodo sólo la utiliza para buscar el producto
                  correspondiente, <strong>no la almacena ni la utiliza para ningún
                  otro fin</strong>, en particular SoloTodo no almacena ninguna
                  información que permita identificar a una persona a partir de
                  este servicio.
                </li>
              </ol>
            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

export default Tos;
