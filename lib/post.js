const Marked = require('acyort-marked')
const categoryFn = require('./category')
const tagFn = require('./tag')
const excerptFn = require('./excerpt')

function post(issue) {
  const marker = new Marked(this)
  const {
    id,
    created_at,
    updated_at,
    title,
    user: {
      login,
      avatar_url,
      html_url,
    },
    body,
  } = issue
  const { post_dir: postDir } = this
  const { excerpt, content } = excerptFn(body)

  return {
    id,
    title,
    raw: body,
    created: created_at,
    updated: updated_at,
    path: `/${postDir}/${id}.html`,
    url: `/${postDir}/${id}.html`,
    author: {
      name: login,
      avatar: avatar_url,
      url: html_url,
    },
    category: categoryFn.call(this, issue),
    tags: tagFn.call(this, issue),
    excerpt: marker.parse(excerpt),
    content: marker.parse(content),
  }
}

module.exports = post
