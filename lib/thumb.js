function thumb(issue, config) {
  const regex = /(!\[.*?]\()(.+?)(\))/
  const matched = issue.match(regex)

  if (!matched) {
    return { thumb: '', content: issue }
  }

  return {
    thumb: matched[2].split('""')[0].trim(),
    content: config.thumbnail_mode === 1 ? issue.replace(matched[0], '') : issue,
  }
}

module.exports = thumb
