import classNames from 'classnames';
import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

const MainContainer = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, className, ...rest } = props;

  return (
    <main ref={ref} className={classNames('bg-ultra-light-gray px-content rounded-t-3xl lg:rounded-3xl', className)} {...rest}>
      {children}
    </main>
  );
});
export default MainContainer;
