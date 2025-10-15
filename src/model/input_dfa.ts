import * as z from 'zod'

interface IDfa {
  type: string
}

interface Nothing extends IDfa {
  type: 'nothing'
}

interface Unit extends IDfa {
  type: 'unit'
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

export type Dfa = Nothing | Unit | Or | And | Keystroke

export const acceptsEmpty: (dfa: Dfa) => boolean = (dfa) => {
  switch (dfa.type) {
    case 'unit': return true
    case 'or': return dfa.alternatives.some(acceptsEmpty)
    case 'and': return dfa.sequence.every(acceptsEmpty)
    default: return false
  }
}

// we return an array here rather than some sort of set because we want to always show the first applicable alternative
export const partialDeriv: (dfa: Dfa, inputEvent: KeyboardEvent) => Dfa[] = (dfa, inputEvent) => {
  // - for keystroke, we check the inputEvent
  //   - if it's `repeat` we discard and do nothing (return dfa)
  //   - otherwise, collect the Alt and Control modifiers
  //   - if the key and modifiers all match (missing modifiers should be checked to false) we return empty
  //   - otherwise return never

  if (inputEvent.repeat) {
    // this happens before the switch as if we are in the accept state but receive a repeat event we don't want to do anything
    return [dfa]
  } else {
    switch (dfa.type) {
      case 'unit':
      case 'nothing':
        return []
      case 'or':
        return dfa.alternatives.flatMap(r => partialDeriv(r, inputEvent))
      case 'and': {
        const leftmost = dfa.sequence[0]
        const right = dfa.sequence.slice(1)
        const s1 = partialDeriv(leftmost, inputEvent).map(l => seq(l, ...right))
        if (acceptsEmpty(leftmost)) {
          // TODO maybe this would be better expressed as a loop
          return [...s1, ...partialDeriv(seq(...right), inputEvent)]
        } else {
          return s1
        }
      }
      case 'keystroke': {
        const wasCtrl = inputEvent.ctrlKey
        const wasAlt = inputEvent.altKey
        const needCtrl = dfa.modifiers.Control ?? false
        const needAlt = dfa.modifiers.Alt ?? false
        if (wasCtrl !== needCtrl || wasAlt !== needAlt || dfa.key !== inputEvent.key) return []
        else return [unit]
      }
    }
  }
}

export interface Zfa<T> {
  schema: T

  name(this: Zfa<T>, $: z.infer<typeof this.schema>): string
  generator(this: Zfa<T>, $: z.infer<typeof this.schema>): Dfa
}

export const unit: Unit = Object.freeze({ type: 'unit' })
export const nothing: Nothing = Object.freeze({ type: 'nothing' })

export const seq: (...parts: Dfa[]) => And = (...parts: Dfa[]) => Object.freeze({
  type: 'and',
  sequence: parts,
})

export const or: (...parts: Dfa[]) => Or = (...parts: Dfa[]) => Object.freeze({
  type: 'or',
  alternatives: parts,
})

export const key: (key: string) => Keystroke = (key: string) => Object.freeze({
  type: 'keystroke',
  key,
  modifiers: {},
})

export const c: (key: string) => Keystroke = (key: string) => Object.freeze({
  type: 'keystroke',
  key,
  modifiers: { ['Control']: true },
})

export const m: (key: string) => Dfa = (k: string) =>
  or(Object.freeze({
    type: 'keystroke',
    key: k,
    modifiers: { ['Alt']: true },
  }), seq(key('Escape'), key(k)))

// TODO C-M-x, which can be input in a bunch of different ways...
