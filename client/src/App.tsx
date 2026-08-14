import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import FindBackShell from "./components/FindBackShell";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import Browse from "./pages/Browse";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ReportItem from "./pages/ReportItem";

function Router() {
  return <FindBackShell><Switch><Route path="/" component={Home} /><Route path="/browse" component={Browse} /><Route path="/report/:type" component={ReportItem} /><Route path="/items/:id" component={ItemDetail} /><Route path="/profile" component={Profile} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></FindBackShell>;
}

export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
