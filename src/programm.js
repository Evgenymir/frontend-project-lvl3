import i18next from 'i18next';
import { watch } from 'melanke-watchjs';
import { onInputHandler, onSubmitHandler } from './handlers';
import { processStateRender } from './view';
import resources from './locales';

const runProgramm = () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  const state = {
    processState: 'waiting',
    validationState: 'valid',
    inputValue: '',
    inputValues: [],
    feedCount: 0,
    errors: {},
  };

  const form = document.querySelector('.j-form');
  const input = form.url;
  const errorBlock = form.querySelector('.error-block');
  const button = form.elements.submit;
  const spinner = button.querySelector('.spinner-block');
  const buttonText = button.querySelector('.form-button__text');

  buttonText.textContent = i18next.t('button');
  input.placeholder = i18next.t('input');

  watch(state, ['processState', 'validationState'], () => processStateRender(state, input, errorBlock, button, spinner));

  input.addEventListener('input', onInputHandler(state));
  form.addEventListener('submit', onSubmitHandler(state));
};

export default runProgramm;
