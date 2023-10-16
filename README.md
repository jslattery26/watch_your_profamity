# Watch your profamity
This action executes find-and-replace on profane words in your project

## Inputs

### `source`

**Required** The source string to apply this action to

### `find`

**Required** The text you want to search for within the branch name (eg. `ref/heads/`)

### `replace`

**Required** The text you want to replace (eg. `head-`, ``, `root_`)

### `replaceAll`

**Optional** Should replace all occurrences? (only 'true' string will be interpreted positive)

## Outputs

### `value`

The new value containing the found-and-replaced string.

### Example usage

```yaml
uses: jslattery26/watch_your_profamity@3
with:
    source: ${{ github.ref }} # this translates to ref/heads/main on the main branch, but can be any arbitrary string 
    find: 'ref/heads/'        # we want to remove ref/heads/ from source 
    replace: ''               # and replace it with a blank string (ie. removing it)
```

This will output `main`.

Check out `.github/workflows/main.yml` for more examples

