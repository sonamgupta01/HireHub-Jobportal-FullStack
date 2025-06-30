import React from 'react'

const Button = ({onClickHandler,value,title}) => {
  const handleClick = (e) => {
    e.target.value = value;
    onClickHandler(e);
  };

  return (
    <button
      onClick={handleClick}
      value={value}
      className="px-4 py-1 border text-base hover:bg-blue-500 hover:text-white transition-colors duration-200 rounded"
    >
      {title}
    </button>
  );
}

export default Button