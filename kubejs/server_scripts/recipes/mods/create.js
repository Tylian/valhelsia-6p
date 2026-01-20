// priority: 10
//   __   ___   _    _  _ ___ _    ___ ___   _        __
//   \ \ / /_\ | |  | || | __| |  / __|_ _| /_\      / /
//    \ V / _ \| |__| __ | _|| |__\__ \| | / _ \    / _ \
//     \_/_/ \_\____|_||_|___|____|___/___/_/ \_\   \___/
//

/**
 * @file Recipe additions for Create's crafting methods.
 *
 * @copyright Valhelsia Inc 2024
 */

/**
 * Create Recipe Event Handler
 */
ServerEvents.recipes(event => {
  const ID_PREFIX = 'valhelsia:create/';

  // Filling
  // event.recipes.create.filling('irons_spellbooks:blood_vial', [Fluid.of('biomesoplenty:blood 250'), 'minecraft:glass_bottle']).id(`${ID_PREFIX}filling/blood_vial`);

  // Mechanical Crafting
  event.recipes.create.mechanical_crafting('valhelsia_structures:dungeon_door', [
    'CCCC',
    'HWWH',
    'CWWC',
    'HSSH',
    'CCCC'
  ], {
    C: '#forge:ingots/steel',
    W: 'minecraft:dark_oak_planks',
    H: 'create:shaft',
    S: '#forge:plates/steel',
  }).id(`${ID_PREFIX}mechanical_crafting/dungeon_door`);

  // Mixing
  event.recipes.create.mixing([Fluid.of('minecraft:milk 250')], [Fluid.of('minecraft:water 250'), '#valhelsia:nuts']).heated().id(`${ID_PREFIX}mixing/milk_from_nuts`);
  event.recipes.create.mixing('minecraft:paper', [Fluid.of('minecraft:water 500'), '2x #forge:dusts/wood']).id(`${ID_PREFIX}mixing/paper_from_sawdust`);
  // event.recipes.create.mixing([Fluid.of('immersiveengineering:phenolic_resin 250')], [Fluid.of('immersiveengineering:acetaldehyde 250'), 'darkerdepths:resin']).heated().id(`${ID_PREFIX}mixing/phenolic_resin_from_resin`);

  // Crushing
  event.recipes.create.crushing('create:experience_nugget', 'hostilenetworks:overworld_prediction');
  event.recipes.create.crushing('2x create:experience_nugget', 'hostilenetworks:nether_prediction');
  event.recipes.create.crushing('2x create:experience_nugget', 'hostilenetworks:twilight_prediction');
  event.recipes.create.crushing('3x create:experience_nugget', 'hostilenetworks:end_prediction');

  const crushedOres = {
    'create:crushed_raw_iron': { 'temperature': 800, 'result': 'forge:molten_iron' },
    'create:crushed_raw_gold': { 'temperature': 700, 'result': 'forge:molten_gold' },
    'create:crushed_raw_copper': { 'temperature': 500, 'result': 'forge:molten_copper' },
    'create:crushed_raw_zinc': { 'temperature': 420, 'result': 'forge:molten_zinc' },
    'create:crushed_raw_osmium': { 'temperature': 975, 'result': 'forge:molten_osmium' },
    'create:crushed_raw_silver': { 'temperature': 970, 'result': 'forge:molten_silver' },
    'create:crushed_raw_tin': { 'temperature': 225, 'result': 'forge:molten_tin' },
    'create:crushed_raw_lead': { 'temperature': 330, 'result': 'forge:molten_lead' },
    'create:crushed_raw_aluminum': { 'temperature': 425, 'result': 'forge:molten_aluminum' },
    'create:crushed_raw_uranium': { 'temperature': 830, 'result': 'forge:molten_uranium' },
    'create:crushed_raw_nickel': { 'temperature': 950, 'result': 'forge:molten_nickel' }
  };

  for (const [item, { temperature, result }] of Object.entries(crushedOres)) {
    event.custom({
      "type": "tconstruct:melting",
      "ingredient": {
        "item": item
      },
      "result": {
        "amount": 90,
        "tag": result
      },
      "temperature": temperature,
      "time": 60
    });
  }
});
