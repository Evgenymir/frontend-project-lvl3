import i18next from 'i18next';
/* eslint-disable no-param-reassign */
export const processValidationRender = (state, elements) => {
  if (state.form.url.isValid) {
    elements.input.classList.remove('is-invalid');
    elements.input.classList.add('is-valid');
    elements.feedbackBlock.classList.remove('is-error');
    elements.feedbackBlock.textContent = '';
  } else {
    elements.input.classList.add('is-invalid');
    elements.input.classList.remove('is-valid');
    elements.feedbackBlock.classList.remove('is-success');
    elements.feedbackBlock.classList.add('is-error');
    elements.feedbackBlock.textContent = i18next.t('validate.notValid');

    if (state.form.url.isDubleUrl) {
      elements.feedbackBlock.textContent = i18next.t('error.addedBefore');
    }
  }
};

export const processStateRender = (state, elements) => {
  switch (state.form.url.processState) {
    case 'waiting': {
      elements.input.classList.remove('is-invalid', 'is-valid');
      elements.feedbackBlock.classList.remove('is-success', 'is-error');
      elements.button.disabled = !state.form.url.isValid;
      break;
    }
    case 'filling': {
      elements.button.disabled = !state.form.url.isValid;
      processValidationRender(state, elements);
      break;
    }
    case 'sending': {
      elements.button.disabled = state.form.url.isValid;
      elements.spinner.classList.add('is-active-spinner');
      break;
    }
    case 'finished': {
      elements.input.value = '';
      elements.feedbackBlock.textContent = i18next.t('successSending');
      elements.input.classList.remove('is-valid');
      elements.spinner.classList.remove('is-active-spinner');
      elements.feedbackBlock.classList.add('is-success');
      break;
    }
    case 'failed': {
      elements.spinner.classList.remove('is-active-spinner');
      elements.button.disabled = state.form.url.isValid;
      elements.input.classList.add('is-invalid');
      elements.feedbackBlock.classList.remove('is-success');
      elements.feedbackBlock.classList.add('is-error');
      if (state.form.url.isNotRssUrl) {
        elements.feedbackBlock.textContent = i18next.t('error.wrongUrl');
      }
      if (state.isErrorNetwork) {
        elements.feedbackBlock.textContent = i18next.t('error.network');
      }
      break;
    }
    default: {
      throw new Error(`Unknown state ${state.form.url.processState}`);
    }
  }
};

const createPost = (title, link, id) => {
  const templatePost = `
    <li class="feed-section__item" id="${id}">
      <a class="feed-section__link" href="${link}" target="_blank">${title}</a>
    </li>
  `;

  return templatePost;
};

const createPosts = (posts) => {
  if (posts.length === 0) {
    return i18next.t('noPosts');
  }

  const postsList = posts.map(({ title, link, id }) => {
    const post = createPost(title, link, id);
    return post;
  });
  const templatePosts = `<ul class="feed-section__list">${postsList.join('')}</ul>`;
  return templatePosts;
};

const createFeed = (data, postsArray) => {
  const posts = createPosts(postsArray);
  const templateFeed = `
  <section id="${data.id}" class="feed-section">
    <h2 class="feed-section__title">${data.title}</h2>
    <div class="feed-section__description">${data.description}</div>
    ${posts}
  </section>
  `;

  return templateFeed;
};

export const renderFeed = (state, feed) => {
  const result = [];
  state.feeds.forEach((feedItem) => {
    const posts = state.posts.filter((postItem) => postItem.feedId === feedItem.id);
    const sectionFeed = createFeed(feedItem, posts);
    result.unshift(sectionFeed);
  });
  feed.innerHTML = result.join('');
};
