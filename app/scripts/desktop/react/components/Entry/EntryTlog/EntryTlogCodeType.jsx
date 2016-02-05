import React, { PropTypes } from 'react';
import Voting from '../../common/Voting';
import PrivacyBadge from '../../common/PrivacyBadge';
import Text from '../../../../../shared/react/components/common/Text';
import EntryTlogMetabar from './EntryTlogMetabar';
import EntryTlogActions from './EntryTlogActions';
import EntryTlogComments from './EntryTlogComments';
import EntryTlogContentLink from './EntryTlogContentLink';

class EntryTlogCodeType {
  startComment() {
    this.refs.comments.startComment();
  }
  renderVoting() {
    const { id, is_voteable, rating } = this.props.entry;

    if (is_voteable) {
      return (
        <Voting entryID={id} rating={rating} />
      );
    }
  }
  renderTitle() {
    const { title } = this.props.entry;

    if (title) {
      return (
        <h1 className="post__title">{title}</h1>
      );
    }
  }
  renderActions() {
    if (this.props.hasModeration) {
      return <EntryTlogActions {...this.props} />;
    }
  }
  render() {
    const { isInList, entry: { is_private, text, url } } = this.props;

    return (
      <span>
        <header className="post__header">
          {this.renderVoting()}
          {is_private && <PrivacyBadge />}
          {this.renderTitle()}
        </header>
        <EntryTlogContentLink show={isInList} url={url}>
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
        <EntryTlogComments {...this.props} ref="comments" />
      </span>
    );
  }
}

EntryTlogCodeType.propTypes = {
  commentator: PropTypes.object,
  entry: PropTypes.object.isRequired,
  hasModeration: PropTypes.bool.isRequired,
  isInList: PropTypes.bool,
};

export default EntryTlogCodeType;