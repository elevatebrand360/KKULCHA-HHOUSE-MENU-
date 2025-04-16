export interface MenuItem {
  name: string
  price?: string
  description?: string
  categoryId?: string
  categoryName?: string
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}
