import classNames from 'classnames';
import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
  heightStyle?: string;
}>;

const MainContainer = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, className, heightStyle, ...rest } = props;

  return (
    <main
      ref={ref}
      style={{ height: `${heightStyle}` }}
      className={classNames('bg-ultra-light-gray px-content rounded-t-3xl lg:rounded-3xl flex-grow', className)}
      {...rest}
    >
      {children}
    </main>
  );
});
export default MainContainer;
