import { Level,SceneLevel } from "./level";


class BattleScene extends Phaser.Scene 
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
    init() {

    }

    preload()
    {
    this.load.image('level',"assets/level.png");
    }
    create()
    {
       Level1 = new SceneLevel(this,1,1,'level',0,0,0,1);
       level2 = new SceneLevel(this,1,1,'level',1,1,1,1);
       level3 = new SceneLevel(this,1,1,'level',2,2,0,0);
    }
}