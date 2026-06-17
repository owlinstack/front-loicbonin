import { Suspense } from 'react'
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
      <Suspense fallback={
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      }>
        <CodeEditorClient projects={projects} />
      </Suspense>
    </div>
  )
}
