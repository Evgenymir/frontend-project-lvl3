import i18next from 'i18next';
import { watch } from 'melanke-watchjs';
import { onInputHandler, onSubmitHandler } from './handlers';
import { processStateRender, renderFeed } from './view';
import resources from './locales';
import { elements } from './variable';

const runProgramm = () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then(() => {
    elements.buttonText.textContent = i18next.t('button');
    elements.input.placeholder = i18next.t('input');
  });

  const state = {
    processState: 'waiting',
    validationState: 'valid',
    inputValue: '',
    errors: {},
    success: '',
    feedCount: 0,
    feeds: [],
  };

  watch(state, ['processState', 'validationState'], () => processStateRender(state, elements));
  watch(state, 'feeds', () => renderFeed(state, elements.feedBlock));

  elements.input.addEventListener('input', onInputHandler(state));
  elements.form.addEventListener('submit', onSubmitHandler(state));
};

export default runProgramm;
