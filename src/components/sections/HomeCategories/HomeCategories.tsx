import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"
import { listCategories } from "@/lib/data/categories"

export const HomeCategories = async ({ heading }: { heading: string }) => {
  const { parentCategories, categories } = await listCategories()
  const displayCategories =
    parentCategories.length > 0 ? parentCategories : categories

  const categoryCards = displayCategories?.map((category) => (
    <CategoryCard key={category.id} category={category} />
  ))

  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      {/* Mobil: 2-kolonne grid uten scroll */}
      <div className="grid grid-cols-2 gap-4 sm:hidden">
        {categoryCards}
      </div>
      {/* Desktop: carousel */}
      <div className="hidden sm:block">
        <Carousel items={categoryCards ?? []} />
      </div>
    </section>
  )
}
