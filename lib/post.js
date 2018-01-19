const Marked = require('acyort-marked')
const categoryFn = require('./category')
const tagFn = require('./tag')
const excerptFn = require('./excerpt')

function post(issue, config) {
  const markeder = new Marked(config)
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
  const { post_dir: postDir } = config
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
    category: categoryFn(issue, config),
    tags: tagFn(issue, config),
    excerpt: markeder.mark(excerpt),
    content: markeder.mark(content),
  }
}

module.exports = post
