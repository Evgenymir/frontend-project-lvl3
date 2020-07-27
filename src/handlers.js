/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import differenceBy from 'lodash/differenceBy';
import uniqueId from 'lodash/uniqueId';
import parse from './parser';
import { corsProxy, delay } from './config';

const schema = yup.string().url('validate.notValid').required();

const runValidate = (urls, value) => {
  const schemaWithCheckDoubleUrl = schema.notOneOf(urls, 'error.addedBefore');

  try {
    schemaWithCheckDoubleUrl.validateSync(value);
    return null;
  } catch (e) {
    return e.message;
  }
};

export const makeUpdates = (state) => {
  state.feeds.forEach((feed) => {
    axios.get(`${corsProxy}${feed.urlFeed}`).then(({ data }) => {
      const { posts } = parse(data);
      const filterOldPosts = state.posts.filter(({ feedId }) => feedId === feed.id);
      const newPosts = differenceBy(posts, filterOldPosts, 'link')
        .map((postItem) => ({ ...postItem, feedId: feed.id, id: uniqueId('post_') }));
      state.posts.unshift(...newPosts);
    });
  });
  setTimeout(makeUpdates, delay, state);
};

export const onInputHandler = (state) => (e) => {
  const valueUrl = e.target.value.trim();

  if (valueUrl === '') {
    state.form.isValid = false;
    state.form.processState = 'waiting';
    return;
  }

  state.form.processState = 'filling';
  const urls = state.feeds.map(({ urlFeed }) => urlFeed);
  const error = runValidate(urls, valueUrl);

  if (error) {
    state.form.isValid = false;
    state.error = error;
    return;
  }

  state.form.isValid = true;
  state.form.url.value = valueUrl;
};

export const onSubmitHandler = (state) => (e) => {
  e.preventDefault();

  state.form.processState = 'sending';

  axios.get(`${corsProxy}${state.form.url.value}`)
    .then((response) => {
      state.form.processState = 'finished';
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
      state.error = 'success';
    })
    .catch((error) => {
      state.error = error.message;
      state.form.processState = 'failed';
      console.log(error);
      throw error;
    });
};
