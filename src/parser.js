const handlerPost = (post) => {
  const titlePost = post.querySelector('title').textContent;
  const linkPost = post.querySelector('link').textContent;

  return {
    title: titlePost,
    link: linkPost,
  };
};

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const postsArray = [...doc.querySelectorAll('item')];

  const posts = postsArray.map((post) => handlerPost(post));

  const result = {
    title,
    description,
    posts,
  };

  return result;
};
