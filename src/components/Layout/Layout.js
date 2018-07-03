import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import ReduxToastr from 'react-redux-toastr';
import s from './Layout.css';
import Navigation from '../Navigation';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    currentRoute: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <Navigation currentRoute={this.props.currentRoute} />
        {this.props.children}
        <ReduxToastr
          timeOut={5000}
          newestOnTop
          preventDuplicates
          position="top-right"
        />
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
