function excerpt(issue) {
  const regex = /<!--\s*more\s*-->/
  const splited = issue.split(regex)

  if (splited.length > 1) {
    return {
      excerpt: splited[0],
      content: issue.replace(regex, ''),
    }
  }

  return { excerpt: '', content: issue }
}

module.exports = excerpt
