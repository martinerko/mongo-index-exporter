# Mongo index exporter
Having correct and effective indexes is very important. As your system grows you might want to update indexes to increase your db performance.
You would probably need to start with exporting current indexes.

I have created this utility to simplify this process.

## Usage
This utility can be used as a node module (see [sample](https://github.com/martinerko/mongo-index-exporter/tree/master/samples) folder) and also as a command-line tool.

This utility is provided with help that will tell you everything you might need:

```sh
node bin/  --help
```

Basic usage:

```sh
node bin/ localhost:27017/test
```

Usage with authentication:

```sh
node bin/ localhost:27017/test --username john --password T0pS3ecr3tP@ssw0rd
```

### Output
Bin version outputs index definitions in a format that you can immediately use to instantiate your database indexes:

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

## Disclaimer
This utility was created by me during my free time and any usage is at your own risk.

## License
(The MIT License)

Copyright (c) 2016 martinerko

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
