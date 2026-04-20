import { Button } from "@/components/ui/Button";
import { CategoryPill, StatusPill } from "@/components/ui/Pill";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight font-tight">F1: Frontend Scaffolded 🚀</h1>
        <p className="text-muted text-lg">
          The design system tokens from your prototype have been integrated into Tailwind v4.
          Core atomic components (Buttons and Pills) are ready for use.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Atomic Components</h2>
        
        <div className="space-y-8">
          {/* Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Button Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="danger">Danger Action</Button>
              <Button variant="success">Success Action</Button>
              <Button variant="ghost">Ghost Link</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" small>Small Primary</Button>
              <Button variant="secondary" small>Small Secondary</Button>
            </div>
          </div>

          {/* Pills */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Pill Types</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <CategoryPill type="public" fee={0} />
              <CategoryPill type="public" fee={500} />
              <CategoryPill type="private" fee={0} />
              <CategoryPill type="private" fee={1200} />
              <StatusPill status="featured" />
              <StatusPill status="approved" />
              <StatusPill status="pending" />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8 border-t border-border-base">
        <p className="text-sm text-muted italic">
          Everything is set up with Next.js 15, TypeScript, and Tailwind v4.
        </p>
      </div>
    </main>
  );
}
