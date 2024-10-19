import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MEDIA } from '../../config.mjs' // Import the dynamically generated MEDIA file
/* eslint-disable no-unused-vars */
// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the project root based on the current working directory
const projectRoot = process.cwd() // This gives you the root directory of the project

// Define absolute paths for settings and output directories
const settingsFolder = path.resolve(projectRoot, 'src/styles/config') // Points to your config directory
const outputFolder = path.resolve(projectRoot, 'src/styles/vars') // Points to the output directory

const rootFileName = '_root.scss' // File for CSS variables
const scssFileName = '_vars.scss' // File for SCSS variables

// Helper function to convert camelCase or PascalCase to kebab-case and handle numbers
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Handle camelCase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // Handle PascalCase
    .replace(/([a-zA-Z])(\d)/g, '$1-$2') // Add hyphen before numbers
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .toLowerCase()
}

// Function to generate SCSS variables and handle media queries (utilities removed for now)
async function generateScss(variables, mapName, parentKey = '') {
  let cssVariables = ''
  let scssVariables = ''
  let mediaQueries = {} // To store variables for media queries

  for (const [key, value] of Object.entries(variables)) {
    const kebabKey = toKebabCase(key) // Convert to kebab-case
    const variableKey = parentKey ? `${parentKey}-${kebabKey}` : kebabKey

    if (typeof value === 'object' && value !== null) {
      // If the value is an object, check if it contains media queries or is a nested object
      if (value.default !== undefined) {
        // Handle variables with a 'default' value and media queries
        cssVariables += `  --${variableKey}: ${value.default};\n` // Default value inside :root
        scssVariables += `$${variableKey}: var(--${variableKey});\n` // SCSS variable outside :root

        // Handle media queries for this variable
        Object.entries(value).forEach(([mediaKey, mediaValue]) => {
          const resolvedMediaKey = MEDIA[mediaKey] ? MEDIA[mediaKey] : mediaKey
          if (mediaKey !== 'default' && resolvedMediaKey) {
            mediaQueries[resolvedMediaKey] =
              mediaQueries[resolvedMediaKey] || ''
            mediaQueries[resolvedMediaKey] +=
              `  --${variableKey}: ${mediaValue};\n`
          }
        })
      } else {
        // If it's a nested object, recurse into it
        const nestedResult = await generateScss(value, mapName, variableKey)
        cssVariables += nestedResult.cssVariables
        scssVariables += nestedResult.scssVariables
        Object.keys(nestedResult.mediaQueries).forEach((media) => {
          mediaQueries[media] = mediaQueries[media] || ''
          mediaQueries[media] += nestedResult.mediaQueries[media]
        })
      }
    } else if (typeof value === 'string') {
      // Handle simple variables
      cssVariables += `  --${variableKey}: ${value};\n` // Include all top-level variables
      scssVariables += `$${variableKey}: var(--${variableKey});\n`
    }
  }

  return { cssVariables, scssVariables, mediaQueries }
}

// Function to write SCSS files for each export in settings (no utility generation)
export async function writeScssForAllSettings(logBox) {
  const settingsFolderPath = settingsFolder
  const outputFolderPath = outputFolder

  // Clear the output folder before writing new files
  clearOutputFolder(outputFolderPath, logBox)

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
    ) // Debugging log
  } catch (error) {
    logBox(chalk.red('Error importing config/index.ts:', error))
    return
  }

  let globalCssVarsContent = ':root {\n'
  let globalScssVarsContent = ''
  let globalMediaQueries = {} // To collect media queries globally

  for (const [exportName, exportValue] of Object.entries(importedModule)) {
    if (Array.isArray(exportValue) && typeof exportValue[0] === 'object') {
      const [variables] = exportValue // Destructure variables only
      const exportFolderPath = path.join(outputFolderPath, exportName)
      if (!fs.existsSync(exportFolderPath)) {
        fs.mkdirSync(exportFolderPath, { recursive: true })
      }

      // Dynamically use the export name as the map name
      const { cssVariables, scssVariables, mediaQueries } = await generateScss(
        variables,
        exportName
      )

      let exportCssVarsContent = `:root {\n${cssVariables}}`

      // Order media queries based on the order defined in MEDIA
      Object.entries(MEDIA).forEach(([mediaKey, mediaValue]) => {
        if (mediaQueries[mediaValue]) {
          exportCssVarsContent += `\n\n@media ${mediaValue} {\n  :root {\n${mediaQueries[mediaValue]}  }\n}`
        }
      })

      let exportScssVarsContent = `${scssVariables}`

      const exportRootFilePath = path.join(exportFolderPath, rootFileName)
      const exportScssFilePath = path.join(exportFolderPath, scssFileName)

      fs.writeFileSync(exportRootFilePath, exportCssVarsContent, 'utf8')
      fs.writeFileSync(exportScssFilePath, exportScssVarsContent, 'utf8')

      logBox(
        chalk.grey(
          `Created ${rootFileName} and ${scssFileName} in ${exportFolderPath}`
        )
      )

      globalCssVarsContent += `${cssVariables}`
      globalScssVarsContent += `${scssVariables}`

      // Append media queries for global root based on MEDIA order
      Object.entries(MEDIA).forEach(([mediaKey, mediaValue]) => {
        if (mediaQueries[mediaValue]) {
          globalMediaQueries[mediaValue] = globalMediaQueries[mediaValue] || ''
          globalMediaQueries[mediaValue] += `${mediaQueries[mediaValue]}`
        }
      })
    }
  }

  globalCssVarsContent += '}\n'

  // Append media queries to the global root in the same order as MEDIA
  Object.entries(MEDIA).forEach(([mediaKey, mediaValue]) => {
    if (globalMediaQueries[mediaValue]) {
      globalCssVarsContent += `\n@media ${mediaValue} {\n  :root {\n${globalMediaQueries[mediaValue]}  }\n}`
    }
  })

  // Write the global root and vars files
  const globalRootFilePath = path.join(outputFolderPath, rootFileName)
  const globalScssFilePath = path.join(outputFolderPath, scssFileName)

  fs.writeFileSync(globalRootFilePath, globalCssVarsContent, 'utf8')
  fs.writeFileSync(globalScssFilePath, globalScssVarsContent, 'utf8')

  logBox(
    chalk.grey(
      `Created global ${rootFileName} and ${scssFileName} in ${outputFolderPath}`
    )
  )
}

// Helper function to delete files and directories in the output folder
function clearOutputFolder(outputFolderPath, logBox) {
  if (fs.existsSync(outputFolderPath)) {
    const items = fs.readdirSync(outputFolderPath)
    for (const item of items) {
      const itemPath = path.join(outputFolderPath, item)

      // Check if the item is a directory or a file
      if (fs.lstatSync(itemPath).isDirectory()) {
        // Recursively delete the directory
        clearOutputFolder(itemPath, logBox)
        fs.rmdirSync(itemPath) // Remove the directory after clearing its content
      } else {
        // Remove the file
        fs.unlinkSync(itemPath)
      }
    }
    logBox(chalk.blue(`Cleared output folder: ${outputFolderPath}`))
  }
}

// If this script is called directly, run the SCSS generation
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running SCSS generation script directly...')
  writeScssForAllSettings().catch((error) => {
    console.error('Error running SCSS generation:', error)
  })
}
