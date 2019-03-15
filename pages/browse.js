import React from 'react'
import {connect} from "react-redux";
import Head from 'next/head';
import {solotodoStateToPropsUtils} from "../redux/utils";
import {settings} from '../settings'
import Loading from "../components/Loading";
import CategoryBrowse from "../components/Category/CategoryBrowse";
import TopBanner from "../components/TopBanner";

class Browse extends React.Component {
  static async getInitialProps(ctx) {
    const { res, query, reduxStore } = ctx;
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

    return {
      category: category
    }
  }

  render() {
    const category = this.props.category;
    const topBanner = <TopBanner category={category.name} />;

    return <React.Fragment>
      <Head>
      </Head>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">

            <CategoryBrowse
              category={category}
              loading={Loading}
              stores={this.props.preferredCountryStores}
              country={this.props.preferredCountry}
              resultsPerPage={settings.categoryBrowseResultsPerPage}
              categoryBrowseParams={settings.categoryBrowseParameters[category.id] || {}}
              websiteId={settings.websiteId}
              websiteUrl={settings.ownWebsiteURl}
              setTitle={() => {}}
              topBanner={topBanner}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, preferredCountry} = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    preferredCountryStores
  }
}

export default connect(mapStateToProps)(Browse);
