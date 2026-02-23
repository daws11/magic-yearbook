function Layout({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      {children}
      <div className="grain-overlay pointer-events-none absolute inset-0 z-40 opacity-20 mix-blend-soft-light" />
    </div>
  )
}

export default Layout
