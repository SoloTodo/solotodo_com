import React from 'react'
import Head from 'next/head';
import {withRouter} from 'next/router'
import {solotodoStateToPropsUtils} from "../redux/utils";
import CategoryBrowse from "../components/Category/CategoryBrowse";
import {withSoloTodoTracker} from "../utils";

class Browse extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query, reduxStore, asPath } = ctx;
    const reduxState = reduxStore.getState();
    const { categories } = solotodoStateToPropsUtils(reduxState);
    const category = categories.filter(localCategory => localCategory.slug === query.category_slug)[0];

    if (!category) {
      if (res) {
        res.statusCode = 404;
        res.end('Not found');
        return
      } else {
        return {
          statusCode: 404
        }
      }
    }

    const categoryBrowseProps = await CategoryBrowse.getInitialProps(category, reduxState, asPath);

    return {
      category: category,
      categoryBrowseProps
    }
  }

  render() {
    const category = this.props.category;

    return <React.Fragment>
      <Head>
        <title>{this.props.category.name} - SoloTodo</title>
        <meta property="og:title" content={`Catálogo de ${this.props.category.name} - SoloTodo`} />
        <meta name="description" property="og:description" content={`Cotiza y ahorra comparando los precios de todos los ${this.props.category.name.toLowerCase()} disponibles en el mercado`} />
      </Head>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <CategoryBrowse category={category} {...this.props.categoryBrowseProps} />
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

function mapPropsToGAField(props) {
  return {
    category: props.category.name,
    pageTitle: props.category.name
  }
}

const TrackedBrowse = withSoloTodoTracker(Browse, mapPropsToGAField);
export default withRouter(TrackedBrowse);
