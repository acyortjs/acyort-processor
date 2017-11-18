const mdtoc = require('markdown-toc')
const marked = require('acyort-marked')

function toc(body) {
  const { content } = mdtoc(body)
  let html = marked(content)
  const hrefs = html.match(/href="([^"]*")/g) || []
  const hrefsifies = hrefs.map(href => decodeURIComponent(href.replace(/_|-/g, '')))

  hrefs.forEach((href, i) => {
    html = html.replace(href, hrefsifies[i])
  })

  return html
}

module.exports = toc
