classnames = require 'classnames'
FeedToolbarList = require './feed/list'
ToolbarMixin    = require './mixins/toolbar'
{ PropTypes } = React

FeedToolbar = React.createClass
  displayName: 'FeedToolbar'
  mixins: [ToolbarMixin]

  propTypes:
    user: PropTypes.object

  render: ->
    toolbarClasses = classnames('toolbar__popup', {
      '__visible': @isOpenState()
    })

    return <nav className="toolbar toolbar--feed">
             <div className="toolbar__toggle"
                  onClick={ @toggleOpenState }>
               <i className="icon icon--ribbon" />
             </div>
             <div className={ toolbarClasses }>
               <FeedToolbarList user={ @props.user } />
             </div>
           </nav>

  toggleOpenState: ->
    html = document.querySelector 'html'

    html.classList.remove 'user-toolbar-open' if html.classList.contains 'user-toolbar-open'
    html.classList.toggle 'feed-toolbar-open'

    if @isOpenState() then @activateCloseState() else @activateOpenState()

module.exports = FeedToolbar