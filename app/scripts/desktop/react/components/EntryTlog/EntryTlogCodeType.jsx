import React, { Component, PropTypes } from 'react';
import PrivacyBadge from '../common/PrivacyBadge';
import Text from '../../../../shared/react/components/common/Text';
import EntryTlogMetabar from './EntryTlogMetabar';
import EntryTlogActions from './EntryTlogActions';
import EntryTlogCommentsContainer from './EntryTlogCommentsContainer';
import EntryTlogContentLink from './EntryTlogContentLink';

class EntryTlogCodeType extends Component {
  startComment() {
    this.refs.comments.getWrappedInstance().startComment();
  }
  renderTitle() {
    const {
      entry,
    } = this.props;
    const title = entry.get('title');

    return !!title && (
      <h1 className="post__title">
        {title}
      </h1>
    );
  }
  renderActions() {
    return !!this.props.hasModeration && <EntryTlogActions {...this.props} />;
  }
  render() {
    const {
      entry,
      isInList,
    } = this.props;
    const isPrivate = entry.get('isPrivate');
    const text = entry.get('text');

    return (
      <span>
        <header className="post__header">
          {!!isPrivate && <PrivacyBadge />}
          {this.renderTitle()}
        </header>
        <EntryTlogContentLink entry={entry} show={isInList}>
          <div className="post__content">
            <pre>
              <Text value={text} withHTML />
            </pre>
          </div>
        </EntryTlogContentLink>
        <div className="post__meta">
          <EntryTlogMetabar {...this.props} onComment={this.startComment.bind(this)} />
        </div>
        {this.renderActions()}
        <EntryTlogCommentsContainer {...this.props} ref="comments" />
      </span>
    );
  }
}

EntryTlogCodeType.propTypes = {
  entry: PropTypes.object.isRequired,
  hasModeration: PropTypes.bool.isRequired,
  isInList: PropTypes.bool,
};

export default EntryTlogCodeType;
