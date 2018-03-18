const pagination = require('acyort-pagination')
const filterFn = require('./lib/filter')
const pageFn = require('./lib/page')
const postFn = require('./lib/post')

function processor(issues) {
  const {
    per_page: perpage,
    category_dir: categoryDir,
    tag_dir: tagDir,
  } = this
  const category = {}
  const tag = {}
  const categories = []
  const tags = []

  let { pages, posts } = filterFn.call(this, issues)
  let index = []

  function setCategories(post) {
    const {
      id,
      name,
      url,
    } = post.category
    const pos = categories.map(c => c.name).indexOf(name)

    if (pos === -1) {
      categories.push({
        id,
        name,
        url,
        type: 'categories',
        posts: [post.id],
      })
    } else {
      categories[pos].posts.push(post.id)
    }
  }

  function setTags(post) {
    post.tags.forEach(({ id, name, url }) => {
      const pos = tags.map(t => t.name).indexOf(name)

      if (pos === -1) {
        tags.push({
          id,
          name,
          url,
          type: 'tags',
          posts: [post.id],
        })
      } else {
        tags[pos].posts.push(post.id)
      }
    })
  }

  pages = pages.map(page => pageFn.call(this, page))

  posts = posts.map((post, i) => {
    const data = postFn.call(this, post)
    data.prev = i > 0 ? posts[i - 1].id : ''
    data.next = i < posts.length - 1 ? posts[i + 1].id : ''
    return data
  })

  posts.forEach((post) => {
    setCategories(post)
    setTags(post)
  })

  index = pagination({
    title: this.title,
    posts: posts.map(post => post.id),
    base: '/',
    perpage,
  }, { type: 'index' })

  categories.forEach((c) => {
    const data = {
      base: `/${categoryDir}/${c.id}`,
      posts: c.posts,
      title: c.name,
      perpage,
    }
    category[c.id] = pagination(data, { type: 'category' })
  })

  tags.forEach((t) => {
    const data = {
      base: `/${tagDir}/${t.id}`,
      posts: t.posts,
      title: t.name,
      perpage,
    }
    tag[t.id] = pagination(data, { type: 'tag' })
  })

  return Promise.resolve({
    posts,
    pages,
    categories,
    tags,
    index,
    category,
    tag,
  })
}

module.exports = processor
