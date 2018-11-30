const Marked = require('acyort-marked')
const categoryFn = require('./category')
const tagFn = require('./tag')
const excerptFn = require('./excerpt')

function post(issue) {
  const marker = new Marked(this)
  const {
    id,
    created_at: created,
    updated_at: updated,
    title,
    number,
    user: {
      login,
      avatar_url: avatar,
      html_url: htmlUrl,
    },
    body,
  } = issue
  const { post_dir: postDir } = this
  const { excerpt, content } = excerptFn(body)

  return {
    id,
    title,
    number,
    type: 'post',
    raw: body,
    created,
    updated,
    path: `/${postDir}/${id}.html`,
    url: `/${postDir}/${id}.html`,
    author: {
      name: login,
      avatar,
      url: htmlUrl,
    },
    category: categoryFn.call(this, issue),
    tags: tagFn.call(this, issue),
    excerpt: marker.parse(excerpt),
    content: marker.parse(content),
  }
}

module.exports = post
