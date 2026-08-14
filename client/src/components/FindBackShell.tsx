import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Bell, Compass, LogOut, Menu, PackagePlus, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { toast } from "sonner";

const navItems = [
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/report/lost", label: "Report lost", icon: PackagePlus },
  { href: "/report/found", label: "Report found", icon: PackagePlus },
];

export default function FindBackShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const notificationsQuery = trpc.notifications.mine.useQuery(undefined, { enabled: isAuthenticated });
  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
      toast.success("Notification marked as read.");
    },
    onError: error => toast.error(error.message),
  });
  const unreadCount = notificationsQuery.data?.filter(notification => !notification.isRead).length ?? 0;

  const navigate = (href: string, message = "Opening requested page.") => {
    toast.message(message);
    setLocation(href);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#25322f]">
      <header className="sticky top-0 z-40 border-b border-[#e7e8df] bg-[#fbfaf7]/90 backdrop-blur-xl">
        <div className="container flex h-[76px] max-w-7xl items-center justify-between gap-5">
          <Link href="/" className="group flex items-center gap-3 shrink-0" aria-label="FindBack home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#254b42] text-[#f8e9ae] shadow-[0_8px_20px_rgba(37,75,66,.18)] transition-transform duration-200 group-hover:-rotate-3">
              <Compass className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-[-0.04em]">FindBack</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => toast.message(`Opening ${label.toLowerCase()}.`)} className="rounded-xl px-3.5 py-2 text-sm font-medium text-[#4e5b56] transition-colors hover:bg-[#eef2eb] hover:text-[#254b42]">
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {!loading && isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-xl text-[#385247]" aria-label="Open notifications">
                      <Bell className="h-[18px] w-[18px]" />
                      {unreadCount > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#cc6f4a] ring-2 ring-[#fbfaf7]" /> : null}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[340px] rounded-2xl border-[#e3e6df] p-2 shadow-xl">
                    <DropdownMenuLabel className="flex items-center justify-between px-2 py-2.5 text-sm font-semibold">
                      Notifications
                      {unreadCount > 0 ? <Badge className="rounded-full bg-[#edf2e7] text-[#31584b] hover:bg-[#edf2e7]">{unreadCount} new</Badge> : null}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notificationsQuery.isLoading ? <p className="px-2 py-5 text-center text-sm text-muted-foreground">Loading updates…</p> : null}
                    {notificationsQuery.isError ? <div className="px-2 py-5 text-center"><p className="text-sm font-medium text-[#963e2d]">Updates could not be loaded.</p><Button variant="ghost" size="sm" className="mt-2 rounded-xl" onClick={() => { notificationsQuery.refetch(); toast.message("Refreshing notifications."); }}>Try again</Button></div> : null}
                    {!notificationsQuery.isLoading && !notificationsQuery.isError && !notificationsQuery.data?.length ? <p className="px-2 py-5 text-center text-sm text-muted-foreground">No notifications yet.</p> : null}
                    {notificationsQuery.data?.slice(0, 5).map(notification => (
                      <DropdownMenuItem key={notification.id} className="flex cursor-pointer flex-col items-start gap-1 rounded-xl px-2 py-2.5" onClick={() => {
                        if (!notification.isRead) markRead.mutate({ notificationId: notification.id });
                        if (notification.itemId) navigate(`/items/${notification.itemId}`);
                      }}>
                        <span className="flex w-full items-center justify-between gap-2 font-medium">
                          {notification.title}
                          {!notification.isRead ? <span className="h-1.5 w-1.5 rounded-full bg-[#cc6f4a]" /> : null}
                        </span>
                        <span className="whitespace-normal text-xs leading-relaxed text-muted-foreground">{notification.body}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-[#eef2eb]">
                      <Avatar className="h-8 w-8 bg-[#dfeadb] text-[#31584b]"><AvatarFallback className="bg-[#dfeadb] text-xs font-semibold">{user?.name?.[0]?.toUpperCase() ?? "S"}</AvatarFallback></Avatar>
                      <span className="max-w-24 truncate text-sm font-medium">{user?.name ?? "Student"}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-2xl border-[#e3e6df] p-1.5">
                    <DropdownMenuLabel className="px-2 py-2 text-xs font-normal text-muted-foreground">Signed in as {user?.role}</DropdownMenuLabel>
                    <DropdownMenuItem className="rounded-xl" onClick={() => navigate("/profile")}>My profile</DropdownMenuItem>
                    {user?.role === "admin" ? <DropdownMenuItem className="rounded-xl" onClick={() => navigate("/admin")}><ShieldCheck className="mr-2 h-4 w-4" />Admin dashboard</DropdownMenuItem> : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-xl text-destructive focus:text-destructive" onClick={() => { logout(); toast.success("You have been signed out."); }}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => startLogin()} className="rounded-xl bg-[#254b42] px-4 text-white hover:bg-[#1e3f37]">Sign in</Button>
            )}
          </div>

          <div className="flex md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="rounded-xl"><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-[#e3e6df] bg-[#fbfaf7] p-5">
                <div className="mb-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#254b42] text-[#f8e9ae]"><Compass className="h-5 w-5" /></span><span className="text-lg font-semibold tracking-[-0.04em]">FindBack</span></div>
                <div className="grid gap-2">
                  {navItems.map(({ href, label, icon: Icon }) => <Button key={href} variant="ghost" className="justify-start rounded-xl" onClick={() => navigate(href, `Opening ${label.toLowerCase()}.`)}><Icon className="mr-2 h-4 w-4" />{label}</Button>)}
                  {isAuthenticated ? <><Button variant="ghost" className="justify-start rounded-xl" onClick={() => navigate("/profile")}>My profile</Button>{user?.role === "admin" ? <Button variant="ghost" className="justify-start rounded-xl" onClick={() => navigate("/admin")}>Admin dashboard</Button> : null}<Button variant="outline" className="mt-3 rounded-xl" onClick={() => { logout(); toast.success("You have been signed out."); }}>Sign out</Button></> : <Button className="mt-3 rounded-xl bg-[#254b42]" onClick={() => startLogin()}>Sign in</Button>}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-[#e7e8df] bg-white"><div className="container flex max-w-7xl flex-col justify-between gap-3 py-8 text-sm text-[#72807a] sm:flex-row"><p>FindBack helps campus communities reconnect with what matters.</p><p>Privacy-first property recovery.</p></div></footer>
    </div>
  );
}
