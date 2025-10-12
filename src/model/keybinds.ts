export type Key = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '<' | '>' | 'DEL'
// TODO add modifiers beyond Meta
export type ControlledStroke = `M-${Key}` | Key
export type Stroke = `C-${ControlledStroke}` | ControlledStroke
export type Strokes = [Stroke, ...Stroke[]]

export type Keybinds = KeybindLevel[]
export type KeybindLevel = Record<string, Strokes>

// TODO to extend this to Vim we need to talk a little bit about M- being equivalent to ESC in Emacs
// also, we might want to consider binds themselves as state machines:
// - worth making some sort of scalacheck-like Arbitrary thing?
// - we can then define a schema with Zod or something and require it to have an Arbitrary??
// - then stuff like C-u could be a state machine:
//       C-u digits*+ (C-u)? action
// TODO lift some code from antimirov maybe for the DFAs?
// TODO resolve the weird structure here where we'd rather difficulty be a property of the keybind...
// - maybe post-process a Keybinds structure into something that can be sampled
export const emacs: Keybinds = [
  {
    'exit': ['C-x', 'C-c'],
    'suspend': ['C-z'],
    'get help': ['C-h'],
    'cancel action': ['C-g'],
    'save file': ['C-x', 'C-s'],
  },
  {
    'start of line': ['C-a'],
    'end of line': ['C-e'],
    'back word': ['M-b'],
    'forward word': ['M-f'],
    'back character': ['C-b'],
    'forward character': ['C-f'],
  },
  {
    'previous line': ['C-p'],
    'next line': ['C-n'],
    'previous page': ['M-v'],
    'next page': ['C-v'],
    'start of file': ['M-<'],
    'end of file': ['M->'],
  },
  {
    'kill rest of line': ['C-k'],
    'delete previous word': ['M-DEL'],
    'delete backward': ['DEL'],
    'delete forward': ['C-d'],
    'delete next word': ['M-d'],
  },
]
