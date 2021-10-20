import { assertNever } from '@util'
import { Recipe, Ingredient, UnitSystem, Unit } from './simple-recipe'

const round2 = (nr: number) => Math.round(nr * 100) / 100

const fromTo = <T extends Unit, U extends UnitSystem>(unit: T, to: U): `${T}->${U}` => `${unit}->${to}`

function convertIngredientAmount(quantity: number, unit: Unit | undefined, to: UnitSystem): [typeof quantity, typeof unit] {
  const cupMlRatio = 236
  const ounceGramRatio = 28.35

  switch (unit) {
    case undefined:
    case "tbs":
    case "tsp":
      return [quantity, unit]
    default:
      const conversion = fromTo(unit, to)
      switch (conversion) {
        case fromTo("cup", "metric"): return [round2(quantity * cupMlRatio), "ml"]
        case fromTo("oz", "metric"): return [round2(quantity * ounceGramRatio), "g"]
        case fromTo("g", "us"): return [round2(quantity / ounceGramRatio), "oz"]
        case fromTo("ml", "us"): return [round2(quantity / cupMlRatio), "cup"]
        case fromTo("cup", "us"):
        case fromTo("oz", "us"):
        case fromTo("g", "metric"):
        case fromTo("ml", "metric"):
          return [quantity, unit]
        default: return assertNever(conversion);
      }
  }
}

function convertIngredient(ingredient: Ingredient, to: UnitSystem): Ingredient {
  const [quantity, unit] = convertIngredientAmount(ingredient.quantity, ingredient.unit, to)

  return {
    ...ingredient,
    quantity: quantity,
    unit: unit
  }
}

export function convertRecipe(recipe: Recipe, to: UnitSystem): Recipe {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map(ingredient => convertIngredient(ingredient, to))
  }
}
