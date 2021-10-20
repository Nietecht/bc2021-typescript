export type Tablespoon = "tbs"
export type Teaspoon = "tsp"
export type Spoon = Tablespoon | Teaspoon
export type Volume = "ml" | "cup"
export type Mass = "g" | "oz"
export type Unit = Spoon | Volume | Mass

export type Ingredient = {
  name: string
  quantity: number
  unit?: Unit
}

export type Recipe = {
  name: string
  author: string
  imgUrl: string
  ingredients: Ingredient[]
}

export type UnitSystem = "metric" | "us"