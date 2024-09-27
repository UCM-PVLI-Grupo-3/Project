# Project

## Genre

**References:**

## Synopsis: 

>[!NOTE]
>This part of GDD provides a concise overview of the setting, allowing any reader to understand what to imagine while specific terms are mentioned in the text. For example, if we specify that the game setting is a medieval fantasy world, the reader will understand that when "weapons" is mentioned, it means swords or crossbows, and not futuristic laser weapons.


## Controls

>[!NOTE]
>In later sections of the document, to associate a specific action with a button, you must specify the name of that button in triangle brackets.
>**Example:** To destroy an obstacle, the player must press button *`<Interact>`* while near the obstacle so that the character is facing in its direction.
>
>If we need to change a button that will be responsible for some action, it will be enough to change it in the table and not touch all the other places where it is mentioned.

### Keyboard

| Button | Name |
| ------ | ---- |
|        |      |

### Gamepad
| Button | Name |
| ------ | ---- |
|        |      |

## Style

>[!NOTE]
>Style is understood in the broadest sense. Here we can add any concept art and references. Write down the details of how the game should feel, what emotions it should evoke in the player.
>
>From a gameplay point of view, in this section you should describe how the game works without touching on details. For example, how the game world is structured, whether it is divided into levels or an "open world", how movement between locations occurs. Can the character only walk? Or fly? Or drive a vehicle? Will you be able to pick up something in his inventory? Move things? Struggle? Use magic?, etc...
>
>This section is like a trailer for the game in text form, where we describe the player's capabilities. After reading the entire section, the reader should understand what the game will be about, but without going into details.


## Dynamics

>[!NOTE]
> Within the MDA framework, "dynamics" refers to the way players interact with game mechanics while playing. Dynamics are defined as how game mechanics lead to changes and evolution of the game experience over time. In other words, dynamics are the result of the player's interaction with the mechanics and subsequent changes in the game.
> 
> In the context of the MDA framework, we can say that dynamics is a higher level of abstraction compared to mechanics. Mechanics determine what actions are available to the player, and dynamics describe how these actions affect the course of the game, what consequences they have, how the game experience unfolds, and what emotional reactions are evoked in the player.
> 
> Thus, we can say that the dynamics are not simply a system of mechanics, but the result of their interaction during the course of the game.


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
>These are all (often) numerical indicators, sometimes colors and other attributes of objects or their behavior, which we will change hundreds of times during development. This includes all dynamic data, from the character's movement speed to the smoothness of the camera transition from one screen to another and the time it takes to break an ice tile.
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
