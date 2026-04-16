const { app, BrowserWindow, ipcMain } = require("electron"); // 한 줄로 합쳤습니다.
const path = require("path");

// 하드웨어 가속을 꺼야 투명 창에서 검은 화면이 나오는 버그를 방지할 수 있습니다.
app.disableHardwareAcceleration();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // 브라우저에서 ipcRenderer를 쓰기 위해 필요
    },
  });

  win.loadURL("http://localhost:3000");

  // 초기 설정: 투명한 부분은 클릭이 통과하도록 설정
  win.setIgnoreMouseEvents(true, { forward: true });
}

// Next.js(Client)에서 보내는 마우스 관통 여부 신호를 처리
ipcMain.on("set-ignore-mouse", (event, ignore) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.setIgnoreMouseEvents(ignore, { forward: true });
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
