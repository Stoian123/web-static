###* @jsx React.DOM ###

window.PersonsPopup_FollowersPanel = PersonsPopup_FollowersPanel = React.createClass

  mixins:       [PersonsPopup_PanelMixin]
  relationUrl:  -> Routes.api.relationships_by_url 'friend'
  itemClass:    PersonsPopup_FollowerRelationship

module.exports = PersonsPopup_FollowersPanel