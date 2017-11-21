const assert = require('power-assert')
const Marked = require('acyort-marked')
const Processor = require('../')
const issues = require('./fixtures/issues.json')
const config = require('./fixtures/config.json')

const marked = new Marked(config)
const markeder = (...args) => marked.mark(...args)

function rejects(promise) {
  return promise
    .then(() => Promise.reject(new Error('Missing expected rejection')))
    .catch(reason => Promise.resolve(reason))
}

describe('processor', () => {
  it('no content', async () => {
    const msg = 'No content. Check user, repository or authors fields'
    const _config = JSON.parse(JSON.stringify(config))
    _config.authors = ['author']
    let processor = new Processor(_config)

    assert((await rejects(processor.process(issues))).message === msg)

    processor = new Processor(config)

    assert((await rejects(processor.process([]))).message === msg)
  })

  it('pages', async () => {
    const processor = new Processor(config)
    const { pages } = await processor.process(issues)
    const issue = issues[3]
    const page = pages[0]

    assert(pages.length === 1)
    assert(page.id === issue.id)
    assert(page.url === `/${issue.title.split(']')[0].split('[')[1]}/`)
    assert(page.path === `/${issue.title.split(']')[0].split('[')[1]}/index.html`)
    assert(page.name === issue.title.split(']')[0].split('[')[1])
    assert(page.title === issue.title.split(']')[1])
    assert(page.created === issue.created_at)
    assert(page.updated === issue.updated_at)
    assert(markeder(issue.body) === page.content)
  })

  it('posts', async () => {
    const _config = JSON.parse(JSON.stringify(config))
    let processor = new Processor(_config)
    let { posts } = await processor.process(issues)
    const post1 = {
      id: 138194595,
      created: '2016-03-03T14:36:26Z',
      updated: '2017-11-03T07:10:07Z',
      title: 'Markdown Cheatsheet',
      path: '/post/138194595.html',
      url: '/post/138194595.html',
      author:
       { name: 'LoeiFy',
         avatar: 'https://avatars0.githubusercontent.com/u/2193211?v=4',
         url: 'https://github.com/LoeiFy' },
      toc: '',
      category: { id: 2195893, name: 'test', url: 'category/2195893/' },
      tags:
       [ { id: 335624168, name: 'duplicate', url: 'tag/335624168/' },
         { id: 335624169, name: 'enhancement', url: 'tag/335624169/' } ],
      thumb: 'https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png',
      summary: '',
      content: '<hr>\n<p>title: LoadRuner中的参数与变量\npermalink: post/loadrunner-parameter-variable</p>\n<h2 id="tags脚本开发loadrunner">tags: [脚本开发, LoadRunner]</h2><p>Emphasis, aka italics, with <em>asterisks</em> or <em>underscores</em>.</p>\n<p>Strong emphasis, aka bold, with <strong>asterisks</strong> or <strong>underscores</strong>.</p>\n<p>Combined emphasis with <strong>asterisks and <em>underscores</em></strong>.</p>\n<p>Strikethrough uses two tildes. <del>Scratch this.</del></p>\n<ol>\n<li>First ordered list item</li><li>Another item\n⋅⋅* Unordered sub-list. </li><li>Actual numbers don&#39;t matter, just that it&#39;s a number\n⋅⋅1. Ordered sub-list</li><li>And another item.</li></ol>\n<p>⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we&#39;ll use three here to also align the raw Markdown).</p>\n<p>⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅\n⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅\n⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)</p>\n<ul>\n<li>Unordered list can use asterisks</li><li>Or minuses</li><li>Or pluses</li></ul>\n<p><a href="https://www.google.com">I&#39;m an inline-style link</a></p>\n<p><a href="https://www.google.com">I&#39;m an inline-style link with title</a></p>\n<p>[I&#39;m a reference-style link][Arbitrary case-insensitive reference text]</p>\n<p><a href="../blob/master/LICENSE">I&#39;m a relative reference to a repository file</a></p>\n<p>Here&#39;s our logo (hover to see the title text):</p>\n<p>Inline-style: </p>\n<p>Reference-style: \n<img src="https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png" alt="alt text"></p>\n\n        <div class="hljs javascript">\n          <pre>var s = <span class="hljs-string">"JavaScript syntax highlighting"</span><span class="hljs-comment">;</span>\nalert(s)<span class="hljs-comment">;</span></pre>\n        </div>\n      \n        <div class="hljs python">\n          <pre>s = <span class="hljs-string">"Python syntax highlighting"</span>\nprint s</pre>\n        </div>\n      \n        <div class="hljs">\n          <pre>No language indicated, so no syntax highlighting. \nBut let&#39;s throw in a &lt;b&gt;tag&lt;&#x2F;b&gt;.</pre>\n        </div>\n      ',
      prev: 138196161,
      next: 138194267
    }

    assert(posts.length === 5)

    assert(`/${_config.post_dir}/${posts[0].id}.html` === posts[0].url)
    assert(`/${_config.category_dir}/${posts[0].category.id}/` === posts[0].category.url)
    assert(`/${_config.category_dir}/0/` === posts[3].category.url)
    assert(_config.default_category === posts[3].category.name)
    assert(posts[0].tags.length === 0)
    assert(`/${_config.tag_dir}/${posts[1].tags[0].id}/` === posts[1].tags[0].url)

    assert(posts[0].next === posts[1].id)
    assert(posts[0].prev === '')
    assert(posts[1].prev === posts[0].id)
    assert(posts[posts.length - 1].next === '')
  })
})
