import React from 'react'
import Link from "next/link";
import Router, {withRouter} from "next/router";
import {toast} from 'react-toastify';
import LaddaButton, { MD, EXPAND_LEFT } from "react-ladda";

import {fetchJson} from "../../../../react-utils/utils";
import {solotodoStateToPropsUtils} from "../../../../redux/utils";
import {settings} from "../../../../settings";
import TopBanner from "../../../../components/TopBanner";
import RatingStarsEditable from "../../../../components/RatingStarsEditable";
import {apiResourceStateToPropsUtils} from "../../../../react-utils/ApiResource";
import {connect} from "react-redux";
import Head from "next/head";


class NewProductRating extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query, reduxStore, asPath } = ctx;
    const reduxState = reduxStore.getState();

    const {user, categories, preferredCountryStores} = solotodoStateToPropsUtils(reduxState);
    const productId = query.slug;

    const productsUrl = settings.apiResourceEndpoints.products;

    let product;

    try {
      product = await fetchJson(`${productsUrl}${productId}/`);
    } catch (e) {
      if (res) {
        res.statusCode=404;
        res.end('Not found');
        return
      }
    }
    const category = categories.filter(localCategory => localCategory.url === product.category)[0];

    return {
      product,
      category,
      preferredCountryStores,
      user
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        product_rating: null,
        product_comments: '',
        store: this.props.preferredCountryStores[0].id,
        store_rating: null,
        store_comments: '',
        purchase_proof: null
      },
      rating: undefined,
      was_product_received: null
    }
  }

  handleWasProductReceivedChange = newValue => {
    this.setState({
      was_product_received: newValue,
      formValues: {
        ...this.state.formValues,
        product_rating: null,
        product_comments: ''
      }
    })
  }

  handleStarClick = (nextValue, prevValue, name) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: nextValue
      }
    })
  };

  handleFieldChange = e => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [e.target.name]: e.target.value
      }})
  };

  handleFileChange = e => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        purchase_proof: e.target.files[0] || null
      }
    })
  };

  handleFormSubmit = e => {
    e.preventDefault();

    if (this.state.was_product_received === null) {
      toast.error('Por favor selecciona si recibiste el producto o no');
      return;
    }

    if (this.state.was_product_received && !this.state.formValues.product_rating) {
      toast.error('Por favor ingrese el numero de estrellas (1 a 5) del producto.');
      return;
    }

    if (!this.state.formValues.store_rating) {
      toast.error('Por favor ingrese el numero de estrellas (1 a 5) de la tienda.');
      return;
    }

    this.setState({
      rating: null
    });

    const formData = new FormData();
    formData.append('product', this.props.product.id);

    const skippedFieldsWhenProductNotReceived = ['product_rating', 'product_comments']

    for (const key in this.state.formValues) {
      if (!this.state.was_product_received && skippedFieldsWhenProductNotReceived.includes(key)) {
        continue
      }

      formData.append(key, this.state.formValues[key])
    }

    this.props.fetchAuth(settings.apiResourceEndpoints.ratings, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': null
      }
    }).then(rating => {
      Router.push(`/products/[slug]?slug=${this.props.product.id}-${this.props.product.slug}`, `/products/${this.props.product.id}-${this.props.product.slug}`);
      toast.success('Rating enviado exitosamente. Gracias! Apenas lo verifiquemos aparecerá publicado en el sitio.', {
        autoClose: false
      });
    })
  };


  render() {
    const product = this.props.product;
    const category = this.props.category;

    return <React.Fragment>
      <Head>
        <title key="title">{product.name} - Nuevo rating - SoloTodo</title>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div>
              <div className="row">
                <TopBanner category={category.name}/>

                <div className="col-12">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link  href={`/browse?category_slug=${category.slug}`} as={`/${category.slug}`}><a>{category.name}</a></Link></li>
                    <li className="breadcrumb-item"><Link href={`/products/[slug]?slug=${product.id}-${product.slug}`} as={`/products/${product.id}-${product.slug}`}><a>{product.name}</a></Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Nuevo rating</li>
                  </ol>
                </div>

                <div className="col-12">
                  <h1>{product.name} - Nuevo rating</h1>
                </div>

                <div className="col-12">
                  <div className="content-card">
                    <form onSubmit={this.handleFormSubmit}>
                      <table className="table">
                        <tbody>
                        <tr>
                          <th className="align-middle">Producto</th>
                          <td>{product.name}</td>
                        </tr>
                        <tr>
                          <th className="align-middle">¿Recibiste el producto?</th>
                          <td>
                            <div className="custom-control custom-radio">
                              <input type="radio"
                                     name="was_product_received"
                                     id="was_product_received_yes"
                                     className="custom-control-input"
                                     checked={this.state.was_product_received === true}
                                     onChange={evt => this.handleWasProductReceivedChange(true)}
                              />
                              <label className="custom-control-label"
                                     htmlFor="was_product_received_yes">Sí, lo recibí</label>
                            </div>
                            <div className="custom-control custom-radio">
                              <input type="radio"
                                     name="was_product_received"
                                     id="was_product_received_no"
                                     className="custom-control-input"
                                     checked={this.state.was_product_received === false}
                                     onChange={evt => this.handleWasProductReceivedChange(false)}
                              />
                              <label className="custom-control-label"
                                     htmlFor="was_product_received_no">No, no lo recibí</label>
                            </div>
                          </td>
                        </tr>
                        {this.state.was_product_received &&
                        <>
                          <tr>
                            <th className="align-middle">Evaluación del producto (de 1 a 5)</th>
                            <td>
                              <RatingStarsEditable
                                  name="product_rating"
                                  value={this.state.formValues.product_rating}
                                  onStarClick={this.handleStarClick}/>
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">Comentarios del producto</th>
                            <td>
                          <textarea
                              name="product_comments"
                              value={this.state.formValues.product_comments}
                              onChange={this.handleFieldChange}
                              required={true}
                              placeholder="Comentarios sobre la calidad o rendimiento del producto mismo. ¿Cumplió las expectativas?"
                              className="form-control"/>
                            </td>
                          </tr>
                        </>}
                        <tr>
                          <th className="align-middle">Tienda</th>
                          <td>
                            <select className="form-control" name="store" value={this.state.formValues.store} onChange={this.handleFieldChange}>
                              {this.props.preferredCountryStores.map(store => (
                                  <option key={store.id} value={store.id}>{store.name}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Evaluación de la tienda (de 1 a 5)</th>
                          <td>
                            <RatingStarsEditable
                                name="store_rating"
                                value={this.state.formValues.store_rating}
                                onStarClick={this.handleStarClick}/>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Comentarios de la tienda</th>
                          <td>
                          <textarea
                              name="store_comments"
                              value={this.state.formValues.store_comments}
                              onChange={this.handleFieldChange}
                              required={true}
                              placeholder="Comentarios sobre tienda. ¿Te trataron bien? ¿Te atendieron rápido? ¿Cómo fue el despacho?"
                              className="form-control"/>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Archivo de confirmación</th>
                          <td>
                            <input
                                type="file"
                                name="purchase_proof"
                                className="form-control-file"
                                required={true}
                                onChange={this.handleFileChange} />
                            <p className="text-muted mt-2">
                              Boleta, factura, correo de confirmación, o cualquier foto o documento que verifique que compraste el producto en esa tienda. Tiene que aparecer el nombre del producto y de la tienda. Puede ser una foto, archivo PDF, o lo que prefieras.
                            </p>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                      <LaddaButton
                          loading={this.state.rating}
                          type="submit"
                          className="btn btn-primary"
                          data-size={MD}
                          data-style={EXPAND_LEFT}>
                        {this.state.rating === null ? 'Enviando' : 'Enviar'}
                      </LaddaButton>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default withRouter(connect(mapStateToProps)(NewProductRating))