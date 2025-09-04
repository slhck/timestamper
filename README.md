# Timestamper

A simple, clean web tool for converting between Unix timestamps and human-readable dates.

## Features

- **Unix to Date conversion** with automatic detection of seconds, milliseconds, and microseconds
- **Date to Unix conversion** with fuzzy parsing of various date formats
- Support for decimal Unix timestamps (seconds.milliseconds format)
- Multiple output formats:
  - ISO 8601 (UTC and local)
  - Human-readable format
  - RFC 822/1123/2822
  - RFC 3339
- Click-to-copy functionality on all output values
- "Use current date" button for quick access to current timestamp
- Clean, dark-mode-only interface
- No external dependencies or servers - runs entirely in your browser

## Behind the scenes

The tool uses [Luxon](https://moment.github.io/luxon/) for robust date/time handling and parsing.

Built with Tailwind CSS for styling.

## License

Copyright (c) Werner Robitza

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
