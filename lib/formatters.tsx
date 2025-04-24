import { Check, X, Minus } from "lucide-react"

export const formatMerged = (val: boolean) => (val ? "✅" : "")

export const formatPrStatus = (val: string) => {
  switch (val) {
    case "merged":
      return (
        <span title="Dieser PR wurde gemergt" className="text-green-600">
          <Check className="h-4 w-4 inline mr-1" />
        </span>
      )
    case "open":
      return (
        <span title="Dieser PR ist offen" className="text-blue-600">
          <Minus className="h-4 w-4 inline mr-1" />
        </span>
      )
    case "closed":
      return (
        <span title="Dieser PR wurde geschlossen" className="text-red-600">
          <X className="h-4 w-4 inline mr-1" />
        </span>
      )
    default:
      return val
  }
}

export const formatLink = (val: string) => (
  <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
    {val}
  </a>
)

export const formatDateTime = (val: string) =>
  new Date(val).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
