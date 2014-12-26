cx = require 'react/lib/cx'
{ PropTypes } = React

ToolbarItem = React.createClass

  propTypes:
    icon:     PropTypes.string.isRequired
    title:    PropTypes.string.isRequired
    href:     PropTypes.string
    active:   PropTypes.bool
    disabled: PropTypes.bool
    onSelect: PropTypes.func

  getDefaultProps: ->
    active:   false
    disabled: false

  render: ->
    toolbarItemClasses = cx
      'toolbar__popup-item': true
      'state--active': @props.active
      'state--disabled': @props.disabled

    return <li className={ toolbarItemClasses }>
             <a href={ this.props.href }
                className="toolbar__popup-link"
                onClick={ this.handleSelect }>
               <i className={ "icon " + this.props.icon } />
               { this.props.title }
             </a>
           </li>

  handleSelect: (e) ->
    if !@props.href && !@props.disabled
      e.preventDefault()
      @props.onSelect()

module.exports = ToolbarItem