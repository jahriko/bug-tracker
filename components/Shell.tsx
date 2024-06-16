"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  PanelTop,
  ChevronDown,
  Users,
  PenSquare,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { WorkspacesData } from "@/server/data/many/get-workspaces"
import { ProjectIdAndTitle } from "../../layout"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Shell({
  children,
  projects,
  workspaces,
}: {
  children: React.ReactNode
  projects: ProjectIdAndTitle[]
  workspaces: WorkspacesData
}) {
  const path = usePathname()
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-1">
          <div className="flex h-14 items-center justify-between px-4 lg:h-[60px]">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex gap-2  p-1" variant="ghost">
                    <div className="hidden h-6 w-6  items-center justify-center rounded-md bg-slate-300 text-xs font-medium sm:flex">
                      {path.slice(1, 3).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium leading-none">
                      {path.split("/")[1]}
                    </p>
                    <ChevronDown className="size-3 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem asChild key={workspace.id}>
                      <Link href={`/${workspace.name}`}>{workspace.name}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    className="h-8 w-8"
                    size="icon"
                    variant="outline"
                  >
                    <Link href="/new-issue">
                      <PenSquare className="h-4 w-4" />
                      <span className="sr-only">New issue</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create issue</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium ">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href={`${path}/issues`}
              >
                <Home className="h-4 w-4" />
                Issues
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href={`${path}/projects`}
              >
                <PanelTop className="h-4 w-4" />
                Projects
              </Link>
            </nav>

            <ul className="-mx-2 mt-2 space-y-1 px-2">
              <ScrollArea>
                {projects.map((project: { id: string; title: string }) => (
                  <li key={project.id}>
                    <Link
                      className={classNames(
                        path === project.id
                          ? "bg-gray-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600",
                        "group flex items-center gap-x-3 rounded-md p-2 px-4 text-sm font-medium leading-6",
                      )}
                      href={`projects/${project.id}/issues`}
                    >
                      <span
                        className={classNames(
                          path === project.id
                            ? "border-indigo-600 text-indigo-600"
                            : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                          "flex size-6  shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium",
                        )}
                      >
                        {project.title.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate capitalize">
                        {project.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ScrollArea>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 ">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="shrink-0 md:hidden"
                size="icon"
                variant="outline"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col" side="left">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  className="flex items-center gap-2 text-lg font-semibold"
                  href="#"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  href="#"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                  href="#"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  href="#"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  href="#"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  href="#"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" size="sm">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        {children}
      </div>
    </div>
  )
}
