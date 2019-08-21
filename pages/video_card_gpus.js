import React from 'react'
import {connect} from "react-redux";
import {withRouter} from "next/dist/client/router";
import Link from "next/link";
import Head from "next/head";

import {fetchJson, areListsEqual} from "../react-utils/utils";
import {solotodoStateToPropsUtils} from "../redux/utils";
import {settings} from "../settings";
import CategoryBrowseResult from "../components/Category/CategoryBrowseResult";
import TopBanner from "../components/TopBanner";
import AnnouncementAlert from "../components/AnnouncementAlert";


class VideoCardGpuDetail extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query } = ctx;

    const gpuId = query.id;

    let gpu;

    try {
      gpu = await fetchJson(`${settings.endpoint}video_card_gpus/${gpuId}/`);
    } catch (e) {
      if (res) {
        res.statusCode=404;
        res.end('Not found');
        return
      }
    }

    return {
      gpu
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      videoCardsWithGpu: undefined
    }
  }


  componentDidMount() {
    this.componentUpdate()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!areListsEqual(this.props.preferredCountryStores,prevProps.preferredCountryStores)) {
      this.componentUpdate();
    }
  }

  componentUpdate(){
    const preferredCountryStores = this.props.preferredCountryStores;
    let storesComponent = '';
    for (const store of preferredCountryStores) {
      storesComponent += `stores=${store.id}&`
    }

    fetchJson(`categories/2/browse/?${storesComponent}page_size=3&ordering=offer_price_usd&gpus=${this.props.gpu.id}`).then(result => {
      this.setState({
        videoCardsWithGpu: result.results
      })
    })
  }

  render() {
    const gpu = this.props.gpu;

    const samplesPerSize = {
      extraSmall: 1,
      small: 2,
      medium: 1,
      large: 1,
      extraLarge: 2,
      infinity: 3,
    };

    const numberOfSampleProducts = samplesPerSize[this.props.mediaType] || 2;

    return <React.Fragment>
      <Head>
        <title>{`${this.props.gpu.unicode}`} - SoloTodo</title>
      </Head>
      <div className="pl-3 pr-3">
        <div className="row mt-3">
          <TopBanner category="Notebooks" />
          <div className="col-12">
            <AnnouncementAlert />

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link href={`/browse?category_slug=video_cards`} as={`/video_cards`}>
                  <a>Tarjetas de video</a>
                </Link></li>
                <li className="breadcrumb-item">GPUs</li>
                <li className="breadcrumb-item">{gpu.unicode}</li>
              </ol>
            </nav>
          </div>
          <div className="col-12">
            <h1>{gpu.unicode}</h1>
          </div>
          <div className="col-12 col-md-6 col-lg-7 col-xl-5">
            <div className="content-card video_card_gpu_specs">
              <h2>Especificaciones</h2>
              <dl>
                <dt>Núcleo</dt>
                <dd>{gpu.core_unicode}</dd>

                <dt>Stream processors</dt>
                <dd>{gpu.stream_processors}</dd>

                <dt>Texture units</dt>
                <dd>{gpu.texture_units}</dd>

                <dt>ROPs</dt>
                <dd>{gpu.rops}</dd>

                <dt>Frecuencias</dt>
                <dd>
                  <ul>
                    <li>Core: {gpu.default_core_clock} MHz</li>
                    <li>Memorias: {gpu.default_memory_clock} MHz</li>
                  </ul>
                </dd>
              </dl>

              <h2>Especificaciones secundarias</h2>
              <dl>
                <dt>Número de transistores</dt>
                <dd>{gpu.transistor_count} millones</dd>

                <dt>TDP</dt>
                <dd>{gpu.tdp} W.</dd>

                <dt>Proceso de manufactura</dt>
                <dd>{gpu.manufacturing_process_unicode}</dd>

                <dt>SLI / Crossfire</dt>
                <dd>{gpu.has_multi_gpu_support ? 'Sí' : 'No'}</dd>

                <dt>DirectX</dt>
                <dd>{gpu.dx_version_unicode}</dd>

                <dt>OpenGL</dt>
                <dd>{gpu.ogl_version_unicode}</dd>
              </dl>

              <h2>Puntajes</h2>
              <dl>
                <dt>3DMark 11</dt>
                <dd>{gpu.tdmark_11_score}</dd>

                <dt>3DMark Cloud Gate</dt>
                <dd>{gpu.tdmark_cloud_gate_score}</dd>

                <dt>3DMark Fire Strike</dt>
                <dd>{gpu.tdmark_fire_strike_score}</dd>
              </dl>
            </div>
          </div>
          {this.state.videoCardsWithGpu && !!this.state.videoCardsWithGpu.length &&
          <div className="col-12 col-md-6 col-lg-5 col-xl-7 mt-3 mt-md-0">
            <div className="content-card">
              <div className="d-flex flex-wrap flex-row justify-content-between">
                {this.state.videoCardsWithGpu.slice(0, numberOfSampleProducts).map(bucket => (
                  <CategoryBrowseResult key={bucket.bucket} bucket={bucket} websiteId={settings.websiteId} priceFormatter={this.props.formatCurrency} />
                ))}
              </div>

              <Link href={`/browse?category_slug=video_cards&gpus=${gpu.id}`} as={`/video_cards/?gpus=${gpu.id}`}>
                <a className="btn btn-xl btn-primary">Ver más tarjetas de video</a>
              </Link>
            </div>
          </div>
          }
        </div>
      </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {formatCurrency, preferredCountryStores} = solotodoStateToPropsUtils(state);

  return {
    formatCurrency,
    preferredCountryStores,
    mediaType: state.browser.mediaType
  }
}


export default withRouter(connect(mapStateToProps)(VideoCardGpuDetail))