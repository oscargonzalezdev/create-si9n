#!/usr/bin/env node

const { execSync, exec } = require("node:child_process")
const path = require("node:path")
const fs = require("node:fs")

// Validation
if (process.argv.length < 3) {
  console.log("❌ Please provide a valid project name. For example :\nnpx create-si9n project-name")
  process.exit(1)
}

// Globals
const projectName = process.argv[2]
const currentPath = process.cwd()
const projectPath = path.join(currentPath, projectName)
const defaultRepo = "git@bitbucket.org:beavergroup/messaging-boilerplate.git"

async function createProject() {
  try {
    // Create project directory
    fs.mkdirSync(projectPath)

    // Clone repositorie
    console.log("⬇️ Downloading files ...")
    execSync(`git clone -b main --single-branch --depth 1 ${defaultRepo} ${projectPath}`)

    // Install dependencies
    console.log("📦 Installing dependencies ...")
    process.chdir(projectPath)
    execSync("npm install")

    // Edit package.json
    const userName = execSync("git config --global user.name").toString().trim()
    execSync(`npm pkg set 'name'='${projectName}'`)
    execSync(`npm pkg set 'author.name'='${userName}'`)

    // Cleaning project
    console.log("🧹 Removing unnecessary files ...")
    execSync("rm -rf ./.git")

    // Run project locally
    console.log(`✅ Done, project running on http://localhost:5001/`)
    execSync("code . && npm run dev:main")
  } catch (error) {
    if (error.code === "EEXIST") {
      console.log(`❌ "${projectName}" already exist in the current directory. Please choose another name for your project.`)
    } else {
      console.log("❌ Error creating a new project.\n", error)
    }
    process.exit(0)
  }
}

// Initialize script
createProject()
