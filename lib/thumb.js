function thumb(issue, config) {
  const regex = /(!\[.*?]\()(.+?)(\))/
  const thumb = issue.match(regex)

  if (!thumb) {
    return { thumb: '', content: issue }
  }

  return {
    thumb: thumb[2].split('""')[0].trim(),
    content: config.thumbnail_mode === 1 ? issue.replace(thumb[0], '') : issue,
  }
}

module.exports = thumb
