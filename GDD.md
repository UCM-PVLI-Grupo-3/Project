# Project: Let's Go ~~Gambling~~ Rolling

## Genre

Roguelike deckbuilder with turn and diceroll-based combat system 

### References: 
[Dicey Dungeon](https://store.steampowered.com/app/861540/Dicey_Dungeons/), [Darkest Dungeon](https://store.steampowered.com/app/262060/Darkest_Dungeon/), [Slice & Dice](https://store.steampowered.com/app/1775490/Slice__Dice/)

## Synopsis: 
You are a time traveler switching between the future and the past. Your goal is to defeat the interdimensional entity that is causing a breach in space-time, twisting the world bringing together dangers from ancient times and unwitnessed futuristic hazards.

Equipped with what you gather from killing these enemies in turn-based, card and dice roll battles; and find in past or future locations, such as markets or online crypto-auctions, you must continue the path towards this glitched interdimensional entity and restore your world.

## Controls
The game controls are mostly UI-based. They should be quite deducible for a player that switches from PC to mobile or any ohter display for a web platform.

### Keyboard and mouse

| Button | Name |
| ------ | ---- |
| W, Arrow-up, Numpad-8 | Up |
| A, Arrow-left, Numpad-4 | Left |
| S, Arrow-down, Numpad-2 | Down |
| D, Arrow-right, Numpad-6 | Right |
| Enter, Space | Confirm |

*LMB* - confirms selected element 


### Gamepad
| Button | Name |
| ------ | ---- |
| L-stick, D-pad | Up/Left/Down/Right |
| East button | Confirm selected action |


### Touch-screen
Touch screen controls use drag-n-drop funcionality, player can select element by touching and confirm action by holding finger on element and dragging it to specific section of screen.


## Style

Smooth vector art with light saturated colors, similar to Dicey Dungeons. Clear telegraphy of any icons, buttons, actions or menu contexts.

#### The game is structured as follows
The player advances from event to event in the map view of the world. The map view of the world is a graph view of the different event locations of the game (similar to [Pegglin](https://store.steampowered.com/app/1296610/Peglin/)'s), how to reach them and their connections. Besides, a player icon is seen on the current event location we are at. While in this view, the player can check out their inventory, and select the next event location (provided there is a graph adjacency from their current location).
An event location may be: a fight, shop, or bonus reward event.

When in a fight, the main card-and-dice-based mechanics of the game take over. The fight may conclude when you are killed by an enemy or when you succesfully kill all present in a fight, granting you with a card or dice reward and taking you back to the map view.

Both shops and reward events are addtional ways to fights to obtain a repertoir of card and dice to use in battles.


## Dynamics

Various dynacmics are present in the game in two different scopes: through the run and through an individual fight.

When traversing the map, the player may be interested in taking a bunch of fights or carefully planning to maximize passing through the most shops possible.
Equally, should the player be interested in a particular set of cards, they may beeline for every past or future event location they catch a glimpse of in the map view. Allowing them to craft a deck with a very defined "temporal aesthetic" and synergies.

When in a particular fight, the mechanics available enhance and leave clear various game-styles. Ones might bet all their dice to risky high attack cards. Whereas others might spread the love along all the card types; of defence, attack, heal. Or even be a personal fan of using the "reorganize dice" action and dynamically assign dice to different card type slots to adapt their strategies to the enemies dynamically.
Moreover, long term thinking is also present all whilst in a fight, given that the emotion stack is one more element to bear in mind. Allowing you to plan a sequence of card turns ahead to ~~gamble~~ roll your odds of getting the best of emotion combinations.


## Systems and Mechanics overview

While in the map view: The main mechanic available is selecting the next event location to move onto.

While in a shop: Inventory management is present and it is combined with the possibility to purchase or remove existing cards from your deck, dice, card slots and or dice slots. All interactions occur in a UI context with deducible implications of what that mechanic implies. (i.e. when you select a card for purchase, that one is added to the totallity of your current deck and its price is subtracted from your current amount. Or if you purchase a card removal, yout then get shown all your deck, to obviously pick which one you want vanished).

While in a reward event: Mechanics implied are almost non-interactive for the player. You get shown your new addition to your deck and can consult its description. You will have it available for future events from that moment onwards.

While in a fight: You may select the target enemy of your next attack. Your only leftover interaction is now to select and play your turn's action.
Actions include using a defence, attack or heal card with all its associated dice or reorganize your dice to weight differently your card type odds.
Resources present in a fight include: tied to player status, health, shield; tied to deck management, drawn cards of each type, assigned dice to each card type; and the emotion stack which can interwine both via its buffs or debuffs.


### Mechanics

Inventory system:
Through the run available manageable persistent resources are collected dice and cards and their "slots" in fights. Neither are preserved in any meta-progression manner (at least as of this draft), nor lost for subsequent events when used in a battle turn. The existent ways to add dice and cards to your game are: winning a battle, entering a reward event and purchasing them in a shop. Slots may only be purchased in a shop.
Number of slots may only increase in a run. There are no ways to remove them. Notwithstanding ways to remove dice and cards; this could be for the purpose of increasing odds of other resources; accept being purchased in shops. Not elsewhere.

Turn play and draw system:
Having selected an enemy, you may choose your action for the turn. You may choose to play one card that is drawn from your whole deck and currently placed in a card slot. Playing that card will roll all the dice assigned to its card type, compute their sum and check that result against your character stats in order to determine if that card action executes successfully or fails. Afterwards the card gets put at the back of your deck. The enemy plays its turn (with a more simplified version of your turn play system (WIP)). And your draw the next card from the front of your deck; which isalways randomly shuffled at the beginning of each battle.

You may, instead of playing an action card, choose to reorganize your assigned dice to each card type. Doing so spends your turn as if you had played a card. While at it, you are able to take any dice from any slot and place it in another (only matters if you change it to a slot of a different card type), making so that the next card play of that type will now use that dice to compute its success.

![Card Play UI](./dice_time.jpg)
