# acyort-processor

[![Build Status](https://travis-ci.org/acyortjs/acyort-processor.svg?branch=master)](https://travis-ci.org/acyortjs/acyort-processor)
[![codecov](https://codecov.io/gh/acyortjs/acyort-processor/branch/master/graph/badge.svg)](https://codecov.io/gh/acyortjs/acyort-processor)

Processor for [AcyOrt](https://github.com/acyortjs/acyort)

## Install

```bash
$ npm i acyort-processor -S
```

## Usage

```js
// npm i acyort-marked -S
const Marked = require('acyort-marked')
const Processor = require('acyort-processor')

const config = {
  "title": "acyort",
  "post_dir": "post",
  "category_dir": "category",
  "default_category": "uncategorized",
  "authors": ["LoeiFy"],
  "per_page": 2,
  "root": "/",
  "tag_dir": "tag",
  "thumbnail_mode": 1
}
const issues = [...issues] // data from github api
const processor = new Processor({
  config,
  markeder: new Marked(config)
})

processor.process(issue)
  .then(res => console.log(res))
  .catch(err => console.error(err))

/*
{
  posts: [...],
  pages: [...],
  categories: [...],
  tags: [...],
  paginations: {
    page: [...],
    categories: {
      ...: [...]
    },
    tags: {
      ...: [...]
    }
  }
}
more: check the issue https://github.com/acyortjs/acyortjs.github.io/issues/11
*/
```
