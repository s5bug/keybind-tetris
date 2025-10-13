import * as z from 'zod'
import { c, type Dfa, key, m, seq, type Zfa } from './input_dfa.ts'

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

// Emacs static keybind, i.e. keybind with no arguments or sub-commands
const emacsToBrowser = (key: string) => {
  switch (key) {
    case 'DEL': return 'Delete'
    default: return key
  }
}
const estatic: (nameV: string, str: Strokes) => Zfa<z.ZodVoid> = (nameV, str) => {
  const cs: Dfa[] = []
  for (const stroke of str) {
    // TODO C-M- checking
    if (stroke.startsWith('C-')) {
      cs.push(c(emacsToBrowser(stroke.slice(2))))
    } else if (stroke.startsWith('M-')) {
      cs.push(m(emacsToBrowser(stroke.slice(2))))
    } else {
      cs.push(key(emacsToBrowser(stroke)))
    }
  }
  const s = seq(...cs)
  return {
    schema: z.void(),
    name(_: void): string {
      return nameV
    },
    generator(_: void): Dfa {
      return s
    },
  }
}

// TODO consider removing the names being doubled?
// something like C-u will probably be configured to be restrictive in the Zfa set it accepts...
// alternative, tag system s.t. actions can mark themselves as "worth being repeated"
export const emacs: Record<string, Zfa<unknown>>[] = [
  {
    'exit': estatic('exit', ['C-x', 'C-c']),
    'suspend': estatic('suspend', ['C-z']),
    'get help': estatic('get help', ['C-h']),
    'cancel action': estatic('cancel action', ['C-g']),
    'save file': estatic('save file', ['C-x', 'C-s']),
  },
  {
    'start of line': estatic('start of line', ['C-a']),
    'end of line': estatic('end of line', ['C-e']),
    'back word': estatic('back word', ['M-b']),
    'forward word': estatic('forward word', ['M-f']),
    'back character': estatic('back character', ['C-b']),
    'forward character': estatic('forward character', ['C-f']),
  },
  {
    'previous line': estatic('previous line', ['C-p']),
    'next line': estatic('next line', ['C-n']),
    'previous page': estatic('previous page', ['M-v']),
    'next page': estatic('next page', ['C-v']),
    'start of file': estatic('start of file', ['M-<']),
    'end of file': estatic('end of file', ['M->']),
  },
  {
    'kill rest of line': estatic('kill rest of line', ['C-k']),
    'delete previous word': estatic('delete previous word', ['M-DEL']),
    'delete backward': estatic('delete backward', ['DEL']),
    'delete forward': estatic('delete forward', ['C-d']),
    'delete next word': estatic('delete next word', ['M-d']),
  },
]
