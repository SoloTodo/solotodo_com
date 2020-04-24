import React from 'react';
import {settings} from '../settings';

const robotsTxt = `User-agent: *
Disallow:

Sitemap: https://solotodo-core.s3.amazonaws.com/sitemaps/sitemap_${settings.countryCode}.xml`;

export default class Robots extends React.Component {
  static getInitialProps ({ query, req, res }) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write(robotsTxt);
    res.end();
  }
}