import { Container, Text } from 'pixi.js'

export class Button extends Container {
  readonly text: Text

  constructor(title: string) {
    super()

    this.text = new Text({
      text: title,
      style: {
        fill: '#ffffff',
        fontSize: 36,
      },
      anchor: 0.5,
    })

    this.addChild(this.text)
  }
}
