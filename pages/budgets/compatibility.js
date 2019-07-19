import React from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import {settings} from "../../settings";
import TopBanner from "../../components/TopBanner";
import Head from "next/head";


class CompatibilityCheckAbout extends React.Component {
  render() {

    return <React.Fragment>
      <Head>
        <title>Chequeo automático de compatibilidad - SoloTodo</title>
      </Head>
      <div className="container">
        <div className="row">
          <TopBanner category="Hardware" />
          <div className="col-12">
            <h1>Chequeo automático de compatibilidad</h1>
          </div>

          <div className="col-12">
            <div className="content-card">
              <p>
                Las cotizaciones de SoloTodo incluyen una herramienta automática
                de <strong>chequeo básico de compatibilidad</strong> entre sus piezas.
              </p>

              <p>
                El sistema verifica los errores más comunes al hacer una cotización,
                pero <strong>no comprueba todos los casos posibles</strong>. Además no verifica
                si la cotización es equilibrada entre sus piezas.
              </p>
              <p>
                Finalmente, la herramienta <strong>se entrega sólo como referencia</strong>.
                Una cotización marcada sin errores por la herramienta no es
                necesariamente compatible, ni viceversa.
              </p>

              <h3>Qué cosas SÍ chequea</h3>

              <ul>
                <li>Que tenga a lo más un procesador,
                  placa madre, fuente de poder, y gabinete
                </li>
                <li>
                  Que la tarjeta de video entre en el gabinete
                </li>
                <li>
                  Que tenga salida de video (o sea, que tenga gráficos
                  integrados o una tarjeta de video dedicada)
                </li>
                <li>
                  Si es SLI / Crossfire, que sea compatible y que la placa
                  madre aguante la configuración
                </li>
                <li>
                  Que el procesador y placa madre sean del mismo socket
                </li>
                <li>
                  Que la placa madre entre en el gabinete
                </li>
                <li>
                  Que la placa madre soporte la cantidad de sticks de ram
                </li>
                <li>
                  Que los sticks de ram sean de desktop y no de servidor
                  o notebook
                </li>
                <li>
                  Que el tipo de RAM sea la correcta (DDR3 o DDR4). Nota:
                  Para plataformas Intel de sexta generación se advierte
                  que es preferible el uso de rams DDR3L.
                </li>
                <li>
                  Que los discos duros entren en el gabinete
                </li>
                <li>
                  Que los discos duros sean para desktop y no para
                  notebook o servidor
                </li>
                <li>
                  Si incluye fuente de poder pero el gabinete ya tiene una
                </li>
                <li>
                  Si uno trata de armar un equipo con tarjeta de video
                  dedicada pero usando una fuente incluida con el gabinete
                </li>
                <li>
                  Si el cooler es compatible con el socket de la
                  placa madre / procesador
                </li>
                <li>
                  Si el cooler entra en el gabinete
                </li>
                <li>
                  Si el procesador no viene con cooler y la cotización
                  no incluye uno. Igualmente si el procesador ya viene con
                  un cooler pero la cotización además incluye uno.
                </li>
              </ul>

              <h3>Qué cosas NO chequea</h3>

              <ul>
                <li>Que la fuente de poder incluya los conectores de
                  energía necesarios (especialmente para la tarjeta de
                  video)
                </li>
                <li>
                  Que la fuente de poder tenga la potencia necesaria para
                  levantar el PC
                </li>
                <li>
                  Si el procesador es para overclock y la placa no (o
                  viceversa)
                </li>
                <li>
                  Si el gabinete es slim entonces solo es compatible
                  con tarjetas de video low profile
                </li>
                <li>
                  En el caso de incluir SSDs M.2 que la placa madre tenga
                  el conector necesario
                </li>
                <li>
                  Si el gabiente tiene los espacios necesarios para un
                  cooler líquido.
                </li>
              </ul>

              <hr/>

              <h4>Se dejan los comentarios abiertos por si alguien encuentra
                un error o tiene alguna observación sobre el sistema de
                compatiblidad.</h4>

              <h4>Cualquier pregunta sobre la compatibilidad
                de una cotización será eliminada.</h4>

            </div>
          </div>

          <div className="col-12 mt-3">
            <div className="content-card">
              <ReactDisqusComments
                shortname={settings.disqusShortName}
                identifier='budget_compatibility'
                url='https://www.solotodo.com/budgets/compatibility/'
              />
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  }
}

export default CompatibilityCheckAbout
