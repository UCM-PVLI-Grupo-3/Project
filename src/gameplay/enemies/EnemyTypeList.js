import {Enemy} from './enemy.js'
import { AttackList } from './AttackList.js'

 const EvilRobot = {health :20,attacks:[AttackList[0],AttackList[5],AttackList[6],AttackList[4]],type:'Corrupted Robot',Url: 'Robot'};
 const Scorpion = {health : 15,attacks : [AttackList[2],AttackList[1],AttackList[7],AttackList[3]],type :'Enraged Scorpion',Url:'Scorpion'};

export var EnemyTypeList = [EvilRobot,Scorpion];