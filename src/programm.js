import { watch } from 'melanke-watchjs';
import { onInputHandler, onSubmitHandler } from './handlers';
import { processStateRender } from './view';

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

  watch(state, ['processState', 'validationState'], () => processStateRender(state, input, errorBlock, button, spinner));

  input.addEventListener('input', onInputHandler(state));
  form.addEventListener('submit', onSubmitHandler(state));
};

export default runProgramm;
