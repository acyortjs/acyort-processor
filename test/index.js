const assert = require('power-assert')
const path = require('path')
const Marked = require('acyort-marked')
const Processor = require('../')
const issues = require('./fixtures/issues.json')
const originConfig = require('./fixtures/config.json')

const marked = new Marked(originConfig)
const markeder = (...args) => marked.mark(...args)

function rejects(promise) {
  return promise
    .then(() => Promise.reject(new Error('Missing expected rejection')))
    .catch(reason => Promise.resolve(reason))
}

function getConfig() {
  return JSON.parse(JSON.stringify(originConfig))
}

String.prototype.trim = function() {
  return this
    .replace(/\n/g, '')
    .replace(/[\t ]+\</g, '<')
    .replace(/\>[\t ]+\</g, '><')
    .replace(/\>[\t ]+$/g, '>')
}

describe('processor', () => {
  it('no content', async () => {
    const msg = 'No content. Check user, repository or authors fields'

    const config = getConfig()
    config.authors = ['author']
    let processor = new Processor(config)
    assert((await rejects(processor.process(issues))).message === msg)

    processor = new Processor(originConfig)
    assert((await rejects(processor.process([]))).message === msg)
  })

  it('pagination', async () => {
    const config = getConfig()
    const processor = new Processor(config)
    const {
      posts,
      index,
      categories,
      tags,
      category,
      tag,
    } = await processor.process(issues)

    assert(index.length === Math.ceil(posts.length / config.per_page))

    categories.forEach((c) => {
      assert(category[c.id].length === Math.ceil(c.posts.length / config.per_page))
    })

    tags.forEach((t) => {
      assert(tag[t.id].length === Math.ceil(t.posts.length / config.per_page))
    })
  })

  it('tags', async () => {
    const processor = new Processor(originConfig)
    const { tags, posts, pages } = await processor.process(issues)
    const _labels = []
    const noLabels = []
    let _posts = []
    const pageids = pages.map(p => p.id)

    issues.forEach(({ labels }, i) => {
      if (!labels.length && pageids.indexOf(issues[i].id) === -1) {
        noLabels.push(issues[i].id)
      }
      labels.forEach((label) => {
        const exits = _labels.find(l => l.id === label.id)
        if (!exits) {
          _labels.push(label)
        }
      })
    })

    tags.forEach((t) => {
      assert(_labels.find(l => l.id === t.id) !== undefined)
      assert(_labels.find(l => l.name === t.name) !== undefined)
      assert(t.url === `/${originConfig.tag_dir}/${t.id}/`)
      _posts = _posts.concat(t.posts)
    })

    _posts = [...new Set(_posts)]
    assert(_posts.length + noLabels.length === posts.length)
  })

  it('categories', async () => {
    const processor = new Processor(originConfig)
    const { categories, posts } = await processor.process(issues)
    const milestones = []
    let _posts = []

    issues.forEach(({ milestone }) => {
      if (milestone) {
        const exits = milestones.find(m => m.id === milestone.id)
        if (!exits) {
          milestones.push(milestone)
        }
      }
    })

    categories.forEach((c) => {
      if (c.id !== 0) {
        assert(milestones.find(m => m.id === c.id) !== undefined)
        assert(milestones.find(m => m.title === c.name) !== undefined)
      } else {
        assert(c.name === originConfig.default_category)
      }
      assert(c.url === `/${originConfig.category_dir}/${c.id}/`)
      _posts = _posts.concat(c.posts)
    })

    assert(posts.length === _posts.length)
  })

  it('pages', async () => {
    const processor = new Processor(originConfig)
    const { pages } = await processor.process(issues)
    const issue = issues[0]
    const page = pages[0]

    assert(pages.length === 2)
    assert(page.id === issue.id)
    assert(page.url === path.join('/', `/${issue.title.split(']')[0].split('[')[1]}/`))
    assert(page.path === path.join('/', `/${issue.title.split(']')[0].split('[')[1]}/index.html`))
    assert(page.name === issue.title.split(']')[0].split('[')[1].split('/').filter(i => i).slice(-1)[0])
    assert(page.title === issue.title.split(']')[1])
    assert(page.created === issue.created_at)
    assert(page.updated === issue.updated_at)
    assert(markeder(issue.body) === page.content)
  })

  it('posts', async () => {
    const _config = getConfig()
    let processor = new Processor(_config)
    let { posts } = await processor.process(issues)
    const post = posts[0]
    const issue = issues[1]

    assert(posts.length === 4)
    assert(post.id === issue.id)
    assert(post.created === issue.created_at)
    assert(post.updated === issue.updated_at)
    assert(post.title === issue.title)
    assert(`/${_config.post_dir}/${post.id}.html` === post.path)
    assert(`/${_config.post_dir}/${post.id}.html` === post.url)
    assert(post.author.name === issue.user.login)
    assert(post.author.avatar === issue.user.avatar_url)
    assert(post.author.url === issue.user.html_url)
    assert(post.category.id === issue.milestone.id)
    assert(post.category.name === issue.milestone.title)
    assert(posts[1].tags.length === issues[2].labels.length)
    assert(posts[1].tags[0].id === issues[2].labels[0].id)
    assert(posts[1].tags[0].name === issues[2].labels[0].name)
    assert(post.excerpt === '')
    assert(posts[1].content === markeder(issues[2].body.replace(/<!--\s*more\s*-->/, '')))
    assert(posts[1].excerpt === markeder(issues[2].body.split(/<!--\s*more\s*-->/)[0]))
    assert(post.raw === issue.body)

    assert(`/${_config.category_dir}/${posts[0].category.id}/` === posts[0].category.url)
    assert(`/${_config.category_dir}/0/` === posts[2].category.url)
    assert(_config.default_category === posts[2].category.name)
    assert(posts[0].tags.length === 0)
    assert(`/${_config.tag_dir}/${posts[1].tags[0].id}/` === posts[1].tags[0].url)

    assert(posts[0].next === posts[1].id)
    assert(posts[0].prev === '')
    assert(posts[1].prev === posts[0].id)
    assert(posts[posts.length - 1].next === '')
  })
})
