import { prismaClient } from '../server/prisma/client';

function placeInfo(data: string | number | null | undefined) {
  if (!data) return '';
  if (typeof data === 'number') return data;
  return data;
}

export function formatEstablishmentLocation(place: any) {
  return `${placeInfo(place.street)} ${placeInfo(place.streetNumber)}, ${placeInfo(place.city)}`;
}

export const tryGetGoogleMapsApiKey = () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY!;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }
  return googleMapsApiKey;
};
export const tryGetAvailableSpecialities = async () => {
  try {
    return await prismaClient.specialty.findMany();
  } catch (e) {
    throw new Error('Unable to get services from database');
  }
};
