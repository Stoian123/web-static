import React, { PropTypes } from 'react';
import MetabarAuthor from '../common/MetabarAuthor';
import EntryTlogMetabarComments from './EntryTlogMetabarComments';
import EntryTlogMetabarDate from './EntryTlogMetabarDate';
import EntryTlogMetabarTags from './EntryTlogMetabarTags';
import EntryTlogMetabarActions from './EntryTlogMetabarActions';
import EntryTlogMetabarVoting from './EntryTlogMetabarVoting';
import EntryTlogMetabarShare from './EntryTlogMetabarShare';

function EntryTlogMetabar(props) {
  function renderTags() {
    return (
      <EntryTlogMetabarTags
        tags={props.entry.tags}
        userSlug={props.entry.tlog.slug}
      />
    );
  }

  const { commentator, entry, host_tlog_id, isFeed, onComment } = props;

  return (
    <span className="meta-bar">
      <EntryTlogMetabarVoting entry={entry} />
      <EntryTlogMetabarComments
        commentator={commentator}
        commentsCount={entry.comments_count}
        onComment={onComment}
        url={entry.url}
      />
      <EntryTlogMetabarShare commentator={commentator} entry={entry} />
      <MetabarAuthor
        author={entry.author}
        hostTlogId={host_tlog_id}
        tlog={entry.tlog}
      />
      <EntryTlogMetabarDate entry={entry} isFeed={isFeed} />
      {entry.tags && entry.tags.length && renderTags()}
      <EntryTlogMetabarActions {...props} />
    </span>
  );
}

EntryTlogMetabar.propTypes = {
  commentator: PropTypes.object,
  entry: PropTypes.object.isRequired,
  host_tlog_id: PropTypes.number,
  isFeed: PropTypes.bool,
  onComment: PropTypes.func,
};

export default EntryTlogMetabar;
