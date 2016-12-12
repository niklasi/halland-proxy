import os from 'os'
import path from 'path'
import electron, { app, BrowserWindow, shell } from 'electron'

const appName = app.getName()

function sendAction (action) {
  const win = BrowserWindow.getAllWindows()[0]

  win.webContents.send(action)
}

const helpSubmenu = [
  {
    label: `${appName} Website`,
    click () {
      shell.openExternal('https://github.com/niklasi/halland-proxy')
    }
  },
  {
    label: 'Report an Issue...',
    click () {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->

-

${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`

      shell.openExternal(`https://github.com/niklasi/halland-proxy/issues/new?body=${encodeURIComponent(body)}`)
    }
  }
]

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click () {
      electron.dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Niklas Ingholt',
        icon: path.join(__dirname, 'static/Icon.png'),
        buttons: []
      })
    }
  })
}

const pluginSubmenu = [
  {
    label: 'Update plugins',
    accelerator: 'CmdOrCtrl+U',
    click () {
      sendAction('update-plugins')
    }
  }
]

const darwinTpl = [
  {
    label: appName,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'Plugins',
    submenu: pluginSubmenu
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      },
      {
        type: 'separator'
      },
      {
        role: 'front'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
]

const otherTpl = [
  {
    label: 'File',
    submenu: [
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        type: 'separator'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
]

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl

module.exports = electron.Menu.buildFromTemplate(tpl)
