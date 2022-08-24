import { AxiosResponseTransformer } from 'axios';

const SERIALIZED_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isSerializedDate(value: unknown) {
  return typeof value === 'string' && SERIALIZED_DATE_REGEX.test(value);
}

export const responseTransformer: AxiosResponseTransformer = (data) => {
  return JSON.parse(data, (key, value) => (isSerializedDate(value) ? new Date(value) : value));
};
