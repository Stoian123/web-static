###* @jsx React.DOM ###

window.PostEditor_VideoEditor = React.createClass
  mixins: ['PostEditor_PersistenceMixin', 'ReactActivitiesUser']

  getInitialState: ->
    embedUrl:  @props.entry.video_url
    embedHtml: @props.entry.iframely?.html
    title:     @props.entry.title

  render: ->
    cx = React.addons.classSet post: true, 'post--video': true, 'post--edit': true, 'state--loading': @hasActivities()
    `<article className={cx}>
      <div className="post__content">
        <VideoMediaBox activitiesHandler={this.activitiesHandler}
                       embedUrl={this.state.embedUrl}
                       embedHtml={this.state.embedHtml}
                       onChange={this.getChangeCallback('video_url')}
                       onClean={this.cleanTitle}
                       onSuccessLoad={this.successLoaded}>
          <MediaBox_VideoWelcome />
        </VideoMediaBox>
        <TastyEditor ref="titleEditor"
                     placeholder="Придумайте подпись, примерно 280 символов (не обязательно)"
                     mode="partial"
                     content={this.state.title}
                     isLoading={ this.hasActivities() }
                     onChange={this.getChangeCallback('title')} />
      </div>
    </article>`

  cleanTitle: ->
    @setState title: ''

  successLoaded: (iframely) ->
    @setState
      embedUrl:  iframely.url
      embedHtml: iframely.html
      title:     iframely.meta.description || iframely.meta.title

  data: ->
    title:     @refs.titleEditor.content()
    video_url: @state.embedUrl
