/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import axios from 'axios';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';
import parse from './parser';
import { isValidateUrl, corsProxy, delay } from './variable';

const makeUpdates = (state) => {
  const feedsUrl = state.feeds.map(({ urlFeed }) => `${corsProxy}${urlFeed}`);
  const promises = feedsUrl.map(axios.get);

  Promise.all(promises)
    .then((response) => {
      response.forEach(({ data }, index) => {
        const { posts } = parse(data);
        const oldPosts = state.feeds[index].posts;
        const newPosts = differenceWith(posts, oldPosts, isEqual);
        state.feeds[index].posts.unshift(...newPosts);
      });
    })
    .finally(() => setTimeout(() => makeUpdates(state), delay));
};

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
  let isDubleURL = false;

  state.feeds.forEach(({ urlFeed }) => {
    if (urlFeed === state.inputValue) {
      isDubleURL = true;
    }
  });

  if (isDubleURL) {
    state.errors.network = i18next.t('validate.addedBefore');
    state.processState = 'failed';
    return;
  }

  axios.get(`${corsProxy}${state.inputValue}`)
    .then((response) => {
      state.processState = 'finished';
      state.success = i18next.t('successText');
      state.feedCount += 1;
      const data = parse(response.data);
      const feeds = {
        urlFeed: state.inputValue,
        id: state.feedCount,
        title: data.title,
        description: data.description,
        posts: data.posts,
      };
      state.feeds.push(feeds);
    })
    .catch((error) => {
      state.errors.network = i18next.t('error.network');
      state.processState = 'failed';
      console.log(error);
      throw error;
    });
  makeUpdates(state);
};
