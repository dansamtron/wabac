function App() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Tailwind is Working
        </h1>

        <p className="mt-3 text-slate-600">
          If you can see this styled card, Tailwind CSS is correctly connected
          to your React + Vite frontend.
        </p>

        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
          Test Button
        </button>
      </section>
    </main>
  );
}

export default App;
