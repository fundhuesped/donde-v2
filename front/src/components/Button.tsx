import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Icon, IconProps } from './Icon';

type Props = React.PropsWithChildren<
  {
    type?: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
    className?: string;
    icon?: ReactNode;
    iconSize?: 'small' | 'medium' | 'large';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    alignment?: 'left' | 'center' | 'right';
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Button: React.FC<Props> = React.memo((props) => {
  const { className, children, icon, disabled = false, type = 'primary', iconSize = 'medium', onClick, name, alignment } = props;
  return (
    <button
      onClick={onClick}
      name={name}
      className={classNames(
        className,
        'px-3 font-bold flex items-center justify-center rounded-2xl border-2',
        { 'rounded-xl': ['primary', 'secondary'].includes(type) },
        {
          'bg-donde-primary text-white': type === 'primary' && !disabled,
          'bg-gray-400 text-white': type === 'primary' && disabled,
        },
        {
          'border border-donde-primary text-donde-primary': type === 'secondary' && !disabled,
          'border border-donde-gray-400 text-donde-gray-400': type === 'secondary' && disabled,
        },
        {
          'text-donde-primary': type === 'tertiary' && !disabled,
          'text-donde-gray-400': type === 'tertiary' && disabled,
        },
      )}
    >
      {icon && <Icon type={type} disabled={disabled} size={iconSize} icon={icon} />}
      <span className={classNames({ 'text-left': alignment === 'left' }, 'py-3')}>{children}</span>
    </button>
  );
});
