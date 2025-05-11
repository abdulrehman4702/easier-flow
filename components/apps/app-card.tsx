import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface App {
  id: string
  name: string
  description: string
  logo: string
  yamlFile: string
  endpoints: number
  createdAt: string
  updatedAt: string
}

interface AppCardProps {
  app: App
  onDelete: () => void
}

export function AppCard({ app, onDelete }: AppCardProps) {
  const updatedTimeAgo = formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image src={app.logo || "/placeholder.svg"} alt={`${app.name} logo`} fill className="object-cover" />
          </div>
          <div>
            <CardTitle>{app.name}</CardTitle>
            <CardDescription>{app.description}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/apps/${app.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/apps/${app.id}/endpoints`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View Endpoints</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Endpoints:</span>
            <span className="font-medium">{app.endpoints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">File:</span>
            <span className="font-medium">{app.yamlFile}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last updated:</span>
            <span className="font-medium">{updatedTimeAgo}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/apps/${app.id}`}>Edit</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/workflow/create?app=${app.id}`}>Use in Workflow</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

