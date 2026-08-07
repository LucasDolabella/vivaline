function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold text-brand-strong">Vivaline</h1>
      <p className="max-w-xs text-ink-muted">
        Medication timeline — coming together.
      </p>
      <button
        type="button"
        className="rounded-lg bg-brand px-6 py-3 text-white shadow-soft"
      >
        Add a medication
      </button>
    </main>
  )
}

export default App