# String Replacer

A GitHub Action for finding and replacing strings in your project files

[![GitHub Release](https://img.shields.io/github/release/thiagodnf/string-replacer.svg)](https://github.com/thiagodnf/string-replacer/releases/latest)
[![GitHub contributors](https://img.shields.io/github/contributors/thiagodnf/string-replacer.svg)](https://github.com/thiagodnf/string-replacer/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/thiagodnf/string-replacer.svg)](https://github.com/thiagodnf/string-replacer)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

## Input

### `find`
**Required** The regular expression you want to be replaced

### `replace`
**Required** The new string to be replaced

### `include`
**Optional** A glob of files to include in our find and replace. Default is `**`

### `exclude`
**Optional** A glob of files to exclude in our find and replace. Default is `.git/**`

## Outputs

### `modifiedFiles`

The number of files which have been modified

## Usage

### Example workflow

```yaml
name: My Workflow

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
     
      - uses: actions/checkout@main
     
      - name: Watch Your Profamity
        uses: jslattery26/watch_your_profamity@main
        with:
          include: |
            test/**/*.md
          exclude: |
            .git/**
            node_modules/**
```

you are a little cutersoner
fk you
ffuk you
i like a$$es a$$
cuterson
shit
cock
cockerspaniel
cuterson ỹоứ
cuterson
...and it does not match on the following:

the cuterson mightier than the sword
i love bananas so yeah
this song seems really banal
grapes are really yummy









