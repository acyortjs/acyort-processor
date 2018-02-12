const pagination = require('acyort-pagination')
const filterFn = require('./lib/filter')
const pageFn = require('./lib/page')
const postFn = require('./lib/post')

const ERROR = 'No content. Check user, repository or authors fields'

function processor(issues) {
  const {
    per_page: perpage,
    category_dir: categoryDir,
    tag_dir: tagDir,
  } = this
  const category = {}
  const tag = {}

  let { pages, posts } = filterFn.call(this, issues)
  let categories = []
  let tags = []
  let index = []

  if (!pages.length && !posts.length) {
    return Promise.reject(new Error(ERROR))
  }


  function getCategories(post) {
    const back = []
    const {
      id,
      name,
      url,
    } = post.category
    const pos = back.map(c => c.name).indexOf(name)

    if (pos === -1) {
      back.push({
        id,
        name,
        url,
        posts: [post.id],
      })
    } else {
      back[pos].posts.push(post.id)
    }

    return back
  }

  function getTags(post) {
    const back = []

    post.tags.forEach(({ id, name, url }) => {
      const pos = back.map(t => t.name).indexOf(name)

      if (pos === -1) {
        back.push({
          id,
          name,
          url,
          posts: [post.id],
        })
      } else {
        back[pos].posts.push(post.id)
      }
    })

    return back
  }

  pages = pages.map(page => pageFn.call(this, page))

  posts = posts.map((post, i) => {
    const data = postFn.call(this, post)
    data.prev = i > 0 ? posts[i - 1].id : ''
    data.next = i < posts.length - 1 ? posts[i + 1].id : ''
    return data
  })

  posts.forEach((post) => {
    categories = getCategories(post)
    tags = getTags(post)
  })

  index = pagination({
    title: this.title,
    posts: posts.map(post => post.id),
    base: '/',
    perpage,
  })

  categories.forEach((c) => {
    const data = {
      base: `/${categoryDir}/${c.id}`,
      posts: c.posts,
      title: c.title,
      perpage,
    }
    category[c.id] = pagination(data)
  })

  tags.forEach((t) => {
    const data = {
      base: `/${tagDir}/${t.id}`,
      posts: t.posts,
      title: t.title,
      perpage,
    }
    tag[t.id] = pagination(data)
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
