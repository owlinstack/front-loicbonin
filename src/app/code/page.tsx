import { Header } from '@/components/layout/Header'
import { getCodeProjects } from '@/lib/api'
import { CodeEditorClient } from '@/components/code/CodeEditorClient'

export default async function CodePage() {
  const projects = await getCodeProjects()

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
      <CodeEditorClient projects={projects} />
    </div>
  )
}
