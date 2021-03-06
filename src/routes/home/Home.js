import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import persianJs from 'persianjs';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  Panel,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap';
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

  componentDidUpdate() {
    const plate = this.props.currentPlate;
    window.onkeypress = e => {
      switch (e.keyCode) {
        case 13:
          this.props.updatePlate({
            id: plate.id,
            plate_code: convertToNajaFormat(
              toEnglishCharacters(plate.plateCharacters),
            ),
            status: 'verified',
            warningDesc: plate.warningDesc,
            violation_code: plate.violation_code,
            violation_address: plate.violation_address,
            cam_code: plate.cam_code,
          });
          break;
        case 127:
          this.props.updatePlate({
            id: plate.id,
            plate_code: convertToNajaFormat(
              toEnglishCharacters(plate.plateCharacters),
            ),
            status: 'rejected',
            warningDesc: plate.warningDesc,
            violation_code: plate.violation_code,
            violation_address: plate.violation_address,
            cam_code: plate.cam_code,
          });
          break;
        case 32:
          this.props.updatePlate({
            id: plate.id,
            plate_code: convertToNajaFormat(
              toEnglishCharacters(plate.plateCharacters),
            ),
            status: 'postponed',
            warningDesc: plate.warningDesc,
            violation_code: plate.violation_code,
            violation_address: plate.violation_address,
            cam_code: plate.cam_code,
          });
          break;

        default:
          break;
      }
    };
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
                  <div style={{ textAlign: 'center' }}>
                    <i className="fa fa-calendar" />&nbsp;{`تاریخ تخلف: ${persianJs(
                      plate.date_time,
                    )
                      .englishNumber()
                      .toString()}`}&emsp;&emsp;
                    <i className="fa fa-circle" />&nbsp;{'کد دوربین: '}
                    <input
                      type="text"
                      value={persianJs(plate.cam_code)
                        .englishNumber()
                        .toString()}
                      size="4"
                      onChange={e => {
                        this.props.changeCurrentPlate({
                          ...plate,
                          cam_code: persianJs(e.target.value)
                            .toEnglishNumber()
                            .toString(),
                        });
                      }}
                    />&emsp;&emsp;
                    <i className="fa fa-circle" />&nbsp;{'کد تخلف: '}
                    <input
                      type="text"
                      value={persianJs(plate.violation_code)
                        .englishNumber()
                        .toString()}
                      size="4"
                      onChange={e => {
                        this.props.changeCurrentPlate({
                          ...plate,
                          violation_code: persianJs(e.target.value)
                            .toEnglishNumber()
                            .toString(),
                        });
                      }}
                    />&emsp;&emsp;
                    <i className="fa fa-circle" />&nbsp;{'محل تخلف: '}
                    <input
                      type="text"
                      value={plate.violation_address}
                      size="15"
                      onChange={e => {
                        this.props.changeCurrentPlate({
                          ...plate,
                          violation_address: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <br />
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
                  <Row>
                    <Col xs={6}>
                      <div style={{ width: '90%', margin: 'auto' }}>
                        <FormGroup controlId="formControlsTextarea">
                          <FormControl
                            componentClass="textarea"
                            placeholder="توضیحات"
                            value={plate.warningDesc || ''}
                            onChange={e => {
                              this.props.changeCurrentPlate({
                                ...plate,
                                warningDesc: e.target.value,
                              });
                            }}
                          />
                        </FormGroup>
                      </div>
                    </Col>
                    <Col xs={6}>
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
                    </Col>
                  </Row>
                  <br />
                  <br />
                  <Row>
                    <Col xs={2} xsPush={2}>
                      <Button
                        block
                        bsStyle="success"
                        onClick={() =>
                          this.props.updatePlate({
                            id: plate.id,
                            plate_code: convertToNajaFormat(
                              toEnglishCharacters(plate.plateCharacters),
                            ),
                            status: 'verified',
                            warningDesc: plate.warningDesc,
                            violation_code: plate.violation_code,
                            violation_address: plate.violation_address,
                            cam_code: plate.cam_code,
                          })
                        }
                      >
                        {c.ACCEPT}
                      </Button>
                    </Col>
                    <Col xs={2} xsPush={3}>
                      <Button
                        block
                        bsStyle="info"
                        onClick={() =>
                          this.props.updatePlate({
                            id: plate.id,
                            plate_code: convertToNajaFormat(
                              toEnglishCharacters(plate.plateCharacters),
                            ),
                            status: 'postponed',
                            warningDesc: plate.warningDesc,
                            violation_code: plate.violation_code,
                            violation_address: plate.violation_address,
                            cam_code: plate.cam_code,
                          })
                        }
                      >
                        {c.POSTPONED}
                      </Button>
                    </Col>
                    <Col xs={2} xsPush={4}>
                      <Button
                        block
                        bsStyle="danger"
                        onClick={() =>
                          this.props.updatePlate({
                            id: plate.id,
                            plate_code: convertToNajaFormat(
                              toEnglishCharacters(plate.plateCharacters),
                            ),
                            status: 'rejected',
                            warningDesc: plate.warningDesc,
                            violation_code: plate.violation_code,
                            violation_address: plate.violation_address,
                            cam_code: plate.cam_code,
                          })
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
  updatePlate(data) {
    dispatch(updatePlate(data));
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
