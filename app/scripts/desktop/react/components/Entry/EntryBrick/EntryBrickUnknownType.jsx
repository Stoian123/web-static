/*global i18n */
import React, { PropTypes } from 'react';
import EntryBrickMetabar from './EntryBrickMetabar';
import EntryBrickActions from './EntryBrickActions';
import * as ProjectTypes from '../../../../../shared/react/ProjectTypes';

function EntryBrickUnknownType({ entry, hasModeration, host_tlog_id, onEntryAccept, onEntryDecline }) {
  function renderBrickTitle() {
    return (
      <a
        className="brick__link"
        href={entry.entry_url}
        title={entry.title}
      >
        <h2 className="brick__title">
          {entry.title}
        </h2>
      </a>
    );
  }

  return (
    <span>
      <div className="brick__body">
        {entry.title && renderBrickTitle()}
        <div className="brick__text">
          <a
            className="brick__link"
            href={entry.url}
            title={entry.title}
          >
            {i18n.t('entry.unknown_type')}
          </a>
        </div>
      </div>
      <div className="brick__meta">
        <EntryBrickMetabar
          entry={entry}
          host_tlog_id={host_tlog_id}
        />
      </div>
      <EntryBrickActions
        hasModeration={hasModeration}
        onAccept={onEntryAccept}
        onDecline={onEntryDecline}
      />
    </span>
  );
}

EntryBrickUnknownType.propTypes = {
  entry: ProjectTypes.tlogEntry.isRequired,
  hasModeration: PropTypes.bool.isRequired,
  host_tlog_id: PropTypes.number,
  onEntryAccept: PropTypes.func.isRequired,
  onEntryDecline: PropTypes.func.isRequired,
};

export default EntryBrickUnknownType;