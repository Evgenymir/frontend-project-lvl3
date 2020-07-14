import i18next from 'i18next';
import { watch } from 'melanke-watchjs';
import { onInputHandler, onSubmitHandler } from './handlers';
import { processStateRender, renderFeed } from './view';
import resources from './locales';

const elements = {
  form: document.querySelector('.j-form'),
  input: document.querySelector('input[name="url"]'),
  feedbackBlock: document.querySelector('.j-feedback-block'),
  button: document.querySelector('button[name="submit"]'),
  spinner: document.querySelector('.j-spinner-block'),
  buttonText: document.querySelector('.j-form-button__text'),
  feedBlock: document.querySelector('.j-feed'),
};

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
    form: {
      url: {
        value: '',
        isDubleUrl: false,
        isValid: false,
        processState: 'waiting',
        isNotRssUrl: false,
      },
    },
    isErrorNetwork: false,
    isUpdateProcess: false,
    feeds: [],
    posts: [],
  };

  watch(state.form.url, ['processState', 'isValid'], () => processStateRender(state, elements));
  watch(state, 'posts', () => renderFeed(state, elements.feedBlock));

  elements.input.addEventListener('input', onInputHandler(state));
  elements.form.addEventListener('submit', onSubmitHandler(state));
};

export default runProgramm;
