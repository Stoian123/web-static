import React, { PropTypes } from 'react';
import { TLOG_SLUG_ANONYMOUS } from '../../../../shared/constants/Tlog';
import * as ProjectTypes from '../../../../shared/react/ProjectTypes';
import RelationButton from '../common/RelationButton';

import HeroProfileDropdownMenu from './HeroProfileDropdownMenu';
import WriteMessageButton from './WriteMessageButton';

function HeroProfileActions({ relationship, user }) {
  const isAnonymousTlog = user.slug === TLOG_SLUG_ANONYMOUS;

  return (
    <div className="hero__actions hero__actions--visible">
      <RelationButton
        objectID={CurrentUserStore.getUserID()}
        relState={relationship}
        subjectID={user.id}
        subjectPrivacy={user.is_privacy}
      />
      {!isAnonymousTlog &&
       [ <WriteMessageButton
           key="write-message-button"
           user={user}
         />,
         <HeroProfileDropdownMenu
           key="ellipsis-button"
           status={relationship}
           userId={user.id}
         /> ]
      }
    </div>
  );
}

HeroProfileActions.propTypes = {
  relationship: PropTypes.string,
  user: ProjectTypes.heroUser,
};

export default HeroProfileActions;
