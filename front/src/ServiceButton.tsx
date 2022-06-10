import React, { ReactNode } from 'react';
import { Button } from './components/Button';

interface ServiceProps {
  id: string;
  icon: ReactNode;
  description: string;
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export const ServiceButton = (props: ServiceProps) => {
  const { id, icon, description, active, onClick } = props;
  const borderColor = active ? '!border-donde-primary' : 'border-white';
  const fontWeight = active ? 'font-semibold' : '!font-normal';
  return (
    <Button
      name={id}
      onClick={onClick}
      className={`bg-white w-full !justify-start my-5 text-base !text-donde-gray-800 ${fontWeight} ${borderColor}`}
      iconSize={'large'}
      type={'tertiary'}
      icon={icon}
      alignment={'left'}
    >
      {description}
    </Button>
  );
};
