// 主进程入口文件 main/index.ts
import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { fileURLToPath } from 'url'

// 在ES模块中获取__dirname的等效值
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  // 检查是否为开发环境
  if (process.env.VITE_DEV_SERVER_URL) {
    // 开发环境 - 加载 Vite 开发服务器
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // 生产环境 - 加载本地文件
    const indexPath = path.join(__dirname, '../dist/index.html')
    win.loadFile(indexPath)

    // 处理加载失败的情况
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log('Failed to load file:', errorCode, errorDescription)
      if (errorCode === -6) {
        // ERR_FILE_NOT_FOUND
        win.loadFile(indexPath)
      }
    })
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
