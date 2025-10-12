import type { Keybinds } from './keybinds.ts'

// TODO we want some form of levelling and combo in here
// - consecutive solves should reward the destruction of "stale" blocks
//   - maybe give blocks some amount of HP (2x their number of keystrokes?) and damage the top block on a solve
// - if there are no stale blocks, we build combo
//   - combo should increase score multiplier
// - level should also increase score multiplier
// - on level 0 we should be shown all the difficulty 1 keybinds and their sequences for training
// - on level 1 we are shown α% difficulty 1 keybinds without sequences and β% difficulty 2 keybinds with sequences
// - continue like this? maybe scaling curve needs to be adjusted?
//   - maybe we should hide the sequences after N successful executions of that keybind rule regardless of level
export class GameState {
  readonly binds: Keybinds

  constructor(binds: Keybinds) {
    this.binds = binds
  }
}
