import React from 'react';
import {connect} from 'react-redux';

import Link from 'next/link'

class CyberCheckBanner extends React.Component {
  render() {
    // return null;

    const imgSrc = this.props.isSmallOrSmaller ? 'mobile.png' : 'desktop.png';
    const imgWidth = this.props.isSmallOrSmaller ? 320 : 768;
    const imgHeight = this.props.isSmallOrSmaller ? 50 : 90;
    const containerClass = this.props.isSmallOrSmaller ? 'mobile' : 'desktop';

    return <Link href="/cyber_check" as="/cyber_check">
      <a className={'cyber-check-banner-' + containerClass} id="cyber-check-banner">
        <div className="text-center">
          <img
            src={'/static/cyber_check_banner/' + imgSrc}
            alt="Cyber check"
            width={imgWidth}
            height={imgHeight}
          />
        </div>
        <div className="p-2 pl-3">
          <strong>¿Vienes por el Cyber?</strong> <span>¡Entra acá para verificar las ofertas de las tiendas!</span>
        </div>
      </a>
    </Link>
  }
}

function mapStateToProps(state) {
  return {
    isSmallOrSmaller: state.browser.lessThan.medium,
  }
}

export default connect(mapStateToProps)(CyberCheckBanner);