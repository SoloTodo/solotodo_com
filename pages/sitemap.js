import React from 'react';
import {settings} from '../settings';

export default class Robots extends React.Component {
  static getInitialProps ({ query, req, res }) {
    const url = `https://solotodo-core.s3.amazonaws.com/sitemaps/sitemap_${settings.countryCode}.xml`;
    res.writeHead(301,
      {Location: url}
    );
    res.end();
  }
}