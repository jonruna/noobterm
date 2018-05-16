// terminal-kit doc: https://github.com/cronvel/terminal-kit/tree/master/doc
const term = require('terminal-kit').terminal
const fs = require('fs')
const homeDir = require('os').homedir()
const currentDir = process.cwd()
const projectScriptDirectory = './script/'
const projectScriptFile = './script/script.json'
const envScriptFile = process.env.NOOBTERM_SCRIPT_FILE

let scriptLoadMsg
let cmdsJSON
if (fs.existsSync(projectScriptFile)) {
  cmdsJSON = JSON.parse(readFile(projectScriptFile))
  if (envScriptFile) {
    const envCmdsJSON = JSON.parse(readFile(envScriptFile))
    envCmdsJSON.name = `{${envCmdsJSON.name}}`
    cmdsJSON.commands.push(envCmdsJSON)
    scriptLoadMsg = `${projectScriptFile}`
  } else {
    scriptLoadMsg = `${projectScriptFile}`
  }
} else {
  if (envScriptFile) {
    cmdsJSON = JSON.parse(readFile(envScriptFile))
    scriptLoadMsg = ''
  } else {
    scriptLoadMsg = `DEFAULT`
    cmdsJSON = {
      name: 'COMMANDS',
      showDefaultCommand: true,
      commands: []
    }
  }
}

const cmds = cmdsJSON

term.on('key', (name, matches, data) => {
  if (name === 'CTRL_C') {
    term.red('\nCTRL + C = EXIT\n')
    process.exit()
  }
})

if (fs.existsSync(projectScriptDirectory)) {
  const dirScriptCommand = {
    name: '/script',
    commands: []
  }
  cmds.commands.unshift(dirScriptCommand)
  appendCommandsFromDir(projectScriptDirectory)
}

if (cmds.showDefaultCommand) {
  const defaultCommand = {
    name: '{Ω}',
    commands: [
      {
        name: 'ENV',
        commands: [
          {
            name: '~/.bash_profile',
            cmd: 'cat ~/.bash_profile'
          },
          {
            name: '~/.bash_rc',
            cmd: 'cat ~/.bash_rc'
          },
          {
            name: '/etc/profile',
            cmd: 'cat /etc/profile'
          }
        ]
      },
      {
        name: 'Home',
        cmd: `echo ${homeDir}`
      },
      {
        name: 'Current',
        cmd: `echo ${currentDir}`
      }
    ]
  }
  cmds.commands.push(defaultCommand)
}

if (cmds.name) {
  term.magenta(cmds.name).dim(` ${scriptLoadMsg}`)
  if (envScriptFile) {
    term.dim.yellow(' NOOBTERM_SCRIPT_FILE')
  }
}

execute(cmds)

function readFile(filePath, fallbackValue) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8')
  } else {
    return fallbackValue
  }
}

function appendCommandsFromDir(commandsDir) {
  const readdirData = fs.readdirSync(commandsDir)
  if (readdirData && readdirData.length > 0) {
    Array.from(readdirData, filePath => {
      if (
        fs.lstatSync(commandsDir + filePath).isFile() &&
        !filePath.endsWith('.json') &&
        !filePath.startsWith('.DS_Store')
      ) {
        const scriptCommand = {
          name: commandsDir.substring(9) + filePath,
          cmd: `sh ${commandsDir + filePath}`
        }
        cmds.commands[0].commands.push(scriptCommand)
      }
    })
    Array.from(readdirData, filePath => {
      if (fs.lstatSync(commandsDir + filePath).isDirectory()) {
        appendCommandsFromDir(commandsDir + filePath + '/')
      }
    })
  }
}

function execute(noobScript) {
  if (noobScript.commands) {
    term.singleLineMenu(
      Array.from(noobScript.commands, x => x.name),
      {
        style: term.white,
        selectedStyle: term.magenta
      },
      (error, response) => {
        execute(noobScript.commands[response.selectedIndex])
      }
    )
  } else if (noobScript.cmd) {
    term.green(`\n${noobScript.cmd}\n`)
    const { execSync } = require('child_process')
    const execOptions = {
      stdio: 'inherit'
    }
    const execData = execSync(noobScript.cmd, execOptions)
    if (execData) {
      term(`${execData}`)
    }
    process.exit()
  } else {
    term.red('\nCORRUPT: ' + noobScript + '\n')
    process.exit()
  }
}
