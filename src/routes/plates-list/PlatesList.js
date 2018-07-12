import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Panel, Button } from 'react-bootstrap';
import base64 from 'base-64';
import { toastr } from 'react-redux-toastr';
import DataTable from '../../components/DataTable';
import { updatePlate } from '../../actions/updatePlate';
import { uploadNewPlates } from '../../actions/uploadNewPlates';
import { getAllPlates } from '../../actions/getAllPlates';
import { errors } from '../../constants/messages';
import c from './constants';
import C from '../../constants/actions';
import s from './PlatesList.css';

class PlatesList extends React.Component {
  static propTypes = {
    currentPlate: PropTypes.object.isRequired,
    updatePlate: PropTypes.func.isRequired,
    changeCurrentPlate: PropTypes.func.isRequired,
    uploadNewPlates: PropTypes.func.isRequired,
    getAllPlates: PropTypes.func.isRequired,
    pendingPlatesTable: PropTypes.arrayOf(PropTypes.array).isRequired,
    verifiedPlatesTable: PropTypes.arrayOf(PropTypes.array).isRequired,
    removedPlatesTable: PropTypes.arrayOf(PropTypes.array).isRequired,
    postponedPlatesTable: PropTypes.arrayOf(PropTypes.array).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      postponedExpanded: false,
      rejectedExpanded: false,
      pendingExpanded: false,
      verifiedExpanded: false,
    };
  }

  componentDidMount() {
    this.props.getAllPlates();
  }

  render() {
    const tableColumns = [
      'محل وقوع',
      'شماره پلاک',
      'زمان',
      'تصویر پلاک',
      'توضیحات',
    ];
    return (
      <div className={s.root}>
        <Panel>
          <Panel.Heading>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {c.IMPORT_FILE_HEADER}
            </span>
          </Panel.Heading>
          <Panel.Body>
            <span>{c.IMPORT_FILE_DESCRIPTION}</span>
            &nbsp;&nbsp;
            <label className={s.customFileUpload}>
              <input
                type="file"
                onChange={e => {
                  if (e.target.files[0].type === 'application/zip') {
                    const reader = new FileReader();
                    reader.onload = evt => {
                      this.props.uploadNewPlates(
                        base64.encode(evt.target.result),
                      );
                    };
                    reader.readAsBinaryString(e.target.files[0]);
                  } else {
                    toastr.error(
                      errors.FILE_SENDING_ERROR,
                      errors.FILE_FORMAT_NOT_SUPPORTED,
                    );
                  }
                }}
              />
              <i className="fa fa-upload" /> &nbsp;{c.UPLOAD}
            </label>
          </Panel.Body>
        </Panel>
        <br />

        <DataTable
          key={Math.random()}
          title={c.PENDING_TITLE}
          data={this.props.pendingPlatesTable}
          header={tableColumns}
          plateType="pending"
          changeExpansion={() =>
            this.setState({ pendingExpanded: !this.state.pendingExpanded })
          }
          expanded={this.state.pendingExpanded}
        />
        <br />
        <DataTable
          key={Math.random()}
          title={c.VERIFIED_TITLE}
          data={this.props.verifiedPlatesTable}
          header={tableColumns}
          plateType="verified"
          changeExpansion={() =>
            this.setState({ verifiedExpanded: !this.state.verifiedExpanded })
          }
          expanded={this.state.verifiedExpanded}
        />
        <br />
        <DataTable
          key={Math.random()}
          title={c.REMOVED_TITLE}
          data={this.props.removedPlatesTable}
          header={tableColumns}
          plateType="rejected"
          changeExpansion={() =>
            this.setState({ rejectedExpanded: !this.state.rejectedExpanded })
          }
          expanded={this.state.rejectedExpanded}
        />
        <br />
        <DataTable
          key={Math.random()}
          title={c.POSTPONED_TITLE}
          data={this.props.postponedPlatesTable}
          header={tableColumns}
          plateType="postponed"
          changeExpansion={() =>
            this.setState({ postponedExpanded: !this.state.postponedExpanded })
          }
          expanded={this.state.postponedExpanded}
        />
      </div>
    );
  }
}

const mapState = state => ({
  pendingPlatesTable: state.pendingPlatesTable,
  verifiedPlatesTable: state.verifiedPlatesTable,
  removedPlatesTable: state.removedPlatesTable,
  postponedPlatesTable: state.postponedPlatesTable,
});

const mapDispatch = dispatch => ({
  updatePlate(id, plateCode, status) {
    dispatch(updatePlate({ id, plateCode, status }));
  },
  changeCurrentPlate(newPlate) {
    dispatch({ type: C.SET_CURRENT_PLATE, payload: newPlate });
  },
  uploadNewPlates(file) {
    dispatch(uploadNewPlates({ file }));
  },
  getAllPlates() {
    dispatch(getAllPlates());
  },
});

export default compose(
  withStyles(s),
  // graphql(newsQuery),
  connect(
    mapState,
    mapDispatch,
  ),
)(PlatesList);
