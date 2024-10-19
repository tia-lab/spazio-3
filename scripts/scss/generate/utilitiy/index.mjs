import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the project root based on the current working directory
const projectRoot = process.cwd()

// Define absolute paths for settings and output directories
const settingsFolder = path.resolve(projectRoot, 'src/styles/config') // Points to your config directory
const outputFolder = path.resolve(projectRoot, 'src/styles/vars') // Points to the output directory

const utilityFileName = '_utilities.scss' // File for utility classes
const globalUtilityFileName = '_utilities.scss' // File for global utility classes

// Helper function to convert camelCase or PascalCase to kebab-case
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Handle camelCase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // Handle PascalCase
    .replace(/(\d+)/g, '-$1') // Add hyphen before numbers
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .toLowerCase()
}

// Function to process double hyphens and ensure hyphen after `var(`
function processHyphens(content) {
  // Step 1: Remove all double hyphens
  let processedContent = content.replace(/--+/g, '-')

  // Step 2: Add a hyphen after `var(`
  processedContent = processedContent.replace(/var\(/g, 'var(-')

  return processedContent
}

// Function to generate utility classes based on the second array element
async function generateUtilityClasses(variables, mappings, parentKey = '') {
  let utilityClasses = ''

  for (const [key, value] of Object.entries(variables)) {
    const kebabKey = toKebabCase(key) // Convert key to kebab-case
    const variableKey = parentKey ? `${parentKey}-${kebabKey}` : kebabKey

    if (typeof value === 'object' && value !== null) {
      // Nested object, recurse into it
      const nestedResult = await generateUtilityClasses(
        value,
        mappings,
        variableKey
      )
      utilityClasses += nestedResult
    } else {
      // Generate utility classes based on the mappings provided
      mappings.forEach((mapping) => {
        for (const [classPrefix, cssProperty] of Object.entries(mapping)) {
          utilityClasses += `
          .${classPrefix}-${variableKey} {
            ${cssProperty}: var(--${variableKey});
          }

          `
        }
      })
    }
  }

  return processHyphens(utilityClasses)
}

// Function to remove classes with parentheses in their names
function removeInvalidClasses(filePath, logBox) {
  let fileContent = fs.readFileSync(filePath, 'utf8')

  // Regular expression to match classes with parentheses
  // eslint-disable-next-line
  const invalidClassPattern = /\.[^\s]+\([^\)]*\)[^\{]*\{[^\}]*\}/g

  // Remove all matches
  fileContent = fileContent.replace(invalidClassPattern, '')

  // Write the updated content back to the file
  fs.writeFileSync(filePath, fileContent, 'utf8')
  logBox(chalk.blue(`Removed invalid classes from ${filePath}.`))
}

// Function to write utility SCSS files for each export in settings and create a global file
export async function writeUtilitiesForAllSettings(logBox) {
  const settingsFolderPath = settingsFolder
  const outputFolderPath = outputFolder

  let globalUtilityContent = '' // Global utility content

  // Process starting from config/index.ts
  const configFilePath = path.resolve(settingsFolderPath, 'index.ts')

  // Dynamically import config/index.ts
  let importedModule
  try {
    importedModule = await import(configFilePath)
    logBox(
      chalk.green(
        'Imported modules: ',
        chalk.cyan(JSON.stringify(Object.keys(importedModule)))
      )
    )
  } catch (error) {
    logBox(chalk.red('Error importing config/index.ts:', error))
    return
  }

  for (const [exportName, exportValue] of Object.entries(importedModule)) {
    if (Array.isArray(exportValue) && typeof exportValue[0] === 'object') {
      const [variables, mappings] = exportValue // Destructure variables and mappings
      const exportFolderPath = path.join(outputFolderPath, exportName)

      // If the array (mappings) is empty, skip utility generation
      if (!mappings || mappings.length === 0) {
        logBox(
          chalk.yellow(
            `Skipping utility generation for ${exportName} because mappings array is empty.`
          )
        )
        continue // Skip this export
      }

      if (!fs.existsSync(exportFolderPath)) {
        fs.mkdirSync(exportFolderPath, { recursive: true })
      }

      // Generate utility classes based on the variables and mappings
      const scssUtilities = await generateUtilityClasses(variables, mappings)

      // Write the utility SCSS file for the current export
      const exportUtilityFilePath = path.join(exportFolderPath, utilityFileName)
      fs.writeFileSync(exportUtilityFilePath, scssUtilities, 'utf8')
      logBox(chalk.gray(`Created ${utilityFileName} in ${exportFolderPath}`))

      // Remove invalid classes from the individual utility file
      removeInvalidClasses(exportUtilityFilePath, logBox)

      // Append to the global utility content
      globalUtilityContent += `\n/* Utility classes for ${exportName} */\n${scssUtilities}`
    }
  }

  // Write the global utility SCSS file
  const globalUtilityFilePath = path.join(
    outputFolderPath,
    globalUtilityFileName
  )
  fs.writeFileSync(globalUtilityFilePath, globalUtilityContent, 'utf8')
  logBox(
    chalk.gray(
      `Created global utility file: ${globalUtilityFileName} in ${outputFolderPath}`
    )
  )

  // Remove invalid classes from the global utility file
  removeInvalidClasses(globalUtilityFilePath, logBox)
}

// If this script is called directly, run the SCSS utility generation
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running SCSS utility generation script directly...')
  writeUtilitiesForAllSettings(console.log).catch((error) => {
    console.error('Error running SCSS utility generation:', error)
  })
}
