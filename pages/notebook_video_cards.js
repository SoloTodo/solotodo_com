import React from 'react'
import {withRouter} from "next/router"
import queryString from "query-string"
import {fetchJson} from "../react-utils/utils";

import NotebookComponentList from "../components/NotebookComponentList"
import {settings} from "../settings";
import Head from "next/head";


class NotebookVideoCards extends React.Component {
  static async getInitialProps(ctx){
    const {asPath} = ctx;
    const videoCardId = parseInt(queryString.parse(asPath.split('?')[1])['id']) || undefined;

    let videoCardList = await fetchJson(`${settings.endpoint}notebook_video_cards/`);
    videoCardList.sort((a, b) => b['speed_score']- a['speed_score']);

    videoCardList = videoCardList.map((videoCard, idx) => ({
      ...videoCard,
      idx
    }));

    const matchingVideoCard = videoCardList.filter(videoCard => videoCard.id === videoCardId)[0];
    let page = 0;
    if (matchingVideoCard) {
      page = Math.floor(matchingVideoCard.idx / 15)
    }

    return {
      videoCardList,
      matchingVideoCard,
      page
    }
  }

  render() {
    return <React.Fragment>
      <Head>
        <title>{this.props.matchingVideoCard? `${this.props.matchingVideoCard.unicode} - ` : ''} Tarjetas de video de notebooks - SoloTodo</title>
        <meta property="og:title" content={`Cotiza y ahorra cotizando todos tus productos de tecnología en un sólo lugar - SoloTodo`} />
        <meta name="description" property="og:description" content={`Ahorra tiempo y dinero cotizando celulares, notebooks, etc. en un sólo lugar y comparando el precio de todas las tiendas.`} />
      </Head>
      <div className="pl-3 pr-3">
        <NotebookComponentList
          label="Tarjetas de video"
          browse_path="video_cards="
          componentList={this.props.videoCardList}
          matchingComponent={this.props.matchingVideoCard}
          initialPage={this.props.page}
          score_field="speed_score"
          speed_tooltip="Según 3DMark Fire Strike Graphics"
          columns={[
            { Header: 'Tipo',
              accessor: 'card_type_unicode',
              width: 100},
            { Header: 'Memoria',
              accessor: 'memory_unicode',
              width: 100}]}/>
      </div>
    </React.Fragment>
  }
}

export default withRouter(NotebookVideoCards)