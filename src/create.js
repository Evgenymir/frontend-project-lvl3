import i18next from 'i18next';

const createPost = (title, link, feedCount, index) => {
  const postItem = document.createElement('li');
  const postLink = document.createElement('a');
  postItem.classList.add('feed-section__item');
  postItem.id = `feed-${feedCount}-post-${index}`;
  postLink.classList.add('feed-section__link');
  postLink.setAttribute('href', link);
  postLink.setAttribute('target', '_blank');
  postLink.textContent = title;

  postItem.append(postLink);
  return postItem;
};

const createPosts = (posts, feedCount) => {
  if (posts.length === 0) {
    return i18next.t('noPosts');
  }

  const postsList = document.createElement('ul');
  postsList.classList.add('feed-section__list');
  posts.forEach(({ title, link }, index) => {
    const currentIndex = index + 1;
    const post = createPost(title, link, feedCount, currentIndex);
    postsList.append(post);
  });
  return postsList;
};

const createFeed = (data, feedCount) => {
  const section = document.createElement('section');
  const title = document.createElement('h2');
  const description = document.createElement('div');
  section.classList.add('feed-section');
  section.id = `feed-${feedCount}`;
  title.classList.add('feed-section__title');
  description.classList.add('feed-section__description');
  title.textContent = data.title;
  description.textContent = data.description;
  const posts = createPosts(data.posts, feedCount);

  section.append(title, description, posts);
  return section;
};

export default createFeed;
