import { Container, Graphics, GraphicsContext, Text } from 'pixi.js'
import { type ComputedLayout, Layout } from '@pixi/layout'

export class Button extends Container {
  readonly backgroundCtxNone: GraphicsContext
  readonly backgroundCtxHover: GraphicsContext
  readonly backgroundCtxPress: GraphicsContext
  readonly background: Graphics
  readonly text: Text

  constructor(title: string) {
    super()

    this.layout = {
      width: '100%',
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    }

    this.eventMode = 'static'

    this.backgroundCtxNone = new GraphicsContext()
    this.backgroundCtxHover = new GraphicsContext()
    this.backgroundCtxPress = new GraphicsContext()
    this.background = new Graphics({
      layout: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      },
      context: this.backgroundCtxNone,
    })
    this.on('pointerdown', _ => this.background.context = this.backgroundCtxPress)
    this.on('pointerover', (_) => {
      if (this.background.context !== this.backgroundCtxPress) this.background.context = this.backgroundCtxHover
    })
    this.on('pointerout', (_) => {
      this.background.context = this.backgroundCtxNone
    })
    this.on('layout', event => this.layoutEventHandler(event))

    this.addChild(this.background)

    this.text = new Text({
      text: title,
      style: {
        fill: '#ffffff',
        fontSize: 36,
      },
      anchor: 0.5,
      layout: true,
    })

    this.addChild(this.text)
  }

  private makeButtonCtx(ctx: GraphicsContext, layout: ComputedLayout, brightness: number) {
    ctx
      .clear()
      .roundRect(0, 0, layout.width, layout.height, 8)
      .fill({ color: 0xffffff, alpha: brightness })
      .roundRect(0, 0, layout.width, layout.height, 8)
      .fill({ color: 0xffffff, alpha: 1.0 })
      .roundRect(4, 4, layout.width - 8, layout.height - 8, 8)
      .cut()
  }

  layoutEventHandler(event: Layout) {
    this.makeButtonCtx(this.backgroundCtxNone, event.computedLayout, 0.0)
    this.makeButtonCtx(this.backgroundCtxHover, event.computedLayout, 0.2)
    this.makeButtonCtx(this.backgroundCtxPress, event.computedLayout, 0.5)
  }
}
