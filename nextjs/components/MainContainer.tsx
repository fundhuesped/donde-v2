import React from 'react';
import classNames from 'classnames';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

const MainContainer = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, className, ...rest } = props;

  return (
    <main ref={ref} className={classNames('bg-ultra-light-gray px-content rounded-t-3xl flex-grow', className)} {...rest}>
      {children}
    </main>
  );
});

export default MainContainer;
