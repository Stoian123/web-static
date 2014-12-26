{ PropTypes } = React

module.exports = React.createClass
  displayName: 'HeroCloseButton'

  propTypes:
    onClick: PropTypes.func.isRequired

  render: ->
    <div className="hero__close"
         onClick={ @props.onClick }>
      <i className="icon icon--cross" />
    </div>