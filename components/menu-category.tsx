"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import type { MenuItem } from "@/types/menu"

interface MenuCategoryProps {
  id: string
  name: string
  items: MenuItem[]
  setActiveCategory: (id: string | null) => void
}

export default function MenuCategory({ id, name, items, setActiveCategory }: MenuCategoryProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
  })

  useEffect(() => {
    if (inView) {
      setActiveCategory(id)
    }
  }, [inView, id, setActiveCategory])

  return (
    <section id={id} ref={ref} className="mb-12">
      <h2 className="text-2xl font-bold text-amber-900 mb-4 pb-2 border-b-2 border-amber-300">{name}</h2>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-amber-900">{item.name}</h3>
              {item.price && <span className="font-bold text-amber-800 ml-2">₹{item.price}</span>}
            </div>
            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
