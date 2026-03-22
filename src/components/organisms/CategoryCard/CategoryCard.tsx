import {
  Camera,
  Layers,
  Monitor,
  Palette,
  Pencil,
  Puzzle,
  SquareStack,
} from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

import { SwatchIcon } from "@/icons"

type CategoryCardProps = {
  category: Pick<
    HttpTypes.StoreProductCategory,
    "id" | "name" | "handle" | "metadata"
  >
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  maleri: Palette,
  tegning: Pencil,
  grafikk: Layers,
  dga: SquareStack,
  foto: Camera,
  "digital-kunst": Monitor,
  "digital kunst": Monitor,
  "mixed-media": Puzzle,
  "mixed media": Puzzle,
}

function getCategoryIcon(handle: string) {
  const normalized = handle?.toLowerCase().replace(/\s+/g, "-") ?? ""
  return CATEGORY_ICON_MAP[normalized] ?? SwatchIcon
}

export function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.metadata?.image_url as string | undefined
  const hasImage = imageUrl && imageUrl.startsWith("http")
  const IconComponent = getCategoryIcon(category.handle ?? "")

  return (
    <LocalizedClientLink
      href={`/categories/${category.handle}`}
      className="relative flex flex-col items-center border rounded-sm bg-component transition-all hover:rounded-full w-[233px] aspect-square"
    >
      <div className="flex relative aspect-square overflow-hidden w-[200px] items-center justify-center">
        {hasImage ? (
          <Image
            loading="lazy"
            src={imageUrl}
            alt={`category - ${category.name}`}
            width={200}
            height={200}
            sizes="(min-width: 1024px) 200px, 40vw"
            className="object-contain scale-90 rounded-full"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center rounded-full bg-component-secondary">
            <IconComponent className="size-20 text-secondary" aria-hidden />
          </div>
        )}
      </div>
      <h3 className="w-full text-center label-lg text-primary">
        {category.name}
      </h3>
    </LocalizedClientLink>
  )
}
