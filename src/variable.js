import * as yup from 'yup';

const schema = yup.string().url();
export const isValidateUrl = (url) => schema.isValid(url);
export const corsProxy = 'https://cors-anywhere.herokuapp.com/';

export const elements = {
  form: document.querySelector('.j-form'),
  input: document.querySelector('input[name="url"]'),
  feedbackBlock: document.querySelector('.j-feedback-block'),
  button: document.querySelector('button[name="submit"]'),
  spinner: document.querySelector('.j-spinner-block'),
  buttonText: document.querySelector('.j-form-button__text'),
  feedBlock: document.querySelector('.j-feed'),
};

export const delay = 5000;
