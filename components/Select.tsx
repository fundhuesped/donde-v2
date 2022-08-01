import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';
type Props = {
  placeholder?: string;
  className?: string;
  items: { value: string; label: string }[];
} & React.HTMLProps<HTMLSelectElement>;
const Select: React.FC<Props> = (props) => {
  const { className, onSelect: handleSelect, value, placeholder, name, items } = props;
  const [selectedValue, setSelectedValue] = useState(value || placeholder);
  const handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedValue(event.currentTarget.value);
    handleSelect && handleSelect(event);
  };
  return (
    <select
      name={name}
      className={classNames(className, 'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6 p-3')}
      onChange={handleChange}
      value={selectedValue}
    >
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {' '}
          {item.label}{' '}
        </option>
      ))}
    </select>
  );
};

export default Select;
