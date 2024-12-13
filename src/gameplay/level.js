class Level 
{
    constructor(enemy1,enemy2)
    {
        this.enemy1 = enemy2;
        this.enemy2 = enemy1;
    }
}

class SceneLevel extends Phaser.GameObjects.Sprite 
{
      /**
     * @type {Phaser.GameObjects.Image}
     * */
      MapImage;
      constructor(scene,positionx,positiony,Url,Width,Height,enemy1,enemy2)
      {
          super(scene,positionx,positiony);
          Level = new Level(enemy1,enemy2);
          this.MapImage = scene.add.image()
          this.Height = 100 * Height;
          this.Width = 100 * Width;
        
          this.MapImage = scene.add.image(this.Height,this.Width,Url);
      
  
          this.setInteractive({
              hitArea: new Phaser.Geom.Rectangle(0, 0, this.MapImage.width, this.MapImage.height),
              hitAreaCallback: Phaser.Geom.Rectangle.Contains 
          })
          .on(Phaser.Input.Events.POINTER_DOWN, () => { console.log("Level Touched") });
        
      }
}

export {Level,SceneLevel};