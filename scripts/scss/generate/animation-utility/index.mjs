import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the project root directory
const projectRoot = process.cwd()

// Path to the central animations file and the output file
const animationsFolderPath = path.resolve(
  projectRoot,
  'src/styles/animations/mixin'
) // Path to the animations folder

const utilityFolderPath = path.resolve(
  projectRoot,
  'src/styles/animations/utilities'
)

const centralMixinFilePath = path.resolve(animationsFolderPath, '_mixin.scss') // Central file with all mixins
const outputFilePath = path.resolve(
  utilityFolderPath,
  '_utilities-generated.scss'
) // Output file

// Helper function to find @import paths in a given SCSS file content
function extractImportPathsFromFile(content) {
  const importRegex = /@import\s+['"]([^'"]+)['"]/g
  let importPaths = []
  let match

  while ((match = importRegex.exec(content)) !== null) {
    importPaths.push(match[1]) // Capture the import path
  }

  return importPaths
}

// Helper function to find mixin names in a given SCSS file content
function extractMixinsFromFile(content) {
  const mixinRegex = /@mixin\s+([a-zA-Z0-9_-]+)/g
  let mixins = []
  let match

  while ((match = mixinRegex.exec(content)) !== null) {
    mixins.push(match[1]) // Capture mixin name
  }

  return mixins
}

// Helper function to generate the utility classes content
function generateUtilityContent(mixinNames) {
  // Create only the required @use './animations' statement
  const importStatements = "@import '../mixin/mixin';\n"

  // Generate utility classes for each mixin without parentheses in @include
  let utilityClasses = ''
  mixinNames.forEach((mixin) => {
    const utilityClass = `.${mixin} {\n  @include ${mixin};\n}\n\n`
    utilityClasses += utilityClass
  })

  return `${importStatements}\n${utilityClasses}`
}

// Helper function to delete the existing file if it exists
function deleteExistingFile(filePath, logBox) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
      logBox(chalk.blue(`Deleted existing file: ${filePath}`))
    } catch (error) {
      logBox(chalk.red('✖ Error deleting existing file: ') + error.message)
    }
  }
}

// Helper function to generate the utility classes file
export async function generateAnimationUtility(logBox) {
  if (typeof logBox !== 'function') {
    throw new TypeError('logBox must be a function')
  }

  logBox(chalk.blue('Reading the central _animations.scss file...'))

  // Delete the existing _utility-generate.scss file before generating new content
  deleteExistingFile(outputFilePath, logBox)

  // Read the central _animations.scss file
  let centralMixinFileContent
  try {
    centralMixinFileContent = fs.readFileSync(centralMixinFilePath, 'utf8')
  } catch (error) {
    logBox(
      chalk.red('✖ Error reading the central _animations.scss file: ') +
        error.message
    )
    return
  }

  // Extract @import paths from the central file
  const importPaths = extractImportPathsFromFile(centralMixinFileContent)

  if (importPaths.length === 0) {
    logBox(
      chalk.yellow(
        '⚠️  No @import paths found in the central _animations.scss file.'
      )
    )
    return
  }

  logBox(
    chalk.green(
      `Found ${importPaths.length} @import paths in the central file.`
    )
  )

  // Resolve the import paths to absolute paths and extract mixins from each file
  let allMixins = []
  for (const importPath of importPaths) {
    // Convert relative import path to an absolute file path
    const importedFilePath = path.resolve(
      animationsFolderPath,
      `${importPath}.scss`
    )

    // Read the contents of the imported file
    let importedFileContent
    try {
      importedFileContent = fs.readFileSync(importedFilePath, 'utf8')
    } catch (error) {
      logBox(
        chalk.red(
          `✖ Error reading imported file: ${importedFilePath} - ${error.message}`
        )
      )
      continue
    }

    // Extract mixins from the imported file
    const mixins = extractMixinsFromFile(importedFileContent)
    if (mixins.length > 0) {
      logBox(
        chalk.green(`Found ${mixins.length} mixins in ${importedFilePath}.`)
      )
      allMixins = allMixins.concat(mixins)
    }
  }

  if (allMixins.length === 0) {
    logBox(chalk.yellow('⚠️  No mixins found in any imported files.'))
    return
  }

  logBox(chalk.green(`Total mixins found: ${allMixins.length}.`))

  // Generate the utility content
  const utilityContent = generateUtilityContent(allMixins)

  // Ensure the destination folder exists before writing the file
  const outputDir = path.dirname(outputFilePath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    logBox(chalk.blue(`Created directory: ${outputDir}`))
  }

  // Write the generated content to the output file
  try {
    fs.writeFileSync(outputFilePath, utilityContent, 'utf8')
    logBox(
      chalk.green('✨ Utility SCSS file generated successfully at: ') +
        outputFilePath
    )
  } catch (error) {
    logBox(
      chalk.red('✖ Error writing the utility SCSS file: ') + error.message
    )
  }
}
