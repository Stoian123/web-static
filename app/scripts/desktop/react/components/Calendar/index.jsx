/*global $, i18n */
import React, { Component, PropTypes } from 'react';
import { Map, List } from 'immutable';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';

import { getCalendar } from '../../actions/CalendarActions';
import CalendarHeader from './CalendarHeader';
import CalendarTimeline from './CalendarTimeline';
import { RELATIONSHIP_STATE_FRIEND } from '../../../../shared/constants/RelationshipConstants';
import { TLOG_SLUG_ANONYMOUS } from '../../../../shared/constants/Tlog';

const MOUSE_LEAVE_TIMEOUT = 300;
const CALENDAR_CLOSED = 'closed';
const CALENDAR_OPENED_BY_HOVER = 'openedByHover';
const CALENDAR_OPENED_BY_CLICK = 'openedByClick';
const TARGET_POST_CLASS = '.post';
const TARGET_POST_PARENT_CLASS = '.posts';

const emptyPeriods = List();
const emptySelectedEntry = Map();

class Calendar extends Component {
  state = {
    currentState: CALENDAR_CLOSED,
    visibleMarkers: [],
  };
  componentWillMount() {
    this.getCalendarData(this.props);
    this.updatePropsEntry(this.props);
  }
  componentDidMount() {
    this.setVisibleMarkers();
    const $post = $(TARGET_POST_CLASS);

    // Следим за скроллингом, только если находимся на странице списка постов
    if ($post.closest(TARGET_POST_PARENT_CLASS)) {
      this.scrollHandler = (ev, { id, time }) => (
        this.updateSelectedEntry(parseInt(id, 10), time)
      );

      $(document).on('waypoint.trigger', this.scrollHandler);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.tlog.get('id') !== nextProps.tlog.get('id')) {
      this.getCalendarData(nextProps);
    }
    this.updatePropsEntry(nextProps);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { periods, tlog } = this.props;
    const { currentState, selectedEntryId, visibleMarkers } = this.state;

    return (
      periods !== nextProps.periods ||
      tlog.get('id') !== nextProps.tlog.get('id') ||
      currentState !== nextState.currentState ||
      selectedEntryId !== nextState.selectedEntryId ||
      visibleMarkers !== nextState.visibleMarkers
    );
  }
  componentWillUnmount() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    if (this.scrollHandler) {
      $(document).off('waypoint.trigger', this.scrollHandler);
    }
  }
  getCalendarData(props) {
    const { currentUser: { id }, tlog, getCalendar } = props;
    const tlogId = tlog.get('id');

    if (tlogId && !tlog.get('isFlow') && tlog.get('slug') !== TLOG_SLUG_ANONYMOUS &&
        (!tlog.get('isPrivacy') || tlogId === id || tlog.myRelationship === RELATIONSHIP_STATE_FRIEND)) {
      getCalendar(tlogId);
    }
  }
  updatePropsEntry({ selectedEntry }) {
    this.updateSelectedEntry(
      selectedEntry.get('id'),
      selectedEntry.get('createdAt', (new Date()).toISOString())
    );
  }
  updateSelectedEntry(id, time) {
    this.setState({
      headerDate: moment(time),
      selectedEntryId: id,
    });
  }
  setVisibleMarkers() {
    const $post = $(TARGET_POST_CLASS);
    this.setState({ visibleMarkers: $post.map(function() { parseInt(this.dataset.id); }).get() });
  }
  onMouseEnter() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    if (this.state.currentState === CALENDAR_CLOSED) {
      this.setState({currentState: CALENDAR_OPENED_BY_HOVER });
    }
  }
  onMouseLeave() {
    if (this.state.currentState === CALENDAR_OPENED_BY_HOVER) {
      this.timeout = window.setTimeout(
        () => this.setState({ currentState: CALENDAR_CLOSED }),
        MOUSE_LEAVE_TIMEOUT
      );
    }
  }
  onClick() {
    switch (this.state.currentState) {
    case CALENDAR_CLOSED:
      this.setState({ currentState: CALENDAR_OPENED_BY_CLICK });
      break;
    case CALENDAR_OPENED_BY_CLICK:
      this.setState({ currentState: CALENDAR_CLOSED });
      break;
    case CALENDAR_OPENED_BY_HOVER:
      this.setState({ currentState: CALENDAR_OPENED_BY_CLICK });
      break;
    }
  }
  isOpen() {
    return (this.state.currentState !== CALENDAR_CLOSED);
  }
  isOpenedByClick() {
    return (this.state.currentState === CALENDAR_OPENED_BY_CLICK);
  }
  render() {
    const { periods } = this.props;

    if (periods.isEmpty()) {
      return null;
    }

    const calendarClasses = classnames({
      'calendar': true,
      'calendar--open': this.isOpen(),
      'calendar--closed': !this.isOpen(),
      'calendar--opened-by-click': this.isOpenedByClick(),
    });
    const { headerDate, selectedEntryId, visibleMarkers } = this.state;
    
    return (
      <nav
        className={calendarClasses}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {this.isOpen()
         ? periods.size > 0
           ? <CalendarTimeline
               periods={periods}
               selectedEntryId={selectedEntryId}
               visibleMarkers={visibleMarkers}
             />
           : <div className="grid-full text--center">
               <div className="grid-full__middle">
                 {periods.size === 0
                  ? <div>{i18n.t('calendar_empty')}</div>
                  : <span className="spinner spinner--24x24">
                      <span className="spinner__icon" />
                    </span>
                 }
               </div>
             </div>
         : <CalendarHeader date={headerDate} />
        }
      </nav>
    );
  }
}

Calendar.propTypes = {
  currentUser: PropTypes.object.isRequired,
  getCalendar: PropTypes.func.isRequired,
  periods: PropTypes.object.isRequired,
  selectedEntry: PropTypes.object,
  tlog: PropTypes.object.isRequired,
};

export default connect(
  (state, { entryId, tlog }) => {
    const { entities } = state;
    const periods = entities.getIn([ 'calendar', String(tlog.get('id')), 'periods' ], emptyPeriods);
    const [ firstEntryId ] = state.tlogEntries.data.items;
    const selectedEntry = entities.getIn([ 'entry', String(entryId || firstEntryId) ], emptySelectedEntry);

    return {
      periods,
      selectedEntry,
      currentUser: state.currentUser.data,
    };
  },
  { getCalendar }
)(Calendar);
