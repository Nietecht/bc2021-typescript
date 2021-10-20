import { assertNever } from '@util'
import { Recipe, Ingredient, UnitSystem, Unit, IngredientWithAlternative, SubRecipe, IngredientDetails } from './intermediate-recipe'

const round2 = (nr: number) => Math.round(nr * 100) / 100

const fromTo = <T extends Unit, U extends UnitSystem>(unit: T, to: U): `${T}->${U}` => `${unit}->${to}`

export function isSubRecipe(ingredient: Ingredient): ingredient is SubRecipe {
  return !!(ingredient as SubRecipe).ingredients
}

export function isIngredientWithAlternative(ingredient: Ingredient): ingredient is IngredientWithAlternative {
  return !!(ingredient as IngredientWithAlternative).alternative
}

function mapRecipe(detailsMapper: (details: IngredientDetails) => IngredientDetails) {
  const mapper = (ingredient: Ingredient): Ingredient => {
    if (isSubRecipe(ingredient))
      return {
        name: ingredient.name,
        ingredients: ingredient.ingredients.map(mapper)
      }
    
    if (isIngredientWithAlternative(ingredient))
      return {
        main: detailsMapper(ingredient.main),
        alternative: detailsMapper(ingredient.alternative)
      }
    
    return detailsMapper(ingredient)
  }

  return mapper;
}

function normalizeQuantity(quantity: IngredientDetails['quantity']) {
  if (typeof quantity === 'number')
    return quantity

  return {
    "½": 0.5,
    "⅓": 0.33,
    "¼": 0.25
  }[quantity]
}

function convertIngredientAmount(quantity: IngredientDetails['quantity'], unit: Unit | undefined, to: UnitSystem): [typeof quantity, typeof unit] {
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
        case fromTo("cup", "metric"): return [round2(normalizeQuantity(quantity) * cupMlRatio), "ml"]
        case fromTo("oz", "metric"): return [round2(normalizeQuantity(quantity) * ounceGramRatio), "g"]
        case fromTo("g", "us"): return [round2(normalizeQuantity(quantity) / ounceGramRatio), "oz"]
        case fromTo("ml", "us"): return [round2(normalizeQuantity(quantity) / cupMlRatio), "cup"]
        case fromTo("cup", "us"):
        case fromTo("oz", "us"):
        case fromTo("g", "metric"):
        case fromTo("ml", "metric"):
          return [quantity, unit]
        default: return assertNever(conversion);
      }
  }
}

function convertIngredientDetails(ingredient: IngredientDetails, to: UnitSystem): IngredientDetails {
  const [quantity, unit] = convertIngredientAmount(ingredient.quantity, ingredient.unit, to)

  return {
    ...ingredient,
    quantity: quantity,
    unit: unit
  }
}

const convertIngredient = (to: UnitSystem) => mapRecipe(details => convertIngredientDetails(details, to))


export function convertRecipe(recipe: Recipe, to: UnitSystem): Recipe {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map(convertIngredient(to))
  }
}

function ingredientDetailsForRatio(ingredient: IngredientDetails, ratio: number): IngredientDetails {
  return {
    ...ingredient,
    quantity: round2(normalizeQuantity(ingredient.quantity) * ratio)
  }
}

const ingredientForRatio = (ratio: number) => mapRecipe(ingredient => ingredientDetailsForRatio(ingredient, ratio))

export function forServings(recipe: Recipe, servings: number): Recipe {
  const ratio = servings / recipe.serves

  return {
    ...recipe,
    serves: servings,
    ingredients: recipe.ingredients.map(ingredientForRatio(ratio))
  }
}