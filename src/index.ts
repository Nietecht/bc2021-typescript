import { init, classModule, propsModule, attributesModule, styleModule, datasetModule } from "snabbdom";
import { DeepReadonly } from '@infra';
import { recipes } from './recipes'
import { Recipe } from "./app/model/types"
import { renderRecipes } from "./app/renderers/render-recipe";
import './css/main.scss';

const patch = init([classModule, propsModule, attributesModule, styleModule, datasetModule]);

const typedRecipes: DeepReadonly<Recipe[]> = recipes;

patch(document.getElementById("content")!, renderRecipes((typedRecipes as Recipe[]).map(r => r)))