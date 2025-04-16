"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronUp, Search, Star, Coffee, Utensils } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { menuData, menuCategories } from "@/data/menu-data"
import Image from "next/image"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState(menuData)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      const filtered = menuData.flatMap((category) => {
        return category.items
          .filter(
            (item) =>
              item.name.toLowerCase().includes(lowercaseQuery) ||
              (item.description && item.description.toLowerCase().includes(lowercaseQuery)),
          )
          .map((item) => ({
            ...item,
            categoryId: category.id,
            categoryName: category.name,
          }))
      })
      setFilteredItems(filtered)
    } else if (activeCategory === "all") {
      setFilteredItems(
        menuData.flatMap((category) =>
          category.items.map((item) => ({
            ...item,
            categoryId: category.id,
            categoryName: category.name,
          })),
        ),
      )
    } else {
      const categoryItems =
        menuData
          .find((category) => category.id === activeCategory)
          ?.items.map((item) => ({
            ...item,
            categoryId: activeCategory,
            categoryName: menuData.find((c) => c.id === activeCategory)?.name || "",
          })) || []
      setFilteredItems(categoryItems)
    }
  }, [searchQuery, activeCategory])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
    setMenuOpen(false)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setActiveCategory("all")
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
  }

  const getPopularItems = () => {
    // This would normally be based on actual data, but for demo purposes
    // we'll just mark some items as popular
    const popularItemIds = [
      "PANEER TIKKA",
      "DOUBLE APPLE",
      "CHOLE BHATURE",
      "MAKHANI CHEESE LOADED MOMOS",
      "VIRGIN MOJITO",
    ]

    return menuData.flatMap((category) =>
      category.items
        .filter((item) => popularItemIds.some((id) => item.name.includes(id)))
        .map((item) => ({
          ...item,
          categoryId: category.id,
          categoryName: category.name,
        })),
    )
  }

  return (
    <div className="min-h-screen bg-black text-gold-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gold-800/50 backdrop-blur-sm bg-opacity-80">
        <div className="container mx-auto px-4 py-3 flex justify-center items-center">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="THE KKULCHA HHOUSE" width={120} height={120} className="h-24 w-auto" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-black border-b border-gold-900/50 shadow-lg overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-2">
                <ul className="grid grid-cols-2 gap-2">
                  <li>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-gold-400 hover:bg-gold-950 hover:text-gold-300",
                        activeCategory === "all" && "bg-gold-950 text-gold-300",
                      )}
                      onClick={() => handleCategoryChange("all")}
                    >
                      All Items
                    </Button>
                  </li>
                  {menuCategories.map((category) => (
                    <li key={category.id}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-gold-400 hover:bg-gold-950 hover:text-gold-300",
                          activeCategory === category.id && "bg-gold-950 text-gold-300",
                        )}
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        {category.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Bar */}
      <div className="sticky top-[69px] z-40 bg-black border-b border-gold-800/30 backdrop-blur-sm bg-opacity-80 py-3">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-600 h-4 w-4" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search our menu..."
              className="pl-10 pr-10 py-6 bg-gold-950/50 border-gold-800/50 text-gold-100 placeholder:text-gold-700 focus:border-gold-600 focus:ring-gold-600"
              onChange={handleSearch}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold-600 hover:text-gold-400 hover:bg-transparent"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="mb-8 text-center">
          <p className="text-gold-400 italic">Premium Dining & Hookah Experience</p>
          <p className="text-gold-600 text-sm mt-1">100% PURE VEG</p>
        </div>

        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="w-full bg-gold-950/50 border border-gold-900/50 mb-6">
            <TabsTrigger
              value="menu"
              className="data-[state=active]:bg-gold-800 data-[state=active]:text-gold-50 text-gold-400"
            >
              <Utensils className="h-4 w-4 mr-2" />
              Full Menu
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="data-[state=active]:bg-gold-800 data-[state=active]:text-gold-50 text-gold-400"
            >
              <Star className="h-4 w-4 mr-2" />
              Popular Items
            </TabsTrigger>
            <TabsTrigger
              value="specials"
              className="data-[state=active]:bg-gold-800 data-[state=active]:text-gold-50 text-gold-400"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Specials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-0">
            {/* Category Pills */}
            <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap",
                  activeCategory === "all"
                    ? "bg-gold-600 hover:bg-gold-700 text-black"
                    : "border-gold-800 text-gold-400 hover:bg-gold-950 hover:text-gold-300",
                )}
                onClick={() => handleCategoryChange("all")}
              >
                All Items
              </Button>
              {menuCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full whitespace-nowrap",
                    activeCategory === category.id
                      ? "bg-gold-600 hover:bg-gold-700 text-black"
                      : "border-gold-800 text-gold-400 hover:bg-gold-950 hover:text-gold-300",
                  )}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {searchQuery && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gold-400 mb-4">Search Results for "{searchQuery}"</h2>
                {filteredItems.length === 0 ? (
                  <p className="text-gold-600 italic">No items found matching your search.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={`${item.name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-gradient-to-r from-gold-950 to-gold-900 rounded-lg shadow-xl p-4 hover:shadow-gold-900/30 transition-all duration-300 border border-gold-800/30"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gold-300">{item.name}</h3>
                            <Badge variant="outline" className="mt-1 text-xs border-gold-700 text-gold-500">
                              {item.categoryName}
                            </Badge>
                            {item.description && <p className="text-sm text-gold-400/80 mt-1">{item.description}</p>}
                          </div>
                          {item.price && (
                            <div className="flex flex-col items-end">
                              <span className="font-bold text-gold-400 ml-2">₹{item.price}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <>
                {activeCategory === "all" ? (
                  // Show all categories
                  menuData.map((category) => (
                    <div key={category.id} className="mb-12">
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-gold-400 mb-4 pb-2 border-b border-gold-800/50 flex items-center"
                      >
                        <span className="bg-gold-400 h-8 w-1 mr-3 rounded-full"></span>
                        {category.name}
                      </motion.h2>
                      <div className="grid grid-cols-1 gap-4">
                        {category.items.map((item, index) => (
                          <motion.div
                            key={`${item.name}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-gradient-to-r from-gold-950 to-gold-900 rounded-lg shadow-xl p-4 hover:shadow-gold-900/30 transition-all duration-300 border border-gold-800/30"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gold-300">{item.name}</h3>
                                {item.description && (
                                  <p className="text-sm text-gold-400/80 mt-1">{item.description}</p>
                                )}
                              </div>
                              {item.price && (
                                <div className="flex flex-col items-end">
                                  <span className="font-bold text-gold-400 ml-2">₹{item.price}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Show selected category
                  <div className="mb-12">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-2xl font-bold text-gold-400 mb-4 pb-2 border-b border-gold-800/50 flex items-center"
                    >
                      <span className="bg-gold-400 h-8 w-1 mr-3 rounded-full"></span>
                      {menuData.find((c) => c.id === activeCategory)?.name}
                    </motion.h2>
                    <div className="grid grid-cols-1 gap-4">
                      {menuData
                        .find((c) => c.id === activeCategory)
                        ?.items.map((item, index) => (
                          <motion.div
                            key={`${item.name}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-gradient-to-r from-gold-950 to-gold-900 rounded-lg shadow-xl p-4 hover:shadow-gold-900/30 transition-all duration-300 border border-gold-800/30"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gold-300">{item.name}</h3>
                                {item.description && (
                                  <p className="text-sm text-gold-400/80 mt-1">{item.description}</p>
                                )}
                              </div>
                              {item.price && (
                                <div className="flex flex-col items-end">
                                  <span className="font-bold text-gold-400 ml-2">₹{item.price}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="popular">
            <div className="mb-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-gold-400 mb-4 pb-2 border-b border-gold-800/50 flex items-center"
              >
                <span className="bg-gold-400 h-8 w-1 mr-3 rounded-full"></span>
                Customer Favorites
              </motion.h2>
              <div className="grid grid-cols-1 gap-4">
                {getPopularItems().map((item, index) => (
                  <motion.div
                    key={`popular-${item.name}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-gradient-to-r from-gold-950 to-gold-900 rounded-lg shadow-xl p-4 hover:shadow-gold-900/30 transition-all duration-300 border border-gold-800/30"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold text-gold-300">{item.name}</h3>
                          <Badge className="ml-2 bg-gold-600 text-black">Popular</Badge>
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs border-gold-700 text-gold-500">
                          {item.categoryName}
                        </Badge>
                        {item.description && <p className="text-sm text-gold-400/80 mt-1">{item.description}</p>}
                      </div>
                      {item.price && (
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-gold-400 ml-2">₹{item.price}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specials">
            <div className="mb-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-gold-400 mb-4 pb-2 border-b border-gold-800/50 flex items-center"
              >
                <span className="bg-gold-400 h-8 w-1 mr-3 rounded-full"></span>
                Today's Specials
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-gold-950 to-gold-900 rounded-lg shadow-xl p-6 hover:shadow-gold-900/30 transition-all duration-300 border border-gold-800/30 mb-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-gold-500 text-black px-4 py-1 rounded-bl-lg font-bold">
                  SPECIAL
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-xl text-gold-300">Combo Deal of the Day</h3>
                    <p className="text-gold-400/80 mt-2">
                      Any two Hookahs (excluding TKH Specials) + 2 Cold Drinks + 1 Starter of your choice
                    </p>
                    <ul className="mt-2 text-gold-400/90 list-disc list-inside">
                      <li>
                        Choose from: Crispy Chilli Babycorn, Paneer Tikka, Chole Bhature, Chinese Bhel, Maggi, or Steam
                        Momo
                      </li>
                    </ul>
                    <Badge variant="outline" className="mt-3 text-xs border-gold-700 text-gold-500">
                      Limited Time Offer
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-gold-400/70 line-through">₹1050</div>
                    <div className="font-bold text-2xl text-gold-400">₹901</div>
                    <div className="text-gold-600 text-sm">Save ₹149</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-gold-950 to-gold-900 rounded-lg shadow-xl p-6 hover:shadow-gold-900/30 transition-all duration-300 border border-gold-800/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-gold-500 text-black px-4 py-1 rounded-bl-lg font-bold">
                  CHEF'S SPECIAL
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-xl text-gold-300">TKH Chef's Special Platter</h3>
                    <p className="text-gold-400/80 mt-2">
                      A surprise selection of our chef's finest creations, curated daily
                    </p>
                    <Badge variant="outline" className="mt-3 text-xs border-gold-700 text-gold-500">
                      Ask Your Server
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-bold text-2xl text-gold-400">₹401</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gold-950 border-t border-gold-900/50 py-6 text-center text-gold-400">
        <div className="container mx-auto px-4">
          <Image
            src="/images/logo.png"
            alt="THE KKULCHA HHOUSE"
            width={120}
            height={120}
            className="h-24 w-auto mx-auto mb-4"
          />
          <p className="text-sm mb-2">100% PURE VEG</p>
          <p className="text-xs text-gold-600">© 2023 THE KKULCHA HHOUSE. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              variant="default"
              size="icon"
              className="rounded-full bg-gold-600 hover:bg-gold-700 text-black shadow-lg h-12 w-12"
              onClick={scrollToTop}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
