function placeInfo(data: string | number | null | undefined) {
  if (!data) return '';
  if (typeof data === 'number') return data;
  return data;
}

export function formatEstablishmentLocation(place: any) {
  return `${placeInfo(place.calle)} ${placeInfo(place.altura)}, ${placeInfo(place.nombre_ciudad)}`;
}
