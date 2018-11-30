const pathFn = require('path')
const Marked = require('acyort-marked')

function page(issue) {
  const marker = new Marked(this)
  const {
    id,
    title,
    updated_at: updated,
    created_at: created,
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
    type: 'page',
    title: matched[2],
    created,
    updated,
    raw: body,
    content: marker.parse(body),
  }
}

module.exports = page
