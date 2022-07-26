import AssetLoader from "../engine/core/AssetLoader.js";
import Tile from "../engine/render/Tile.js";
import Game from "../Game.js";
import { GROUND_SKEW, GROUND_WIDTH } from "../constants/Tiles.js";

/**
 * This class represents a ground tile in the game.
 */
export default class GroundTile extends Tile {

    constructor(prev, segment) {
        super(prev, segment, GROUND_SKEW, GROUND_WIDTH, true);
    }

    /**
     * Return the color of the tile.
     */
    getColor(isDark) {
        const colors = AssetLoader.getColor("codes")[Game.route];
        return isDark ? colors.darkOffroadColor : colors.lightOffroadColor;
    }

}