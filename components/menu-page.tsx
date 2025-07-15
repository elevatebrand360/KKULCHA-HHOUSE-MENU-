"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Menu, X, ChevronUp, Search, Star, Coffee, Utensils } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { menuData, menuCategories } from "@/data/menu-data"
import type { MenuItem } from "@/types/menu"
import Image from "next/image"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
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

  // Helper for seeded random
  function seededRandom(seed: number) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Helper for seeded random per category
  function seededRandomForCategory(seed: number, categoryId: string) {
    let hash = 0;
    for (let i = 0; i < categoryId.length; i++) {
      hash = ((hash << 5) - hash) + categoryId.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return seededRandom(seed + hash);
  }

  // List of category IDs for which to show suggestions
  const suggestionCategoryIds = [
    "indian-main-course",
    "dessert",
    "soup",
    "salad",
    "continental-chinese",
    "combo",
    "mocktails-beverages",
  ];

  return (
    <div className="min-h-screen text-gold-50">
      {/* Header */}
      <header className="z-50 border-b border-gold-800/50 backdrop-blur-sm bg-opacity-80">
        <div className="container mx-auto px-4 py-0.5 flex justify-center items-center min-h-0">
          <Image src="/images/logo.png" alt="THE KKULCHA HHOUSE" width={280} height={280} className="h-auto w-[180px] sm:w-[280px]" />
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
      <div className="sticky top-[69px] z-40 border-b border-gold-800/30 backdrop-blur-sm bg-opacity-80 py-3">
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
      <main className="container mx-auto px-4 py-6 pb-24 relative" style={{ position: 'relative', zIndex: 1 }}>
        {/* Watermark logo background */}
        <div className="watermark-bg"></div>
        {/* Main content above watermark */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-8 text-center">
            <p className="text-gold-200 font-bold text-lg mb-1">THE KKULCHA HHOUSE CAFE</p>
            <p className="text-gold-400 italic">Premium Dining & Hookah Experience</p>
            <p className="text-gold-600 text-sm mt-1">100% PURE VEG</p>
          </div>

          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="w-full border border-gold-900/50 mb-6">
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
              <div className="flex flex-wrap gap-2 pb-4 mb-6 justify-center">
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
                        {/* Category suggestion box for each category */}
                        {(() => {
                          let suggestionBox: React.ReactNode = null;
                          if (category.items.length > 0 && suggestionCategoryIds.includes(category.id)) {
                            const today = new Date();
                            const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                            const randomIndex = Math.floor(seededRandomForCategory(seed, category.id) * category.items.length);
                            const suggestion = category.items[randomIndex];
                            if (suggestion) {
                              suggestionBox = (
                                <div className="flex justify-center my-10">
                                  <div className="relative w-full max-w-xl">
                                    <span className="absolute top-3 right-3 bg-gold-400 text-black font-bold text-xs px-3 py-1 rounded-full shadow">Suggestion</span>
                                    <div className="bg-white border-l-4 border-gold-400 shadow p-6 rounded-lg">
                                      <div className="font-bold text-lg text-gold-900 mb-1">{suggestion.name}</div>
                                      {suggestion.description && (
                                        <div className="text-gray-700 mb-2 text-sm">{suggestion.description}</div>
                                      )}
                                      {suggestion.price && (
                                        <div className="font-bold text-gold-500 text-base">₹{suggestion.price}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }
                          return suggestionBox;
                        })()}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {category.items.map((item, index) => {
                            const isShisha = category.id === "hookah" || category.id === "tkh-special-sisha";
                            const hasDescription = !!item.description;
                            if (isShisha && !hasDescription) {
                              return (
                                <motion.div
                                  key={`${item.name}-${index}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="flex flex-row items-center justify-between bg-gradient-to-br from-gold-950/80 to-gold-900/90 border-2 border-gold-700 rounded-xl shadow-xl px-4 py-3 min-h-[64px] h-auto w-full gap-4 hover:shadow-gold-900/40 transition-all duration-300 relative"
                                >
                                  <h3 className="font-bold text-gold-200 text-base sm:text-lg text-left w-2/3 truncate">
                                    {item.name}
                                  </h3>
                                  <span className="font-extrabold text-gold-400 text-lg sm:text-xl text-right w-1/3">₹{item.price}</span>
                                </motion.div>
                              );
                            } else {
                              return (
                                <motion.div
                                  key={`${item.name}-${index}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="aspect-square flex flex-col justify-between items-center bg-gradient-to-br from-gold-950/80 to-gold-900/90 border-2 border-gold-700 rounded-2xl shadow-xl p-6 gap-2 hover:shadow-gold-900/40 transition-all duration-300 relative"
                                >
                                  <h3 className="font-bold text-gold-200 text-lg sm:text-xl text-center w-full leading-tight">
                                    {item.name}
                                  </h3>
                                  <div className="flex-1 flex items-center w-full">
                                    <p className="text-sm text-gold-400/90 text-center w-full line-clamp-3 overflow-hidden" style={{minHeight: '3.6em'}}>
                                      {item.description}
                                    </p>
                                  </div>
                                  <span className="font-extrabold text-gold-400 text-xl sm:text-2xl text-center w-full">₹{item.price}</span>
                                </motion.div>
                              );
                            }
                          })}
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
                      {/* Category suggestion box for selected category */}
                      {(() => {
                        const category = menuData.find((c) => c.id === activeCategory);
                        if (!category || !suggestionCategoryIds.includes(category.id) || category.items.length === 0) return null;
                        const today = new Date();
                        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                        const randomIndex = Math.floor(seededRandomForCategory(seed, category.id) * category.items.length);
                        const suggestion = category.items[randomIndex];
                        if (!suggestion) return null;
                        return (
                          <div className="flex justify-center my-10">
                            <div className="relative w-full max-w-xl">
                              <span className="absolute top-3 right-3 bg-gold-400 text-black font-bold text-xs px-3 py-1 rounded-full shadow">Suggestion</span>
                              <div className="bg-white border-l-4 border-gold-400 shadow p-6 rounded-lg">
                                <div className="font-bold text-lg text-gold-900 mb-1">{suggestion.name}</div>
                                {suggestion.description && (
                                  <div className="text-gray-700 mb-2 text-sm">{suggestion.description}</div>
                                )}
                                {suggestion.price && (
                                  <div className="font-bold text-gold-500 text-base">₹{suggestion.price}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {(() => {
                          const items = menuData.find((c) => c.id === activeCategory)?.items || [];
                          return items.map((item, index) => {
                            const isShisha = activeCategory === "hookah" || activeCategory === "tkh-special-sisha";
                            const hasDescription = !!item.description;
                            if (isShisha && !hasDescription) {
                              return (
                                <motion.div
                                  key={`${item.name}-${index}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="flex flex-row items-center justify-between bg-gradient-to-br from-gold-950/80 to-gold-900/90 border-2 border-gold-700 rounded-xl shadow-xl px-4 py-3 min-h-[64px] h-auto w-full gap-4 hover:shadow-gold-900/40 transition-all duration-300 relative"
                                >
                                  <h3 className="font-bold text-gold-200 text-base sm:text-lg text-left w-2/3 truncate">
                                    {item.name}
                                  </h3>
                                  <span className="font-extrabold text-gold-400 text-lg sm:text-xl text-right w-1/3">₹{item.price}</span>
                                </motion.div>
                              );
                            } else {
                              return (
                                <motion.div
                                  key={`${item.name}-${index}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="aspect-square flex flex-col justify-between items-center bg-gradient-to-br from-gold-950/80 to-gold-900/90 border-2 border-gold-700 rounded-2xl shadow-xl p-6 gap-2 hover:shadow-gold-900/40 transition-all duration-300 relative"
                                >
                                  <h3 className="font-bold text-gold-200 text-lg sm:text-xl text-center w-full leading-tight">
                                    {item.name}
                                  </h3>
                                  <div className="flex-1 flex items-center w-full">
                                    <p className="text-sm text-gold-400/90 text-center w-full line-clamp-3 overflow-hidden" style={{minHeight: '3.6em'}}>
                                      {item.description}
                                    </p>
                                  </div>
                                  <span className="font-extrabold text-gold-400 text-xl sm:text-2xl text-center w-full">₹{item.price}</span>
                                </motion.div>
                              );
                            }
                          });
                        })()}
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

                {/* Random suggestion for the day */}
                {(() => {
                  // Flatten all menu items
                  const allItems = menuData.flatMap((cat) => cat.items);
                  // Seeded random based on date
                  const today = new Date();
                  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                  function seededRandom(seed: number) {
                    let x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                  }
                  const randomIndex = Math.floor(seededRandom(seed) * allItems.length);
                  const item = allItems[randomIndex];
                  if (!item) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative mb-6 rounded-2xl border-2 border-gold-400 bg-white/30 backdrop-blur-md shadow-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 overflow-hidden mx-auto max-w-xl"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg border-4 border-white">
                          <Star className="text-white w-7 h-7" />
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left mt-8 md:mt-0">
                        <h3 className="font-extrabold text-2xl md:text-3xl text-gold-900 mb-2 tracking-tight drop-shadow">{item.name}</h3>
                        {item.description && (
                          <p className="text-gold-800/90 mt-1 text-base font-medium">{item.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
                        {item.price && (
                          <div className="font-extrabold text-2xl md:text-3xl bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent drop-shadow">₹{item.price}</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gold-950 border-t border-gold-900/50 py-2 text-center text-gold-400">
        <div className="container mx-auto px-4">
          <Image
            src="/images/logo.png"
            alt="THE KKULCHA HHOUSE"
            width={220}
            height={220}
            className="h-56 w-auto mx-auto mb-2"
          />
          <p className="text-sm mb-2">100% PURE VEG</p>
          <p className="text-xs text-gold-600">© 2025 THE KKULCHA HHOUSE CAFE. All rights reserved.</p>
        </div>
        <div className="mt-2">
          <span className="text-gold-400 text-xs">Developed & Maintained by </span>
          <a href="https://www.elevatebrand360.com" target="_blank" rel="noopener noreferrer" className="text-gold-400 text-xs underline hover:text-gold-300 transition-colors duration-200 font-semibold">
            Elevate Brand 360
          </a>
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
