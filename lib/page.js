const pathFn = require('path')
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
  const splited = matched[1].split('/').filter(i => i)
  const name = splited.slice(-1)[0]
  const url = pathFn.join('/', matched[1], '/')
  const path = pathFn.join(url, 'index.html')

  return {
    id,
    url,
    path,
    name,
    title: matched[2],
    created: created_at,
    updated: updated_at,
    raw: body,
    content: markeder.mark(body),
  }
}

module.exports = page
