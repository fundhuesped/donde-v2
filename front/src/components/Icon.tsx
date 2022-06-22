import classNames from 'classnames';
import React, { ReactNode } from 'react';

export type IconProps = {
  type?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  circle?: boolean;
  className?: string;
  icon: ReactNode;
};

export const Icon = React.memo<IconProps>((props) => {
  const { type = 'primary', size = 'large', disabled = false, icon: IconInner, className, circle = false } = props;
  return (
    <div
      className={classNames(
        className,
        'flex items-center justify-center',
        { 'w-6 h-6 p-1': size === 'small' },
        { 'w-8 h-8 p-1.5': size === 'medium' },
        { 'w-14 h-14 p-4': size === 'large' },
        { 'rounded-full': circle },
        { 'bg-wingu-primary': type === 'primary' && !disabled },
        { 'bg-wingu-gray-400': type === 'primary' && disabled },
        { 'bg-wingu-secondary': type === 'tertiary' },
        { 'bg-white': type === 'secondary' },
      )}
    >
      {IconInner}
    </div>
  );
});
