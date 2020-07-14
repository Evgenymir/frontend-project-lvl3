/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import differenceBy from 'lodash/differenceBy';
import uniqueId from 'lodash/uniqueId';
import parse from './parser';
import { corsProxy, delay } from './config';

const schema = yup.string().url();
const isValidateUrl = (url) => schema.isValid(url);

const makeUpdates = (state) => {
  const feedsUrl = state.feeds.map(({ urlFeed }) => `${corsProxy}${urlFeed}`);
  const promises = feedsUrl.map(axios.get);

  Promise.all(promises).then((response) => {
    response.forEach(({ data }, index) => {
      const currentFeed = state.feeds[index];
      const { posts } = parse(data);
      const currentOldPosts = state.posts.filter(({ feedId }) => feedId === currentFeed.id);
      const newPosts = differenceBy(posts, currentOldPosts, 'link')
        .map((postItem) => ({ ...postItem, feedId: currentFeed.id, id: uniqueId('post_') }));
      state.posts.unshift(...newPosts);
    });
  }).finally(() => setTimeout(() => makeUpdates(state), delay));
};

export const onInputHandler = (state) => (e) => {
  const valueUrl = e.target.value.trim();
  const wasAddedBefore = state.feeds
    .find(({ urlFeed }) => valueUrl.toLowerCase() === urlFeed.toLowerCase());

  if (valueUrl !== '') {
    state.form.url.processState = 'filling';
    isValidateUrl(valueUrl).then((valid) => {
      if (valid) {
        state.form.url.isValid = true;
        state.form.url.isDubleUrl = false;
        state.form.url.value = valueUrl;

        if (wasAddedBefore) {
          state.form.url.isValid = false;
          state.form.url.isDubleUrl = true;
        }
      } else {
        state.form.url.isValid = false;
      }
    });
  } else {
    state.form.url.isValid = false;
    state.form.url.processState = 'waiting';
  }
};

export const onSubmitHandler = (state) => (e) => {
  e.preventDefault();

  state.form.url.processState = 'sending';
  state.isErrorNetwork = false;
  state.form.url.isNotRssUrl = false;

  axios.get(`${corsProxy}${state.form.url.value}`)
    .then((response) => {
      state.form.url.processState = 'finished';
      const data = parse(response.data, state);
      const feed = {
        urlFeed: state.form.url.value,
        id: uniqueId('feed_'),
        title: data.title,
        description: data.description,
      };
      data.posts.forEach((post) => {
        const result = {
          id: uniqueId('post_'),
          feedId: feed.id,
          title: post.title,
          link: post.link,
        };
        state.posts.push(result);
      });
      state.feeds.push(feed);

      if (!state.isUpdateProcess) {
        makeUpdates(state);
        state.isUpdateProcess = true;
      }
    })
    .catch((error) => {
      if (state.form.url.isNotRssUrl) {
        state.form.url.processState = 'failed';
      } else {
        state.isErrorNetwork = true;
        state.form.url.processState = 'failed';
      }
      console.log(error);
      throw error;
    });
};
