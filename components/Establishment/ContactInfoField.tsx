import { useState } from "react";
import * as yup from 'yup';
import { urlRegex } from "../../model/establishment";

type ContactInfoFieldProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  website: string | null;
  phone?: string;
  whatsApp?: string;
  email?: string;
};

export const ContactInfoField = (props: ContactInfoFieldProps) => {
  const { onChange, website, phone, whatsApp, email } = props;

  const [isValidWebsite, setIsValidWebsite] = useState(true);

  const validateWebsite = (url: string) => {
    const schema = yup.string().matches(urlRegex).max(2048).nullable();
    return schema.isValidSync(url);
  };

  const handleInputChange = (event: { currentTarget: { value: string; name: string } }) => {
    const isValid = validateWebsite(event.currentTarget.value);
    setIsValidWebsite(isValid);
    onChange(event);
  };

  return (
    <>
      <h2 className={'my-2 text-justify font-bold text-black'}>Datos de contacto del establecimiento</h2>
      <input
        name={'website'}
        className={`rounded-lg p-3 w-full border border-light-gray focus:outline-0 ${isValidWebsite ? '' : 'bg-red-400 font-semibold'}`}
        placeholder={'Sitio web: https://ejemplo.org'}
        onChange={handleInputChange}
        value={website ? website : undefined}
      />
      {/* <input
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
      /> */}
    </>
  );
};
