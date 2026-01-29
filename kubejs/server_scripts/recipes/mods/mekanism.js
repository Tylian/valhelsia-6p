/**
 * Mekanism Recipe Event Handler
 */
ServerEvents.recipes(event => {
  const ID_PREFIX = 'valhelsia:mekanism/';

  // ------------------------------------------------------------
  // Parse helpers
  // ------------------------------------------------------------

  const parseX = (s) => {
    const m = String(s).trim().match(/^(\d+)\s*x\s+(.+)$/i);
    if (!m) return { amount: null, what: String(s).trim() };
    return { amount: parseInt(m[1], 10), what: m[2].trim() };
  };

  const parseMB = (s) => {
    const m = String(s).trim().match(/^(\d+(?:\.\d+)?)\s*mb\s+(.+)$/i);
    if (!m) return { amount: null, what: String(s).trim() };
    return { amount: Number(m[1]), what: m[2].trim() };
  };

  const hasTag = (tag) => !Ingredient.of(`#${tag}`).isEmpty();
  const idOf = (input) => InputItem.of(input).ingredient.first.id;

  // ------------------------------------------------------------
  // JSON builders (Item / Fluid / Chemical)
  // ------------------------------------------------------------

  const itemIngredient = (spec, nbt) => {
    if (nbt === undefined) nbt = null;

    const { amount, what } = parseX(spec);

    if (nbt != null) {
      if (String(what).trim().startsWith('#')) {
        throw new Error(`itemIngredient NBT cannot be used with a tag: ${what}`);
      }

      const obj = {
        ingredient: {
          type: 'forge:nbt',
          item: String(what).trim(),
          nbt: typeof nbt === 'string' ? nbt : JSON.stringify(nbt)
        }
      };

      if (amount != null) obj.amount = amount;
      return obj;
    }

    const obj = {
      ingredient: Ingredient.of(what).toJson()
    };

    if (amount != null) obj.amount = amount;
    return obj;
  };

  const itemStack = (spec, nbt) => {
    if (nbt === undefined) nbt = null;

    const { amount, what } = parseX(spec);
    if (String(what).trim().startsWith('#')) {
      throw new Error(`itemStack output cannot be a tag: ${what}`);
    }

    const nbtArg = (nbt != null) ? nbt : null;

    const stack = amount != null
      ? Item.of(String(what).trim(), amount, nbtArg)
      : Item.of(String(what).trim(), nbtArg);

    return stack.toJson();
  };

  const fluidIngredient = (spec, nbt) => {
    if (nbt === undefined) nbt = null;

    const { amount, what } = parseMB(spec);

    if (amount == null) {
      throw new Error(`fluidIngredient requires an amount like "300mb ...": ${spec}`);
    }

    const w = String(what).trim();
    if (w.startsWith('#')) {
      if (nbt != null) throw new Error(`fluidIngredient NBT cannot be used with a tag: ${w}`);
      return { tag: w.slice(1), amount: amount };
    }

    const obj = {
      fluid: w,
      amount: amount
    };

    if (nbt != null) obj.nbt = (typeof nbt === 'string' ? nbt : JSON.stringify(nbt));
    return obj;
  };

  const chemicalIngredient = (type, spec) => {
    const { amount, what } = parseMB(spec);

    if (amount == null) {
      throw new Error(`chemicalIngredient requires an amount like "2mb ...": ${spec}`);
    }

    // dunno why but mekanism uses 100mb units for gasses.
    const finalAmount = type === "gas" ? amount / 100 : amount;

    const w = String(what).trim();
    if (w.startsWith('#')) return { tag: w.slice(1), amount: amount };

    const obj = { amount: finalAmount };
    obj[type] = w;
    return obj;
  };

  const chemicalStack = (type, spec, boxed) => {
    if (boxed === undefined) boxed = false;

    const { amount, what } = parseMB(spec);

    if (amount == null) {
      throw new Error(`chemicalStack requires an amount like "1000mb ...": ${spec}`);
    }

    const w = String(what).trim();
    if (w.startsWith('#')) {
      throw new Error(`chemicalStack output cannot be a tag: ${w}`);
    }

    const obj = {
      amount: amount
    };

    obj[type] = w;

    if (boxed) obj.chemicalType = type;
    return obj;
  };

  const gasIng = (s) => chemicalIngredient('gas', s);
  const slurryIng = (s) => chemicalIngredient('slurry', s);

  const slurryOut = (s, boxed) => {
    if (boxed === undefined) boxed = false;
    return chemicalStack('slurry', s, boxed);
  };

  // ------------------------------------------------------------
  // Mekanism recipe helpers (RETURN event.custom(...))
  // ------------------------------------------------------------

  const infusionConversion = (type, input, amount) => {
    return event.custom({
      type: 'mekanism:infusion_conversion',
      input: InputItem.of(input).toJson(),
      output: { infuse_type: type, amount: amount }
    });
  };

  const dissolution = (output, inputItem, inputGas) => {
    return event.custom({
      type: 'mekanism:dissolution',
      itemInput: itemIngredient(inputItem),
      gasInput: gasIng(inputGas),
      output: output
    });
  };

  const injecting = (output, inputItem, inputGas) => {
    return event.custom({
      type: 'mekanism:injecting',
      itemInput: itemIngredient(inputItem),
      chemicalInput: gasIng(inputGas),
      output: itemStack(output)
    });
  };

  const purifying = (output, inputItem, inputGas) => {
    return event.custom({
      type: 'mekanism:purifying',
      itemInput: itemIngredient(inputItem),
      chemicalInput: gasIng(inputGas),
      output: itemStack(output)
    });
  };

  const enriching = (output, input) => {
    return event.custom({
      type: 'mekanism:enriching',
      input: itemIngredient(input),
      output: itemStack(output)
    });
  };

  const crushing = (output, input) => {
    return event.custom({
      type: 'mekanism:crushing',
      input: itemIngredient(input),
      output: itemStack(output)
    });
  };

  const washing = (output, inputFluid, inputSlurry) => {
    return event.custom({
      type: 'mekanism:washing',
      fluidInput: fluidIngredient(inputFluid),
      slurryInput: slurryIng(inputSlurry),
      output: output
    });
  };

  const crystallizing = (output, inputType, input) => {
    return event.custom({
      type: 'mekanism:crystallizing',
      chemicalType: inputType,
      input: chemicalIngredient(inputType, input),
      output: itemStack(output)
    });
  };

  // ------------------------------------------------------------
  // Tag authority
  // ------------------------------------------------------------

  const resolveTagItem = (tag) => {
    let item = AlmostUnified.getPreferredItemForTag(tag);
    if (!item.isEmpty()) return item;

    if (hasTag(tag)) return Ingredient.of(`#${tag}`).getFirst();

    return null;
  };

  // ------------------------------------------------------------
  // One helper that emits the whole processing chain for a material
  // ------------------------------------------------------------

  /**
   * Builds the entire 4x Mekanism chain for a material.
   *
   * mekanismMaterialChain(material, {
   *   shard, clump, dirtyDust, crystal,
   *   dirty, clean
   * })
   *
   * Where shard/clump/dirtyDust/crystal are ITEM ids,
   * and dirty/clean are SLURRY ids.
   */
  const mekanismMaterialChain = (material, out) => {
    const oreTag = `forge:ores/${material}`;
    const rawTag = `forge:raw_materials/${material}`;
    const rawBlockTag = `forge:storage_blocks/raw_${material}`;
    const dustTag = `forge:dusts/${material}`;
    const ingotTag = `forge:ingots/${material}`;

    const {
      shard,
      clump,
      dirtyDust,
      crystal,
      dirty,
      clean
    } = out;

    const outDust = resolveTagItem(dustTag);
    let outIngot = resolveTagItem(ingotTag);

    if (!outDust) {
      console.error(
        `[valhelsia:mekanism] Missing dust tag #${dustTag}. Skipping all Mekanism recipes for '${material}'.`
      );
      return;
    }

    // Raw block
    if (hasTag(rawBlockTag)) {
      dissolution(
        slurryOut(`6000mb ${dirty}`, true),
        `1x #${rawBlockTag}`,
        `200mb mekanism:sulfuric_acid`
      ).id(`${ID_PREFIX}processing/${material}/dirty_slurry_from_raw_block`);

      injecting(
        `24x ${shard}`,
        `1x #${rawBlockTag}`,
        `400mb mekanism:hydrogen_chloride`
      ).id(`${ID_PREFIX}processing/${material}/shard_from_raw_block`);

      purifying(
        `18x ${clump}`,
        `1x #${rawBlockTag}`,
        `400mb mekanism:oxygen`
      ).id(`${ID_PREFIX}processing/${material}/clump_from_raw_block`);

      enriching(
        `12x ${outDust.id}`,
        `1x #${rawBlockTag}`
      ).id(`${ID_PREFIX}processing/${material}/dust_from_raw_block`);
    }

    // Ore
    if (hasTag(oreTag)) {
      dissolution(
        slurryOut(`1000mb ${dirty}`, true),
        `1x #${oreTag}`,
        `100mb mekanism:sulfuric_acid`
      ).id(`${ID_PREFIX}processing/${material}/dirty_slurry_from_ore`);

      injecting(
        `4x ${shard}`,
        `1x #${oreTag}`,
        `200mb mekanism:hydrogen_chloride`
      ).id(`${ID_PREFIX}processing/${material}/shard_from_ore`);

      purifying(
        `3x ${clump}`,
        `1x #${oreTag}`,
        `200mb mekanism:oxygen`
      ).id(`${ID_PREFIX}processing/${material}/clump_from_ore`);

      enriching(
        `2x ${outDust.id}`,
        `1x #${oreTag}`
      ).id(`${ID_PREFIX}processing/${material}/dust_from_ore`);
    }

    // Raw materials
    if (hasTag(rawTag)) {
      dissolution(
        slurryOut(`2000mb ${dirty}`, true),
        `3x #${rawTag}`,
        `100mb mekanism:sulfuric_acid`
      ).id(`${ID_PREFIX}processing/${material}/dirty_slurry_from_raw_ore`);

      injecting(
        `8x ${shard}`,
        `3x #${rawTag}`,
        `200mb mekanism:hydrogen_chloride`
      ).id(`${ID_PREFIX}processing/${material}/shard_from_raw_ore`);

      purifying(
        `2x ${clump}`,
        `1x #${rawTag}`,
        `200mb mekanism:oxygen`
      ).id(`${ID_PREFIX}processing/${material}/clump_from_raw_ore`);

      enriching(
        `4x ${outDust.id}`,
        `3x #${rawTag}`
      ).id(`${ID_PREFIX}processing/${material}/dust_from_raw_ore`);
    }

    // Slurry + refinement
    washing(
      slurryOut(`1mb ${clean}`, false),
      `5mb #minecraft:water`,
      `1mb ${dirty}`
    ).id(`${ID_PREFIX}processing/${material}/clean_slurry_from_dirty_slurry`);

    crystallizing(
      `1x ${crystal}`,
      'slurry',
      `200mb ${clean}`
    ).id(`${ID_PREFIX}processing/${material}/crystal_from_clean_slurry`);

    injecting(
      `1x ${shard}`,
      `1x #mekanism:crystals/${material}`,
      `200mb mekanism:hydrogen_chloride`
    ).id(`${ID_PREFIX}processing/${material}/shard_from_crystal`);

    purifying(
      `1x ${clump}`,
      `1x #mekanism:shards/${material}`,
      `200mb mekanism:oxygen`
    ).id(`${ID_PREFIX}processing/${material}/clump_from_shard`);

    crushing(
      `1x ${dirtyDust}`,
      `1x #mekanism:clumps/${material}`
    ).id(`${ID_PREFIX}processing/${material}/dirty_dust_from_clump`);

    enriching(
      `1x ${outDust.id}`,
      `1x #mekanism:dirty_dusts/${material}`
    ).id(`${ID_PREFIX}processing/${material}/dust_from_dirty_dust`);

    if (outIngot) {
      event.smelting(outIngot.id, `#${dustTag}`);
      event.blasting(outIngot.id, `#${dustTag}`);
    }
  };

  // ------------------------------------------------------------
  // Recipes
  // ------------------------------------------------------------

  // Infusion
  infusionConversion('mekanism:carbon', '#forge:coal_coke', 40)
    .id(`${ID_PREFIX}infusion_conversion/mekanism_carbon_from_forge_coal_coke`);

  infusionConversion('mekanism:carbon', '#forge:dusts/coal_coke', 40)
    .id(`${ID_PREFIX}infusion_conversion/mekanism_carbon_from_forge_dusts_coal_coke`);

  // Processing Chain
  global.mekanismMaterials.forEach(entry => {
    let material = entry.material;
    mekanismMaterialChain(material, {
      shard: `kubejs:shard_${material}`,
      clump: `kubejs:clump_${material}`,
      dirtyDust: `kubejs:dirty_dust_${material}`,
      crystal: `kubejs:crystal_${material}`,
      dirty: `kubejs:dirty_${material}_slurry`,
      clean: `kubejs:clean_${material}_slurry`
    });
  });
});
