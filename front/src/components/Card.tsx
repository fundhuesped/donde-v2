import classNames from 'classnames';
import React from 'react';
import { Icon, IconProps } from './Icon';

type CardProps = React.PropsWithChildren<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}>;
export const Card = React.memo<CardProps>((props) => {
  const { children, className, ...restProps } = props;
  return (
    <div className={classNames(className, 'bg-white flex flex-col drop-shadow-wingu rounded-2xl p-4')} {...restProps}>
      {children}
    </div>
  );
});

type CardHeaderProps = React.PropsWithChildren<{
  className?: string;
}>;
export const CardHeader = React.memo<CardHeaderProps>((props) => {
  const { className, children, ...restProps } = props;
  return (
    <h3 className={classNames(className, 'text-black font-bold')} {...restProps}>
      {children}
    </h3>
  );
});

type CardSubHeaderProps = React.PropsWithChildren<{
  className?: string;
}>;
export const CardSubHeader = React.memo<CardSubHeaderProps>((props) => {
  const { className, children, ...restProps } = props;
  return (
    <h4 className={classNames(className, 'pt-6 pb-2 text-xs text-wingu-gray-400')} {...restProps}>
      {children}
    </h4>
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

type CardIconListProps = React.PropsWithChildren<{}>;
export const CardList = React.memo<CardIconListProps>((props) => {
  const { children } = props;
  return <ul>{children}</ul>;
});

type CardIconLineProps = React.PropsWithChildren<{
  className?: string;
  icon: IconProps['icon'];
}>;
export const CardListItem = React.memo<CardIconLineProps>((props) => {
  const { className, children, icon } = props;
  return (
    <li className={classNames(className, 'flex items-center text-dark-gray')}>
      <Icon size="medium" type="secondary" icon={icon} />
      <span className="pl-1 text-dark-gray text-sm">{children}</span>
    </li>
  );
});
