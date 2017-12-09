const tocFn = require('./toc')
const categoryFn = require('./category')
const tagFn = require('./tag')
const thumbFn = require('./thumb')
const summaryFn = require('./summary')

function post(issue, { config, markeder }) {
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

  const data = {
    id,
    created: created_at,
    updated: updated_at,
    title,
    path: `/${config.post_dir}/${id}.html`,
    url: `/${config.post_dir}/${id}.html`,
    author: {
      name: login,
      avatar: avatar_url,
      url: html_url,
    },
    html: markeder(body, true),
    toc: tocFn(body, markeder),
    category: categoryFn(issue, config),
    tags: tagFn(issue, config),
  }

  const { thumb, content } = thumbFn(body, config)
  const { summary, main } = summaryFn(content)

  data.thumb = thumb
  data.summary = markeder(summary)
  data.content = markeder(main)

  return data
}

module.exports = post
