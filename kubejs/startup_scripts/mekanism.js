/*
  Created with reference to the AllTheMods file. Thanks for your contribution o7
*/

const DEFAULT_TYPES = ['clump', 'crystal', 'dirty_dust', 'shard'];
const DEFAULT_WITH_DUST = DEFAULT_TYPES.concat('dust');

// global configuration
global.mekanismMaterials = [
  { material: 'desh', color: '#d38b4c', types: DEFAULT_WITH_DUST },
  { material: 'ostrum', color: '#a66b72', types: DEFAULT_WITH_DUST },
  { material: 'calorite', color: '#691533', types: DEFAULT_WITH_DUST },
  { material: 'zinc', color: '#b7e6bf', types: DEFAULT_WITH_DUST },
  // bismuth ore not tagged correctly. too lazy to fix tbh lmao
  // { material: 'bismuth', color: '#afb1a3', types: DEFAULT_WITH_DUST },
  { material: 'aluminum', color: '#afb1a3', types: DEFAULT_TYPES },
  { material: 'silver', color: '#ced9e2', types: DEFAULT_TYPES },
  { material: 'nickel', color: '#c6ccbb', types: DEFAULT_TYPES },
  // { material: '', color:'', types: DEFAULT_TYPES },
  // { material: '', color: '', types: DEFAULT_WITH_DUST },
]

const $Slurry = Java.loadClass('mekanism.api.chemical.slurry.Slurry')
const $SlurryBuilder = Java.loadClass('mekanism.api.chemical.slurry.SlurryBuilder')

function titleCase(str) {
  return str
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

StartupEvents.registry('item', event => {
  global.mekanismMaterials.forEach(entry => {
    let { material, color, types } = entry;

    types.forEach(type => {
      let displayName = type == "dirty_dust"
        ? `Dirty ${titleCase(material)} Dust`
        : `${titleCase(material)} ${titleCase(type)}`;

      let ev = event.create(`${type}_${material}`)
        .displayName(displayName)
        .texture('layer0', 'mekanism:item/empty')
        .texture('layer1', `mekanism:item/${type}`)
        .color(1, color)
        .tag(`mekanism:${type}s`)
        .tag(`mekanism:${type}s/${material}`)
        .tag(`forge:${type}s`)
        .tag(`forge:${type}s/${material}`)

      if(type != 'dust') {
        ev.texture('layer2', `mekanism:item/${type}_overlay`)
      }
    })
  })
})

StartupEvents.registry('mekanism:slurry', event => {
  let slurry = (material, color) => {
    let colorJs = Color.of(color).getRgbJS();
    event.createCustom(`dirty_${material}_slurry`, () => new $Slurry($SlurryBuilder.dirty().tint(colorJs).ore(`forge:ores/${material}`)))
    event.createCustom(`clean_${material}_slurry`, () => new $Slurry($SlurryBuilder.clean().tint(colorJs).ore(`forge:ores/${material}`)))
  }

  global.mekanismMaterials.forEach(entry => slurry(entry.material, entry.color))
})