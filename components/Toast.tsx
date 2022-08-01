import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const Toast = (props: { title: string; message: string }) => {
  const { title, message } = props;
  return (
    <div className={'outline outline-1 outline-orange-400 rounded-xl flex flex-col p-4'}>
      <div className={'flex pb-2'}>
        <ExclamationCircleIcon className={'h-6 w-5 text-orange-400 mr-4'} />
        <p className={'text-orange-400'}>{title}</p>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
