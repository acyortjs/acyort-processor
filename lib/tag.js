const path = require('path')

function tag(issue) {
  const { tag_dir: tagDir } = this
  const { labels } = issue

  if (!labels.length) {
    return []
  }

  return labels.map((label) => {
    const { id, name } = label
    return {
      id,
      name,
      url: path.join('/', tagDir, id.toString(), '/'),
    }
  })
}

module.exports = tag
