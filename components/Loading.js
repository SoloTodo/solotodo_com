import React from 'react';
// import { css } from '@emotion/core';
import { PacmanLoader } from 'react-spinners';

export default class Loading extends React.Component {
  render() {
    // const override = css`
    //     display: block;
    //     margin: 0 auto;
    //     border-color: red;
    // `;

    // const spinnerId = this.props.type === 'light' ? 'loading-spinner-light' : 'loading-spinner';

    return <div className="d-flex justify-content-center pt-3 pb-3">
        <PacmanLoader
          // css={override}
          sizeUnit={"px"}
          size={25}
          color={'#ddd'}
          // loading={false}
        />
    </div>
  }
}