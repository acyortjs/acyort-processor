const path = require('path')

function getPath(base, current) {
  if (current === 1) {
    return path.join(base, 'index.html')
  }
  return path.join(base, current.toString(), 'index.html')
}

function getPostIds(posts) {
  return posts.map(post => post.id || post)
}

class Pagination {
  constructor(config) {
    this.per_page = config.per_page
    this.root = config.root
    this.category_dir = config.category_dir
    this.tag_dir = config.tag_dir
  }

  getPrev(base, current) {
    if (current === 1) {
      return ''
    }
    return path.join(this.root, base, 'page', (current - 1).toString(), '/')
  }

  getNext(base, current) {
    return path.join(this.root, base, 'page', (current + 1).toString(), '/')
  }

  getBase(type, id) {
    if (!id) {
      return '/'
    }
    return `/${this[`${type}_dir`]}/${id}`
  }

  paging(data) {
    const {
      per_page,
      getBase,
      getNext,
      getPrev,
    } = this
    const { type, id, name } = data
    const posts = getPostIds(data.posts)
    const base = getBase(type, id)
    const pagination = []
    const total = per_page === 0 ? 1 : Math.ceil(posts.length / per_page)

    let page = 1

    if (per_page === 0 || posts.length <= per_page) {
      return [{
        base,
        name,
        prev: '',
        next: '',
        posts,
        path: getPath(base, 1),
        current: 1,
        total: 1,
      }]
    }

    for (let i = 0; i < posts.length; i += per_page) {
      pagination.push({
        base,
        name,
        prev: getPrev(base, page),
        next: getNext(base, page),
        posts: posts.slice(i, i + per_page),
        path: getPath(base, page),
        current: page,
        total,
      })

      if (page === total) {
        pagination[page - 1].next = ''
      }

      page += 1
    }

    return pagination
  }
}

module.exports = Pagination
