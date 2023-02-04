const TableData = require("../../TableData");

class PlayerData extends TableData {
    constructor(client, playerData, inventoryData) {
        super(client, playerData);

        this.inventoryData = inventoryData;
        this.lang = this.data.lang;

        this.load();
        this.overwrite();
    }

    load() {
        this.data.expBoost = 1;
        for (const stat in this.data.statistics) {
            this.data.statistics[stat] = this.client.RPGAssetsManager.getStatistic(this.data.lang, stat, this.data.statistics[stat]);
        }

        if (this.inventoryData.enchantedGrimoire.id !== null) {
            const grimoire = this.client.RPGAssetsManager.getEnchantedGrimoire(this.lang, this.inventoryData.enchantedGrimoire.id);

            for (const grimoireEffect of grimoire.effects) {
                if (grimoireEffect === "statisticsBoost") {
                    for (const stat in ["strength", "speed", "weaponControl"]) stat.setGrimoireBoost(grimoire.strength);
                }
                else if (grimoireEffect === "experienceBoost") {
                    this.data.expBoost = this.client.util.round((grimoire.strength / 10) + 1, 2);
                }
            }
        }

        this.data.health = this.client.RPGAssetsManager.getPlayerHealth(this.data.hp, this.data.lastHealing);
        this.data.character = this.client.RPGAssetsManager.getCharacter(this.lang, this.data.characterId);
        this.data.level = this.client.RPGAssetsManager.getPlayerLevel(this.data.exp);
        this.data.date = `${(this.data.creationDate / 1000).toFixed(0)}`;
        if (this.data.breathingStyle !== null) {
            this.data.breathingStyle = this.client.RPGAssetsManager.getBreathingStyle(
                this.data.lang, this.data.breathingStyle,
            );
        }
        this.data.rank = this.client.RPGAssetsManager.getPlayerRank(this.lang, this.data.rank);

        delete this.data.characterId;
        delete this.data.exp;
        delete this.data.creationDate;
        delete this.data.hp;
        delete this.data.lastHealing;
    }
}

module.exports = PlayerData;