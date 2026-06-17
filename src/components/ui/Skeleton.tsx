export function SkeletonBar({ width = '100%', height = 16 }: { width?: string | number; height?: number }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius: 2,
      }}
      aria-hidden="true"
    />
  )
}

export function ArticleCardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SkeletonBar width="30%" height={11} />
      <SkeletonBar width="70%" height={28} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <SkeletonBar width="100%" height={16} />
        <SkeletonBar width="85%" height={16} />
      </div>
      <SkeletonBar width="25%" height={11} />
    </div>
  )
}

export function ArticleListSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function FeaturedArticleSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 56 }}>
      <SkeletonBar width="20%" height={11} />
      <SkeletonBar width="85%" height={44} />
      <SkeletonBar width="65%" height={44} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <SkeletonBar width="100%" height={18} />
        <SkeletonBar width="90%" height={18} />
        <SkeletonBar width="60%" height={18} />
      </div>
      <SkeletonBar width="22%" height={11} />
    </div>
  )
}
