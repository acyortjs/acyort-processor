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
    this.category = {}
    this.tag = {}
    this.index = []
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

    this.index = this.paging({ name: title, posts })
    this.categories.forEach((category) => {
      const data = Object.assign(category, { type: 'category' })
      this.category[category.id] = this.paging(data)
    })
    this.tags.forEach((tag) => {
      const data = Object.assign(tag, { type: 'tag' })
      this.tag[tag.id] = this.paging(data)
    })
  }

  setTags(post) {
    post.tags.forEach(({ id, name, url }) => {
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
      const data = postFn(post, this.config)
      data.prev = i > 0 ? posts[i - 1].id : ''
      data.next = i < posts.length - 1 ? posts[i + 1].id : ''
      return data
    })
  }

  setPages(pages) {
    this.pages = pages.map(page => pageFn(page, this.config))
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
      index: this.index,
      category: this.category,
      tag: this.tag,
    })
  }
}

module.exports = Processor
