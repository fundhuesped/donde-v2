import React from 'react';

type Props = React.PropsWithChildren<{}>;

const MainContainer = (props: Props) => {
  return <main className={'bg-donde-gray-200 px-4 mt-6 rounded-t-3xl flex-grow'}>{props.children}</main>;
};

export default MainContainer;
