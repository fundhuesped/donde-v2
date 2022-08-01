import React from "react";

type LocationFieldProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  fullAddress: string;
  streetName: string;
  streetNumber: string;
  floor: string;
  surroundingStreets: string;
}
export const LocationField = (props: LocationFieldProps) => {
  const {onChange, fullAddress, streetName, streetNumber, floor, surroundingStreets} = props
  return <>
    <h1 className={"my-4 text-justify font-bold text-black"}>¿Dónde queda?</h1>
    <input
      name={"fullAddress"}
      className={"rounded-lg p-3 w-full border border-light-gray focus:outline-0 "}
      placeholder={"Estado / Provincia"}
      onChange={onChange}
      value={fullAddress}
    />
    <input
      name={"streetName"}
      className={"rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6"}
      placeholder={"Calle"}
      onChange={onChange}
      value={streetName}
    />
    <div className={"flex justify-between mt-6"}>
      <input
        name={"streetNumber"}
        className={"rounded-lg p-3 w-full border border-light-gray focus:outline-0 max-w-[45%]"}
        placeholder={"Número"}
        onChange={onChange}
        value={streetNumber}
      />
      <input
        name={"floor"}
        className={"rounded-lg p-3 w-full border border-light-gray focus:outline-0 max-w-[45%]"}
        placeholder={"Piso"}
        onChange={onChange}
        value={floor}
      />
    </div>
    <input
      name={"surroundingStreets"}
      className={"rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6"}
      placeholder={"Entre calles"}
      onChange={onChange}
      value={surroundingStreets}
    />
    <p className={"mt-8 text-xs mb-2"}>Posicioná la ubicación correcta en el mapa</p>
  </>
};
