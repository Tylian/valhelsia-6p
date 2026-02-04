ServerEvents.recipes(event => {
    // 1. remove redundant recipes
    event.remove({ id: 'mifa:dissolution_chamber/efficiency_addon_2'});
    event.remove({ id: 'mifa:dissolution_chamber/processing_addon_2'});
    event.remove({ id: 'mifa:dissolution_chamber/speed_addon_2'});

    // 2. fix recipes
    event.replaceInput(
        { id: 'mifa:dissolution_chamber/efficiency_addon_3'},
        "industrialforegoing:efficiency_addon_2",
        "mifa:netherite_gear"
    )
    event.replaceInput(
        { id: 'mifa:dissolution_chamber/processing_addon_3'},
        "industrialforegoing:processing_addon_2",
        "mifa:netherite_gear"
    )
    event.replaceInput(
        { id: 'mifa:dissolution_chamber/speed_addon_3'},
        "industrialforegoing:speed_addon_2",
        "mifa:netherite_gear"
    )

    event.replaceInput(
        { id: 'mifa:dissolution_chamber/efficiency_addon_4'},
        "mifa:efficiency_addon_3",
        "minecraft:echo_shard"
    )
    event.replaceInput(
        { id: 'mifa:dissolution_chamber/processing_addon_4'},
        "mifa:processing_addon_3",
        "minecraft:echo_shard"
    )
    event.replaceInput(
        { id: 'mifa:dissolution_chamber/speed_addon_4'},
        "mifa:speed_addon_3",
        "minecraft:echo_shard"
    )
});