# Proyecto: Vida Electronica

 
>[...] La pregunta de si las máquinas pueden pensar [...] es tan relevante como la pregunta de si los submarinos pueden nadar.
>Edsger Dijkstra, The Threats to Computing Science

En los capítulos de proyecto, dejaré de abrumarte con teoría nueva por un breve momento, y en lugar de eso trabajaremos a través de un programa juntos. La teoría es indispensable cuando aprendemos a programar, pero debería ser acompañada de lecturas y la comprensión de programas no triviales.


Nuestro proyecto en este capítulo es construir un ecosistema virtual, un mundo pequeño poblado con bichos que se mueven alrededor y luchan por sobrevivir.  


### Definición

Para hacer esta tarea manejable, nosotros simplificaremos radicalmente el concepto de _mundo_. Es decir un mundo será una _cuadricula_ de dos dimensiones donde cada entidad ocupa un cuadro completo de ella. En cada _turno_, todos los bichos tienen oportunidad de tomar alguna acción.

Por lo tanto, cortamos ambos tiempo y espacio en dos unidades con un tamaño fijo: cuadros para espacio y turnos para tiempo. Por supuesto, esto es una burda e imprecisa _aproximación_. Pero nuestra simulación pretende ser entretenida, no precisa, así que podemos cortar libremente las esquinas.

Podemos definir un mundo con un _plan_, una matriz de cadenas que establece la cuadrícula del mundo usando un carácter por cuadro. 

```
var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];
```

El carácter "#" en este programa representa _paredes_ y rocas, y el carácter "o" representa bichos. Los espacios, como posiblemente habrás adivinado, son espacios vacíos.

Una matriz unidimensional puede ser usada para crear un objeto _mundo_. Tal objeto mantiene seguimiento del tamaño y contenido del mundo tiene un método de "toString", que convierte al mundo nuevamente en una cadena imprimible (parecida al programa en el que se basó) de manera que podamos ver qué es lo que está pasando dentro. El objeto mundo también tiene un método de `vuelta`, el cual permite a todos los bichos en él tomar un turno y actualizar el mundo a reflejo de sus acciones.  

### Representando el espacio.

La _cuadrícula_ que modela el mundo tiene un ancho y altura fija. Los cuadros son identificados por sus coordenadas "X" y "Y". Usamos un tipo sencillo, `Vector` (como los vistos en los ejercicios del capítulo anterior), para representar estas coordenadas en pares.


```
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
```

A continuacion, necesitamos un tipo de objeto que modele por si mismo la cuadricula. Una cuadricula es parte de un mundo, pero nosotros estamos haciendo un objeto separado (la cuál sera una propiedad de un objeto del _mundo_) para mantener el objeto mundo simple. El mundo debe ocuparse de las cosas relacionadas con mundo, y la cuadricula debe ocuparse de las cosas relacionadas con la cuadricula.  

Para almacenar una cuadricula de valores, tenemos varias opciones. Podemos utilizar una matriz de matrices de fila y utilizar dos propiedades de acceso para llegar a una cruadricula específica, como esto:

```
var grid = [["top left",    "top middle",    "top right"],
            ["bottom left", "bottom middle", "bottom right"]];
console.log(grid[1][2]);
// → bottom right
```

O podemos utilizar una sola matriz, con el tamaño de ancho x alto, y decidir que el elemento en (_x_,_y_) se encuentra en la posición _x_ + (_y_ x ancho) de la matriz.


```
var grid = ["top left",    "top middle",    "top right",
            "bottom left", "bottom middle", "bottom right"];
console.log(grid[2 + (1 * 3)]);
// → bottom right
```

Dado que el acceso real a esta matriz será envuelto en métodos en el objeto de tipo cuadricula, no le importa al código externo cual enfoque tomamos. Elegí la segunda representación, ya que hace que sea mucho más fácil crear la matriz. Al llamar al constructor de `Array` con un solo número como argumento, se crea una nueva matriz vacía de la longitud dada.

Este código define el objeto de cuadrícula, con algunos métodos básicos:

```
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function(vector) {
  return vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};
```

Y aquí es una prueba trivial:

```
var grid = new Grid(5, 5);
console.log(grid.get(new Vector(1, 1)));
// → undefined
grid.set(new Vector(1, 1), "X");
console.log(grid.get(new Vector(1, 1)));
// → X
```

### Una interfaz de programación de bichos

Para poder comenzar en el `constructor` del _mundo_, tenemos que ser más específicos acerca de los objetos `bichos` que van a vivir en su interior. He mencionado que el mundo va a pedir a los bichos acciones que quieren tomar. Esto funciona de la siguiente manera: cada objeto bicho tiene un método `acto` que, cuando se le llama, devuelve una acción. Una acción es un objeto con una propiedad `tipo`, que da nombre al tipo de acción que la criatura quiere tomar, por ejemplo, `"movimiento"`. La acción también puede contener información adicional, como la dirección de la criatura quiere mudarse.

Critters are terribly myopic and can see only the
squares directly around them on the grid. But even this limited vision
can be useful when deciding which action to take. When the `act`
method is called, it is given a _view_ object that allows the critter
to inspect its surroundings. We name the eight surrounding squares by
their ((compass direction))s: `"n"` for north, `"ne"` for northeast,
and so on. Here's the object we will use to map from direction names
to coordinate offsets:



```
var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};
```

The view object has a method `look`, which takes a
direction and returns a character, for example `"#"` when there is a
wall in that direction, or `" "` (space) when there is nothing there.
The object also provides the convenient methods `find` and `findAll`.
Both take a map character as an argument. The first returns a direction
in which the character can be found next to the critter or returns `null` if
no such direction exists. The second returns an array containing all
directions with that character. For example, a creature sitting left
(west) of a wall will get `["ne", "e", "se"]` when calling `findAll`
on its view object with the `"#"` character as argument.

sHere is a simple, stupid critter that just follows its nose until it hits an
obstacle and then bounces off in a random open direction:


```
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter() {
  this.direction = randomElement(directionNames);
};

BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) != " ")
    this.direction = view.find(" ") || "s";
  return {type: "move", direction: this.direction};
};
```

The `randomElement` helper function simply picks a random element from an array, using
`Math.random` plus some arithmetic to get a random index. We'll use
this again later because randomness can be useful in ((simulation))s.

To pick a random direction, the `BouncingCritter` constructor calls `randomElement` on an array of direction names. We could also have used `Object.keys` to get this
array from the `directions` object we defined
link:07_elife.html#directions[earlier], but that provides no
guarantees about the order in which the properties are listed. In most
situations, modern JavaScript engines will return properties in the
order they were defined, but they are not required to.

The “++|| "s"++” in the `act` method is there to prevent `this.direction` from getting the value `null` if the
critter is somehow trapped with no empty space around it (for example
when crowded into a corner by other critters).

== The world object ==

Now we can start on the `World` object type. The ((constructor)) takes a plan (the array of strings representing the world's grid, described
link:07_elife.html#grid[earlier]) and a _((legend))_ as arguments. A
legend is an object that tells us what each character in the map
means. It contains a constructor for every character—except for the
space character, which always refers to `null`, the value we'll use to
represent empty space.


```
function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function(line, y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y),
               elementFromChar(legend, line[x]));
  });
}
```

In `elementFromChar`, first we create an instance of the right type by looking up the
character's constructor and applying `new` to it. Then we add an
`originChar` ((property)) to it to make it easy to find out what
character the element was originally created from.

We need this `originChar` property when implementing the world's `toString` method. This method builds up a maplike string from the world's current state by performing a
two-dimensional loop over the squares on the grid.


```
function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

World.prototype.toString = function() {
  var output = "";
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
};
```

A ((wall)) is a simple object—it is used only for taking up space and has no
`act` method.


```
function Wall() {}
```

When we try the `World` object by creating an instance based on the plan from link:07_elife.html#plan[earlier in the
chapter] and then calling `toString` on it, we get a string very
similar to the plan we put in.

// include_code strip_log
// test: trim

```
var world = new World(plan, {"#": Wall,
                             "o": BouncingCritter});
console.log(world.toString());
// → ############################
//   #      #    #      o      ##
//   #                          #
//   #          #####           #
//   ##         #   #    ##     #
//   ###           ##     #     #
//   #           ###      #     #
//   #   ####                   #
//   #   ##       o             #
//   # o  #         o       ### #
//   #    #                     #
//   ############################
```

== this and its scope ==

The `World` ((constructor)) contains a
call to `forEach`. One interesting thing to note is that inside the
function passed to `forEach`, we are no longer directly in the
function scope of the constructor. Each function call gets its own
`this` binding, so the `this` in the inner function does _not_
refer to the newly constructed object that the outer `this` refers to.
In fact, when a function isn't called as a method, `this` will refer
to the global object.

This means that we can't write `this.grid` to access the grid from
inside the ((loop)). Instead, the outer function creates a normal
local variable, `grid`, through which the inner function gets access
to the grid.

This is a bit of a design blunder in JavaScript.
Fortunately, the next version of the language provides a solution for
this problem. Meanwhile, there are workarounds. A common pattern is to
say `var self = this` and from then on refer to `self`, which is a
normal variable and thus visible to inner functions.

(((bind method)))(((this)))Another solution is to use the `bind`
method, which allows us to provide an explicit `this` object to bind
to.

```
var test = {
  prop: 10,
  addPropTo: function(array) {
    return array.map(function(elt) {
      return this.prop + elt;
    }.bind(this));
  }
};
console.log(test.addPropTo([5]));
// → [15]
```

The function passed to `map` is the result of the `bind` call and thus has its `this` bound to the first argument given
to ++bind++—the outer function's `this` value (which holds the `test`
object).

Most ((standard)) higher-order methods on arrays, such as `forEach` and `map`, take an
optional second argument that can also be used to provide a `this` for
the calls to the iteration function. So you could express the previous example
in a slightly simpler way.

```
var test = {
  prop: 10,
  addPropTo: function(array) {
    return array.map(function(elt) {
      return this.prop + elt;
    }, this); // ← no bind
  }
};
console.log(test.addPropTo([5]));
// → [15]
```

This works only for higher-order functions that
support such a _context_ parameter. When they don't, you'll need to
use one of the other approaches.

In our own higher-order functions, we can support such a context
parameter by using the `call` method to call the function given as an
argument. For example, here is a `forEach` method for our `Grid` type,
which calls a given function for each element in the grid that isn't
null or undefined:


```
Grid.prototype.forEach = function(f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};
```

== Animating life ==

The next step is to write a `turn` method for the world object that gives the
((critter))s a chance to act. It will go over the grid using the
`forEach` method we just defined, looking for objects with an `act`
method. When it finds one, `turn` calls that method to get an action
object and carries out the action when it is valid. For now, only
`"move"` actions are understood.

(((grid)))There is one potential problem with this approach. Can you
spot it? If we let critters move as we come across them, they may move
to a square that we haven't looked at yet, and we'll allow them to
move _again_ when we reach that square. Thus, we have to keep an array
of critters that have already had their turn and ignore them when we
see them again.


```
World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};
```

(((this)))We use the second parameter to the grid's `forEach` method
to be able to access the correct `this` inside the inner function.
The `letAct` method contains the actual logic that allows the critters
to move.


```
World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == "move") {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
};

World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest))
      return dest;
  }
};

```

First, we simply ask the critter to act, passing it a view object that knows about the world and the critter's current position in that world (we'll define `View`
in a link:07_elife.html#view[moment]). The `act` method returns an
action of some kind.

If the action's `type` is not `"move"`, it is ignored. If it _is_
`"move"`,  if it has a `direction` property that refers to a valid
direction, _and_ if the square in that direction is empty (null), we set
the square where the critter used to be to hold null and store the
critter in the destination square.

Note that `letAct` takes care to ignore nonsense ((input))—it doesn't assume that the action's `direction`
property is valid or that the `type` property makes sense. This kind
of _defensive_ programming makes sense in some situations. The main
reason for doing it is to validate inputs coming from sources you
don't control (such as user or file input), but it can also be useful
to isolate subsystems from each other. In this case, the intention is
that the critters themselves can be programmed sloppily—they don't
have to verify if their intended actions make sense. They can just
request an action, and the world will figure out whether to allow it.

These two methods are not part of the external interface of a `World` object. They are an internal detail. Some languages provide
ways to explicitly declare certain methods and properties _private_
and signal an error when you try to use them from outside the object.
JavaScript does not, so you will have to rely on some other form of
communication to describe what is part of an object's interface.
Sometimes it can help to use a naming scheme to distinguish between
external and internal properties, for example by prefixing all
internal ones with an underscore character (_). This will make
accidental uses of properties that are not part of an object's
interface easier to spot.

The one missing part, the `View` type, looks like this:

```
function View(world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target));
  else
    return "#";
};
View.prototype.findAll = function(ch) {
  var found = [];
  for (var dir in directions)
    if (this.look(dir) == ch)
      found.push(dir);
  return found;
};
View.prototype.find = function(ch) {
  var found = this.findAll(ch);
  if (found.length == 0) return null;
  return randomElement(found);
};
```

The `look` method figures out the
coordinates that we are trying to look at and, if they are inside the
((grid)), finds the character corresponding to the element that sits
there. For coordinates outside the grid, `look` simply pretends that
there is a wall there so that if you define a world that isn't walled
in, the critters still won't be tempted to try to walk off the edges.

== It moves ==

We instantiated a world object earlier. Now that we've added all the necessary methods, it
should be possible to actually make the world move.

```
for (var i = 0; i < 5; i++) {
  world.turn();
  console.log(world.toString());
}
// → … five turns of moving critters
```

The first two maps that are displayed will look something like this
(depending on the random direction the critters picked):

```
############################  ############################
#      #    #             ##  #      #    #             ##
#                   o      #  #                          #
#          #####           #  #          #####     o     #
##         #   #    ##     #  ##         #   #    ##     #
###           ##     #     #  ###           ##     #     #
#           ###      #     #  #           ###      #     #
#   ####                   #  #   ####                   #
#   ##                     #  #   ##                     #
#    #       o         ### #  #o   #                 ### #
#o   #          o          #  #    #       o o           #
############################  ############################
```

They move! To get a more interactive view of these critters crawling around and bouncing off the walls, open this chapter
in the online version of the book at
http://eloquentjavascript.net[_eloquentjavascript.net_].


Simply printing out many copies of the map is a rather unpleasant
way to observe a world, though. That's why the sandbox provides an
`animateWorld` function that will run a world as an onscreen
animation, moving three turns per second, until you hit the stop
button.


```
animateWorld(world);
// → … life!
```

The implementation of `animateWorld` will remain a mystery for now,
but after you've read the link:13_dom.html#dom[later chapters] of this
book, which discuss JavaScript integration in web browsers, it won't
look so magical anymore.


== More life forms ==

The dramatic highlight of our world, if you watch for a bit, is when
two critters bounce off each other. Can you think of another
interesting form of ((behavior))?

The one I came up with is a ((critter)) that moves along walls. Conceptually, the critter keeps its left hand (paw, tentacle, whatever) to the wall and follows along. This turns out to
be not entirely trivial to implement.

We need to be able to “compute” with ((compass direction))s. Since directions are
modeled by a set of strings, we need to define our own operation
(`dirPlus`) to calculate relative directions. So `dirPlus("n", 1)`
means one 45-degree turn clockwise from north, giving `"ne"`.
Similarly, `dirPlus("s", -2)` means 90 degrees counterclockwise from
south, which is east.


```
function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

function WallFollower() {
  this.dir = "s";
}

WallFollower.prototype.act = function(view) {
  var start = this.dir;
  if (view.look(dirPlus(this.dir, -3)) != " ")
    start = this.dir = dirPlus(this.dir, -2);
  while (view.look(this.dir) != " ") {
    this.dir = dirPlus(this.dir, 1);
    if (this.dir == start) break;
  }
  return {type: "move", direction: this.dir};
};
```

The `act` method only has to “scan” the critter's surroundings, starting from
its left side and going clockwise until it finds an empty square.
It then moves in the direction of that empty square.

What complicates things is that a critter may end up in the middle of
empty space, either as its start position or as a result of walking
around another critter. If we apply the approach I just described in
empty space, the poor critter will just keep on turning left at every
step, running in circles.

So there is an extra check (the `if` statement) to start scanning to
the left only if it looks like the critter has just passed some kind
of ((obstacle))—that is, if the space behind and to the left of the
critter is not empty. Otherwise, the critter starts scanning directly
ahead, so that it'll walk straight when in empty space.

And finally, there's a test comparing `this.dir` to `start` after every pass through the loop to make sure that the loop
won't run forever when the critter is walled in or crowded in by other
critters and can't find an empty square.


This small world demonstrates the wall-following creatures:


```
animateWorld(new World(
  ["############",
   "#     #    #",
   "#   ~    ~ #",
   "#  ##      #",
   "#  ##  o####",
   "#          #",
   "############"],
  {"#": Wall,
   "~": WallFollower,
   "o": BouncingCritter}
));
```


== A more lifelike simulation ==

To make life in our world more interesting, we will add the concepts of ((food)) and
((reproduction)). Each living thing in the world gets a new property,
`energy`, which is reduced by performing actions and increased by
eating things. When the critter has enough ((energy)), it can
reproduce, generating a new critter of the same kind. To keep things
simple, the critters in our world reproduce asexually, all by
themselves.

If critters only move around and eat one another, the world will soon succumb to the law of increasing entropy, run out of energy, and become a lifeless wasteland. To prevent this
from happening (too quickly, at least), we add ((plant))s to the
world. Plants do not move. They just use ((photosynthesis)) to grow
(that is, increase their energy) and reproduce.

To make this work, we'll need a world with a different `letAct` method. We could just replace the method of the `World` prototype, but I've become very attached to our simulation with the wall-following critters and would hate to break that old world.

One solution is to use ((inheritance)). We create a new ((constructor)), `LifelikeWorld`, whose prototype is based on the `World` prototype but which overrides the `letAct` method. The new `letAct` method delegates the work of actually performing an action to various functions stored in the `actionTypes` object.


```
function LifelikeWorld(map, legend) {
  World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter,
                                  vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, null);
  }
};
```

The new `letAct` method first checks whether an action was returned at all, then whether a handler function for this type of action exists, and finally whether that handler returned true, indicating that it successfully handled the action. Note the use
of `call` to give the handler access to the world, through its `this`
binding.

If the action didn't work for whatever reason, the default action is
for the creature to simply wait. It loses one-fifth point of ((energy)),
and if its energy level drops to zero or below, the creature dies and
is removed from the grid.

== Action handlers ==

The simplest action a creature can perform is `"grow"`, used by ((plant))s. When an action object like `{type: "grow"}` is returned, the following handler method will be called:


```
actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
};
```

Growing always succeeds and adds half a point to the plant's
((energy)) level.

Moving is more involved.


```
actionTypes.move = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
};
```

This action first checks, using the `checkDestination` method defined link:07_elife.html#checkDestination[earlier], whether
the action provides a valid destination. If not, or if the
destination isn't empty, or if the critter lacks the required
((energy)), `move` returns false to indicate no action was taken.
Otherwise, it moves the critter and subtracts the energy cost.

In addition to moving, critters can eat.

```
actionTypes.eat = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};
```

Eating another ((critter)) also involves providing a valid destination square. This time, the destination must not be empty and must contain something with ((energy)), like a critter (but not a wall—walls are not edible). If so, the energy from the eaten is transferred to the eater, and the victim is removed from the grid.

And finally, we allow our critters to reproduce.

```
actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend,
                             critter.originChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};
```

Reproducing costs twice the ((energy)) level of the newborn critter. So we first create a (hypothetical) baby using `elementFromChar` on the critter's own origin character. Once we have a baby, we can find its energy level and test whether the parent has enough energy to successfully bring it into the world. We also
require a valid (and empty) destination.

If everything is okay, the baby is put onto the grid (it is now no longer hypothetical), and the energy is spent.

== Populating the new world ==

We now have a ((framework)) to simulate these more lifelike creatures. We could put
the critters from the old world into it, but they would just die
since they don't have an ((energy)) property. So let's make new ones.
First we'll write a ((plant)), which is a rather simple life-form.


```
function Plant() {
  this.energy = 3 + Math.random() * 4;
}
Plant.prototype.act = function(view) {
  if (this.energy > 15) {
    var space = view.find(" ");
    if (space)
      return {type: "reproduce", direction: space};
  }
  if (this.energy < 20)
    return {type: "grow"};
};
```

Plants start with an energy level between 3 and 7, randomized so that they don't all reproduce in the same turn. When a plant reaches 15 energy points and there is empty
space nearby, it reproduces into that empty space. If a plant can't
reproduce, it simply grows until it reaches energy level 20.

We now define a plant eater.

```
function PlantEater() {
  this.energy = 20;
}
PlantEater.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 60 && space)
    return {type: "reproduce", direction: space};
  var plant = view.find("*");
  if (plant)
    return {type: "eat", direction: plant};
  if (space)
    return {type: "move", direction: space};
};
```

We'll use the `*` character for ((plant))s, so that's what this
creature will look for when it searches for ((food)).

== Bringing it to life ==

And that gives us enough elements to try our new world. Imagine the following map as a grassy valley with a herd of ((herbivore))s in it, some boulders, and lush ((plant)) life
everywhere.


```
var valley = new LifelikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O         ##***    #",
   "#                 ##**     #",
   "#   O       #*             #",
   "#*          #**       O    #",
   "#***        ##**    O    **#",
   "##****     ###***       *###",
   "############################"],
  {"#": Wall,
   "O": PlantEater,
   "*": Plant}
);
```

Let's see what happens if we run this. (!book These snapshots illustrate a typical run of this world.!)


```
animateWorld(valley);
```


```
############################  ############################
#####                 ######  ##### **              ######
##   ***   O             *##  ##  ** *            O     ##
#   *##*          **     *##  #  **##                   ##
#    **           ##*     *#  #  **  O          ##O      #
#                 ##*      #  #   *O      * *   ##       #
#                 ##  O    #  #            ***  ##     O #
#           #*      O      #  #**         #***           #
#*          #**  O         #  #**      O  #****          #
#*   O    O ##*          **#  #***        ##***     O    #
##*        ###*          ###  ##**       ###**    O    ###
############################  ############################

############################  ############################
#####O O              ######  #####  O              ######
##                        ##  ##                        ##
#    ##O                  ##  #    ##            O      ##
#           O  O *##       #  #                 ##       #
#  O    O    O  **##    O  #  #                 ##       #
#               **##     O #  #               O ## *     #
#           #   *** *      #  #           #  O           #
#           # O*****  O    #  #        O  #   O          #
#           ##******       #  #           ##    O     O  #
##         ###******     ###  ##         ### O         ###
############################  ############################

############################  ############################
#####                 ######  #####                 ######
##                        ##  ##                 **  *  ##
#    ##                   ##  #    ##            *****  ##
#                 ##       #  #                 ##****   #
#                 ##* *    #  #                 ##*****  #
#              O  ## *     #  #                 ##****** #
#           #              #  #           #       ** **  #
#           #              #  #           #              #
#           ##             #  #           ##             #
##         ###           ###  ##         ###           ###
############################  ############################
```


Most of the time, the plants multiply and expand quite quickly, but then
the abundance of ((food)) causes a population explosion of the
((herbivore))s, who proceed to wipe out all or nearly all of the
((plant))s, resulting in a mass starvation of the critters. Sometimes,
the ((ecosystem)) recovers and another cycle starts. At other times,
one of the species dies out completely. If it's the herbivores, the
whole space will fill with plants. If it's the plants, the remaining
critters starve, and the valley becomes a desolate wasteland. Ah, the
cruelty of nature.

== Exercises ==

=== Artificial stupidity ===

Having the inhabitants of our world go extinct after a few minutes is kind of depressing. To deal with this, we could try to create a smarter plant eater.

There are several obvious problems with our herbivores. First, they are terribly greedy,
stuffing themselves with every plant they see until they have wiped
out the local plant life. Second, their randomized movement (recall
that the `view.find` method returns a random direction when multiple
directions match) causes them to stumble around ineffectively and
starve if there don't happen to be any plants nearby. And finally,
they breed very fast, which makes the cycles between abundance and
famine quite intense.

Write a new critter type that tries to address one or more of these
points and substitute it for the old `PlantEater` type in the valley
world. See how it fares. Tweak it some more if necessary.


// test: no

```
// Your code here
function SmartPlantEater() {}

animateWorld(new LifelikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O         ##***    #",
   "#                 ##**     #",
   "#   O       #*             #",
   "#*          #**       O    #",
   "#***        ##**    O    **#",
   "##****     ###***       *###",
   "############################"],
  {"#": Wall,
   "O": SmartPlantEater,
   "*": Plant}
));
```


!!hint!!

The greediness problem can be attacked in several ways. The critters could stop eating when they
reach a certain ((energy)) level. Or they could eat only every N turns (by
keeping a counter of the turns since their last meal in a property on
the creature object). Or, to make sure plants never go entirely
extinct, the animals could refuse to eat a ((plant)) unless they see
at least one other plant nearby (using the `findAll` method on the
view). A combination of these, or some entirely different strategy,
might also work.

Making the critters move more effectively could be done by stealing one of the movement strategies
from the critters in our old, energyless world. Both the bouncing
behavior and the wall-following behavior showed a much wider range of
movement than completely random staggering.

Making creatures breed more slowly is trivial. Just increase the minimum energy level at which they
reproduce. Of course, making the ecosystem more stable also makes it
more boring. If you have a handful of fat, immobile critters forever
munching on a sea of plants and never reproducing, that makes for a
very stable ecosystem. But no one wants to watch that.

!!hint!!

=== Predators ===

Any serious ((ecosystem)) has a food chain longer than a single link. Write
another ((critter)) that survives by eating the ((herbivore)) critter.
You'll notice that ((stability)) is even harder to achieve now that there
are cycles at multiple levels. Try to find a strategy to make the
ecosystem run smoothly for at least a little while.

One thing that will help is to make the world bigger.
This way, local population booms or busts are less likely to wipe out
a species entirely, and there is space for the relatively large prey
population needed to sustain a small predator population.


```
// Your code here
function Tiger() {}

animateWorld(new LifelikeWorld(
  ["####################################################",
   "#                 ####         ****              ###",
   "#   *  @  ##                 ########       OO    ##",
   "#   *    ##        O O                 ****       *#",
   "#       ##*                        ##########     *#",
   "#      ##***  *         ****                     **#",
   "#* **  #  *  ***      #########                  **#",
   "#* **  #      *               #   *              **#",
   "#     ##              #   O   #  ***          ######",
   "#*            @       #       #   *        O  #    #",
   "#*                    #  ######                 ** #",
   "###          ****          ***                  ** #",
   "#       O                        @         O       #",
   "#   *     ##  ##  ##  ##               ###      *  #",
   "#   **         #              *       #####  O     #",
   "##  **  O   O  #  #    ***  ***        ###      ** #",
   "###               #   *****                    ****#",
   "####################################################"],
  {"#": Wall,
   "@": Tiger,
   "O": SmartPlantEater, // from previous exercise
   "*": Plant}
));
```


!!hint!!

Many of the same tricks that worked for the previous exercise also apply here.
Making the predators big (lots of energy) and having them reproduce
slowly is recommended. That'll make them less vulnerable to periods of
starvation when the herbivores are scarce.

Beyond staying alive, keeping its ((food)) stock alive is a
predator's main objective. Find some way to make predators hunt
more aggressively when there are a lot of ((herbivore))s and hunt more
slowly (or not at all) when prey is rare. Since plant eaters move
around, the simple trick of eating one only when others are nearby is
unlikely to work—that'll happen so rarely that your predator will
starve. But you could keep track of observations in previous turns, in
some ((data structure)) kept on the predator objects, and have it base
its ((behavior)) on what it has seen recently.

