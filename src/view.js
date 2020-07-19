/* eslint-disable no-param-reassign */
export const processValidationRender = (state, elements) => {
  if (state.form.isValid) {
    elements.input.classList.remove('is-invalid');
    elements.input.classList.add('is-valid');
    elements.feedbackBlock.classList.remove('is-error');
  } else {
    elements.input.classList.add('is-invalid');
    elements.input.classList.remove('is-valid');
    elements.feedbackBlock.classList.remove('is-success');
    elements.feedbackBlock.classList.add('is-error');
  }
};

export const processStateRender = (state, elements) => {
  switch (state.form.processState) {
    case 'waiting': {
      elements.input.classList.remove('is-invalid', 'is-valid');
      elements.feedbackBlock.classList.remove('is-success', 'is-error');
      elements.button.disabled = !state.form.isValid;
      break;
    }
    case 'filling': {
      elements.button.disabled = !state.form.isValid;
      processValidationRender(state, elements);
      break;
    }
    case 'sending': {
      elements.button.disabled = state.form.isValid;
      elements.spinner.classList.add('is-active-spinner');
      break;
    }
    case 'finished': {
      elements.input.value = '';
      elements.input.classList.remove('is-valid');
      elements.spinner.classList.remove('is-active-spinner');
      elements.feedbackBlock.classList.add('is-success');
      break;
    }
    case 'failed': {
      elements.spinner.classList.remove('is-active-spinner');
      elements.button.disabled = state.form.isValid;
      elements.input.classList.add('is-invalid');
      elements.feedbackBlock.classList.remove('is-success');
      elements.feedbackBlock.classList.add('is-error');
      break;
    }
    default: {
      throw new Error(`Unknown state ${state.form.processState}`);
    }
  }
};

const createPostTemplate = (title, link, id) => {
  const templatePost = `
    <li class="feed-section__item" id="${id}">
      <a class="feed-section__link" href="${link}" target="_blank">${title}</a>
    </li>
  `;

  return templatePost;
};

const createPostsTemplate = (posts) => {
  const postsList = posts.map(({ title, link, id }) => {
    const post = createPostTemplate(title, link, id);
    return post;
  });
  const templatePosts = `<ul class="feed-section__list">${postsList.join('')}</ul>`;
  return templatePosts;
};

const createFeedTemplate = (data, postsArray) => {
  const posts = createPostsTemplate(postsArray);
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
  const result = state.feeds.map((feedItem) => {
    const posts = state.posts.filter((postItem) => postItem.feedId === feedItem.id);
    const sectionFeed = createFeedTemplate(feedItem, posts);
    return sectionFeed;
  });
  feed.innerHTML = result.join('');
};
