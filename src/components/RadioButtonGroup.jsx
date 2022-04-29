import { useState } from 'react';

export default function RadioButtonGroup(props) {
  const { options, value, onChange } = props;

  return (
    <div className="relative bg-light-400 rounded">
      <div
        className="flex p-1 select-none shadow-inner rounded"
        onChange={onChange}
      >
        {options.map((option, index) => (
          <label
            htmlFor={`radio-group-${option.value}`}
            key={index}
            className="flex-1 py-1.5 z-10 text-center cursor-pointer"
          >
            {option.label}
            <input
              className="hidden"
              type="radio"
              id={`radio-group-${option.value}`}
              value={option.value}
              name={option.name || 'radio-button-group'}
            />
          </label>
        ))}
      </div>
      <div
        className="absolute bg-white z-0 rounded transition shadow-sm"
        style={{
          top: 4,
          width: 'calc(50% - 4px)',
          height: 'calc(100% - 8px)',
          transform: `translateX(${value ? '4px' : 'calc(100% + 4px)'})`,
        }}
      ></div>
    </div>
  );
}
