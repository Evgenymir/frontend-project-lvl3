import i18next from 'i18next';

const createPost = (title, link, id, index) => {
  const templatePost = `
    <li class="feed-section__item" id="feed-${id}-post-${index}">
      <a class="feed-section__link" href="${link}" target="_blank">${title}</a>
    </li>
  `;

  return templatePost;
};

const createPosts = (posts, id) => {
  if (posts.length === 0) {
    return i18next.t('noPosts');
  }

  const postsList = [];
  posts.forEach(({ title, link }, index) => {
    const currentIndex = index + 1;
    const post = createPost(title, link, id, currentIndex);
    postsList.push(post);
  });
  const templatePosts = `<ul class="feed-section__list">${postsList.join('')}</ul>`;
  return templatePosts;
};

const createFeed = (data) => {
  const posts = createPosts(data.posts, data.id);
  const templateFeed = `
  <section id="feed-${data.id}" class="feed-section">
    <h2 class="feed-section__title">${data.title}</h2>
    <div class="feed-section__description">${data.description}</div>
    ${posts}
  </section>
  `;

  return templateFeed;
};

export default createFeed;
