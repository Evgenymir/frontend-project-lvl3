const makePost = (postData) => {
  const titlePost = postData.querySelector('title').textContent;
  const linkPost = postData.querySelector('link').textContent;

  return {
    title: titlePost,
    link: linkPost,
  };
};

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const error = doc.querySelector('parsererror');
  if (error) {
    throw new Error('error.wrongUrl');
  }

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const posts = [...doc.querySelectorAll('item')].map((post) => makePost(post));

  const result = {
    title,
    description,
    posts,
  };

  return result;
};
