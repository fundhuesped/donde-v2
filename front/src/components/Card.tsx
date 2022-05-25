import classNames from 'classnames';
import React from 'react';
import { Icon, IconProps } from './Icon';

type CardProps = {
  className?: string;
};
export const Card = React.memo<CardProps>((props) => {
  const { className, ...restProps } = props;
  return <div className={classNames(className, 'bg-white flex flex-col drop-shadow-wingu rounded-2xl p-4')} {...restProps} />;
});

type CardHeaderProps = React.PropsWithChildren<{
  className?: string;
}>;
export const CardHeader = React.memo<CardHeaderProps>((props) => {
  const { className, children, ...restProps } = props;
  return (
    <h1 className={classNames(className, 'pb-2 text-wingu-gray-800 font-bold')} {...restProps}>
      {children}
    </h1>
  );
});

type CardSubHeaderProps = React.PropsWithChildren<{
  className?: string;
}>;
export const CardSubHeader = React.memo<CardSubHeaderProps>((props) => {
  const { className, children, ...restProps } = props;
  return (
    <h2 className={classNames(className, 'pt-6 pb-2 text-xs text-wingu-gray-400')} {...restProps}>
      {children}
    </h2>
  );
});

type CardParagraphProps = React.PropsWithChildren<{
  className?: string;
}>;
export const CardParagraph = React.memo<CardParagraphProps>((props) => {
  const { className, children, ...restProps } = props;
  return (
    <p className={classNames(className, 'text-sm leading-6')} {...restProps}>
      {children}
    </p>
  );
});

type CardIconLineProps = React.PropsWithChildren<{
  className?: string;
  icon: IconProps['icon'];
}>;
export const CardIconLine = React.memo<CardIconLineProps>((props) => {
  const { className, children, icon, ...restProps } = props;
  return (
    <div className={classNames(className, 'flex items-center')} {...restProps}>
      <Icon size="medium" type="secondary" circle={false} icon={icon} />
      <span className="pl-1.5 text-wingu-gray-600 text-sm">{children}</span>
    </div>
  );
});
