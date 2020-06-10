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

export default createFeed;
