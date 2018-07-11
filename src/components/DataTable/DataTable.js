import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import $ from 'jquery';
import 'datatables.net';
import { connect } from 'react-redux';
import { Panel, Button } from 'react-bootstrap';
import { goToPendingList } from '../../actions/goToPendingList';
import { convertTo8Digit } from '../../plateUtils';
import c from './constants';

class DataTable extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.array).isRequired,
    header: PropTypes.arrayOf(PropTypes.string).isRequired,
    onReload: PropTypes.func,
    plateType: PropTypes.string.isRequired,
  };

  componentDidMount() {
    // Setting datatable defaults
    $.extend($.fn.dataTable.defaults, {
      autoWidth: false,
      responsive: true,
      columnDefs: [
        {
          orderable: false,
          width: '100px',
          targets: this.props.plateType === 'rejected' ? [5] : [4],
        },
      ],
      dom:
        '<"datatable-header"fl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
      language: {
        emptyTable: 'داده ای برای نمایش وجود ندارد',
        info: 'نمایش رکوردهای _START_ تا _END_ از _TOTAL_ رکورد موجود',
        infoEmpty: 'نمایش رکوردهای 0 تا 0 از 0 رکورد موجود',
        infoFiltered: '(فیلتر شده از مجموع _MAX_ رکورد)',
        loadingRecords: 'در حال بارگذاری...',
        processing: 'در حال پردازش...',
        search: '<span>فیلتر:</span> _INPUT_',
        searchPlaceholder: 'تایپ کنید...',
        lengthMenu: '<span>نمایش:</span> _MENU_',
        zeroRecords: 'هیچ رکوردی یافت نشد',
        paginate: {
          first: 'اولین',
          last: 'آخرین',
          next: '&larr;',
          previous: '&rarr;',
        },
        aria: {
          sortAscending: ': فعال سازی نمایش به صورت صعودی',
          sortDescending: ': فعال سازی نمایش به صورت نزولی',
        },
      },
    });

    // Column controlled child rows
    $(this.table).DataTable({
      responsive: {
        details: {
          type: 'column',
        },
      },
      columnDefs: [
        {
          className: 'control',
          orderable: false,
          targets: 0,
        },
        {
          width: '100px',
          targets:
            this.props.plateType === 'rejected' ||
            this.props.plateType === 'postponed'
              ? [5]
              : [4],
        },
        {
          orderable: false,
          targets:
            this.props.plateType === 'rejected' ||
            this.props.plateType === 'postponed'
              ? [5]
              : [4],
        },
      ],
      order: [1, 'asc'],
    });
  }

  render() {
    return (
      <Panel expanded={this.props.expanded}>
        <Panel.Heading
          onClick={() => this.props.changeExpansion()}
          style={{
            cursor: 'pointer',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {this.props.title}
          </span>
          <i
            className={
              this.props.expanded ? 'fa fa-caret-up' : 'fa fa-caret-down'
            }
            style={{
              float: 'left',
              fontSize: '18px',
            }}
          />
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <table
              ref={input => {
                this.table = input;
              }}
              className="table"
            >
              <thead>
                <tr>
                  {this.props.header.map((item, i) => <th key={i}>{item}</th>)}
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.data.map((item, i) => {
                  const plateCharacters = convertTo8Digit(item.plate_code);
                  const twoDigit = plateCharacters[0] + plateCharacters[1];
                  const letter = plateCharacters[2];
                  const threeDigit =
                    plateCharacters[3] +
                    plateCharacters[4] +
                    plateCharacters[5];
                  const iranCode = plateCharacters[6] + plateCharacters[7];
                  return (
                    <tr key={i}>
                      {/* {item.map((item_, j) => <td key={j}>{item_}</td>)} */}
                      <td key={1}>{item.violation_address}</td>
                      <td
                        key={2}
                      >{`${iranCode} ${threeDigit} ${letter} ${twoDigit}`}</td>
                      <td key={3}>{item.date_time}</td>
                      <td key={4}>
                        <img
                          style={{ maxWidth: '200px' }}
                          src={item.plate_full_address}
                        />
                      </td>
                      {(this.props.plateType === 'rejected' ||
                        this.props.plateType === 'postponed') && (
                        <td key={5}>
                          <Button
                            bsStyle="primary"
                            onClick={() =>
                              this.props.goToPendingList(
                                item,
                                this.props.plateType,
                              )
                            }
                          >
                            {c.GO_TO_PENDING_LIST}
                          </Button>
                        </td>
                      )}
                      <td />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

DataTable.defaultProps = {
  onReload: () => {},
};

const mapDispatch = dispatch => ({
  goToPendingList(plate, itemType) {
    dispatch(goToPendingList({ plate }, itemType));
  },
});

export default connect(
  undefined,
  mapDispatch,
)(DataTable);
