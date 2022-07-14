import Camera from "./Camera.js";
import Canvas from "../render/Canvas.js";
import { thales } from "../geometry/Utils.js";
import Vector2 from "../geometry/Vector2.js";

/**
 * This class represents a ground tile in the game.
 */
export default class Tile {

    constructor(prev, segment, skew, width, infinite=false) {
        this.lowCenter = segment._lowCenter;
        this.highCenter = segment._highCenter;
        this.skew = skew;
        this.width = width;
        this.infinite = infinite;
        if (prev == null) {
            prev = {
                upLeft: new Vector2(0, 0),
                upRight: new Vector2(0, 0),
            }
        }
        this.downLeft = prev.upLeft;
        this.downRight = prev.upRight;
        this.upLeft = new Vector2(0, 0);
        this.upRight = new Vector2(0, 0);
    }

    getColor() {
        throw new Error("Implement the getColor() method in the child class.");
    }

    getCorners() {
        return [this.upLeft, this.upRight, this.downRight, this.downLeft];
    }

    /**
     * This function is called once at each game cycle by the mainLoop()
     * function in the Game class.
     */
    project(zDiff) {
        const relSkew = thales(this.skew, Camera.gap, zDiff);
        const relWidth = thales(this.width, Camera.gap, zDiff);
        this.upLeft.x = this.infinite ? 0 : this.highCenter.onScreen.x + relSkew - relWidth / 2;
        this.upLeft.y = this.highCenter.onScreen.y;
        this.upRight.x = this.infinite ? Canvas.width : this.highCenter.onScreen.x + relSkew + relWidth / 2;
        this.upRight.y = this.highCenter.onScreen.y;
    }

    draw(isDark) {
        Canvas.drawShape(this.getCorners(), this.getColor(isDark));
    }

}