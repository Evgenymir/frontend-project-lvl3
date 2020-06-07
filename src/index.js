import './scss/main.scss';
import axios from 'axios';
import * as yup from 'yup';
import { watch } from 'melanke-watchjs';

const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const schema = yup.string().url();
const isValidateUrl = (url) => schema.isValid(url);

const runProgramm = () => {
  const form = document.querySelector('.j-form');
  const input = form.url;
  const errorBlock = form.querySelector('.error-block');
  const button = form.elements.submit;
  const spinner = button.querySelector('.spinner-block');

  const state = {
    processState: 'waiting',
    validationState: 'valid',
    inputValue: '',
    errors: {},
  };

  watch(state, ['processState', 'validationState'], () => {
    switch (state.processState) {
      case 'waiting': {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        errorBlock.classList.remove('is-error-active');
        button.disabled = true;
        break;
      }
      case 'filling': {
        if (state.validationState === 'valid') {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
          errorBlock.classList.remove('is-error-active');
          errorBlock.textContent = state.errors.valid;
        } else {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          errorBlock.classList.add('is-error-active');
          errorBlock.textContent = state.errors.invalid;
        }
        button.disabled = state.validationState === 'invalid';
        break;
      }
      case 'sending': {
        button.disabled = true;
        spinner.classList.add('is-active-spinner');
        break;
      }
      case 'finished': {
        input.value = '';
        input.classList.remove('is-valid');
        spinner.classList.remove('is-active-spinner');
        break;
      }
      case 'failed': {
        spinner.classList.remove('is-active-spinner');
        button.disabled = true;
        input.classList.add('is-invalid');
        errorBlock.textContent = state.errors.network;
        break;
      }
      default: {
        throw new Error(`Unknown state ${state.processState}`);
      }
    }
  });

  input.addEventListener('input', (e) => {
    const valueUrl = e.target.value.trim();
    if (valueUrl !== '') {
      state.processState = 'filling';
      isValidateUrl(valueUrl).then((valid) => {
        if (valid) {
          state.validationState = 'valid';
          state.errors.valid = '';
          state.inputValue = valueUrl;
        } else {
          state.validationState = 'invalid';
          state.errors.invalid = 'Is not valid url';
        }
      });
    } else {
      state.validationState = 'empty';
      state.processState = 'waiting';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    state.processState = 'sending';
    axios.get(`${corsProxy}${state.inputValue}`)
      .then((response) => {
        console.log(response);
        state.processState = 'finished';
      })
      .catch((error) => {
        state.processState = 'failed';
        state.errors.network = 'Network error, please try again later.';
        console.log(error);
        throw error;
      });
  });
};

runProgramm();
