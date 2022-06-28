import { WorldObject } from "./WorldObject.js";
import { Outrun } from "./Game.js";
import { Segment, laneWidth, lineWidth } from "./Segment.js";
import { Driver } from "./GameWorld.js";
import { dimensions } from "./Assets.js";
import Vector3 from "./engine/Vector3.js";
import { Junction } from "./Junction.js";

/**
 * This class represents non-player vehicles in the game.
 */
export class Vehicle {

    constructor(center, shift, vehicleType) {
        this.vehicleType = vehicleType;
        this.shift = shift;
        this.car = new WorldObject(center, "right0");
        this.car.width = 810; // Width of the vehicle
        this.car.height = 460; // Height of the vehicle
        // Project function of this object
        this.car.project = function (measure2, dimension) {
            this.center.project();
            this.relWidth = Vector3.calculate(dimension.width, Driver.camera.gap, measure2);
            this.relHeight = Vector3.calculate(dimension.height, Driver.camera.gap, measure2);
        };
        this.lastSegment = null;
        this.chosenPath = [];
        this.curveDirection = 0;
        this.hasStopped = false;
    }

    /**
     * This function is called once at each game cycle by the mainLoop()
     * function in the Game class.
     */
    play() {
        if (!this.hasStopped) {
            this.car.center.z += speed;
        }

        let carIndex = Outrun.gameWorld.road.findIndex(this.car.center.z);
        let segment = Outrun.gameWorld.road.segments[carIndex];
        if (segment instanceof Segment) {
            this.hasStopped = false;
            this.lastSegment = segment;
            if (Outrun.gameWorld.road.segments[carIndex - 1] instanceof Segment) {
                this.curveDirection = segment.curve - Outrun.gameWorld.road.segments[carIndex - 1].curve;
            } else {
                this.curveDirection = 0;
                this.shift += 1.5 * (this.chosenPath[this.chosenPath.length - 1] ? -1 : 1);
            }
        } else if (segment instanceof Junction) {
            this.hasStopped = false;
            if (Outrun.gameWorld.road.trackCount > this.chosenPath.length) {
                this.chosenPath.push(this.car.center.x >= this.lastSegment.highCenter.x);
                this.shift += 1.5 * (this.chosenPath[this.chosenPath.length - 1] ? -1 : 1);
            }
            if (this.chosenPath[this.chosenPath.length - 1]) {
                segment = segment.rightJunction;
                if (Outrun.gameWorld.road.segments[carIndex - 1] instanceof Junction) {
                    this.curveDirection = segment.curve - Outrun.gameWorld.road.segments[carIndex - 1].rightJunction.curve;
                } else {
                    this.curveDirection = 0;
                }
            } else {
                segment = segment.leftJunction;
                if (Outrun.gameWorld.road.segments[carIndex - 1] instanceof Junction) {
                    this.curveDirection = segment.curve - Outrun.gameWorld.road.segments[carIndex - 1].leftJunction.curve;
                } else {
                    this.curveDirection = 0;
                }
            }
        } else {
            this.hasStopped = true;
        }

        this.car.center.x = segment.highCenter.x + this.shift * (laneWidth + lineWidth);
        this.car.center.y = segment.highCenter.y;
    }

    /**
     * This function is called once at each game cycle by the mainLoop()
     * function in the Game class.
     */
    project() {
        this.car.project(this.car.center.z - Driver.camera.position.z, dimensions[this.vehicleType]);

        if (this.curveDirection < 0) {
            if (this.car.center.x < Driver.car.center.x)
                this.car.fileName = "left1";

            else
                this.car.fileName = "left0";
        } else if (this.curveDirection > 0) {
            if (this.car.center.x > Driver.car.center.x)
                this.car.fileName = "right1";

            else
                this.car.fileName = "right0";
        } else {
            if (this.car.center.x < Driver.car.center.x) {
                this.car.fileName = "right0";
            } else {
                this.car.fileName = "left0";
            }
        }
    }

}

const speed = 400; // Constant speed of vehicles