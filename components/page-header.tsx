import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
}

export function PageHeader({ title, description, backHref }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 pb-6">
      {backHref && (
        <Button variant="ghost" size="sm" className="w-fit gap-1 pl-0" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}
