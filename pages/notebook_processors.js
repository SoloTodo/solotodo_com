import React from 'react'
import {withRouter} from "next/router";
import queryString from "query-string";
import {fetchJson} from "../react-utils/utils";
import Head from "next/head";

import NotebookComponentList from "../components/NotebookComponentList";
import {settings} from "../settings";


class NotebookProcessors extends React.Component {
  static async getInitialProps(ctx) {
    const {asPath} = ctx;
    const processorId = parseInt(queryString.parse(asPath.split('?')[1])['id']) || undefined;

    let processorList = await fetchJson(`${settings.endpoint}notebook_processors/`);
    processorList.sort((a,b) => b['speed_score'] - a['speed_score']);

    processorList =  processorList.map((processor, idx) => ({
      ...processor,
      idx
    }));

    const matchingProcessor = processorList.filter(processor => processor.id === processorId)[0];
    let page = 0;
    if (matchingProcessor) {
      page = Math.floor(matchingProcessor.idx / 15)
    }

    return {
      processorList,
      matchingProcessor,
      page
    }
  }

  render() {
    return <React.Fragment>
      <Head>
        <title>{this.props.matchingProcessor? `${this.props.matchingProcessor.unicode} - ` : ''} Procesadores de notebooks - SoloTodo</title>
      </Head>
      <div className="pl-3 pr-3">
        <NotebookComponentList
          label="Procesadores"
          browse_path="processors="
          componentList={this.props.processorList}
          matchingComponent={this.props.matchingProcessor}
          initialPage={this.props.page}
          score_field="speed_score"
          speed_tooltip="Según PassMark"
          columns={[
            { Header: 'Cores',
              accessor: 'core_count_unicode',
              width: 100},
            { Header: 'Frecuencia',
              accessor: 'frequency_unicode',
              width: 100},
            { Header: 'Frec. turbo',
              accessor: 'turbo_frequency_unicode',
              width: 100}]}/>
      </div>
    </React.Fragment>
  }
}

export default withRouter(NotebookProcessors)