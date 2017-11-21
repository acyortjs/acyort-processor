# acyort-processor

Processor for [AcyOrt](https://github.com/acyortjs/acyort)

## Install

```bash
$ npm i acyort-processor -S
```

## Usage

```js
const Processor = require('acyort-processor')

const config = {
  "title": "acyort",
  "post_dir": "post",
  "category_dir": "category",
  "default_category": "uncategorized",
  "authors": ["LoeiFy"],
  "archives_per_page": 0,
  "per_page": 2,
  "root": "/",
  "archives_dir": "archives",
  "tag_dir": "tag",
  "thumbnail_mode": 1
}
const issues = [...issues] // data from github api
const processor = new Processor(config)

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
    archives: [...],
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
