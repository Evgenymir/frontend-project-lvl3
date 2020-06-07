import './scss/main.scss';
import axios from 'axios';
import * as yup from 'yup';
import { watch } from 'melanke-watchjs';

const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const schema = yup.string().url();
const isValidateUrl = (url) => schema.isValid(url);

const runProgramm = () => {
  const form = document.querySelector('.j-form');
  const input = form.url;
  const errorBlock = form.querySelector('.error-block');
  const button = form.elements.submit;
  const spinner = button.querySelector('.spinner-block');
  const feed = document.querySelector('.j-feed');

  const state = {
    processState: 'waiting',
    validationState: 'valid',
    inputValue: '',
    errors: {},
  };

  watch(state, ['processState', 'validationState'], () => {
    switch (state.processState) {
      case 'waiting': {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        errorBlock.classList.remove('is-error-active');
        button.disabled = true;
        break;
      }
      case 'filling': {
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
        button.disabled = state.validationState === 'invalid';
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
  });

  const parseData = (data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'application/xml');

    const title = doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const postsArray = [...doc.querySelectorAll('item')];

    const handlesPost = (post) => {
      const titlePost = post.querySelector('title').textContent;
      const linkPost = post.querySelector('link').textContent;

      return {
        title: titlePost,
        link: linkPost,
      };
    };

    const posts = postsArray.map((post) => handlesPost(post));

    const result = {
      title,
      description,
      posts,
    };

    return result;
  };

  const createPost = (title, link) => {
    const postItem = document.createElement('li');
    const postLink = document.createElement('a');
    postItem.classList.add('feed-section__item');
    postLink.classList.add('feed-section__link');
    postLink.setAttribute('href', link);
    postLink.setAttribute('target', '_blank');
    postLink.textContent = title;

    postItem.append(postLink);
    return postItem;
  };

  const createPosts = (posts) => {
    if (posts.length === 0) {
      return 'No posts';
    }

    const postsList = document.createElement('ul');
    postsList.classList.add('feed-section__list');
    posts.forEach(({ title, link }) => {
      const post = createPost(title, link);
      postsList.append(post);
    });
    return postsList;
  };

  const createFeed = (data) => {
    const section = document.createElement('section');
    const title = document.createElement('h2');
    const description = document.createElement('div');
    section.classList.add('feed-section');
    title.classList.add('feed-section__title');
    description.classList.add('feed-section__description');
    title.textContent = data.title;
    description.textContent = data.description;
    const posts = createPosts(data.posts);

    section.append(title, description, posts);
    return section;
  };

  input.addEventListener('input', (e) => {
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
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    state.processState = 'sending';
    axios.get(`${corsProxy}${state.inputValue}`)
      .then((response) => {
        state.processState = 'finished';
        const data = parseData(response.data);
        const sectionFeed = createFeed(data);
        feed.append(sectionFeed);
      })
      .catch((error) => {
        state.processState = 'failed';
        state.errors.network = 'Network error, please try again later.';
        console.log(error);
        throw error;
      });
  });
};

runProgramm();
