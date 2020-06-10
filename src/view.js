/* eslint-disable no-param-reassign */
export const processValidationRender = (state, input, errorBlock) => {
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
};

export const processStateRender = (state, input, errorBlock, button, spinner) => {
  switch (state.processState) {
    case 'waiting': {
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
      errorBlock.classList.remove('is-error-active');
      button.disabled = true;
      break;
    }
    case 'filling': {
      button.disabled = state.validationState === 'invalid';
      processValidationRender(state, input, errorBlock);
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
};
