import React, { Component, PropTypes } from 'react';
import ItemEntryPreviewImage from '../Conversations/List/ItemEntryPreviewImage';
import GroupSettingsActions from '../../../actions/GroupSettingsActions';

class GroupHeaderForm extends Component {
  handleAvatarChange(ev) {
    const reader = new window.FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        GroupSettingsActions.updateSettings({
          avatar: {
            isFile: true,
            url: ev.target.result,
            geometry: {
              width: img.width,
              height: img.height,
            },
          },
        });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(ev.target.files[0]);
  }
  handleTopicChange(ev) {
    GroupSettingsActions.updateSettings({ topic: ev.target.value });
  }
  render() {
    const { avatar, topic } = this.props;

    return (
      <div className="messages__dialog messages__dialog--discussion">
        <div className="messages__user-avatar">
          {avatar && avatar.url
           ? <ItemEntryPreviewImage image={avatar} isRawUrl={avatar.isFile} />
           : <i className="icon icon--instagram-circle" />
          }
          <input
            accept="image/png,image/jpeg,image/gif"
            className="messages__group-avatar-input"
            onChange={this.handleAvatarChange.bind(this)}
            size="10"
            type="file"
          />
        </div>
        <div className="messages__dialog-text --group-header">
          <div className="messages__entry-data-container">
            <div className="messages__topic-name">
              <input
                onChange={this.handleTopicChange}
                placeholder={"Название групповой беседы"}
                type="text"
                value={topic}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GroupHeaderForm.propTypes = {
  avatar: PropTypes.object,
  topic: PropTypes.string,
};

export default GroupHeaderForm;
