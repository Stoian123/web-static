FeedStore         = require '../../stores/feed'
ComponentMixin    = require '../../mixins/component'
ConnectStoreMixin = require '../../../../shared/react/mixins/connectStore'
FeedMixin         = require './mixins/feed'
FeedViewActions   = require '../../actions/view/feed'
Feed              = require './feed'
{ PropTypes } = React

FeedLive = React.createClass
  displayName: 'FeedLive'
  mixins: [ConnectStoreMixin(FeedStore), FeedMixin, ComponentMixin]

  propTypes:
    limit: PropTypes.number

  render: ->
    <Feed entries={ @state.entries }
          loading={ @isLoadingState() }
          everythingLoaded={ @state.everythingLoaded }
          onLoadMore={ @loadMoreEntries } />

  loadMoreEntries: ->
    sinceEntryId = @state.entries[@state.entries.length - 1].id
    limit        = @props.limit

    @activateLoadingState()

    FeedViewActions.loadLiveEntries sinceEntryId, limit
      .then @activateShowState
      .fail @activateErrorState

module.exports = FeedLive