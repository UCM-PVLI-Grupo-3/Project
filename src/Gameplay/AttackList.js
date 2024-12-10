import {Attack} from '\attack.js';


const Slash = new Attack(4,'harm',[1,7],85,20);
const VenomSpit = new Attack(9,'harm',[9,8],65,50);
const Bite = new Attack(7,'harm',[0,0],80,101);
const Regenerate = new Attack(25,'heal',[0,0],75,101);
const LaserBeam = new Attack(34,'harm'[0,0],65,101);




 export var AttackList = [Slash,VenomSpit,Bite,Regenerate,LaserBeam]; 

