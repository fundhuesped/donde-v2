import { ChevronLeftIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React from 'react';

type BackButtonProps = React.PropsWithChildren<{
  className?: string;
}>;

export const BackButton = React.memo<BackButtonProps>((props) => {
  const { className } = props;
  const router = useRouter();
  const navigateBack = () => router.back();
  return (
    <button className={'h-6 mr-2 ' + className} onClick={navigateBack} aria-label={'Go back'}>
      <ChevronLeftIcon className="w-8 -m-2 text-dark-gray" />
    </button>
  );
});
