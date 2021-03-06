classnames = require 'classnames'
NumberHelpers = require '../../../../../../shared/helpers/number'
{ PropTypes } = React

HeroTlogStatsItem = React.createClass
  displayName: 'HeroTlogStatsItem'

  propTypes:
    count:   PropTypes.number.isRequired
    title:   PropTypes.string.isRequired
    href:    PropTypes.string
    onClick: PropTypes.func

  render: ->
    itemClasses = classnames('hero__stats-item', {
      'hero__stats-item-handler': @props.onClick
    })

    return <div className={ itemClasses }
                onClick={ @handleClick }>
             { @renderItem() }
           </div>

  renderItem: ->
    count = NumberHelpers.reduceNumber @props.count

    if @props.href
      <a href={ @props.href }
         title={ @props.count + ' ' + @props.title }
         className="hero__stats-link">
        <strong className="hero__stats-value">
          { count }
        </strong>
        <span>
          { @props.title }
        </span>
      </a>
    else
      <span>
        <strong className="hero__stats-value">
          { count }
        </strong>
        <span>
          { @props.title }
        </span>
      </span>

  handleClick: (e) ->
    if @props.onClick
      e.preventDefault()
      @props.onClick()

module.exports = HeroTlogStatsItem