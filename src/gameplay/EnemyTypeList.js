import {Enemy} from './enemy.js'
import { AttackList } from './AttackList.js'

const EvilRobot = new Enemy(20,[AttackList[0],AttackList[5],AttackList[6],AttackList[4]],'Corrupted Robot');
const Scorpion = new Enemy(15,[AttackList[2],AttackList[1],AttackList7,AttackList[3]],'Enraged Scorpion');

export var EnemyTypeList = [EvilRobot,Scorpion];