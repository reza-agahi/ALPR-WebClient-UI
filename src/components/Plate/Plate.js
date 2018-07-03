import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Plate.css';
import c from './constants';

class Plate extends React.Component {
  static propTypes = {
    plateCharacters: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
  };
  render() {
    return (
      <div className={s.root}>
        <input
          style={{
            fontSize: '30px',
            width: '25px',
            position: 'absolute',
            top: '18px',
            right: `${285}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="1"
          type="text"
          value={this.props.plateCharacters[0]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[0] = e.target.value;
            this.props.onChange(x);
          }}
        />

        <input
          style={{
            fontSize: '30px',
            width: '25px',
            position: 'absolute',
            top: '18px',
            right: `${252}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="1"
          type="text"
          value={this.props.plateCharacters[1]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[1] = e.target.value;
            this.props.onChange(x);
          }}
        />

        <input
          style={{
            fontSize: '30px',
            width: '50px',
            position: 'absolute',
            top: '18px',
            right: `${195}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="3"
          type="text"
          value={this.props.plateCharacters[2]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[2] = e.target.value;
            this.props.onChange(x);
          }}
        />

        <input
          style={{
            fontSize: '30px',
            width: '30px',
            position: 'absolute',
            top: '18px',
            right: `${160}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="1"
          type="text"
          value={this.props.plateCharacters[3]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[3] = e.target.value;
            this.props.onChange(x);
          }}
        />

        <input
          style={{
            fontSize: '30px',
            width: '30px',
            position: 'absolute',
            top: '18px',
            right: `${125}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="1"
          type="text"
          value={this.props.plateCharacters[4]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[4] = e.target.value;
            this.props.onChange(x);
          }}
        />

        <input
          style={{
            fontSize: '30px',
            width: '30px',
            position: 'absolute',
            top: '18px',
            right: `${90}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="1"
          type="text"
          value={this.props.plateCharacters[5]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[5] = e.target.value;
            this.props.onChange(x);
          }}
        />

        <input
          style={{
            fontSize: '30px',
            width: '30px',
            position: 'absolute',
            top: '22px',
            right: `${47}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="1"
          type="text"
          value={this.props.plateCharacters[6]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[6] = e.target.value;
            this.props.onChange(x);
          }}
        />

        <input
          style={{
            fontSize: '30px',
            width: '30px',
            position: 'absolute',
            top: '22px',
            right: `${10}px`,
            textAlign: 'center',
          }}
          size={1}
          maxLength="1"
          type="text"
          value={this.props.plateCharacters[7]}
          onChange={e => {
            const x = JSON.parse(JSON.stringify(this.props.plateCharacters));
            x[7] = e.target.value;
            this.props.onChange(x);
          }}
        />
      </div>
    );
  }
}

export default withStyles(s)(Plate);
