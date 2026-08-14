import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

const categories = ["All categories", "Electronics", "Identity", "Keys", "Bags", "Clothing", "Books", "Accessories", "Other"];
const statuses = ["All statuses", "lost", "found", "resolved", "archived"];

export default function Browse() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const input = useMemo(() => ({ query: query || undefined, category: category === "All categories" ? undefined : category, status: status === "All statuses" ? undefined : status as "lost" | "found" | "resolved" | "archived", fromDate: fromDate || undefined, toDate: toDate || undefined, page, pageSize: 8 }), [query, category, status, fromDate, toDate, page]);
  const listing = trpc.items.list.useQuery(input);
  const reset = () => { setQuery(""); setCategory("All categories"); setStatus("All statuses"); setFromDate(""); setToDate(""); setPage(1); };
  const hasFilters = Boolean(query || category !== "All categories" || status !== "All statuses" || fromDate || toDate);

  return <main className="container max-w-7xl py-10 sm:py-14">
    <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#648174]">Campus directory</p><h1 className="text-3xl font-semibold tracking-[-0.045em] text-[#263630] sm:text-4xl">Browse reported items</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#68766f]">Search current campus reports and take the next step when something looks familiar.</p></div><div className="rounded-2xl border border-[#dfe6dd] bg-[#f1f5ee] px-4 py-3 text-sm text-[#527266]"><span className="font-semibold text-[#31584a]">{listing.data?.total ?? "—"}</span> reports currently visible</div></div>
    <section className="mb-8 rounded-2xl border border-[#e2e7e0] bg-white p-4 shadow-[0_10px_30px_rgba(29,50,42,.04)]"><div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))_auto]"><label className="relative"><span className="sr-only">Search reports</span><Search className="absolute left-3 top-3 h-4 w-4 text-[#809087]" /><Input value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Search items, description or place…" className="h-10 rounded-xl border-[#e1e7df] pl-9" /></label><select aria-label="Category" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }} className="h-10 rounded-xl border border-[#e1e7df] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#527f6d]/30">{categories.map(option => <option key={option}>{option}</option>)}</select><select aria-label="Status" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className="h-10 rounded-xl border border-[#e1e7df] bg-white px-3 text-sm capitalize outline-none focus:ring-2 focus:ring-[#527f6d]/30">{statuses.map(option => <option key={option}>{option}</option>)}</select><Input aria-label="From date" type="date" value={fromDate} onChange={event => { setFromDate(event.target.value); setPage(1); }} className="h-10 rounded-xl border-[#e1e7df] text-sm" /><Input aria-label="To date" type="date" value={toDate} onChange={event => { setToDate(event.target.value); setPage(1); }} className="h-10 rounded-xl border-[#e1e7df] text-sm" /><Button variant="ghost" disabled={!hasFilters} onClick={reset} className="h-10 rounded-xl text-[#5a7167]"><X className="mr-1.5 h-4 w-4" />Clear</Button></div></section>
    {listing.isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-[345px] rounded-2xl bg-[#edf1ea]" />)}</div> : null}
    {listing.isError ? <div className="rounded-2xl border border-[#f2d7d1] bg-[#fff8f6] p-8 text-center"><p className="font-medium text-[#963e2d]">Unable to load reports</p><p className="mt-2 text-sm text-[#7d665e]">{listing.error.message}</p><Button className="mt-4 rounded-xl" onClick={() => listing.refetch()}>Try again</Button></div> : null}
    {!listing.isLoading && !listing.isError && !listing.data?.records.length ? <div className="rounded-2xl border border-dashed border-[#ccd9ce] bg-[#f7faf5] px-6 py-16 text-center"><span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#e6efe3] text-[#477362]"><Filter className="h-5 w-5" /></span><h2 className="text-lg font-semibold">No items match those filters</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#748078]">Try a broader search or reset filters to see all recent reports.</p>{hasFilters ? <Button variant="outline" className="mt-5 rounded-xl" onClick={reset}>Reset filters</Button> : null}</div> : null}
    {!listing.isLoading && listing.data?.records.length ? <><div className="mb-5 flex items-center gap-2 text-sm text-[#718077]"><SlidersHorizontal className="h-4 w-4" />Page {listing.data.page} of {listing.data.totalPages}</div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{listing.data.records.map(item => <ItemCard key={item.id} item={item} />)}</div><div className="mt-10 flex items-center justify-center gap-3"><Button variant="outline" className="rounded-xl" disabled={page <= 1} onClick={() => setPage(previous => previous - 1)}>Previous</Button><span className="text-sm text-[#718077]">{page} / {listing.data.totalPages}</span><Button variant="outline" className="rounded-xl" disabled={page >= listing.data.totalPages} onClick={() => setPage(previous => previous + 1)}>Next</Button></div></> : null}
  </main>;
}
