#!/usr/bin/env node

import chalk from 'chalk' // Import chalk for colored terminal text
import { spawn } from 'child_process' // Import child_process for running commands

// Helper function to run a command and log its output with color coding
function runCommand(command, args, description, color, isLint = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'pipe', shell: true })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data
      let output = data.toString()
      if (isLint) {
        output = output
          .replace(/^(.*?)(Warning: .*)$/gm, chalk.yellow('$2'))
          .replace(/^(.*?)(Error: .*)$/gm, chalk.red('$2'))
      }
      process.stdout.write(color(output)) // Output directly to console for real-time feedback with color
    })

    child.stderr.on('data', (data) => {
      stderr += data
      process.stderr.write(color(data)) // Output directly to console for real-time feedback with color
    })

    child.on('error', (error) => {
      console.error(chalk.red(`Error running ${description}: ${error.message}`))
      reject(error)
    })

    child.on('close', (code) => {
      if (stderr) {
        console.warn(
          chalk.yellow(`${description} completed with warnings:\n${stderr}`)
        )
      }

      if (code !== 0) {
        console.error(chalk.red(`${description} failed with exit code ${code}`))
        reject(new Error(`Command failed with exit code ${code}`))
      } else {
        console.log(chalk.green(`${description} completed successfully!`))
      }
      resolve(stdout)
    })
  })
}

// Main function to run all linting processes
;(async () => {
  try {
    // Run Prettier
    console.log(chalk.cyan('✨ Running Prettier...'))
    await runCommand(
      'prettier',
      [
        '--config',
        './config/.prettierrc.json',
        '--ignore-path',
        './config/.prettierignore',
        '--write',
        '.'
      ],
      'Prettier',
      chalk.gray
    )

    // Run Stylelint
    console.log(chalk.cyan('✨ Running Stylelint...'))
    await runCommand(
      'stylelint',
      ['**/*.{css,scss}', '--config', './config/.stylelintrc.json', '--fix'],
      'Stylelint',
      chalk.reset,
      true // Specify that this is a lint command
    )

    // Run ESLint
    console.log(chalk.cyan('✨ Running ESLint...'))
    await runCommand(
      ['lint', '--fix', '--ignore-path', './config/.eslintignore'],
      'ESLint',
      chalk.reset,
      true // Specify that this is a lint command
    )

    console.log(chalk.green('🎉 All linting processes completed successfully!'))
  } catch (error) {
    console.error(
      chalk.red('✖ Error during the linting process:\n' + error.message)
    )
  }
})()
