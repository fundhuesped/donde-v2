import classNames from 'classnames';
import React from 'react';
import { Icon, IconProps } from './Icon';

type Props = React.PropsWithChildren<{
  type?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  className?: string;
  icon?: string;
  iconSize?: 'small' | 'medium' | 'large';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}>;

export const Button: React.FC<Props & React.HTMLProps<HTMLButtonElement>> = React.memo((props) => {
  const { className, children, icon, disabled = false, type = 'primary', iconSize = 'medium', onClick, name } = props;
  return (
    <button
      onClick={onClick}
      name={name}
      className={classNames(
        className,
        'px-3 font-bold flex items-center justify-center',
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
      <span className="py-3">{children}</span>
    </button>
  );
});
