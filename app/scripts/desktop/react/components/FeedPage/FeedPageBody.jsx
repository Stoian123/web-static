import React, { Component, PropTypes } from 'react';
import queryString from 'query-string';
import LiveLoadButtonContainer from './LiveLoadButtonContainer';
import BestLoadButtonContainer from './BestLoadButtonContainer';
import FriendsLoadButtonContainer from './FriendsLoadButtonContainer';
import AnonymousLoadButtonContainer from './AnonymousLoadButtonContainer';
import LiveFlowLoadButtonContainer from './LiveFlowLoadButtonContainer';
import EntryBricksContainer from '../EntryBricks/EntryBricksContainer';
import EntryTlogsContainer from '../EntryTlogs/EntryTlogsContainer';
import FeedFilters from '../FeedFilters';
import PreviousEntriesButton from '../common/PreviousEntriesButton';
import Routes from '../../../../shared/routes/routes';

import {
  FEED_TYPE_ANONYMOUS,
  FEED_TYPE_LIVE,
  FEED_TYPE_FRIENDS,
  FEED_TYPE_BEST,
  FEED_TYPE_LIVE_FLOW,
} from '../../constants/FeedConstants';

const LoadButtons = {
  [FEED_TYPE_LIVE]: { component: LiveLoadButtonContainer, href: Routes.live_feed_path() },
  [FEED_TYPE_BEST]: { component: BestLoadButtonContainer, href: Routes.best_feed_path() },
  [FEED_TYPE_FRIENDS]: { component: FriendsLoadButtonContainer, href: Routes.friends_feed_path() },
  [FEED_TYPE_ANONYMOUS]: { component: AnonymousLoadButtonContainer, href: Routes.live_anonymous_feed_path() },
  [FEED_TYPE_LIVE_FLOW]: { component: LiveFlowLoadButtonContainer, href: Routes.live_flows_feed_path() },
};

class FeedPageBody extends Component {
  renderFilters() {
    const { entries_info: { limit }, feedType, locale,
            navFilters, navViewMode, viewMode } = this.props;
    const queryHash = queryString.parse(window.location.search);

    if (!(navFilters.items.length || navViewMode)) {
      return null;
    }

    let UnreadButton = LoadButtons[feedType];

    const button = UnreadButton
      ? queryHash.since_entry_id
        ? <PreviousEntriesButton href={UnreadButton.href} />
        : <UnreadButton.component limit={limit} locale={locale} />
      :null;

    return (
      <FeedFilters
        navFilters={navFilters}
        navViewMode={navViewMode}
        viewMode={viewMode}
      >
        {button}
      </FeedFilters>
    );
  }

  render() {
    const { viewMode } = this.props;

    return (
      <div className="page-body">
        <div className="layout-outer">
          {viewMode === 'feed'
             ? <EntryBricksContainer {...this.props}>
                 {this.renderFilters()}
               </EntryBricksContainer>
             : <div>
                 {this.renderFilters()}
                 <div className="content-area">
                   <div className="content-area__bg" />
                   <div className="content-area__inner">
                     <EntryTlogsContainer {...this.props} />
                   </div>
                 </div>
               </div>
          }
        </div>
      </div>
    );
  }
}

FeedPageBody.propTypes = {
  entries_info: PropTypes.object,
  feedType: PropTypes.oneOf([
    FEED_TYPE_ANONYMOUS,
    FEED_TYPE_LIVE,
    FEED_TYPE_FRIENDS,
    FEED_TYPE_BEST,
    FEED_TYPE_LIVE_FLOW,
  ]).isRequired,
  locale: PropTypes.string,
  navFilters: PropTypes.object,
  navViewMode: PropTypes.bool.isRequired,
  viewMode: PropTypes.oneOf(['feed', 'tlog']).isRequired,
};

FeedPageBody.defaultProps = {
  entries_info: {},
  navFilters: { active: null, items: [] },
  navViewMode: true,
  viewMode: 'tlog',
};

export default FeedPageBody;