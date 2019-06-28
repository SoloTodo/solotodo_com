// Only used for development! Serverless routes are configured in now.json

const express = require('express');
const next = require('next');
const https = require("https");
const devcert = require("devcert");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.get(`/`, (req, res) => {
      const actualPage = '/';
      app.render(req, res, actualPage)
    });

    server.get(`/reset/:uid/:token`, (req, res) => {
      const actualPage = '/reset';
      const queryParams = {
        uid: req.params.uid,
        token: req.params.token
      };

      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/products/:id-:slug`, (req, res) => {
      const actualPage = '/products/view';
      const queryParams = {
        id: req.params.id,
        slug: req.params.slug };
      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/products/:id`, (req, res) => {
      const actualPage = '/products/view';
      const queryParams = {
        id: req.params.id
      };
      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/products/:id/ratings`, (req, res) => {
      const actualPage = '/products/ratings';
      const queryParams = {
        id: req.params.id,
      };
      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/products/:id/ratings/new`, (req, res) => {
      const actualPage = '/products/new_rating';
      const queryParams = {
        id: req.params.id,
      };
      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/stores/:id/ratings`, (req, res) => {
      const actualPage = '/store_ratings';
      const queryParams = {
        id: req.params.id,
      };
      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/budgets/:id`, (req, res) => {
      const actualPage = '/budgets/view';
      const queryParams = {
        id: req.params.id
      };
      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/budgets/:id/edit`, (req, res) => {
      const actualPage = '/budgets/edit';
      const queryParams = {
        id: req.params.id
      };
      app.render(req, res, actualPage, queryParams)
    });

    server.get(`/notebook_processors`, (req, res) => {
      const actualPage = '/notebook_processors';
      app.render(req, res, actualPage)
    });

    server.get(`/:category_slug`, (req, res) => {
      const actualPage = '/browse';
      const queryParams = { category_slug: req.params.category_slug };
      app.render(req, res, actualPage, queryParams)
    });

    server.get('*', (req, res) => {
      return handle(req, res)
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000')
    })

    // if (dev) {
    //   devcert.certificateFor("local.solotodo.com", {installCertutil: true}).then((ssl) => {
    //     https.createServer(ssl, server).listen(3000, (err) => {
    //       if (err) throw err;
    //       // eslint-disable-next-line
    //       console.log(`> Ready on https://local.solotodo.com:3000`);
    //     });
    //   });
    // } else {
    //   server.listen(3000, (err) => {
    //     if (err) throw err;
    //     // eslint-disable-next-line
    //     console.log(`> Ready on http://localhost:3000`);
    //   });
    // }
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1)
  });
