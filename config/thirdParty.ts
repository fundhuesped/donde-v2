export const GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS = {
  componentRestrictions: { country: 'ar' },
  types: ['geocode'],
};

export const GET_DYNAMIC_GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS = (country: string | undefined) => {
  return {
    componentRestrictions: { country: country },
    types: ['geocode']
  }
}
