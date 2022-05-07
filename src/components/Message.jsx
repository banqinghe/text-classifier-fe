import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import { IconInfo } from '../icons';
import cn from 'classnames';

function Message(props) {
  const { text } = props;
  const [show, setShow] = useState(false);
  const [disappear, setDisappear] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 200);
    setTimeout(() => {
      setDisappear(true);
    }, 2000);
  }, []);

  // console.log({
  //   text,
  //   show,
  //   disappear,
  // });

  return (
    <div
      className={cn(
        'transform transition relative top-2 flex items-center gap-3 px-3 py-2 shadow rounded bg-white',
        {
          'translate-y-0': show,
          '-translate-y-4 opacity-0': !show,
          'opacity-0': disappear,
        }
      )}
    >
      <IconInfo className="text-lg" />
      <span>{text}</span>
    </div>
  );
}

let running = false;

export default function message(text) {
  if (running) {
    return;
  }
  let messageContainer = document.getElementById('message-container');
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    messageContainer.className =
      'fixed top-0 right-0 left-0 flex justify-center';
    document.body.append(messageContainer);
  }
  const root = ReactDOM.createRoot(messageContainer);
  root.render(<Message text={text} />);
  running = true;
  setTimeout(() => {
    running = false;
    root.unmount();
    messageContainer.remove();
  }, 2500);
}
