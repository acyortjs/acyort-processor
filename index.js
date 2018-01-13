const Pagination = require('./lib/pagination')
const filterFn = require('./lib/filter')
const pageFn = require('./lib/page')
const postFn = require('./lib/post')

class Processor extends Pagination {
  constructor(config) {
    super(config)
    this.config = config
    this.categories = []
    this.tags = []
    this.posts = []
    this.pages = []
    this.paginations = { categories: {}, tags: {} }
  }

  setCategories(post) {
    const {
      id,
      name,
      url,
    } = post.category
    const index = this.categories.map(c => c.name).indexOf(name)

    if (index === -1) {
      this.categories.push({
        id,
        name,
        url,
        posts: [post.id],
      })
    } else {
      this.categories[index].posts.push(post.id)
    }
  }

  setPaginations() {
    const { config: { title }, posts } = this
    const page = { name: title, posts }

    this.paginations.page = this.paging(page)
    this.categories.forEach((c) => {
      const category = Object.assign({ type: 'category' }, {
        name: c.name,
        id: c.id,
        posts: c.posts,
      })
      this.paginations.categories[c.id] = this.paging(category)
    })
    this.tags.forEach((t) => {
      const tag = Object.assign({ type: 'tag' }, {
        name: t.name,
        id: t.id,
        posts: t.posts,
      })
      this.paginations.tags[t.id] = this.paging(tag)
    })
  }

  setTags(post) {
    post.tags.forEach((tag) => {
      const {
        id,
        name,
        url,
      } = tag
      const index = this.tags.map(t => t.name).indexOf(name)

      if (index === -1) {
        this.tags.push({
          id,
          name,
          url,
          posts: [post.id],
        })
      } else {
        this.tags[index].posts.push(post.id)
      }
    })
  }

  setPosts(posts) {
    this.posts = posts.map((post, i) => {
      const data = postFn(post, {
        config: this.config,
        markeder: this.markeder,
      })

      data.prev = i > 0 ? posts[i - 1].id : ''
      data.next = i < posts.length - 1 ? posts[i + 1].id : ''

      return data
    })
  }

  setPages(pages) {
    this.pages = pages.map(page => pageFn(page, this.markeder))
  }

  process(issues) {
    const { pages, posts } = filterFn(issues, this.config)

    if (!pages.length && !posts.length) {
      return Promise.reject(new Error('No content. Check user, repository or authors fields'))
    }

    this.setPages(pages)
    this.setPosts(posts)
    this.posts.forEach((post) => {
      this.setCategories(post)
      this.setTags(post)
    })
    this.setPaginations()

    return Promise.resolve({
      posts: this.posts,
      pages: this.pages,
      categories: this.categories,
      tags: this.tags,
      paginations: this.paginations,
    })
  }
}

module.exports = Processor
