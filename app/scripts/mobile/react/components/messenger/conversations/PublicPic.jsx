import React, { PropTypes } from 'react';
import Avatar from '../../common/avatar/avatar';
import PreviewImage from './PreviewImage';
import { CONVERSATION_PIC_SIZE } from './ConversationListItem';

function PublicPic({ entry }) {
  const { author, preview_image, title } = entry;
  const userpic = {
    default_colors: author.userpic.default_colors,
    symbol: title[0],
  };

  return preview_image
    ? <PreviewImage image={preview_image} />
    : <Avatar size={CONVERSATION_PIC_SIZE} userpic={userpic} />;
}

PublicPic.displayName = 'PublicPic';

PublicPic.propTypes = {
  entry: PropTypes.shape({
    preview_image: PropTypes.object,
    title: PropTypes.string,
  }).isRequired,
};

export default PublicPic;
