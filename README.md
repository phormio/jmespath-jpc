This npm package provides a program called `jpc`, similar to the
[`jp`](https://github.com/jmespath/jp) program for querying JSON with
[JMESPath](https://jmespath.org/specification.html).
I wrote it after losing
confidence in `jp`, because of a
[bug](https://github.com/jmespath/go-jmespath/issues/84)
in the underlying library.

A notable feature of `jpc` is that you can choose which of the available
JavaScript libraries should parse your query.
The current options are:

* <https://github.com/jmespath/jmespath.js> (official)
* <https://github.com/nanoporetech/jmespath-ts>

I have no plans to put this package in the
[npm repository](https://www.npmjs.com/).
