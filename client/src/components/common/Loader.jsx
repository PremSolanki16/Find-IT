import React from 'react';
import './Loader.css';

export const Loader = ({
  size = 'md',
  text = 'Loading...',
  fullPage = false
}) => {
  const content = (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="loader-fullpage">{content}</div>;
  }

  return content;
};

export default Loader;

