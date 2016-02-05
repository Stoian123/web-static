/*global i18n */
import React, { PropTypes } from 'react';
import Spinner from '../../../../shared/react/components/common/Spinner';

class UserOnboardingMoreButton {
  showMore() {
    const { isLoading, showMore: propsShowMore } = this.props; //FIXME: https://github.com/babel/babel/pull/3256

    !isLoading && propsShowMore();
  }
  render() {
    const { isLoading } = this.props;

    return (
      <div className="popup__more">
        <button className="more-button" onClick={this.showMore.bind(this)}>
          {isLoading ? <Spinner size={24} /> : i18n.t('load_more_button')}
        </button>
      </div>
    );
  }
}

UserOnboardingMoreButton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  showMore: PropTypes.func.isRequired,
};

export default UserOnboardingMoreButton;