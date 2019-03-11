import React from 'react';
import Link from "next/link";
import {parseBrowsePathToNextJs} from "../../utils";

export default class NavBarSelectedDepartment extends React.Component {
  render() {
    return <div className="container-fluid" id="navbar-section-categories">
      {this.props.selectedDepartment &&
      <div className="row">
        <div className="col pt-3 pb-3 d-flex flex-wrap">
          {this.props.selectedDepartment.sections.map(section => (
            <div key={section.name} className="pr-5">
              {section.path === '/' ?
                <span className="category-header">{section.name}</span> :
                <Link {...parseBrowsePathToNextJs(section.path)}>
                  <a className="category-header">{section.name}</a>
                </Link>
              }
              {section.items && <ul className="list-unstyled mt-1">
                {section.items.map(item => (
                  <li key={item.name}>
                    <Link {...parseBrowsePathToNextJs(item.path)}>
                      <a>{item.name}</a>
                    </Link>
                  </li>
                ))}
                {section.items.length && section.path !== '/' ? <li className="pt-1 font-weight-bold">
                  <Link {...parseBrowsePathToNextJs(section.path)}><a>Ver todos</a></Link>
                </li> : null}
              </ul>}
            </div>
          ))}
        </div>
      </div>
      }
    </div>
  }
}