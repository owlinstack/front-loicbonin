/**
 * Lightweight watercolor syntax highlighter.
 *
 * Dark theme  → "dark watercolor" : washed ink tokens on dark bg
 * Light theme → "light watercolor": muted ink tokens on warm white bg
 *
 * Supported: typescript, javascript, css, html, php, python
 */

// ── Token types ───────────────────────────────────────────────────
type TokenType =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'operator'
  | 'function'
  | 'type'
  | 'tag'
  | 'attr'
  | 'punctuation'
  | 'decorator'
  | 'plain'

interface Token {
  type: TokenType
  value: string
}

// ── Watercolor palettes ───────────────────────────────────────────
// Each palette is [dark-theme-color, light-theme-color]
const PALETTE: Record<TokenType, [string, string]> = {
  keyword:    ['#7eb8c4', '#3d7a8a'],   // slate-teal ink
  string:     ['#a3b899', '#557a5a'],   // sage green
  comment:    ['#5a5652', '#a09a95'],   // muted sepia
  number:     ['#c49a6c', '#8a6030'],   // amber
  operator:   ['#8fa8a0', '#4a6b65'],   // dusty teal
  function:   ['#c4a882', '#7a6040'],   // warm sand
  type:       ['#9ab0c4', '#4a6880'],   // dusty blue
  tag:        ['#c48a7a', '#8a4a3a'],   // terracotta
  attr:       ['#b4a0c4', '#6a5080'],   // lavender mist
  punctuation:['#4a4845', '#c0bbb6'],   // near-invisible
  decorator:  ['#c4b47a', '#7a6830'],   // golden ink
  plain:      ['#e8e6e1', '#1a1917'],   // base text
}

/** Returns the CSS color for a token type given the current theme */
export function tokenColor(type: TokenType, theme: 'dark' | 'light'): string {
  return PALETTE[type][theme === 'dark' ? 0 : 1]
}

// ── Tokenizers per language ───────────────────────────────────────

const TS_KEYWORDS = new Set([
  'import','export','from','default','const','let','var','function','return',
  'if','else','for','while','do','switch','case','break','continue','new',
  'class','extends','implements','interface','type','enum','namespace',
  'async','await','try','catch','finally','throw','typeof','instanceof',
  'void','null','undefined','true','false','in','of','as','satisfies',
  'declare','abstract','static','readonly','private','protected','public',
  'override','keyof','infer','never','unknown','any','this','super',
])

const PY_KEYWORDS = new Set([
  'import','from','as','def','return','class','if','elif','else','for',
  'while','with','in','not','and','or','is','None','True','False',
  'try','except','finally','raise','pass','break','continue','yield',
  'lambda','global','nonlocal','del','assert','async','await',
])

const PHP_KEYWORDS = new Set([
  'echo','print','if','else','elseif','foreach','for','while','do',
  'switch','case','break','continue','return','function','class','interface',
  'extends','implements','new','use','namespace','trait','abstract','static',
  'public','protected','private','readonly','final','const','null','true',
  'false','array','string','int','float','bool','void','self','parent',
  'match','fn','declare','enum','throw','try','catch','finally',
])

const CSS_KEYWORDS = new Set([
  '@import','@media','@keyframes','@font-face','@supports','@layer',
  '@view-transition','@theme',
  'none','auto','inherit','initial','unset','revert','normal',
])

// ── Regex-based tokenizer ─────────────────────────────────────────

type LangRule = [TokenType, RegExp]

const COMMON_RULES: LangRule[] = [
  ['string',  /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/],
  ['number',  /^-?\d+\.?\d*([eE][+-]?\d+)?/],
]

function tokenizeWithRules(
  source: string,
  rules: LangRule[],
  plainWordTest?: (word: string) => TokenType
): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < source.length) {
    let matched = false
    for (const [type, re] of rules) {
      const slice = source.slice(i)
      const m = slice.match(re)
      if (m && m.index === 0) {
        tokens.push({ type, value: m[0] })
        i += m[0].length
        matched = true
        break
      }
    }
    if (!matched) {
      // Try to grab a word token
      const wordMatch = source.slice(i).match(/^[A-Za-z_$][\w$]*/)
      if (wordMatch) {
        const word = wordMatch[0]
        const type = plainWordTest ? plainWordTest(word) : 'plain'
        tokens.push({ type, value: word })
        i += word.length
      } else {
        // Single character — punctuation or operator
        const ch = source[i]
        const isPunct = /[()[\]{};,.]/.test(ch)
        const isOp    = /[+\-*/<>=!&|^~%?:]/.test(ch)
        tokens.push({
          type: isPunct ? 'punctuation' : isOp ? 'operator' : 'plain',
          value: ch,
        })
        i++
      }
    }
  }
  return tokens
}

// ── Per-language entry points ─────────────────────────────────────

function tokenizeTS(source: string): Token[] {
  const rules: LangRule[] = [
    ['comment', /^\/\*[\s\S]*?\*\/|^\/\/.*/],
    ...COMMON_RULES,
    ['decorator', /^@[A-Za-z_][\w]*/],
    ['type',     /^[A-Z][A-Za-z0-9_]*(?=[\s<,>|&)\]])/],
    ['function', /^[a-z_$][a-zA-Z0-9_$]*(?=\s*\()/],
  ]

  return tokenizeWithRules(source, rules, (word) => {
    if (TS_KEYWORDS.has(word)) return 'keyword'
    if (/^[A-Z]/.test(word))   return 'type'
    return 'plain'
  })
}

function tokenizePY(source: string): Token[] {
  const rules: LangRule[] = [
    ['comment', /^"""[\s\S]*?"""|^'''[\s\S]*?'''|^#.*/],
    ...COMMON_RULES,
    ['decorator', /^@[A-Za-z_][\w]*/],
    ['function', /^[a-z_][a-zA-Z0-9_]*(?=\s*\()/],
  ]

  return tokenizeWithRules(source, rules, (word) => {
    if (PY_KEYWORDS.has(word)) return 'keyword'
    if (/^[A-Z]/.test(word))   return 'type'
    return 'plain'
  })
}

function tokenizePHP(source: string): Token[] {
  const rules: LangRule[] = [
    ['comment', /^\/\*[\s\S]*?\*\/|^\/\/.*|^\#.*/],
    ...COMMON_RULES,
    ['keyword', /^\$[A-Za-z_][\w]*/],  // variables
    ['function', /^[a-z_][a-zA-Z0-9_]*(?=\s*\()/],
    ['type',    /^[A-Z\\][A-Za-z0-9_\\]*/],
  ]

  return tokenizeWithRules(source, rules, (word) => {
    if (PHP_KEYWORDS.has(word)) return 'keyword'
    if (/^[A-Z]/.test(word))   return 'type'
    return 'plain'
  })
}

function tokenizeCSS(source: string): Token[] {
  const rules: LangRule[] = [
    ['comment', /^\/\*[\s\S]*?\*\/|^\/\/.*/],
    ['string',  /^"[^"]*"|^'[^']*'/],
    ['number',  /^-?\d+\.?\d*(%|px|rem|em|vw|vh|fr|deg|s|ms)?/],
    ['keyword', /^@[a-z-]+/],
    ['function', /^[a-z-]+(?=\s*\()/],
    ['attr',    /^--[a-zA-Z-]+/],    // CSS custom properties
    ['type',    /^#[0-9a-fA-F]{3,8}/], // hex colors
    ['tag',     /^[a-z][a-zA-Z0-9-]*(?=\s*[{,])/], // selectors
  ]

  return tokenizeWithRules(source, rules, (word) => {
    if (CSS_KEYWORDS.has(word)) return 'keyword'
    return 'plain'
  })
}

function tokenizeHTML(line: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const s = line

  while (i < s.length) {
    // Comment
    if (s.startsWith('<!--', i)) {
      const end = s.indexOf('-->', i)
      const val = end >= 0 ? s.slice(i, end + 3) : s.slice(i)
      tokens.push({ type: 'comment', value: val })
      i += val.length
      continue
    }
    // Tag open/close
    if (s[i] === '<') {
      tokens.push({ type: 'punctuation', value: '<' }); i++
      if (s[i] === '/') { tokens.push({ type: 'punctuation', value: '/' }); i++ }
      // tag name
      const tagMatch = s.slice(i).match(/^[a-zA-Z][a-zA-Z0-9-]*/)
      if (tagMatch) {
        tokens.push({ type: 'tag', value: tagMatch[0] })
        i += tagMatch[0].length
      }
      // attributes until >
      while (i < s.length && s[i] !== '>') {
        if (s[i] === ' ' || s[i] === '\t') {
          tokens.push({ type: 'plain', value: s[i] }); i++; continue
        }
        // attr name
        const attrMatch = s.slice(i).match(/^[a-zA-Z_:][a-zA-Z0-9_:.-]*/)
        if (attrMatch) {
          tokens.push({ type: 'attr', value: attrMatch[0] })
          i += attrMatch[0].length
          continue
        }
        // = sign
        if (s[i] === '=') {
          tokens.push({ type: 'operator', value: '=' }); i++; continue
        }
        // string value
        if (s[i] === '"' || s[i] === "'") {
          const q = s[i]
          const end = s.indexOf(q, i + 1)
          const val = end >= 0 ? s.slice(i, end + 1) : s.slice(i)
          tokens.push({ type: 'string', value: val })
          i += val.length
          continue
        }
        tokens.push({ type: 'plain', value: s[i] }); i++
      }
      if (i < s.length && s[i] === '>') {
        tokens.push({ type: 'punctuation', value: '>' }); i++
      }
      continue
    }
    // Template expression {{ }}
    if (s.startsWith('{{', i)) {
      const end = s.indexOf('}}', i)
      const val = end >= 0 ? s.slice(i, end + 2) : s.slice(i)
      tokens.push({ type: 'function', value: val })
      i += val.length
      continue
    }
    // Plain text
    const until = s.slice(i).search(/[<{]/)
    const plain = until >= 0 ? s.slice(i, i + until) : s.slice(i)
    if (plain) { tokens.push({ type: 'plain', value: plain }); i += plain.length }
    else { tokens.push({ type: 'plain', value: s[i] }); i++ }
  }

  return tokens
}

// ── Public API ────────────────────────────────────────────────────

type Language = 'typescript' | 'javascript' | 'css' | 'html' | 'php' | 'python'

function normalizeLanguage(lang: string): Language {
  const l = lang.toLowerCase()
  if (l === 'ts' || l === 'tsx' || l === 'js' || l === 'jsx' || l === 'javascript') return 'typescript'
  if (l === 'py') return 'python'
  if (l === 'htm') return 'html'
  return l as Language
}

function splitTokensIntoLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokens) {
    if (token.value.includes('\n')) {
      const parts = token.value.split('\n')
      for (let j = 0; j < parts.length; j++) {
        if (parts[j] !== '') {
          lines[lines.length - 1].push({ type: token.type, value: parts[j] })
        }
        if (j < parts.length - 1) {
          lines.push([])
        }
      }
    } else {
      lines[lines.length - 1].push(token)
    }
  }
  return lines
}

export function tokenizeCode(code: string, lang: string): Token[][] {
  const l = normalizeLanguage(lang)
  let tokens: Token[]
  switch (l) {
    case 'python':  tokens = tokenizePY(code); break
    case 'php':     tokens = tokenizePHP(code); break
    case 'css':     tokens = tokenizeCSS(code); break
    case 'html':    tokens = tokenizeHTML(code); break
    default:        tokens = tokenizeTS(code); break
  }
  return splitTokensIntoLines(tokens)
}

/** Tokenize a single line given a language */
export function tokenizeLine(line: string, lang: string): Token[] {
  return tokenizeCode(line, lang)[0] || []
}
