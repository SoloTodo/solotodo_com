import React from 'react'
import {connect} from "react-redux";

import {settings} from "../settings";
import LeadLink from "../react-utils/components/LeadLink";


class SoloTodoLeadLink extends React.Component {
  handleClick = uuid => {
    const {entity, product, storeEntry, category} = this.props;
    const price = parseFloat(entity.active_registry.offer_price);

    window.gtag('event', 'Follow', {
      dimension2: category.name,
      dimension3: product.name,
      dimension4: storeEntry.name,
      dimension5: `${product.name}|${category.name}|${storeEntry.name}`,
      event_category: 'Lead',
      event_label: uuid,
      value: price
    });

  };

  render() {
    const {entity, className, storeEntry, children} = this.props;
    return <LeadLink
      entity={entity}
      store={storeEntry}
      className={className}
      websiteId={settings.websiteId}
      callback={this.handleClick}
      soicosPrefix="ST_"
    >
      {children}
    </LeadLink>
  }
}

function mapStateToProps(state, ownProps) {
  return {
    category: state.apiResourceObjects[ownProps.entity.category],
  }
}

export default connect(mapStateToProps)(SoloTodoLeadLink)