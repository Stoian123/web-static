RelationshipsStore = require '../../../stores/relationships'
{ PropTypes } = React

module.exports = React.createClass
  displayName: 'FollowStatus'

  propTypes:
    userId: PropTypes.number.isRequired  
    status: PropTypes.string.isRequired

  getInitialState: ->
    @getStateFromStore()

  componentDidMount: ->
    RelationshipsStore.addChangeListener @onStoreChange

  componentWillUnmount: ->
    RelationshipsStore.removeChangeListener @onStoreChange

  render: ->
    if @state.status?
      <span className={ 'follow-status __' + @state.status }>
        <i className="follow-status__icon" />
      </span>
    else null

  getStateFromStore: ->
    status: RelationshipsStore.getStatus(@props.userId) || @props.status

  onStoreChange: ->
    @setState @getStateFromStore()