const path = require('path')

function catogory(issue, config) {
  const { category_dir, default_category } = config
  const { milestone } = issue

  if (!milestone) {
    return {
      id: 0,
      name: default_category,
      url: path.join('/', category_dir, '0/'),
    }
  }

  const { id, title } = milestone

  return {
    id,
    name: title,
    url: path.join('/', category_dir, id.toString(), '/'),
  }
}

module.exports = catogory
