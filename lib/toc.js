const mdtoc = require('markdown-toc')

function toc(body, markeder) {
  const { content } = mdtoc(body)
  let html = markeder(content)
  const hrefs = html.match(/href="([^"]*")/g) || []
  const hrefsifies = hrefs.map(href => decodeURIComponent(href.replace(/_|-/g, '')))

  hrefs.forEach((href, i) => {
    html = html.replace(href, hrefsifies[i])
  })

  return html
}

module.exports = toc
