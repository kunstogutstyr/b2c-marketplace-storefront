import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/atoms"
import { ProductListing } from "@/components/sections"
import type { Metadata } from "next"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const title = "Alle produkter (uten Algolia)"
  const description =
    "Produktliste hentet direkte fra Medusa – for å teste integrasjon uten Algolia."

  return {
    title,
    description,
    robots: { index: false, follow: true },
  }
}

export default async function AlleProdukterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const breadcrumbsItems = [
    { path: "/", label: "Hjem" },
    { path: "/alle-produkter", label: "Alle produkter (uten Algolia)" },
  ]

  return (
    <main className="container">
      <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <h1 className="heading-xl uppercase">Alle produkter (uten Algolia)</h1>
      <p className="text-secondary mt-1 mb-4">
        Denne listen hentes direkte fra Medusa-backend uten Algolia.
      </p>
      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListing showSidebar locale={locale} />
      </Suspense>
    </main>
  )
}
