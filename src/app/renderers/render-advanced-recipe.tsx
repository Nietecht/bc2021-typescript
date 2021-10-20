import { VNode } from 'snabbdom'
import { jsx } from '@infra'
import { assertNever } from '@util'
import { isIngredientWithAlternative, isSubRecipe } from 'app/model/advanced-operations'
import { Recipe, Ingredient, IngredientDetails, SubRecipe, IngredientWithAlternative } from '../model/advanced-recipe'

export function renderRecipes(recipes: Recipe[]) {
  return <main>
    {recipes.map(recipe => <section>{renderRecipe(recipe)}</section>)}
  </main>
}

function renderAttribute(attribute: Attribute) {
  const config = renderConfig[attribute.type]
  const args =
    "details" in attribute
      ? Array.isArray(attribute.details)
        ? attribute.details
        : [ attribute.details ]
      : []

  return (config.renderer as ((...args: any[]) => VNode))(...args)
}

function renderArea(area: Area, attributes: Attribute[]) {
  return attributes.filter(a => renderConfig[a.type].area === area).map(renderAttribute)
}

function renderRecipe(recipe: Recipe) {
  return <article className="container">
    <div className="title">{recipe.name}</div>
    <div className="recipe-image" style={{background: `url(${recipe.imgUrl})`}}></div>
    <div className="details">
      <strong>By { typeof recipe.author === "string" ? recipe.author : <a href={recipe.author.href}>{recipe.author.name}</a>}</strong>
      <div className="header-attributes">
        {renderArea("header", recipe.attributes)}
      </div>
    </div>
    
    <section className="items">
      <span className="item-title">Ingredients</span>
      <ul className="checkmark">
        {recipe.ingredients.map(ingredient => <li>
          {renderIngredient(ingredient)}
        </li>)}
      </ul>
    </section>
    <section className="nutrition-attributes">
      {renderArea("nutrition", recipe.attributes)}
    </section>
    <footer className="footer-attributes">
      {renderArea("footer", recipe.attributes)}
    </footer>
  </article>
}

function renderSubRecipe(subRecipe: SubRecipe) {
  return <span><strong>{subRecipe.name}</strong><ul>
    {subRecipe.ingredients.map(subIngredient => <li>{renderIngredient(subIngredient)}</li>)}
  </ul></span>
}

function renderIngredientWithAlternative(ingredient: IngredientWithAlternative) {
  return <span>
      {renderIngredient(ingredient.main)}
      &nbsp;<i>(or alternatively, {renderIngredient(ingredient.alternative)})</i>
    </span>
}

function renderIngredient(ingredient: Ingredient) {
  if (isSubRecipe(ingredient))
    return renderSubRecipe(ingredient)
  if (isIngredientWithAlternative(ingredient))
    return renderIngredientWithAlternative(ingredient)

  return <span>
      <span className="ingredient">{ingredient.name}</span>&nbsp;<span className="amount">{renderAmount(ingredient)}</span>
    </span>
}

function renderAmount(ingredient: IngredientDetails) {
  switch (ingredient.unit) {
    case undefined:
      return ingredient.quantity
    case 'g':
    case 'ml':
      return `${ingredient.quantity} ${ingredient.unit}`
    case 'tbs':
    case 'tsp':
    case 'oz':
    case 'cup':
      return `${ingredient.quantity} ${ingredient.unit}`
    default: return assertNever(ingredient.unit);
  }
}

type Area = "header" | "footer" | "nutrition"

type ConfigFor<Renderer> = {
  area: Area
  renderer: Renderer
}

type Renderers<Attribute extends { type: string, details?: any }> = 
    { [K in Attribute["type"]]:
        (Attribute & { type: K }) extends { details: infer Details }
          ? Details extends any[]
            ? ConfigFor<(...args: Details) => VNode>
            : ConfigFor<(detail: Details) => VNode>
          : ConfigFor<() => VNode> }

type TypeOfArray<T extends any[]> = T extends Array<infer U> ? U : never

type Attribute = TypeOfArray<Recipe["attributes"]>

const renderConfig: Renderers<Attribute> = {
  "cook time": {
    area: "header",
    renderer: time => <span className="cooking-time">Cooking: {time}m</span>
  },
  "prep time": {
    area: "header",
    renderer: time => <span className="cooking-time">Prep: {time}m</span>
  },
  "marinating time": {
    area: "header",
    renderer: time => <span className="cooking-time">Marinating: {time}m</span>
  },
  course: {
    area: "footer",
    renderer: (...courses) => <span className="courses">Can be served as: {courses.join(', ')}</span>
  },
  cuisine: {
    area: "footer",
    renderer: cuisine => <span className="cuisine">Cuisine: {cuisine}</span>
  },
  difficulty: {
    area: "header",
    renderer: (difficulty: string) => <span className="difficulty">Difficulty: {difficulty}</span>
  },
  freezable: {
    area: "footer",
    renderer: () => <span className="freezable">Freezable</span>
  },
  nutrition: {
    area: "nutrition",
    renderer: (type, amount, unit, percentDaily) => <div className="nutrition-box">
      <div className="nutrition-inner">
        <span className="nutrition-title">{type}</span>
        <span className="nutrition-top">{amount}{unit}</span>
        <span className="nutrition-bottom">{percentDaily ? `${percentDaily}%` : <span>&nbsp;</span>}</span>
      </div>
    </div>
  }
}
