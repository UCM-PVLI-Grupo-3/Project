# Project: Let's Go ~~Gambling~~ Rolling

# Genre

Roguelike deckbuilder with turn and diceroll-based combat system 

### References: 
[Dicey Dungeon](https://store.steampowered.com/app/861540/Dicey_Dungeons/), [Darkest Dungeon](https://store.steampowered.com/app/262060/Darkest_Dungeon/), [Slice & Dice](https://store.steampowered.com/app/1775490/Slice__Dice/)

# Synopsis: 
You are a time traveler switching between the future and the past. Your goal is to defeat the interdimensional entity that is causing a breach in space-time, twisting the world bringing together dangers from ancient times and unwitnessed futuristic hazards.

Equipped with what you gather from killing these enemies in turn-based, card and dice roll battles; and find in past or future locations, such as markets or online crypto-auctions, you must continue the path towards this glitched interdimensional entity and restore your world.

# Controls
The game controls are mostly UI-based. They should be quite deducible for a player that switches from PC to mobile or any ohter display for a web platform.

### Keyboard and mouse

| Button                   | Name    |
| ------------------------ | ------- |
| W, Arrow-up, Numpad-8    | Up      |
| A, Arrow-left, Numpad-4  | Left    |
| S, Arrow-down, Numpad-2  | Down    |
| D, Arrow-right, Numpad-6 | Right   |
| Enter, Space             | Confirm |

*LMB* - confirms selected element 


### Gamepad
| Button         | Name                    |
| -------------- | ----------------------- |
| L-stick, D-pad | Up/Left/Down/Right      |
| East button    | Confirm selected action |


### Touch-screen
Touch screen controls use drag-n-drop funcionality, player can select element by touching and confirm action by holding finger on element and dragging it to specific section of screen.


# Style

Smooth vector art with light saturated colors, similar to Dicey Dungeons. Clear telegraphy of any icons, buttons, actions or menu contexts.

**The game is structured as follows**
The player advances from event to event in the map view of the world. The map view of the world is a graph view of the different event locations of the game (similar to [Pegglin](https://store.steampowered.com/app/1296610/Peglin/)'s), how to reach them and their connections. Besides, a player icon is seen on the current event location we are at. While in this view, the player can check out their inventory, and select the next event location (provided there is a graph adjacency from their current location).
An event location may be: a fight, shop, or bonus reward event.

When in a fight, the main card-and-dice-based mechanics of the game take over. The fight may conclude when you are killed by an enemy or when you succesfully kill all present in a fight, granting you with a card or dice reward and taking you back to the map view.

Both shops and reward events are addtional ways to fights to obtain a repertoir of card and dice to use in battles.


# Dynamics

Various dynacmics are present in the game in two different scopes: through the run and through an individual fight.

When traversing the map, the player may be interested in taking a bunch of fights or carefully planning to maximize passing through the most shops possible.
Equally, should the player be interested in a particular set of cards, they may beeline for every past or future event location they catch a glimpse of in the map view. Allowing them to craft a deck with a very defined "temporal aesthetic" and synergies.

When in a particular fight, the mechanics available enhance and leave clear various game-styles. Ones might bet all their dice to risky high attack cards. Whereas others might spread the love along all the card types; of defence, attack, heal. Or even be a personal fan of using the "reorganize dice" action and dynamically assign dice to different card type slots to adapt their strategies to the enemies dynamically.
Moreover, long term thinking is also present all whilst in a fight, given that the emotion stack is one more element to bear in mind. Allowing you to plan a sequence of card turns ahead to ~~gamble~~ roll your odds of getting the best of emotion combinations.


# Gameplay



## Mechanics
### Cards 
#The cards are the most importal and principal mechanic in this game.They represent the actions the player can do during the fight,this being divided in three subclasses,each representing the cards main purpose: attack cards,they deal damage to the enemy; defense cards, they help the player receive less damage; Heal cards,they restores the players health; This been said it is posible to find a card that is a fusion of two types,like: attack/defense,attack/heal or defense/heal.
Besides their main action, the card may have side effect and an emotion.All of this actions outcomes are decided by the dices roll,the stats bonus,the dice bonus and the emotion bonus,all of this bonuses will be talked about later on.

### Emotions
#As we have said before, a way of improving your chances at landing your cards is your emotion bonus.Most cards have emotions integrated in them and they are not just for show. Each time the dices are rolled when you play a card with an emotion,if your roll is on the higher epsilon you will receive that cards benefitial emotion and it will give you a temporal buff in your attack,defense or heal power or it will upgrade your luck,making you hit higher rolls easier,giving you more emotions,which results in more luck,getting you on a roll,hitting more and more...but beware one very bad roll and the card will give you a negative emotion,this will debuff your strenght,heal or defense power or make you hit lower rolls easier,as in the benefitial emotion,negative ones can also stack but in a slower pace giving you time to rise from the slump before you get too depressed 

### Character stats
#Like in many games,stats are a big part of the players kit,in this game its no diferent. In time dice, the player counts with 3 stats: strenght,constitution and resilience,each of them conected to the diferent movements the player can make: attack,defense and heal respectively. This stats are usefull because they act as a bonus to o the dice roll puntuaction of their respective classes,that way you can attain greater rolls during a fight. Each time you win a fight you gain experience to increase your level and increasing your level gives you points, you can spend the points to improve your stats. That way instead of leveling up all stats automatically and evenly, we give the players the chance to choose depending on their playstyle and strategy.

### Dice organizing
#As explainede before on the gameplay analisis,during your turn you may change your dices position depending on the state of the battle and your startegy. You start each battle with a set number of diferent kinds of dices which vary from the d4 dice to the d20 dice.By rearranging your dices you can place more or less dices in each action type: attack,defense,heal. Giving more dices to your attack will give you better probability on your rolls on attack cards,giving you not only more dices but also an aditional dices bonus. But thats not the only bonus a dice can give,lets imagine,if you are figting a cyborg that needs a 19 to be hit, you may think that using d20 dices is the best answer,but its not the best one its the safest one, and this game doesnt reward being safe. Using lower dices like 3d8 will not only allow you to hit but it will give you a bonus for using a lower dice and an even bigger bonus if you use a 3 d6.That way the game doesnt only reward the smartes and most strategic players but the ones with an inner ludopat

### Purchase items
#TODO write about purchasing logic while in shops

### Remove items
#TODO write about removing items (cards, dices) logic




![Card Play UI](./dice_time.jpg)
