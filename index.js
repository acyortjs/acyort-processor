const pagination = require('acyort-pagination')
const filterFn = require('./lib/filter')
const pageFn = require('./lib/page')
const postFn = require('./lib/post')

class Processor {
  constructor(config) {
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
    const {
      per_page: perpage,
      category_dir: categoryDir,
      tag_dir: tagDir,
    } = this.config

    this.index = pagination({
      title: this.config.title,
      posts: this.posts.map(post => post.id),
      base: '/',
      perpage,
    })
    this.categories.forEach(({ id, posts, name: title }) => {
      const data = {
        base: `/${categoryDir}/${id}`,
        posts,
        title,
        perpage,
      }
      this.category[id] = pagination(data)
    })
    this.tags.forEach(({ id, posts, name: title }) => {
      const data = {
        base: `/${tagDir}/${id}`,
        posts,
        title,
        perpage,
      }
      this.tag[id] = pagination(data)
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
