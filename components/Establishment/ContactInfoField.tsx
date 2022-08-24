import React from 'react';

type ContactInfoFieldProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  website: string;
  phone: string;
  whatsApp: string;
  email: string;
};
export const ContactInfoField = (props: ContactInfoFieldProps) => {
  const { onChange, website, phone, whatsApp, email } = props;
  return (
    <>
      <h1 className={'my-6 text-justify font-bold text-black'}>Datos de contacto</h1>
      <input
        name={'website'}
        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0'}
        placeholder={'Sitio web'}
        onChange={onChange}
        value={website}
      />
      <input
        name={'phone'}
        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
        placeholder={'Teléfono'}
        onChange={onChange}
        value={phone}
      />
      <input
        name={'whatsApp'}
        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
        placeholder={'WhatsApp'}
        onChange={onChange}
        value={whatsApp}
      />
      <input
        name={'email'}
        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
        placeholder={'Email'}
        onChange={onChange}
        value={email}
      />
    </>
  );
};
