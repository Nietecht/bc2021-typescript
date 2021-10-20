import { recipes } from './recipes/advanced'
import { Recipe } from "./app/model/advanced-recipe"
import { renderRecipes } from "./app/renderers/render-advanced-recipe";
import { convertRecipe, forServings } from "./app/model/advanced-operations";
import { init, classModule, propsModule, attributesModule, styleModule, datasetModule } from "snabbdom";
import './css/main.scss';

const patch = init([classModule, propsModule, attributesModule, styleModule, datasetModule]);

type DeepReadonly<T> =
  T extends {}
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>
    }
  : T extends Array<infer U>
    ? ReadonlyArray<U>
    : T

const typedRecipes: DeepReadonly<Recipe[]> = recipes;

console.log(typedRecipes);

patch(document.getElementById("content")!, renderRecipes((typedRecipes as Recipe[]).map(r => forServings(convertRecipe(r, "metric"), 4))))