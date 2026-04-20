export function Footer() {
  return (
    <footer className="border-t border-border-base bg-white font-sans mt-auto">
      <div className="max-w-[1200px] mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
        <div>
          <div className="text-[18px] font-bold tracking-[-0.03em] text-foreground mb-2">Planora</div>
          <div className="text-[13px] text-muted leading-[1.7]">Create, discover, and join events.</div>
        </div>
        {[
          { h: "About", l: ["Our story", "How it works", "Blog"] },
          { h: "Contact", l: ["Support", "Partnerships", "Press"] },
          { h: "Legal", l: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
        ].map(col => (
          <div key={col.h}>
            <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.07em] mb-3.5">{col.h}</div>
            {col.l.map(l => (
              <div
                key={l}
                className="text-[14px] text-muted mb-2 cursor-pointer hover:text-foreground transition-colors"
              >
                {l}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-border-base max-w-[1200px] mx-auto px-8 py-4 text-[12px] text-muted">
        © 2026 Planora. All rights reserved.
      </div>
    </footer>
  );
}
