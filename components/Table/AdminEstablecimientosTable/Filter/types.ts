export const establishmentTypes = [
  { name: 'Establecimiento de salud público', id: 'HEALTH_ESTABLISHMENT' },
  { name: 'Organizacion social', id: 'SOCIAL_ORGANIZATION' },
  { name: 'Organismo público', id: 'PUBLIC_INSTITUTION' },
  { name: 'Privado', id: 'PRIVATE_INSTITUTION' },
  { name: 'Establecimiento educativo', id: 'EDUCATIONAL_INSTITUTION' },
  { name: 'Otro', id: 'OTHER' },
];

const countriesData = [
  { name: 'Argentina', id: 'AR' },
  { name: 'Bolivia', id: 'BO' },
  { name: 'Brasil', id: 'BR' },
  { name: 'Chile', id: 'CL' },
  { name: 'Colombia', id: 'CO' },
  { name: 'Belice', id: 'BZ' },
  { name: 'Costa Rica', id: 'CR' },
  { name: 'El Salvador', id: 'SV' },
  { name: 'Guatemala', id: 'GT' },
  { name: 'Honduras', id: 'HN' },
  { name: 'Nicaragua', id: 'NI' },
  { name: 'Panamá', id: 'PA' },
  { name: 'Ecuador', id: 'EC' },
  { name: 'Guyana', id: 'GY' },
  { name: 'Guyana Francesa', id: 'GF' },
  { name: 'Paraguay', id: 'PY' },
  { name: 'Perú', id: 'PE' },
  { name: 'Surinam', id: 'SR' },
  { name: 'Uruguay', id: 'UY' },
  { name: 'Venezuela', id: 'VE' },
  { name: 'Antigua y Barbuda', id: 'AG' },
  { name: 'Aruba', id: 'AW' },
  { name: 'Bahamas', id: 'BS' },
  { name: 'Barbados', id: 'BB' },
  { name: 'Cuba', id: 'CU' },
  { name: 'Haití', id: 'HT' },
  { name: 'Jamaica', id: 'JM' },
  { name: 'Martinica', id: 'MQ' },
  { name: 'Puerto Rico', id: 'PR' },
  { name: 'República Dominicana', id: 'DO' },
  { name: 'Trinidad y Tobago', id: 'TT' },
  { name: 'México', id: 'MX' },
];

const countries = countriesData.sort(function (a, b) {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
});

export default countries;