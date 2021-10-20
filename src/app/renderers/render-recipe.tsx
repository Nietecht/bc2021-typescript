import { jsx } from '@infra'
import { Recipe } from '../model/recipe'

export function renderRecipes(recipes: Recipe[]) {
  return <main>
    {recipes.map(recipe => <section>{renderRecipe(recipe)}</section>)}
  </main>
}

export function renderRecipe(recipe: Recipe) {
  return <article className="container">
    <div className="title"></div>
    <div className="recipe-image" style={{background: "url('https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1290&q=80')"}}></div>
    <div className="details">
      <strong>By Paul Hollywood</strong>
    </div>
    
    <section className="items">
      <span className="item-title">Ingredients</span>
      <ul className="checkmark">
      <li>
          <span className="ingredient">Dummy ingredient 1</span>&nbsp;<span className="amount">2 tsp</span>
        </li>
        <li>
          <span className="ingredient">Dummy ingredient 2</span>&nbsp;<span className="amount">5g</span>
        </li>
      </ul>
    </section>
  </article>
}