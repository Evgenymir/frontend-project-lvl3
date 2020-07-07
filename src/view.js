import createFeed from './create';
/* eslint-disable no-param-reassign */
export const processValidationRender = (state, elements) => {
  if (state.validationState === 'valid') {
    elements.input.classList.remove('is-invalid');
    elements.input.classList.add('is-valid');
    elements.feedbackBlock.classList.remove('is-error');
    elements.feedbackBlock.textContent = state.errors.valid;
  } else {
    elements.input.classList.add('is-invalid');
    elements.input.classList.remove('is-valid');
    elements.feedbackBlock.classList.remove('is-success');
    elements.feedbackBlock.classList.add('is-error');
    elements.feedbackBlock.textContent = state.errors.invalid;
  }
};

export const processStateRender = (state, elements) => {
  switch (state.processState) {
    case 'waiting': {
      elements.input.classList.remove('is-invalid');
      elements.input.classList.remove('is-valid');
      elements.feedbackBlock.classList.remove('is-success');
      elements.feedbackBlock.classList.remove('is-error');
      elements.button.disabled = true;
      break;
    }
    case 'filling': {
      elements.button.disabled = state.validationState === 'invalid';
      processValidationRender(state, elements);
      break;
    }
    case 'sending': {
      elements.button.disabled = true;
      elements.spinner.classList.add('is-active-spinner');
      break;
    }
    case 'finished': {
      elements.input.value = '';
      elements.input.classList.remove('is-valid');
      elements.spinner.classList.remove('is-active-spinner');
      elements.feedbackBlock.classList.add('is-success');
      elements.feedbackBlock.textContent = state.success;
      break;
    }
    case 'failed': {
      elements.spinner.classList.remove('is-active-spinner');
      elements.button.disabled = true;
      elements.input.classList.add('is-invalid');
      elements.feedbackBlock.textContent = state.errors.network;
      elements.feedbackBlock.classList.add('is-error');
      break;
    }
    default: {
      throw new Error(`Unknown state ${state.processState}`);
    }
  }
};

export const renderFeed = (state, feed) => {
  if (state.feeds.length === 0) {
    return;
  }

  const result = [];
  state.feeds.forEach((feedItem) => {
    const sectionFeed = createFeed(feedItem);
    result.unshift(sectionFeed);
  });
  feed.innerHTML = result.join('');
};
