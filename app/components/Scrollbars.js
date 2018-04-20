import React from 'react';
import PropTypes from 'prop-types';

const scrollThumbStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 'inherit'
};

const ScrollThumb = ({ ...props }) => {
  const { style, ...rest } = props;
  return <div style={Object.assign({}, style, scrollThumbStyle)} {...rest} />;
};
ScrollThumb.propTypes = {
  style: PropTypes.object.isRequired,
};

const scrollbarProps = {
  height: '100%',
  autoHide: true,
  hideTracksWhenNotNeeded: true,
  renderThumbVertical: ScrollThumb
};

export default scrollbarProps;
