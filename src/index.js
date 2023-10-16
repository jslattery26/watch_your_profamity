const core = require('@actions/core')

const FileUtils = require('./utils/FileUtils')
const ActionUtils = require('./utils/ActionUtils')
const ArrayUtils = require('./utils/ArrayUtils')
const {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  //   englishRecommendedTransformers,
} = require('obscenity')

async function run() {
  try {
    if (FileUtils.isWorkspaceEmpty()) {
      throw new Error('Workspace is empty')
    }

    const matcher = new RegExpMatcher({
      ...englishDataset.build(),
      //   ...englishRecommendedTransformers,
    })

    let find = 'fuck'
    let replace = ActionUtils.getInput('replace', { required: false })
    let include = ActionUtils.getInputAsArray('include', { required: false })
    let exclude = ActionUtils.getInputAsArray('exclude', { required: false })

    find = new RegExp(find, 'gm')
    include = ArrayUtils.split(include, ',')
    exclude = ArrayUtils.split(exclude, ',')

    core.info(`include: ${JSON.stringify(include)}`)
    core.info(`exclude: ${JSON.stringify(exclude)}`)
    core.info(`find: ${find}`)
    core.info(`replace: ${replace}`)

    const files = FileUtils.searchFiles(include, exclude)

    core.info(`Found ${files.length} file(s). Checking them out:`)

    let modifiedFiles = 0
    const fudgeStrategy = () => 'cute'
    const censor = new TextCensor().setStrategy(fudgeStrategy)

    files.forEach((file) => {
      core.info(`Processing: ${file}`)

      let content = FileUtils.readContent(file)

      const input = content
      const matches = matcher.getAllMatches(input)
      const newContent = censor.applyTo(input, matches)

      if (content != newContent) {
        modifiedFiles++
      }

      FileUtils.writeContent(file, newContent)
    })

    core.info('Done. All files checked')

    core.setOutput('modifiedFiles', modifiedFiles)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
