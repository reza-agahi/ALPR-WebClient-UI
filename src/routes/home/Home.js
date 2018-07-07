import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import Plate from '../../components/Plate';
import { updatePlate } from '../../actions/updatePlate';
import { getAPlate } from '../../actions/getAPlate';
import c from './constants';
import {
  convertToNajaFormat,
  toEnglishCharacters,
  toPersianCharacters,
} from '../../plateUtils';
import C from '../../constants/actions';
// import newsQuery from './news.graphql';
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
    currentPlate: PropTypes.object.isRequired,
    updatePlate: PropTypes.func.isRequired,
    changeCurrentPlate: PropTypes.func.isRequired,
    getAPlate: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getAPlate();
  }

  render() {
    const plate = this.props.currentPlate;
    return (
      <div className={s.root}>
        <div className={s.container}>
          {plate.plateCharacters.length !== 0 ? (
            <Panel>
              <Panel.Body>
                <div>
                  <Row>
                    <div className={s.imageContainer}>
                      <img
                        src={this.props.currentPlate.carSrc}
                        alt="car_image"
                      />
                    </div>
                  </Row>
                  <br />
                  <Row>
                    <div className={s.imageContainer}>
                      <img
                        src={this.props.currentPlate.plateSrc}
                        alt="car_image"
                      />
                    </div>
                  </Row>
                  <br />
                  <br />
                  <Row>
                    <div className={s.plateContainer}>
                      <Plate
                        plateCharacters={toPersianCharacters(
                          plate.plateCharacters,
                        )}
                        onChange={plateCharacters => {
                          this.props.changeCurrentPlate({
                            ...plate,
                            plateCharacters,
                          });
                        }}
                      />
                    </div>
                  </Row>
                  <br />
                  <br />
                  <Row>
                    <Col xs={2} xsPush={4}>
                      <Button
                        block
                        bsStyle="success"
                        onClick={() =>
                          this.props.updatePlate(
                            plate.id,
                            convertToNajaFormat(
                              toEnglishCharacters(plate.plateCharacters),
                            ),
                            'verified',
                          )
                        }
                      >
                        {c.ACCEPT}
                      </Button>
                    </Col>
                    <Col xs={2} xsPush={4}>
                      <Button
                        block
                        bsStyle="danger"
                        onClick={() =>
                          this.props.updatePlate(
                            plate.id,
                            convertToNajaFormat(plate.plateCharacters),
                            'rejected',
                          )
                        }
                      >
                        {c.REJECT}
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Panel.Body>
            </Panel>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  currentPlate: state.currentPlate,
});

const mapDispatch = dispatch => ({
  updatePlate(id, plateCode, status) {
    dispatch(updatePlate({ id, plateCode, status }));
  },
  changeCurrentPlate(newPlate) {
    dispatch({ type: C.SET_CURRENT_PLATE, payload: newPlate });
  },
  getAPlate() {
    dispatch(getAPlate());
  },
});

export default compose(
  withStyles(s),
  // graphql(newsQuery),
  connect(
    mapState,
    mapDispatch,
  ),
)(Home);
