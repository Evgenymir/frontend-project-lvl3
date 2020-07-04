/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import axios from 'axios';
import { isValidateUrl, corsProxy } from './utils';
import createFeed from './create';
import parse from './parser';

const feed = document.querySelector('.j-feed');

export const onInputHandler = (state) => (e) => {
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
        state.errors.invalid = i18next.t('validate.notValid');
      }
    });
  } else {
    state.validationState = 'empty';
    state.processState = 'waiting';
  }
};

export const onSubmitHandler = (state) => (e) => {
  e.preventDefault();

  state.processState = 'sending';

  if (!state.inputValues.includes(state.inputValue)) {
    state.inputValues.push(state.inputValue);
  } else {
    state.errors.network = i18next.t('validate.addedBefore');
    state.processState = 'failed';
    return;
  }

  axios.get(`${corsProxy}${state.inputValue}`)
    .then((response) => {
      state.processState = 'finished';
      state.feedCount += 1;
      const data = parse(response.data);
      const sectionFeed = createFeed(data, state.feedCount);
      feed.append(sectionFeed);
    })
    .catch((error) => {
      state.errors.network = i18next.t('error.network');
      state.processState = 'failed';
      console.log(error);
      throw error;
    });
};
