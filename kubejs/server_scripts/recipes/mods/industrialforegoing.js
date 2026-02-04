ServerEvents.recipes(event => {
    const ID_PREFIX = "valhelsia:dissolution_chamber/"
    // 2. fix recipes
    const dissolution = (id, inputs, inputFluid, outputItem, outputNbt) => {
        event.remove({ id: id })
        event.custom({
            type: 'industrialforegoing:dissolution_chamber',
            input: inputs,
            inputFluid: inputFluid,
            output: {
                count: 1,
                item: outputItem,
                nbt: outputNbt
            },
            processingTime: 200
        }).id(id)
    }

    const tier3Inputs = (extraA, extraB) => {
        return [
            { tag: 'forge:dusts/redstone' },
            { tag: 'forge:dusts/redstone' },
            { tag: 'forge:glass_panes/colorless' },
            { tag: 'forge:glass_panes/colorless' },
            { tag: 'forge:gears/netherite' },
            { tag: 'forge:gears/netherite' },
            extraA,
            extraB
        ]
    }

    const tier4Inputs = (extraA, extraB) => {
        return [
            { tag: 'forge:dusts/redstone' },
            { tag: 'forge:dusts/redstone' },
            { tag: 'forge:glass_panes/colorless' },
            { tag: 'forge:glass_panes/colorless' },
            { item: 'minecraft:echo_shard' },
            { item: 'minecraft:echo_shard' },
            extraA,
            extraB
        ]
    }

    // 1. remove recipes
    event.remove({ id: 'mifa:dissolution_chamber/efficiency_addon_2' })
    event.remove({ id: 'mifa:dissolution_chamber/processing_addon_2' })
    event.remove({ id: 'mifa:dissolution_chamber/speed_addon_2' })
    event.remove({ id: 'mifa:dissolution_chamber/efficiency_addon_3' })
    event.remove({ id: 'mifa:dissolution_chamber/processing_addon_3' })
    event.remove({ id: 'mifa:dissolution_chamber/speed_addon_3' })
    event.remove({ id: 'mifa:dissolution_chamber/efficiency_addon_4' })
    event.remove({ id: 'mifa:dissolution_chamber/processing_addon_4' })
    event.remove({ id: 'mifa:dissolution_chamber/speed_addon_4' })

    // 2. fix recipes

    // efficiency
    dissolution(
        `${ID_PREFIX}efficiency_addon_3`,
        tier3Inputs({ tag: 'forge:rods/blaze' }, { tag: 'forge:rods/blaze' }),
        '{Amount:1000,FluidName:"industrialforegoing:latex"}',
        'mifa:efficiency_addon_3',
        '{TitaniumAugment:{Efficiency:0.7f}}',
    )

    dissolution(
        `${ID_PREFIX}efficiency_addon_4`,
        tier4Inputs({ tag: 'forge:rods/blaze' }, { tag: 'forge:rods/blaze' }),
        '{Amount:1000,FluidName:"industrialforegoing:ether_gas"}',
        'mifa:efficiency_addon_4',
        '{TitaniumAugment:{Efficiency:0.6f}}',
    )

    // processing
    dissolution(
        `${ID_PREFIX}processing_addon_3`,
        tier3Inputs({ item: 'minecraft:furnace' }, { item: 'minecraft:crafting_table' }),
        '{Amount:1000,FluidName:"industrialforegoing:pink_slime"}',
        'mifa:processing_addon_3',
        '{TitaniumAugment:{Processing:4.0f}}',
    )

    dissolution(
        `${ID_PREFIX}processing_addon_4`,
        tier4Inputs({ item: 'minecraft:furnace' }, { item: 'minecraft:crafting_table' }),
        '{Amount:1000,FluidName:"industrialforegoing:ether_gas"}',
        'mifa:processing_addon_4',
        '{TitaniumAugment:{Processing:5.0f}}',
    )

    // speed
    dissolution(
        `${ID_PREFIX}speed_addon_3`,
        tier3Inputs({ item: 'minecraft:sugar' }, { item: 'minecraft:sugar' }),
        '{Amount:1000,FluidName:"industrialforegoing:pink_slime"}',
        'mifa:speed_addon_3',
        '{TitaniumAugment:{Speed:4.0f}}',
    )

    dissolution(
        `${ID_PREFIX}speed_addon_4`,
        tier4Inputs({ item: 'minecraft:sugar' }, { item: 'minecraft:sugar' }),
        '{Amount:1000,FluidName:"industrialforegoing:ether_gas"}',
        'mifa:speed_addon_4',
        '{TitaniumAugment:{Speed:5.0f}}',
    )
});