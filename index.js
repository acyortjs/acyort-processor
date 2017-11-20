const Marked = require('acyort-marked')
const Pagination = require('./lib/pagination')
const postCategory = require('./lib/category')
const postFilter = require('./lib/filter')
const postPage = require('./lib/page')
const postTag = require('./lib/tag')
const postThumb = require('./lib/thumb')
const postToc = require('./lib/toc')
const postSummary = require('./lib/summary')

class Processor extends Pagination {
  constructor(config) {
    const markeder = new Marked(config)
    super(config)
    this.config = config
    this.markeder = (...args) => markeder.mark(...args)
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
    const archives = {
      name: title,
      type: 'archives',
      posts,
    }

    this.paginations.page = this.paging(page)
    this.paginations.archives = this.paging(archives)
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
      const data = this.getPost(post)
      data.prev = i > 0 ? posts[i - 1].id : ''
      data.next = i < posts.length - 1 ? posts[i + 1].id : ''
      return data
    })
  }

  getPost(post) {
    const { config, markeder } = this
    const {
      id,
      created_at,
      updated_at,
      title,
      user: {
        login,
        avatar_url,
        html_url,
      },
      body,
    } = post

    const data = {
      id,
      created: created_at,
      updated: updated_at,
      title,
      path: `/${config.post_dir}/${id}.html`,
      url: `/${config.post_dir}/${id}.html`,
      author: {
        name: login,
        avatar: avatar_url,
        url: html_url,
      },
      html: markeder(body, true),
      toc: postToc(body, markeder),
      category: postCategory(post, config),
      tags: postTag(post, config),
    }

    const { thumb, content } = postThumb(body, config)
    const { summary, main } = postSummary(content)

    data.thumb = thumb
    data.summary = markeder(summary)
    data.content = markeder(main)

    return data
  }

  setPages(pages) {
    this.pages = pages.map(page => postPage(page, this.markeder))
  }

  process(issues) {
    const { pages, posts } = postFilter(issues, this.config)

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
