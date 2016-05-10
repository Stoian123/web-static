import React, { Component, PropTypes } from 'react';
import PrivacyBadge from '../common/PrivacyBadge';
import Text from '../../../../shared/react/components/common/Text';
import ImageAttachmentsCollage from '../../../../shared/react/components/common/imageAttachmentsCollage';
import EntryTlogMetabar from './EntryTlogMetabar';
import EntryTlogActions from './EntryTlogActions';
import EntryTlogComments from './EntryTlogComments';
import EntryTlogContentLink from './EntryTlogContentLink';

class EntryTlogImageType extends Component {
  startComment() {
    this.refs.comments.startComment();
  }
  renderActions() {
    if (this.props.hasModeration) {
      return <EntryTlogActions {...this.props} />;
    }
  }
  render() {
    const { entry, isInList } = this.props;
    const { imageAttachments, isPrivate, title } = entry;

    return (
      <span>
        <div className="post__content">
          <EntryTlogContentLink entry={entry} show={isInList}>
            <ImageAttachmentsCollage imageAttachments={imageAttachments} width={712} />
          </EntryTlogContentLink>
          {isPrivate && <PrivacyBadge />}
          <EntryTlogContentLink entry={entry} show={isInList}>
            <Text value={title} withHTML />
          </EntryTlogContentLink>
        </div>
        <div className="post__meta">
          <EntryTlogMetabar {...this.props} onComment={this.startComment.bind(this)} />
        </div>
        {this.renderActions()}
        <EntryTlogComments {...this.props} ref="comments" />
      </span>
    );
  }
}

EntryTlogImageType.propTypes = {
  commentator: PropTypes.object,
  entry: PropTypes.object.isRequired,
  hasModeration: PropTypes.bool.isRequired,
  isInList: PropTypes.bool,
};

export default EntryTlogImageType;
