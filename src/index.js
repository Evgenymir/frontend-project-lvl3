import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import * as yup from 'yup';
import { watch } from 'melanke-watchjs';

const schema = yup.string().url();
const isValidateUrl = (url) => schema.isValid(url);

const runProgramm = () => {
  const form = document.querySelector('.j-form');
  const input = form.url;
  const button = form.elements.submit;

  const state = {
    processState: 'waiting',
    validationState: 'valid',
    inputValue: '',
    errors: [],
  };

  watch(state, ['processState', 'validationState'], () => {
    switch (state.processState) {
      case 'waiting': {
        input.classList.remove('is-invalid');
        button.disabled = true;
        break;
      }
      case 'filling': {
        if (state.validationState === 'valid') {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        button.disabled = state.validationState === 'invalid';
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
        } else {
          state.validationState = 'invalid';
        }
      });
    } else {
      state.validationState = 'empty';
      state.processState = 'waiting';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('Send');
  });
};

runProgramm();
