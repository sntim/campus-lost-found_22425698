import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Compass, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[#e2e8df] bg-[#f5f8f2]">
        <div className="pointer-events-none absolute -right-32 top-0 h-[440px] w-[440px] rounded-full bg-[#dae9d5] opacity-75 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-120px] left-[18%] h-[240px] w-[400px] rounded-[100%] bg-[#f4dda3] opacity-40 blur-3xl" />
        <div className="container relative grid max-w-7xl items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#cadac8] bg-white/65 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-[#477062]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d27b55]" />Campus property recovery
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#23372f] sm:text-5xl lg:text-6xl">
              Lost something? <span className="text-[#527b66]">Let’s help it find its way back.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#61736a]">
              FindBack is a trusted home for campus lost-and-found reports—designed to make discovery simple, ownership safer, and recovery more human.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/browse" onClick={() => toast.message("Opening the campus report directory.")}>
                <Button size="lg" className="h-12 w-full rounded-xl bg-[#254b42] px-6 text-white shadow-[0_10px_24px_rgba(37,75,66,.20)] hover:bg-[#1e3f37] sm:w-auto">
                  Browse reports<ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/report/lost" onClick={() => toast.message("Opening a new lost-item report.")}>
                <Button size="lg" variant="outline" className="h-12 w-full rounded-xl border-[#b8cbbb] bg-white/70 px-6 text-[#365d4f] hover:bg-white sm:w-auto">
                  Report an item
                </Button>
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#5c7468]">
              <Link
                href="/browse"
                onClick={() => toast.message("Browse found reports to begin a private ownership claim.")}
                className="flex items-center gap-2 rounded-lg outline-none transition-colors hover:text-[#254b42] focus-visible:ring-2 focus-visible:ring-[#527f6d]/40"
              >
                <CheckCircle2 className="h-4 w-4 text-[#4e816b]" />Privacy-first claims<ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin"
                onClick={() => toast.message("Opening the administrator review area.")}
                className="flex items-center gap-2 rounded-lg outline-none transition-colors hover:text-[#254b42] focus-visible:ring-2 focus-visible:ring-[#527f6d]/40"
              >
                <CheckCircle2 className="h-4 w-4 text-[#4e816b]" />Administrator review<ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-[30px] border border-white/75 bg-white/75 p-3 shadow-[0_28px_60px_rgba(39,74,59,.14)] backdrop-blur">
              <div className="rounded-[22px] bg-[#254b42] p-5 text-white">
                <div className="flex items-center justify-between"><span className="text-sm font-medium text-[#d7e8d1]">FindBack report</span><span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">FOUND</span></div>
                <div className="mt-8 flex h-36 items-center justify-center rounded-[18px] bg-[radial-gradient(circle_at_40%_25%,#7da386,transparent_28%),linear-gradient(135deg,#345f51,#1d3c34)]"><Compass className="h-12 w-12 text-[#f5d982]" /></div>
                <p className="mt-5 text-xl font-semibold tracking-[-0.03em]">Black leather wallet</p>
                <p className="mt-2 text-sm leading-6 text-[#cde0ca]">Found near the library entrance. Identifying details kept private.</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-[#b8d3b7]"><span>Library · Today</span><span>Verified workflow</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3">
                <div className="rounded-2xl bg-[#eef3ea] p-3"><p className="text-[11px] font-semibold uppercase tracking-wider text-[#6c8677]">Find</p><p className="mt-1 text-sm font-semibold text-[#2f5749]">Search first</p></div>
                <div className="rounded-2xl bg-[#fff1cf] p-3"><p className="text-[11px] font-semibold uppercase tracking-wider text-[#947a38]">Claim</p><p className="mt-1 text-sm font-semibold text-[#624f22]">Prove ownership</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container max-w-7xl py-16 lg:py-20">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#648174]">Designed around trust</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#263630]">A clearer path from report to reunion.</h2></div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e3e9e1] bg-white p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f0e5] text-[#416f5b]"><Search className="h-5 w-5" /></span><h3 className="mt-5 font-semibold">Discover quickly</h3><p className="mt-2 text-sm leading-6 text-[#718077]">Search reports by what, where, when, or current recovery status.</p></div>
          <div className="rounded-2xl border border-[#e3e9e1] bg-white p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1d2] text-[#9b7521]"><ShieldCheck className="h-5 w-5" /></span><h3 className="mt-5 font-semibold">Claim with confidence</h3><p className="mt-2 text-sm leading-6 text-[#718077]">Ownership evidence is reviewed before anyone’s private contact information is revealed.</p></div>
          <div className="rounded-2xl border border-[#e3e9e1] bg-white p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e5edf8] text-[#45688c]"><LockKeyhole className="h-5 w-5" /></span><h3 className="mt-5 font-semibold">Keep control</h3><p className="mt-2 text-sm leading-6 text-[#718077]">Your reports, claims and decision alerts live safely in one simple profile.</p></div>
        </div>
      </section>
    </main>
  );
}
