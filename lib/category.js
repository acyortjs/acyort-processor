const path = require('path')

function catogory(issue) {
  const { category_dir: categortDir, default_category: defaultCategory } = this
  const { milestone } = issue

  if (!milestone) {
    return {
      id: 0,
      name: defaultCategory,
      url: path.join('/', categortDir, '0/'),
    }
  }

  const { id, title } = milestone

  return {
    id,
    name: title,
    url: path.join('/', categortDir, id.toString(), '/'),
  }
}

module.exports = catogory
