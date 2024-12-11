import {Enemy} from './enemy.js'
export class Attack
{
    constructor(actionValue,actionDefiner,HitPercentaje)
    {
        this.actionValue = actionValue;
        this.actionDefiner = actionDefiner;
        this.ArrayLenght = sideEffects.lenght;
     

        this.HitPercentaje = HitPercentaje;
      
    }

    GetHitPercentaje()
    {
       return this.HitPercentaje;
    }

    GetSideEffectPercentaje()
    {
        return this.SideEffectPercentaje;
    }
    UseAction(user,enemy)
    {
        if(actionDefiner == 'heal')
        { 
          user.UpdateHealth(this.actionValue);
        } 
        else
        {
        
        }

        
    }
    useSideEffect(enemy)
    {
         
    }
}
