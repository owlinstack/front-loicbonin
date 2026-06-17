import { Header } from '@/components/layout/Header'
import { getCodeTree } from '@/lib/api'
import { CodeEditorClient } from '@/components/code/CodeEditorClient'

export default async function CodePage() {
  const tree = await getCodeTree()

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <CodeEditorClient tree={tree} />
    </div>
  )
}
