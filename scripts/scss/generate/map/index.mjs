import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

// Define the output directory where the _vars.scss and _map.scss files are located/generated
const outputFolder = path.resolve(process.cwd(), 'src/styles/vars')

// Helper function to read files
async function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

// Helper function to write files
async function writeFileAsync(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// Helper function to get all subdirectories
function getSubdirectories(source) {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(source, dirent.name))
}

// Function to generate the SCSS map for a specific folder
async function generateScssMapForFolder(folderPath, logBox) {
  const varsFilePath = path.join(folderPath, '_vars.scss')
  const mapFilePath = path.join(folderPath, '_map.scss')
  const folderName = path.basename(folderPath)

  // Read the _vars.scss file
  let varsContent = ''
  try {
    varsContent = await readFileAsync(varsFilePath)
  } catch (error) {
    logBox(chalk.red(`Failed to read _vars.scss in ${folderPath}:`, error))
    return
  }

  // Generate the map content
  let mapContent = `$${folderName}: (\n`
  const varsLines = varsContent.split('\n')
  for (const line of varsLines) {
    if (line.trim()) {
      const [variable, value] = line.split(':')
      if (variable && value) {
        const mapKey = variable.trim().substring(1) // Remove the leading $
        const mapValue = value.replace(';', ',').trim() // Replace ; with ,
        mapContent += `  ${mapKey}: ${mapValue}\n`
      }
    }
  }
  mapContent += ');\n'

  // Write the _map.scss file
  try {
    await writeFileAsync(mapFilePath, mapContent)
    logBox(chalk.grey(`Created _map.scss in ${folderPath}`))
  } catch (error) {
    logBox(chalk.red(`Failed to write _map.scss in ${folderPath}:`, error))
  }

  return mapContent // Return the map content for global inclusion
}

// Function to generate SCSS maps for all subfolders and create a global _map.scss file
export async function generateScssMap(logBox) {
  const subdirectories = getSubdirectories(outputFolder)
  let globalMapContent = ''

  // Process each subdirectory and generate its _map.scss
  for (const folderPath of subdirectories) {
    const mapContent = await generateScssMapForFolder(folderPath, logBox)
    if (mapContent) {
      globalMapContent += `\n${mapContent}`
    }
  }

  // Write the global _map.scss file
  const globalMapFilePath = path.join(outputFolder, '_map.scss')
  try {
    await writeFileAsync(globalMapFilePath, globalMapContent)
    logBox(chalk.gray(`Created global _map.scss in ${outputFolder}`))
  } catch (error) {
    logBox(chalk.red('Failed to write global _map.scss:', error))
  }
}

// If this script is called directly, run the map generation
if (import.meta.url === `file://${process.argv[1]}`) {
  generateScssMap().catch((error) => {
    console.error('Error running SCSS map generation:', error)
  })
}
