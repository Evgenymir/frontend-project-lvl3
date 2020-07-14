const handlerPost = (post) => {
  const titlePost = post.querySelector('title').textContent;
  const linkPost = post.querySelector('link').textContent;

  return {
    title: titlePost,
    link: linkPost,
  };
};
/* eslint-disable no-param-reassign */
export default (data, state) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const error = doc.querySelector('parsererror');
  if (error) {
    state.form.url.isNotRssUrl = true;
    throw new Error('Is not RSS');
  }

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const posts = [...doc.querySelectorAll('item')].map((post) => handlerPost(post));

  const result = {
    title,
    description,
    posts,
  };

  return result;
};
