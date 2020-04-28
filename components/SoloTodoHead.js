import React from 'react';
import Head from 'next/head';
import {settings} from '../settings';
import exponea_tag from './exponea_tag'

export default class SoloTodoHead extends React.Component {
  setGoogleTags() {
    return {
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      `
    };
  }

  setExponeaTags() {
    return {
      __html: exponea_tag
    };
  }

  componentDidMount() {
    window.exponea && window.exponea.initialize({
      "token": "b3458982-2e36-11ea-ad7a-9e27530e0693",
      "ping": {
        "enabled": false
      }
    })
  };

  render() {
    return <Head>
      <link rel="shortcut icon" href="/static/favicon.ico" />

      <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0" />
      <meta name="theme-color" content="#284c6b" />

      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400" rel="stylesheet" />
      <meta property="og:image" content={`${settings.domain}/static/logo_horizontal.png`} key="og_image" />

      <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}></script>
      <script dangerouslySetInnerHTML={this.setGoogleTags()} />
      <script dangerouslySetInnerHTML={this.setExponeaTags()} />
    </Head>
  }
}