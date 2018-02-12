# acyort-processor

[![Build Status](https://travis-ci.org/acyortjs/acyort-processor.svg?branch=master)](https://travis-ci.org/acyortjs/acyort-processor)
[![codecov](https://codecov.io/gh/acyortjs/acyort-processor/branch/master/graph/badge.svg)](https://codecov.io/gh/acyortjs/acyort-processor)

Data Processor for [AcyOrt](https://github.com/acyortjs/acyort)

## Install

```bash
$ npm i acyort-processor -S
```

## Usage

```js
const processor = require('acyort-processor')

const config = {
  "title": "acyort",
  "post_dir": "post",
  "category_dir": "category",
  "default_category": "uncategorized",
  "authors": ["LoeiFy"],
  "per_page": 2,
  "root": "/",
  "tag_dir": "tag"
}
const issues = [...issues] // data from github api

processor.call(config, issue)
  .then(res => console.log(res))
  .catch(err => console.error(err))

/*
{
  posts: [...],
  pages: [...],
  categories: [...],
  tags: [...],
  index: [...],
  category: {
    ...: [...]
  },
  tag: {
    ...: [...]
  }
}
more: https://acyort.com/docs/variables/
*/
```
