const path = require('path')
const Marked = require('acyort-marked')

function page(issue, config) {
  const markeder = new Marked(config)
  const {
    id,
    title,
    updated_at,
    created_at,
    body,
  } = issue
  const matched = title.split(/^\[(.+?)]/)
  const name = matched[1]

  return {
    id,
    url: path.join('/', name, '/'),
    path: path.join('/', name, 'index.html'),
    name,
    title: matched[2],
    created: created_at,
    updated: updated_at,
    content: markeder.mark(body),
  }
}

module.exports = page
