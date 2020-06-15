/* eslint-disable no-param-reassign */
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
        state.errors.invalid = 'Is not valid url';
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
    state.errors.network = 'URL was added before';
    state.processState = 'failed';
    return;
  }

  axios.get(`${corsProxy}${state.inputValue}`)
    .then((response) => {
      state.processState = 'finished';
      const data = parse(response.data);
      const sectionFeed = createFeed(data);
      feed.append(sectionFeed);
    })
    .catch((error) => {
      state.errors.network = 'Network error, please try again later.';
      state.processState = 'failed';
      console.log(error);
      throw error;
    });
};
