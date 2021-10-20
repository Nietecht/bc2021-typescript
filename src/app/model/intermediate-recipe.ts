export type Link = {
  href: string
  name: string
}

export type Author = string | Link

export type Tablespoon = "tbs"
export type Teaspoon = "tsp"
export type Spoon = Tablespoon | Teaspoon
export type Volume = "ml" | "cup"
export type Mass = "g" | "oz"
export type Unit = Spoon | Volume | Mass

export type IngredientDetails = {
  name: string
  quantity: number | "½" | "⅓" | "¼"
  unit?: Unit
  instruction?: string
}

export type IngredientWithAlternative = {
  main: IngredientDetails
  alternative: IngredientDetails
}

export type SubRecipe = {
  name: string
  ingredients: Ingredient[]
}

export type Ingredient = IngredientDetails | IngredientWithAlternative | SubRecipe

export type Recipe = {
  name: string
  author: Author
  imgUrl: string
  serves: number
  ingredients: Ingredient[]
}

export type UnitSystem = "metric" | "us"
