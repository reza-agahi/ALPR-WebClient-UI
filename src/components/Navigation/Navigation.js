import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import c from './constants';
import routes from '../../constants/routes';
import logoSrc from './logo.png';
import Link from '../Link';

class Navigation extends React.Component {
  static propTypes = {
    currentRoute: PropTypes.string.isRequired,
  };
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header navbar-left">
            <Link className="navbar-left" to="#">
              <div className={s.logoContainer}>
                <img src={logoSrc} alt="logo" />
              </div>
            </Link>
          </div>
          <ul
            style={{ direction: 'ltr', fontWeight: '500' }}
            className="nav navbar-nav navbar-left"
          >
            <li
              className={
                this.props.currentRoute === routes.HOME ? 'active' : ''
              }
            >
              <Link to={routes.HOME}>
                {c.HOME}&nbsp;<i className="fa fa-home" />
              </Link>
            </li>
            <li
              className={
                this.props.currentRoute === routes.PLATES_LIST ? 'active' : ''
              }
            >
              <Link to={routes.PLATES_LIST}>
                {c.PLATES_LIST}&nbsp;<i className="fa fa-list" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default withStyles(s)(Navigation);
