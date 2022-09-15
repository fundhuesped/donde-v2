import { Establishment, establishmentTypes } from '../model/establishment';

function placeInfo(data: string | number | null | undefined) {
  if (!data) return '';
  if (typeof data === 'number') return data;
  return data;
}

export function formatEstablishmentLocation(place: Establishment): string {
  return `${placeInfo(place.street)} ${placeInfo(place.streetNumber)}, ${placeInfo(place.city)}`;
}

export function formatEstablishmentType(establishment: Establishment): string {
  return establishmentTypes[establishment.type];
}

export const tryGetGoogleMapsApiKey = () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY!;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }
  return googleMapsApiKey;
};
