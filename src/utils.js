import * as yup from 'yup';

const schema = yup.string().url();
export const isValidateUrl = (url) => schema.isValid(url);
export const corsProxy = 'https://cors-anywhere.herokuapp.com/';
