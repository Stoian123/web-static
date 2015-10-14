import React, { PropTypes } from 'react';
import EditorLayout from './Layout/Layout';
import EditorActions from './Actions/Actions';
import EditorTypeSwitcher from './TypeSwitcher/TypeSwitcher';
import EditorArea from './EditorArea';
import { TLOG_ENTRY_TYPE_ANONYMOUS } from '../../../../shared/constants/TlogEntry';

class Editor {
  renderTypeSwitcher() {
    const { canChangeType, entryType, loading, onChangeType, tlogType } = this.props;
    if (tlogType !== TLOG_ENTRY_TYPE_ANONYMOUS) {
      return (
        <EditorTypeSwitcher
          canChangeType={canChangeType}
          entryType={entryType}
          loading={loading}
          onChangeType={onChangeType}
        />
      );
    }
  }
  render() {
    const { backUrl, entry, entryPrivacy, entryType, isPinned, loading, onChangePrivacy,
            onPinEntry, onSaveEntry, pinnedTill, tlog, tlogType, user: { id, features } } = this.props;
    return (
      <EditorLayout backUrl={backUrl} loading={loading}>
        <EditorActions
          canPinEntry={features.fixup}
          entryPrivacy={entryPrivacy}
          isPinned={isPinned}
          loading={loading}
          onChangePrivacy={onChangePrivacy}
          onPinEntry={onPinEntry}
          onSaveEntry={onSaveEntry}
          pinnedTill={pinnedTill}
          tlog={tlog}
          tlogType={tlogType}
          userID={id}
        />
        <EditorArea
          entry={entry}
          entryPrivacy={entryPrivacy}
          entryType={entryType}
          loading={loading}
        />
        {this.renderTypeSwitcher()}
      </EditorLayout>
    );
  }
}

Editor.propTypes = {
  backUrl: PropTypes.string,
  canChangeType: PropTypes.bool.isRequired,
  entry: PropTypes.object.isRequired,
  entryPrivacy: PropTypes.string.isRequired,
  entryType: PropTypes.string.isRequired,
  isPinned: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onChangePrivacy: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onPinEntry: PropTypes.func.isRequired,
  onSaveEntry: PropTypes.func.isRequired,
  pinnedTill: PropTypes.string,
  tlog: PropTypes.object,
  tlogType: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default Editor;
