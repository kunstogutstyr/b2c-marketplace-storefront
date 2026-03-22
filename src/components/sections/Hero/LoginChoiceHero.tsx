import { Sora } from "next/font/google"
import Link from "next/link"

import tailwindConfig from "../../../../tailwind.config"
import { ArrowRightIcon } from "@/icons"
import { HeroVendorTicker } from "./HeroVendorTicker"

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

type LoginChoiceHeroProps = {
  heading: string
  vendorNames?: string[]
  paragraph: string
  buttons: { label: string; path: string }[]
}

export const LoginChoiceHero = ({
  heading,
  vendorNames = [],
  paragraph,
  buttons,
}: LoginChoiceHeroProps) => {
  return (
    <section className="w-full flex container mt-5 justify-center items-center min-h-[50vh] text-primary">
      <div className="w-full max-w-2xl flex flex-col items-center text-center">
        <h2 className="font-bold mb-6 display-md text-4xl md:text-5xl leading-tight">
          <span className="inline-flex flex-wrap items-baseline gap-y-1 justify-center">
            <span className={sora.className}>{heading}</span>
            <span className="mx-3 hidden sm:inline">|</span>
            <HeroVendorTicker names={vendorNames} />
          </span>
        </h2>
        <p className="text-lg mb-8">{paragraph}</p>
        {buttons.length > 0 && (
          <div className="w-full max-w-md h-[72px] flex font-bold uppercase gap-2">
            {buttons.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className="group flex-1 flex border rounded-sm h-full bg-content hover:bg-action hover:text-tertiary transition-all duration-300 p-6 justify-between items-center"
                aria-label={label}
                title={label}
              >
                <span>
                  <span className="group-hover:inline-flex hidden">#</span>
                  {label}
                </span>
                <ArrowRightIcon
                  color={tailwindConfig.theme.extend.backgroundColor.primary}
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
