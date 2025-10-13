import * as z from 'zod'

interface IDfa {
  type: string
}

interface Never extends IDfa {
  type: 'never'
}

interface Empty extends IDfa {
  type: 'empty'
}

interface Or extends IDfa {
  type: 'or'
  alternatives: Dfa[]
}

interface And extends IDfa {
  type: 'and'
  sequence: Dfa[]
}

interface Keystroke extends IDfa {
  type: 'keystroke'
  key: string
  modifiers: Partial<Record<'Alt' | 'Control', boolean>>
}

export type Dfa = Never | Empty | Or | And | Keystroke

export interface Zfa<T> {
  schema: T

  name(this: Zfa<T>, $: z.infer<typeof this.schema>): string
  generator(this: Zfa<T>, $: z.infer<typeof this.schema>): Dfa
}

export const seq: (...parts: Dfa[]) => And = (...parts: Dfa[]) => ({
  type: 'and',
  sequence: parts,
})

export const or: (...parts: Dfa[]) => Or = (...parts: Dfa[]) => ({
  type: 'or',
  alternatives: parts,
})

export const key: (key: string) => Keystroke = (key: string) => ({
  type: 'keystroke',
  key,
  modifiers: {},
})

export const c: (key: string) => Keystroke = (key: string) => ({
  type: 'keystroke',
  key,
  modifiers: { ['Control']: true },
})

export const m: (key: string) => Dfa = (k: string) =>
  or({
    type: 'keystroke',
    key: k,
    modifiers: { ['Alt']: true },
  }, seq(key('Escape'), key(k)))

// TODO C-M-x, which can be input in a bunch of different ways...
