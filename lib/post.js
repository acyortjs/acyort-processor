const Marked = require('acyort-marked')
const categoryFn = require('./category')
const tagFn = require('./tag')
const summaryFn = require('./summary')

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
  const { post_dir } = config
  const { summary, content } = summaryFn(body)

  return {
    id,
    title,
    raw: body,
    created: created_at,
    updated: updated_at,
    path: `/${post_dir}/${id}.html`,
    url: `/${post_dir}/${id}.html`,
    author: {
      name: login,
      avatar: avatar_url,
      url: html_url,
    },
    html: markeder,mark(body, true),
    category: categoryFn(issue, config),
    tags: tagFn(issue, config),
    summary: markeder.mark(summary),
    content: markeder.mark(content),
  }
}

module.exports = post
