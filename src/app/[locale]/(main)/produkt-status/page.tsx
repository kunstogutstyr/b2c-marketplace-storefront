import { getRegion, listRegions } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import type { HttpTypes } from "@medusajs/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Produktstatus – hvorfor vises ikke produktene?",
  robots: { index: false, follow: false },
}

async function getDiagnostics(locale: string) {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  const result: {
    backendUrl: string
    publishableKeySet: boolean
    regionsError: string | null
    regionsCount: number
    regionCountries: string[]
    regionForLocale: { found: boolean; name?: string; id?: string }
    productsError: string | null
    productsCount: number
    productsRawCount: number
  } = {
    backendUrl,
    publishableKeySet: Boolean(publishableKey),
    regionsError: null,
    regionsCount: 0,
    regionCountries: [],
    regionForLocale: { found: false },
    productsError: null,
    productsCount: 0,
    productsRawCount: 0,
  }

  try {
    const regions = await listRegions()
    result.regionsCount = regions?.length ?? 0
    result.regionCountries = (regions || []).flatMap((r: HttpTypes.StoreRegion) =>
      (r.countries || []).map((c: { iso_2?: string }) => c.iso_2 || "").filter(Boolean)
    )
  } catch (e) {
    result.regionsError = e instanceof Error ? e.message : String(e)
  }

  const region = await getRegion(locale)
  if (region) {
    result.regionForLocale = {
      found: true,
      name: region.name,
      id: region.id,
    }
  }

  try {
    const { response } = await listProducts({
      countryCode: locale,
      queryParams: { limit: 100 },
    })
    result.productsCount = response.products.length
    result.productsRawCount = response.count
  } catch (e) {
    result.productsError = e instanceof Error ? e.message : String(e)
  }

  return result
}

function InfoRow({
  label,
  value,
  ok,
}: {
  label: string
  value: React.ReactNode
  ok?: boolean
}) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </td>
      <td className="py-2">
        {ok !== undefined && (
          <span
            className={
              ok
                ? "text-green-600 dark:text-green-400"
                : "text-amber-600 dark:text-amber-400"
            }
          >
            {ok ? "✓" : "✗"}{" "}
          </span>
        )}
        {value}
      </td>
    </tr>
  )
}

export default async function ProduktStatusPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const d = await getDiagnostics(locale)

  return (
    <main className="container max-w-2xl py-8">
      <h1 className="heading-xl mb-2">Produktstatus</h1>
      <p className="text-secondary text-sm mb-6">
        Denne siden viser hvorfor produktene kanskje ikke vises. Bruk locale fra
        URL: <strong>{locale}</strong>
      </p>

      <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 mb-6">
        <h2 className="font-semibold mb-3">1. Backend og konfigurasjon</h2>
        <table className="w-full text-sm">
          <tbody>
            <InfoRow
              label="Backend URL"
              value={<code className="text-xs break-all">{d.backendUrl}</code>}
            />
            <InfoRow
              label="Publishable key satt?"
              value={d.publishableKeySet ? "Ja" : "Nei"}
              ok={d.publishableKeySet}
            />
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 mb-6">
        <h2 className="font-semibold mb-3">2. Regioner (land) i Medusa</h2>
        <table className="w-full text-sm">
          <tbody>
            <InfoRow
              label="Henting av regioner"
              value={
                d.regionsError
                  ? `Feil: ${d.regionsError}`
                  : `${d.regionsCount} region(er) hentet`
              }
              ok={!d.regionsError}
            />
            <InfoRow
              label="Landkoder (iso_2)"
              value={
                d.regionCountries.length
                  ? d.regionCountries.join(", ")
                  : "Ingen (eller feil ved henting)"
              }
            />
          </tbody>
        </table>
        <p className="text-xs text-secondary mt-2">
          URL-en bruker første del som landkode (f.eks. /no/ → &quot;no&quot;). Den må
          finnes i listen over.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 mb-6">
        <h2 className="font-semibold mb-3">3. Region for din locale</h2>
        <table className="w-full text-sm">
          <tbody>
            <InfoRow
              label={`Region for &quot;${locale}&quot;`}
              value={
                d.regionForLocale.found
                  ? `Funnet: ${d.regionForLocale.name || d.regionForLocale.id}`
                  : "Ikke funnet – bruk en URL med en landkode fra listen over (f.eks. /us/ eller /no/)"
              }
              ok={d.regionForLocale.found}
            />
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 mb-6">
        <h2 className="font-semibold mb-3">4. Produkter fra API</h2>
        <table className="w-full text-sm">
          <tbody>
            <InfoRow
              label="Henting av produkter"
              value={
                d.productsError
                  ? `Feil: ${d.productsError}`
                  : `Rå antall fra API: ${d.productsRawCount}. Etter filtrering (selger aktiv, har pris): ${d.productsCount}`
              }
              ok={!d.productsError && d.productsCount > 0}
            />
          </tbody>
        </table>
        <p className="text-xs text-secondary mt-2">
          Produkter uten pris i denne regionen, eller med suspendert selger,
          vises ikke.
        </p>
      </section>

      <section className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
        <h2 className="font-semibold mb-2">Kort oppsummert</h2>
        <ul className="list-disc list-inside text-sm space-y-1 text-secondary">
          {!d.regionForLocale.found && (
            <li>Locale &quot;{locale}&quot; matcher ingen region – sjekk Medusa Admin → Regions og landkoder.</li>
          )}
          {d.regionForLocale.found && d.productsCount === 0 && !d.productsError && (
            <li>Region finnes, men ingen produkter ble vist. Sjekk at produktene har priser i denne regionen og at selger er aktiv.</li>
          )}
          {d.regionsError && (
            <li>Kunne ikke hente regioner – sjekk at backend kjører på {d.backendUrl} og at publishable key er riktig.</li>
          )}
          {d.productsError && (
            <li>Feil ved henting av produkter: {d.productsError}</li>
          )}
          {d.productsCount > 0 && (
            <li>Alt ser ut til å fungere – {d.productsCount} produkt(er) hentet.</li>
          )}
        </ul>
      </section>
    </main>
  )
}
