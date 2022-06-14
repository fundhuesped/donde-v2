import React from 'react';
import classNames from 'classnames';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

const MainContainer = (props: Props) => {
  const { children, className } = props;

  return <main className={classNames(className, 'bg-ultra-light-gray px-4 mt-6 rounded-t-3xl flex-grow')}>{children}</main>;
};

export default MainContainer;
