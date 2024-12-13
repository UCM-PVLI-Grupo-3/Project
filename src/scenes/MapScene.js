import { Level,SceneLevel } from "../Gameplay/level.js";
import { KEYS_SCENES, KEYS_ASSETS_SPRITES, KEYS_EVENTS } from "../common/common.js";

class MapScene extends Phaser.Scene 
{
     /**
     * @type {Level}
     * */
     Level1;
 /**
     * @type {Level}
     * */
     level2;
     /**
     * @type {Level}
     * */
     level3;
 /**
     * @type {Level}
     * */
     level4;

     constructor()
     {
        super({ key: KEYS_SCENES.MAP });
     }
    init() {

    }

    preload()
    {
    this.load.image('level',"assets/level.png");
    }
    create()
    {
        const screen_width = this.renderer.width;
        const screen_height = this.renderer.height;

       Level1 = new SceneLevel(this,1,1,'level',0,0,0,1);
       level2 = new SceneLevel(this,1,1,'level',1,1,1,1);
       level3 = new SceneLevel(this,1,1,'level',2,2,0,0);
    }
}
export { MapScene }