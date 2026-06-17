interface ArticleProseProps {
  content: string
}

// Very simple line-by-line markdown renderer for demo purposes.
// In production, use a proper MDX/remark pipeline.
function renderMarkdown(raw: string): string {
  const processInline = (text: string) =>
    text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')

  const lines = raw.split('\n')
  const out: string[] = []
  let i = 0
  let inParagraph = false
  let inCodeBlock = false
  let codeLang = ''
  let codeLines: string[] = []

  const closeParagraph = () => {
    if (inParagraph) {
      out.push('</p>')
      inParagraph = false
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    // Code block start
    if (!inCodeBlock && line.match(/^```(\w*)/)) {
      closeParagraph()
      codeLang = line.match(/^```(\w*)/)?.[1] || 'code'
      codeLines = []
      inCodeBlock = true
      i++
      continue
    }

    // Code block end
    if (inCodeBlock && line.trim() === '```') {
      const code = escapeHtml(codeLines.join('\n'))
      out.push(
        `<pre><div class="code-topbar"><span>${codeLang}</span></div><code class="language-${codeLang}">${code}</code></pre>`
      )
      inCodeBlock = false
      codeLines = []
      i++
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      i++
      continue
    }

    // Blank line
    if (line.trim() === '') {
      closeParagraph()
      i++
      continue
    }

    // h2
    if (line.startsWith('## ')) {
      closeParagraph()
      out.push(`<h2>${processInline(line.slice(3))}</h2>`)
      i++
      continue
    }

    // h3
    if (line.startsWith('### ')) {
      closeParagraph()
      out.push(`<h3>${processInline(line.slice(4))}</h3>`)
      i++
      continue
    }

    // blockquote
    if (line.startsWith('> ')) {
      closeParagraph()
      out.push(`<blockquote>${processInline(line.slice(2))}</blockquote>`)
      i++
      continue
    }

    // Regular text line → paragraph
    if (!inParagraph) {
      out.push('<p>')
      inParagraph = true
    } else {
      out.push(' ')
    }
    out.push(processInline(line))
    i++
  }

  closeParagraph()
  return out.join('')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function ArticleProse({ content }: ArticleProseProps) {
  const html = renderMarkdown(content)

  return (
    <div
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
