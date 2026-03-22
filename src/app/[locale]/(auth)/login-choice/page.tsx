import { LoginChoiceHero } from "@/components/sections"
import { listSellerNames } from "@/lib/data/seller"

export default async function LoginChoicePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const vendorNames = await listSellerNames()

  const vendorUrl =
    process.env.NEXT_PUBLIC_VENDOR_URL || "https://vendor.mercurjs.com"

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center text-primary">
      <LoginChoiceHero
        heading="ArtBy"
        vendorNames={vendorNames}
        paragraph="Buy, sell, and discover pre-loved gems from the trendiest brands."
        buttons={[
          { label: "Buy now", path: `/${locale}/login` },
          { label: "Sell now", path: vendorUrl },
        ]}
      />
    </main>
  )
}
