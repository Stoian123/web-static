/*global CurrentUserStore */
import BaseStore from '../../stores/BaseStore';
import MessagingDispatcher from '../MessagingDispatcher';
import ConversationsStore from '../stores/ConversationsStore';
import { PUBLIC_CONVERSATION, GROUP_CONVERSATION } from '../constants/ConversationConstants';

const _messages = {};
const _allMessagesLoaded = {};
let _selectedIds = [];

const MessagesStore = Object.assign(
  new BaseStore(),
  {
    pushMessages(conversationId, messages) {
      const clonedMessages = (_messages[conversationId] || []).slice(0);

      messages.forEach((message) => {
        if (!this.isMessageExists(conversationId, message)) {
          clonedMessages.push(message);
        }
      });

      _messages[conversationId] = clonedMessages;
    },
    
    unshiftMessages(conversationId, messages) {
      const loadedMessages = messages.reverse();
      const clonedMessages = _messages[conversationId].slice(0);

      loadedMessages.forEach((loadedMessage) => clonedMessages.unshift(loadedMessage));

      _messages[conversationId] = clonedMessages;
    },
    
    updateMessage(conversationId, data) {
      const messages = _messages[conversationId] || [];

      messages.forEach((message) => {
        if (message.uuid === data.uuid) {
          if (message.read_at && !data.read_at) { //FIXME temporal fix for race condition
            delete(data.read_at);
          }
          Object.assign(message, data);
        }
      });
    },

    getMessages(conversationId) {
      return _messages[conversationId] || [];
    },

    getMessageById(id, conversationId) {
      const messages = _messages[conversationId] || [];

      return messages.filter((msg) => msg.id === id)[0];
    },

    getMessageInfo(message, conversationId) {
      const conversation = ConversationsStore.getConversation(conversationId);
      const currentUser  = CurrentUserStore.getUser();
      if ([ PUBLIC_CONVERSATION, GROUP_CONVERSATION ].indexOf(conversation.type) > -1) {
        const msgAuthor = conversation.users.filter((u) => u.id === message.user_id)[0];

        return ({
          type: message.user_id === currentUser.id ? 'outgoing' : 'incoming',
          user: msgAuthor,
        });
      } else {
        const recipient = conversation.recipient;

        if (recipient.id === message.recipient_id) {
          return { type: 'outgoing', user: currentUser };
        } else {
          return { type: 'incoming', user: recipient };
        }
      }
    },

    isMessageExists(conversationId, message) {
      const messages = (_messages[conversationId] || [])
              .filter((msg) => msg.uuid === message.uuid);

      return !!messages.length;
    },

    isAllMessagesLoaded(conversationId) {
      return _allMessagesLoaded[conversationId];
    },

    sortByAsc(conversationId) {
      const clonedMessages = _messages[conversationId].slice(0);
      clonedMessages.sort((a, b) => a.id - b.id);

      _messages[conversationId] = clonedMessages;
    },

    addToSelection(id) {
      if (_selectedIds.indexOf(id) < 0) {
        _selectedIds.push(id);
      }
    },

    removeFromSelection(id) {
      const idx = _selectedIds.indexOf(id);
      if (idx > -1) {
        _selectedIds.splice(idx, 1);
      }
    },

    toggleSelection(id) {
      const idx = _selectedIds.indexOf(id);

      if (idx > -1) {
        this.removeFromSelection(id);
      } else {
        this.addToSelection(id);
      }
    },

    resetSelection() {
      _selectedIds = [];
    },

    getSelection() {
      return _selectedIds;
    },

    isSelected(id) {
      return (_selectedIds.indexOf(id) > -1);
    },

    canDelete() {
      return _selectedIds.length > 0;
    },

    canDeleteEverywhere(conversationId) {
      let msg;

      return (_selectedIds.filter((id) => {
        if ((msg = this.getMessageById(id, conversationId))) {
          const msgInfo = this.getMessageInfo(msg, conversationId);

          return msgInfo.type === 'incoming';
        } else {
          return false;
        }
      })).length === 0 && this.canDelete();
    },

    deleteMessages(conversationId, deleted) {
      const messages = _messages[conversationId] || [];

      _selectedIds = _selectedIds.filter((id) => deleted.indexOf(id) < 0);
      _messages[conversationId] = messages.filter((msg) => deleted.indexOf(msg.id) < 0);
    },

    deleteUserMessages(conversationId, deleted) {
      const messages = _messages[conversationId] || [];
      const deletedHash = deleted.reduce((acc, { id, content }) => {
        return acc[id] = content, acc;
      }, {});
      const deletedIds = Object.keys(deletedHash);

      _selectedIds = _selectedIds.filter((id) => deletedIds.indexOf(id) < 0);
      messages.forEach((msg) => {
        let content_html = deletedHash[msg.id];
        if (content_html) {
          Object.assign(msg, { content_html });
        }
      });
    },
  }
);

MessagesStore.dispatchToken = MessagingDispatcher.register(({ action }) => {
  switch (action.type) {
  case 'messagesLoaded':
    MessagesStore.pushMessages(action.conversationId, action.messages);
    MessagesStore.sortByAsc(action.conversationId);
    MessagesStore.emitChange();
    break;
  case 'moreMessagesLoaded':
    _allMessagesLoaded[action.conversationId] = action.allMessagesLoaded;

    MessagesStore.unshiftMessages(action.conversationId, action.messages);
    MessagesStore.emitChange();
    break;
  case 'messagesUpdated':
    action.messages.forEach((message) => (
      MessagesStore.updateMessage(action.conversationId, message)
    ));

    MessagesStore.emitChange();
    break;
  case 'messageReceived':
    const message = Object.assign(action.message, { sendingState: null });

    if (MessagesStore.isMessageExists(action.conversationId, message)) {
      MessagesStore.updateMessage(action.conversationId, message);
    } else {
      MessagesStore.pushMessages(action.conversationId, [ message ]);
      MessagesStore.sortByAsc(action.conversationId);
    }

    MessagesStore.emitChange();
    break;
  case 'messageSubmitted':
    MessagesStore.pushMessages(action.conversationId, [ action.message ]);
    MessagesStore.emitChange();
    break;
  case 'messageSendingError':
    MessagesStore.updateMessage(action.conversationId, {
      uuid: action.uuid,
      sendingState: 'error',
    });
    MessagesStore.emitChange();
    break;
  case 'messagesToggleSelection':
    MessagesStore.toggleSelection(action.id);
    MessagesStore.emitChange();
    break;
  case 'closeMessagesPopup':
  case 'startSelect':
  case 'stopSelect':
  case 'openConversation':
  case 'openConversationList':
  case 'messagesResetSelection':
    MessagesStore.resetSelection();
    MessagesStore.emitChange();
    break;
  case 'deleteMessages':
    MessagesStore.deleteMessages(action.conversationId, action.messages);
    MessagesStore.emitChange();
    break;
  case 'deleteUserMessages':
    MessagesStore.deleteUserMessages(action.conversationId, action.messages);
    MessagesStore.emitChange();
    break;
  };
});

export default MessagesStore;
