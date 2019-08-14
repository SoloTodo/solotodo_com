import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";
import ReactTable from 'react-table'
import classNames from 'classnames/bind';
import ReactTooltip from 'react-tooltip'

import {areListsEqual, fetchJson} from "../react-utils/utils";
import {solotodoStateToPropsUtils} from "../redux/utils";
import TopBanner from "./TopBanner";
import CategoryBrowseResult
  from "./Category/CategoryBrowseResult";
import {settings} from "../settings";
import AnnouncementAlert from "./AnnouncementAlert";


class NotebookComponentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooksWithMatchingComponent: undefined,
      page: this.props.initialPage
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

  componentUpdate() {
    const matchingComponent = this.props.matchingComponent;
    if (!matchingComponent) {
      return
    }

    let storesComponent = '';
    for (const store of this.props.preferredCountryStores) {
      storesComponent += `stores=${store.id}&`
    }

    fetchJson(`categories/1/es_browse?${storesComponent}page_size=3&ordering=offer_price_usd&${this.props.browse_path}${matchingComponent.id}`).then(result => {
      this.setState({
        notebooksWithMatchingComponent: result.results
      })
    })
  }


  render() {
    const matchingComponent = this.props.matchingComponent;

    const columns = [
      { id: 'Name',
        accessor: 'unicode',
        Header: 'Nombre',
        Cell: props => <Link href={`/browse?category_slug=notebooks&${this.props.browse_path}${props.original.id}`} as={`notebooks?${this.props.browse_path}${props.original.id}`}>
          <a className={classNames('text-primary', {'font-weight-bold': matchingComponent && props.original.id === matchingComponent.id})}>{props.original.unicode}</a>
        </Link>,
        filterable: true,
        filterMethod: (filter, row) => row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
      },
      ...this.props.columns
    ];

    columns.push({
      id: 'Speed',
      accessor: this.props.score_field,
      Header: props => <div>
        <ReactTooltip id="speed-tooltip" type="info" effect="solid" place="top">
          <span>{this.props.speed_tooltip}</span>
        </ReactTooltip>
        <span data-tip data-for="speed-tooltip" className="notebook-component-list-tooltip-label">Velocidad</span>
      </div>,
      Cell: props => <span className={classNames({'font-weight-bold': matchingComponent && props.original.id === matchingComponent.id})}>
        {props.value}
      </span>,
      width: 100,
      className: 'text-right'
    });

    const samplesPerSize = {
      extraSmall: 1,
      small: 2,
      medium: 2,
      large: 1,
      extraLarge: 2,
      infinity: 3,
    };

    const numberOfSampleProducts = samplesPerSize[this.props.mediaType] || 2;

    return <div className="row">
      <TopBanner category="Notebooks" />
      <div className="col-12">
        <AnnouncementAlert />

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href={`/browse?category_slug=notebooks`} as={`notebooks`}>
              <a>Notebooks</a>
            </Link></li>
            <li className="breadcrumb-item">{this.props.label}</li>
            {matchingComponent &&
            <li className="breadcrumb-item">{matchingComponent.unicode}</li>}
          </ol>
        </nav>
      </div>

      <div className="col-12">
        <h1>{matchingComponent ?
          matchingComponent.unicode :
          `Ránking ${this.props.label} Notebooks`}
        </h1>
      </div>

      <div className="col-12 col-lg-7 col-xl-5">
        <div className="content-card">
          <ReactTable
            data={this.props.componentList}
            page={this.state.page}
            columns={columns}
            sortable={false}
            defaultSorted={[{id: 'Speed', desc: true}]}
            defaultPageSize={15}
            className="-striped -highligh"
            showPageSizeOptions={false}
            onPageChange={page => this.setState({page})}
            onFilteredChange={() => this.setState({page: 0})}
            previousText="Anterior"
            nextText="Siguiente"
            pageText="Página"
            ofText="de"
            rowsText="filas"/>
        </div>
      </div>

      {this.state.notebooksWithMatchingComponent && this.state.notebooksWithMatchingComponent.length &&
      <div className="col-12 col-lg-5 col-xl-7 mt-3 mt-lg-0">
        <div className="content-card">
          <div className="d-flex flex-wrap flex-row justify-content-between">
            {this.state.notebooksWithMatchingComponent.slice(0, numberOfSampleProducts).map(bucket => (
              <CategoryBrowseResult key={bucket.bucket} bucket={bucket} websiteId={settings.websiteId} priceFormatter={this.props.formatCurrency} />
            ))}
          </div>
          <Link href={`/browse?category_slug=notebooks&${this.props.browse_path}${matchingComponent.id}`} as={`notebooks?${this.props.browse_path}${matchingComponent.id}`}>
            <a className="btn btn-xl btn-primary">Ver más notebooks</a>

          </Link>,
        </div>
      </div>}
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    preferredCountryStores,
    formatCurrency,
    mediaType: state.browser.mediaType
  }
}

export default connect(mapStateToProps)(NotebookComponentList);