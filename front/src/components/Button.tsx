import classNames from 'classnames';
import React from 'react';
import { Icon } from './Icon';

type Props = React.PropsWithChildren<{
  type?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  className?: string;
  icon?: string;
}>;

export const Button: React.FC<Props> = React.memo((props) => {
  const { className, children, icon, disabled = false, type = 'primary' } = props;
  return (
    <button
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
      {icon && <Icon type={type} disabled={disabled} size="medium" icon={icon} />}
      <span className="py-3">{children}</span>
    </button>
  );
});