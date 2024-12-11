import {Enemy} from '\enemy.js'
export class Attack
{
    constructor(actionValue,actionDefiner,sideEffects,HitPercentaje,SideEffectPercentaje)
    {
        this.actionValue = actionValue;
        this.actionDefiner = actionDefiner;
        this.ArrayLenght = sideEffects.lenght;
        var sideEffect;
        for(i = 0;i < this.ArrayLenght;i++ )
        {
            sideEffect[i] = sideEffects[i];
        }
        this.HitPercentaje = HitPercentaje;
        this.SideEffectPercentaje = SideEffectPercentaje;
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
