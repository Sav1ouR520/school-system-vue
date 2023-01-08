import { app, BrowserWindow } from "electron"
import path from "path"

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      devTools: true,
    },
    width: 1280,
    height: 720,
    resizable: true,
    autoHideMenuBar: true,
  })
  win.webContents.openDevTools()
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../index.html"))
  } else {
    win.loadURL(`${process.env["VITE_DEV_SERVER_URL"]}`)
  }
}
//在Electron完成初始化时被触发
app.whenReady().then(createWindow)
