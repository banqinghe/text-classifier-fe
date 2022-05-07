import { forwardRef } from 'react';
import cn from 'classnames';

const Input = forwardRef((props, ref) => {
  const { className, type = 'text', name, id, placeholder, min } = props;

  return (
    <input
      ref={ref}
      className={cn(
        'block focus:outline-light-400 border text-sm p-1.5',
        className
      )}
      type={type}
      min={min}
      name={name}
      placeholder={placeholder}
      id={id}
      title={placeholder}
    />
  );
});

export default Input;
