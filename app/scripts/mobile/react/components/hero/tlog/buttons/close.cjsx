{ PropTypes } = React

HeroTlogCloseButton = React.createClass
  displayName: 'HeroTlogCloseButton'

  propTypes:
    onClick: PropTypes.func.isRequired

  render: ->
    <div className="hero__close"
         onClick={ @props.onClick }>
      <i className="icon icon--cross" />
    </div>

module.exports = HeroTlogCloseButton