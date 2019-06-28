import React from 'react'
import {withRouter} from "next/router";
import queryString from "query-string";
import {fetchJson} from "../react-utils/utils";

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
    const page = matchingProcessor && Math.floor(matchingProcessor.idx/15);

    return {
      processorList,
      matchingProcessor,
      page
    }
  }

  render() {
    return <NotebookComponentList
      label="Procesadores"
      browse_path="processors="
      componentList={this.props.processorList}
      matchingComponent={this.props.matchingProcessor}
      page={this.props.page}
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
  }
}

export default withRouter(NotebookProcessors)