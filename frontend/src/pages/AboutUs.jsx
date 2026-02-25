const AboutUs = () => {
  return (
    <div className="page">
      <section className="container py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Built for people, <span className="muted">not spreadsheets.</span></h1>
        <p className="text-lg max-w-2xl mx-auto muted">StockFlow started in 2024 with one goal — make inventory management simple enough for anyone, powerful enough for everyone.</p>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Simplicity First", body: "Software shouldn't need a manual. We design for clarity." },
              { title: "Speed Matters", body: "Real-time updates — when stock changes, your dashboard reflects it instantly." },
              { title: "Customer Driven", body: "Every feature is based on direct feedback from real users." },
            ].map(({ title, body }) => (
              <div key={title} className="card p-6">
                <div className="w-2 h-8 rounded mb-4" style={{background: 'linear-gradient(90deg,var(--accent),var(--accent-2))'}} />
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-sm muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;