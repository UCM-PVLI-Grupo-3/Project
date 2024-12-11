import {AttackList} from '\AttackList.js'
import {Attack}     from '\attack.js'

 export class Enemy
{
    constructor(health,imageDirection,actions,enemyType)
    {
        this.health = health;
        this.imageDirection = imageDirection;            
        this.enemyType = enemyType;
        this.action1 =actions[1];
        this.action2 =actions[2];
        this.action3 = actions[3];
        this.action4 = action[4];
        this.actions = [this.action1,this.action2,this.action3,this.action4];  
        this.TopHealth = health; 

    }

    UpdateHealth(change)
    {
         this.health = this.health + change;

         if ( this.health <= 0 ) 
        {
            this.Death();
        }
    }

    Death()
    {

    }
    Behaviour()
    {
        var RndAction = Math.floor(Math.random()*100) +1;
        if(this.health >= this.TopHealth*3/4)
        {
            if ( this.actions[0].GetHitPercentage() <= Rnd)
            {
                this.UseAttack(0);
            }
        }
        else if (this.health >= this.TopHealth/2)
        {   var Rnd = Math.floor(Math.random()*2);
            if ( this.actions[Rnd].GetHitPercentage() <= Rnd)
                {
                    this.UseAttack(Rnd);
                }
        }
        else if (this.health >= this.TopHealth/4)
        {
            var Rnd = Math.floor(Math.random()*3);
            if ( this.actions[Rnd].GetHitPercentage() <= Rnd)
                {
                    this.UseAttack(Rnd);
                }
        }
        else if (this.health < this.TopHealth/4)
        {
            var Rnd = Math.floor(Math.random()*4);
            if ( this.actions[Rnd].GetHitPercentage() <= Rnd)
                {
                    this.UseAttack(Rnd);
                }
        }

    }
    UseAttack(actionNumber)
    {
        if(actionNumber == 0){
        this.action1.UseAction(this);
        }
        if(actionNumber == 0){
        this.action2.UseAction(this);
        } 
        if(actionNumber == 0){
        this.action3.UseAction(this);
        } 
        if(actionNumber == 0){
        this.action4.UseAction(this);
        }
        
    }
    GetHealth()
    {
        return this.health;
    }
    GetEnemyType() 
    {
        return this.enemyType;
    }
}