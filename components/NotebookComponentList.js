import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";
import classNames from 'classnames/bind';
import ReactTooltip from 'react-tooltip'

import {fetchJson} from "../react-utils/utils";
import {solotodoStateToPropsUtils} from "../redux/utils";
import {DropdownItem} from "reactstrap";


class NotebookComponentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooksWithMatchingComponent: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate()
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
        Cell: props => <Link href={`/browse?category_slug=notebooks`} as={`notebooks`}>
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

    const numberOfSampleProducts = 2;

    return <div className="row">
      <div className="col-12">
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
          React Table aquí
        </div>
      </div>

      {
      }
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores} = solotodoStateToPropsUtils(state);

  return {
    preferredCountryStores
  }
}

export default connect(mapStateToProps)(NotebookComponentList);