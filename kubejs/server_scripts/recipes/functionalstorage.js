ServerEvents.recipes(event => {
  const suffixes = ["_1", "_2", "_4"];

  const fixDrawerRecipe = recipe => {
    const recipeId = recipe.getId();
    const suffix = suffixes.find(s => recipeId.endsWith(s));
    if (!suffix) return;

    const recipeSlug = recipeId.slice(0, -suffix.length);

    event.remove({ id: `${recipeSlug}_2` });
    event.remove({ id: `${recipeSlug}_4` });

    event.stonecutting(`${recipeSlug}_2`, `${recipeSlug}_1`);
    event.stonecutting(`${recipeSlug}_4`, `${recipeSlug}_1`);
  };

  event.remove({id:"functionalstorage:oak_drawer_alternate_x1"});
  event.remove({id:"functionalstorage:oak_drawer_alternate_x2"});
  event.remove({id:"functionalstorage:oak_drawer_alternate_x4"});

  // Functional storage
  event.forEachRecipe({ output: /functionalstorage:\S+_1$/ }, fixDrawerRecipe);
  event.forEachRecipe({ output: /everycomp:fs\S+_1$/ }, fixDrawerRecipe);

  // Storage drawers (half + full)
  event.forEachRecipe({ output: /storagedrawers:\S+_1$/ }, fixDrawerRecipe);
  event.forEachRecipe({ output: /everycomp:sd\S+_1$/ }, fixDrawerRecipe);
});
