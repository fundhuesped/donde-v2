import React from 'react';

type Props = React.PropsWithChildren<{}>;

const EstablishmentSideBar = React.memo<Props>((props) => {
  const { children } = props;
  return (
    <div className="mt-0 lg:mt-6 flex h-full lg:max-h-[95vh]">
      <div className={'hidden lg:block w-1/4'}></div>
      <div className={'w-full mr-0 flex flex-col justify-center lg:flex-row lg:flex-wrap lg:w-3/4 lg:mr-5 p-0'}>{children}</div>
    </div>
  );
});

export default EstablishmentSideBar;
