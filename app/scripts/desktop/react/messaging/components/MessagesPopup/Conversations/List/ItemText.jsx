/*global i18n */
import React, { Component, PropTypes } from 'react';
import MsgUserAvatar from '../../MsgUserAvatar';
import ItemMain, { getLastMsgTxt } from './ItemMain';
import { CONVERSATION_PIC_SIZE } from './Item';

class ItemText extends Component {
  renderLastMessage() {
    const { last_message, recipient_id, user_id, typing } = this.props.conversation;
    const lastMessageText = typing[recipient_id]
            ? i18n.t('messenger.typing')
            : last_message ? getLastMsgTxt(last_message) : '';
    const showAvatar =  !typing[recipient_id]
            && last_message
            && last_message.author
            && last_message.author.id === user_id;

    return lastMessageText
      ? <div className="messages__last-message">
          {showAvatar && <MsgUserAvatar size={20} user={last_message.author} />}
          <span dangerouslySetInnerHTML={{ __html: lastMessageText }} />
        </div>
      : <noscript />;
  }
  render() {
    const { conversation: { created_at, last_message, not_disturb, recipient, unread_messages_count, user_id },
            hasUnread, hasUnreceived, onClick } = this.props;

    return (
      <ItemMain
        createdAt={created_at}
        hasUnread={hasUnread}
        hasUnreceived={hasUnreceived}
        isMuted={not_disturb}
        lastMessage={last_message}
        onClick={onClick}
        unreadCount={unread_messages_count}
        userId={user_id}
      >
        <span className="messages__user-avatar">
          <MsgUserAvatar size={CONVERSATION_PIC_SIZE} user={recipient} />
        </span>
        <div className="messages__dialog-text">
          <div className="messages__user-name">
            {recipient.slug}
          </div>
          {this.renderLastMessage()}
        </div>
      </ItemMain>
    );
  }
}

ItemText.propTypes = {
  conversation: PropTypes.object.isRequired,
  hasUnread: PropTypes.bool,
  hasUnreceived: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ItemText;
