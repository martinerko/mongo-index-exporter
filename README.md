# Mongo index exporter
Having correct and effective indexes is very important. As your system grows
you might want to update indexes to increase performance of your db.
You would probably need to start with exporting current indexes.

I have created this utility to simplify this process.

## Usage

This utility can be used as a command-line tool and also as a node module
(see [sample](https://github.com/martinerko/mongo-index-exporter/tree/master/sample) folder).

## Installation

```sh
npm install -g mongo-index-exporter
```

## CLI

Command-line version is provided with help that will tell you everything you
might need:

```sh
mongo-index-exporter  --help
```

Basic usage:

```sh
mongo-index-exporter localhost:27017/test
```

Usage with authentication:

```sh
mongo-index-exporter localhost:27017/test --username john --password s3ecr3t
```

### Output
CLI version outputs index definitions in a format that you can immediately use
to instantiate your database indexes:

```sh
// library.books
db.library.books.createIndex({"_id":1}, {"name":"_id_"});
db.library.books.createIndex({"author.name":1}, {"name":"author.name_1"});
db.library.books.createIndex({"genre":1}, {"name":"genre_1"});
db.library.books.createIndex({"title":1,"author.name":1}, {"name":"title_1_author.name_1"});

// library.genres
db.library.genres.createIndex({"_id":1}, {"name":"_id_"});
db.library.genres.createIndex({"title":1}, {"unique":true,"name":"title_1"});
```

## Full workflow

1. Use [mongo-index-exporter](https://www.npmjs.com/package/mongo-index-exporter) to extract indexes from your database:

  ```sh
  mongo-index-exporter localhost:27017/test > indexesForReview.txt
  ```

2. Manually review and update index definitions (reviewedIndexes.txt).

3. Import them into database:

  ```sh
  cat reviewedIndexes.txt | mongo localhost:27017/test
  ```

4. Use [mongo-index-reviewer](https://www.npmjs.com/package/mongo-index-reviewer) to compare reviewed indexes with those in database:

  ```sh
  mongo-index-reviewer localhost:27017/test --indexFile ./reviewedIndexes.txt > outstandingIndexes.txt
  ```
5. Remove outstanding indexes from your database:

  ```sh
  cat outstandingIndexes.txt | mongo localhost:27017/test
  ```

## Disclaimer
This utility was created by me during my free time and any usage is at your own risk.

## License
(The MIT License)

Copyright (c) 2016 martinerko

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
