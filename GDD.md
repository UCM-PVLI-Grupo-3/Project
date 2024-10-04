# Project
Let's Go ~~Gambling~~ Rolling

## Genre

Roguelike deckbuilder with turn and diceroll-based combat system 

### References: 
[Dicey Dungeon](https://store.steampowered.com/app/861540/Dicey_Dungeons/), [Darkest Dungeon](https://store.steampowered.com/app/262060/Darkest_Dungeon/), [Slice & Dice](https://store.steampowered.com/app/1775490/Slice__Dice/)

## Synopsis: 

>[!NOTE]
>You are a time traveler switching between the future and the past. Your goal is to defeat the interdimensional entity that is causing a breach in space-time, twisting the world bringing together dangers from ancient times and unwitnessed futuristic hazards.
>
>Equipped with what you gather from killing these enemies in turn-based, card and dice roll battles; and find in past or future locations, such as markets or online crypto-auctions, you must continue the path towards this glitched interdimensional entity and restore your world.

## Controls

>[!NOTE]
>The game controls are mostly UI-based. They should be quite deducible for a player that switches from PC to mobile or any ohter display for a web platform.
>
>In later sections of the document, to associate a specific action with a button, you must specify the name of that button in triangle brackets.
>**Example:** To destroy an obstacle, the player must press button *`<Interact>`* while near the obstacle so that the character is facing in its direction.
>
>If we need to change a button that will be responsible for some action, it will be enough to change it in the table and not touch all the other places where it is mentioned.

### Keyboard

| Button | Name |
| ------ | ---- |
| Arrow keys, WASD, numpad | Change selected action |
| Intro, space | Confirm selected action |


### Mouse

| Button | Name |
| ------ | ---- |
| Mouse hover | Change selected action |
| Left click | Confirm selected action |


### Gamepad
| Button | Name |
| ------ | ---- |
| Left stick, d-pad | Change selected action |
| East button | Confirm selected action |


### Touch-screen
| Button | Name |
| ------ | ---- |
| Touch | Change selected action |
| Swipe | Confirm selected action |


## Style

>[!NOTE]
> Smooth vector art with light saturated colors, similar to Dicey Dungeons. Clear telegraphy of any icons, buttons, actions or menu contexts.
>
>The game is structured as follows:
>The player advances fromm event to event in the map view of the world. The map view of the world is a graph view of the different event locations of the game (similar to [Pegglin](https://store.steampowered.com/app/1296610/Peglin/)'s), how to reach them and their connections. Besides, a player icon is seen on the current event location we are at. While in this view, the player can check out their inventory, and select the next event location (provided there is a graph adjacency from their current location).
>
>An event location may be: a fight, shop, or bonus reward event.
>
>When in a fight, the main card-and-dice-based mechanics of the game take over. The fight may conclude when you are killed by an enemy or when you succesfully kill all present in a fight, granting you with a card or dice reward and taking you back to the map view.
>
>Both shops and reward events are addtional ways to fights to obtain a repertoir of card and dice to use in battles.


## Dynamics

>[!NOTE]
>Various dynacmics are present in the game in two different scopes: through the run and through an individual fight.
>
>When traversing the map, the player may be interested in taking a bunch of fights or carefully planning to maximize passing through the most shops possible.
>Equally, should the player be interested in a particular set of cards, they may beeline for every past or future event location they catch a glimpse of in the map view. Allowing them to craft a deck with a very defined "temporal aest


## Systems and Mechanics

>[!NOTE]
> In this section we must write everything related to the logic of the game. There is no need to delve into the parameters of how long it lasts in seconds or how much damage it causes. Here we must describe the working principle of EVERYTHING that happens within the game.
>
> In terms of building the structure of the document, it is worth starting with the systems and then moving on to the mechanics.


>[!TIP]
>
>Estoy seguro de que en España, como en muchos otros países, en el colegio/escuela te enseñan a escribir composiciones o ensayos, intentando cometer un mínimo de errores léxicos y estilísticos (por ejemplo, tautologías).
>
>Pero la documentación no es una obra de arte, aquí se fomenta romper las reglas de redacción de composiciones para evitar la grafomanía
>
>**Ejemplo:** 
>*`Cuando un personaje activa la habilidad de "Curación", el personaje recibe el buff de "Curación", que cura al personaje y restaura N unidades de salud.`*
>
>Esto puede sonar terrible desde un punto de vista estilístico, pero para fines de documentación, este es un párrafo muy bueno que se puede traducir fácilmente a [codigo](https://ibb.co/vhgZWbt).

### Systems

>[!NOTE]
>
>**A system** is simply a set of mechanics that are combined into a separate module, which can be large or small. Systems interact with each other, but the mechanics within a single system have the most connections.  
>
>**For example:** the movement system consists of all movement mechanics (running, jumping, climbing...), the combat system consists of combat mechanics (weak hit, strong hit, block...).


### Mechanics

>[!NOTE]
> 
> **Mechanics** are separate actions, a building block from which systems are built. For example, the movement system has a "running" mechanic and a "swimming" mechanic. Our task is to describe the mechanics so that we can imagine their code.


## Parameters

>[!NOTE]
>
>These are all (often) numerical indicators, sometimes colors and other attributes of objects or their behavior, which we will change hundreds of times during development. This includes all dynamic data, from the character's movement speed to the smoothness of the camera transition from one screen to another and the time it takes to perform an action
>
>They should be separated from the mechanics section, because this will make script design easier. This will also allow us to create parameter sets already prepared for testing (presets) and quickly switch between them.
>
>The value of the parameters should not be written before the prototype, as it is better to test them in practice and point them here.


## Design

### Narrative:

### Art:

### Animations:

### Music:

## Progression

>[!NOTE]
>A very small section that indicates the sequence of opening levels, unlocking new mechanics and story events.

## Interface
