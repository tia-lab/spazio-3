import boxen from 'boxen' // Boxen for creating styled boxes
import chalk from 'chalk' // Chalk for colored terminal text
import { exec } from 'child_process' // Import child_process for running Prettier
import 'dotenv/config'
import { generateAnimationUtility } from './generate/animation-utility/index.mjs'
import { generateScssMap } from './generate/map/index.mjs'
import { writeUtilitiesForAllSettings } from './generate/utilitiy/index.mjs'
import { writeScssForAllSettings } from './generate/var/index.mjs'
import { importConfig } from './import-config/index.mjs'

// Variable to accumulate log messages
let accumulatedMessages = ''

// Helper function to log messages inside a single box
function logBox(message) {
  accumulatedMessages += message + '\n'
}

// Helper function to display the accumulated log messages in a box
function displayFinalLog(isError = false) {
  const borderColor = isError ? 'red' : 'green'

  console.log(
    boxen(accumulatedMessages, {
      padding: 1,
      margin: 0,
      borderColor: borderColor,
      borderStyle: 'round'
    })
  )

  // Clear accumulated messages after displaying them
  accumulatedMessages = ''
}

// Helper function to run Prettier on the generated files and the config.mjs file
function runPrettier() {
  return new Promise((resolve, reject) => {
    exec(
      'npx prettier --write "src/styles/vars/**/*.scss" "scripts/scss/config.mjs" > /dev/null 2>&1',
      (error) => {
        if (error) {
          logBox(chalk.red('✖ Error running Prettier:') + ` ${error}\n`)
          reject(error)
          return
        }

        // If Prettier ran successfully and files were formatted, log a success message
        logBox(chalk.green('✨ Files have been prettified.\n'))
        resolve()
      }
    )
  })
}

;(async () => {
  try {
    logBox(chalk.bold('🛠  Generate config file...'))
    await importConfig(logBox)
    logBox(chalk.green('config.file created successfully.\n'))

    logBox(chalk.bold('🤩  Starting SCSS generation...'))
    await writeScssForAllSettings(logBox)
    logBox(chalk.green('Created SCSS root and vars files.\n'))

    logBox(chalk.bold('🐙 Generate SCSS Maps...'))
    await generateScssMap(logBox)
    logBox(chalk.green('SCSS maps generated successfully.\n'))

    logBox(chalk.bold('💪 Generate SCSS Utility...'))
    await writeUtilitiesForAllSettings(logBox)
    logBox(chalk.green('Created _utilities.scss in the output folder.\n'))

    logBox(chalk.bold('🎨 Generate Animation Utility...'))
    await generateAnimationUtility(logBox)
    logBox(chalk.green('Created _generated.scss for animations.\n'))

    /*  logBox(chalk.bold('✨ Prettifying files...'))
    await runPrettier() */

    logBox(chalk.green('🤟 SCSS generation complete!\n'))

    // Display the final log in a box
    displayFinalLog(false)
  } catch (error) {
    logBox(
      chalk.red('✖ Error during SCSS generation:') + ` ${error.message}\n`
    )

    // Display the error log in a red box
    displayFinalLog(true)
  }
})()
