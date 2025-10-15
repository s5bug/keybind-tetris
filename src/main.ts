import 'modern-normalize'
import './main.css'
import '@pixi/layout'
import { Application, Container } from 'pixi.js'
import { Button } from './component/button.ts'

const app = new Application()

if (import.meta.env.DEV) {
  const { initDevtools } = await import('@pixi/devtools')
  await initDevtools({ app })
}

await app.init({
  resizeTo: window,
  layout: {
    layout: {
      autoUpdate: true,
      enableDebug: undefined!,
      debugModificationCount: undefined!,
      throttle: undefined!,
    },
  },
})

if (import.meta.env.DEV) {
  await app.renderer.layout.enableDebug(true)
}

document.body.appendChild(app.canvas)

app.stage.layout = {
  width: app.screen.width,
  height: app.screen.height,
  justifyContent: 'center',
  alignItems: 'center',
}
app.renderer.on('resize', (width, height) => {
  app.stage.layout = {
    width, height, justifyContent: 'center', alignItems: 'center',
  }
})

// TODO refactor this into a screen system
const mainMenuContainer = new Container({
  isRenderGroup: true,
  layout: {
    // TODO adjust this based on screen aspect ratio
    width: '80%',
    height: '80%',
    flexDirection: 'column',
    gap: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
})
app.stage.addChild(mainMenuContainer)

const playButton = new Button('Play')
mainMenuContainer.addChild(playButton)

const playButton2 = new Button('Play2')
mainMenuContainer.addChild(playButton2)

const playButton3 = new Button('Play3')
mainMenuContainer.addChild(playButton3)
