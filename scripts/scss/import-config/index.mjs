import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the project root based on the current working directory
const projectRoot = process.cwd() // This gives you the root directory of the project

// Path to the SPOT_CONFIG and output media.mjs file
const spotConfigPath = path.resolve(projectRoot, 'spot.config.ts') // Absolute path to spot.config.ts
const outputMediaFilePath = path.resolve(projectRoot, 'scripts/scss/config.mjs') // Absolute path to media.mjs output

// Dynamically import SPOT_CONFIG and generate media.mjs
export async function importConfig(logBox) {
  let SPOT_CONFIG
  try {
    SPOT_CONFIG = await import(spotConfigPath)
    logBox(chalk.green('Config imported successfully.'))
  } catch (error) {
    logBox(chalk.red('Failed to import Config: ') + error.message)
    return
  }

  // Extract the MEDIA configuration from SPOT_CONFIG
  const mediaConfig = SPOT_CONFIG.MEDIA
  if (!mediaConfig) {
    logBox(chalk.red('No MEDIA config found in SPOT_CONFIG.'))
    return
  }

  // Generate the content for media.mjs, preserving backticks
  const mediaFileContent =
    'export const MEDIA = {\n' +
    Object.entries(mediaConfig)
      .map(([key, value]) => `  ${key}: \`${value}\`,`)
      .join('\n') +
    '\n}\n'

  // Write the content to media.mjs
  try {
    fs.writeFileSync(outputMediaFilePath, mediaFileContent, 'utf8')
    logBox(chalk.gray(`Generated config.mjs at: ${outputMediaFilePath}`))
  } catch (error) {
    logBox(chalk.red(`Error writing config.mjs: ${error.message}`))
  }
}
