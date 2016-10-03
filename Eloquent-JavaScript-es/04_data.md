# Estructuras de Datos: Objetos y Arreglos

>En dos ocasiones me preguntaron - “Disculpe, Sr. Babbage, si pongo números incorrectos en la máquina, ¿van a salir las respuestas correctas?” [...] No puedo terminar de comprender el tipo de confusión de ideas que podrían provocar esta pregunta.
>Charles Babbage, Passages from the Life of a Philosopher (1864)

Números, Booleanos y cadenas son los ladrillos de los que están hechas las estructuras de datos.
Pero no podrás construir mucha casa de un solo ladrillo. Los _objetos_ nos permiten agrupar valores-incluyendo otros objetos-permitiéndonos construir estructuras más complejas.

Los programas que hemos construido hasta ahora han sido seriamente limitados debido al hecho de que estaban operando únicamente en tipos de datos simples. Este capítulo agregará a tu caja de herramientas un entendimiento básico de las estructuras de datos. Al finalizarlo, sabrás lo suficiente para empezar a escribir algunos programas de utilidad.

El capítulo trabajará a lo largo de un ejemplo de programación más o menos realista, introduciendo conceptos conforme apliquen al problema en cuestión.
El código de ejemplo muchas veces se construirá sobre funciones y variables que fueron presentadas previamente en el texto.

El sandbox de programación en línea para el libro [_eloquentjavascript.net/code_](http://eloquentjavascript.net/code) proporciona una manera de correr el código en el contexto de un capítulo en espacífico. Si decides trabajar en los ejemplos en otro entorno, asegúrate de descargar primero el código completo de este capítulo desde la página del sandbox.

### La ardillalobo

De vez en cuando, comúnmente entre las ocho y las diez de la noche, Jacques se transforma en un pequeño y peludo roedor con una frondosa cola.

Por un lado, Jacques esta bastante contento de no tener la clásica licantropía.
Convertirse en una ardilla suele causar menos problemas que convertirse en un lobo. En vez de tener que preocuparse por comerse accidentalmente a un vecino (_eso_ sería extraño), le preocupa el ser deborado por el gato del vecino.
Después de un par de ocasiones donde se despertó, desnudo y desorientado, en una apenas delgada rama en la cima de un roble, se ha asegurado de cerrar puertas y ventanas de su cuarto por las noches y poner algunas nueces en el suelo para mantenerse ocupado.

![](img/weresquirrel.png)

Eso resuelve los problemas del gato y el roble. Pero Jacques aún sufre de su enfermedad. Los momentos irregulares en que se presenta la transformación le hacen sospechar que pudieran ser detonadas por algo. Por algún tiempo, creyó que sucedía sólo en los dias que había tocado árboles. Así que dejó de tocar árboles de manera definitiva e incluso evitó acercarse a ellos. Pero el problema presistió.

Cambiando a una perspectiva un poco más científica, Jacques planea empezar un registro diario de todo lo que hizo ese día y si tuvo o no una transformación. Con estos datos espera limitar las condiciones que disparan las transformaciones.

La primer cosa que hace es diseñar una estructura de datos para almacenar esta información.

### Conjuntos de datos

Para trabajar con un pedazo de datos digitales, primero tendremos que encontrar una forma de representarlo en la memoria de nuestra máquina. Digamos, como un pequeño ejemplo, que queremos representar una colección de números: 2, 3, 5, 7 y 11.

Podríamos ponernos creativos usando cadenas-despues de todo, las cadenas pueden ser de cualquier longitud, así que podríamos pone mucha información en ellas-y usar `"2 3 5 7 11"` como nuestra representación. Pero esto es extraño. De alguna forma tendrías que extaer los dígitos y convertirlos de vuelta a números para accesarlos.

Afortunadamente, Javascript proporciona un tipo de dato específico para almacenar secuencias de valores. Se le llama _arreglo_ y se escribe como una lista de valores entre corchetes, separados por comas.

```
var listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[1]);
// → 3
console.log(listOfNumbers[1 - 1]);
// → 2
```

La notación para obtener los elementos dentro de un arreglo también utiliza corchetes. Un par de corchetes inmediátamente después de una expresión, con otra expresión dentro de los corchetes. buscará el elemento en la expresión de la izquierda que corresponda al _índice_ dado por la expresión en corchetes.

El primer índice de un arreglo es cero, no uno. Así que el primer elemento puede leerse usando `listOfNumbers[0]`. Si no tienes antecedentes en programación, acostumbrarte a esta convención puede tomarte algún tiempo. Pero el _zero-based counting_ tiene una larga tradición en tecnología y mientras la convención se siga de manera consistente (que se ha hecho, en Javascript), funciona bien.

### Propiedades

Hemos visto algunas expresiones sospechosas como `myString.length` (para obtener la longitud de una cadena) y `Math.max` (la función máximo) en ejemplos pasados. Estas son expresiones que accesan una _propiedad_ de algún valor. En el primer caso, accesamos la propiedad `length` de el valor en `myString`. En el segundo, accesamos la propiedad llamada `max` en el objeto `Math` (que es una colección de valores y funciones relacionadas con las matemáticas).

Casi todos los valores de Javascript tienen propiedades. Las excepciones son `null` y `undefined`. Si intentas acceder una propiedad de alguno de estos nonvalues, recibirás un error.

```
null.length;
// → TypeError: Cannot read property 'length' of null
```

Las dos maneras comúnes de acceder a propiedades en Javascript es con un punto y con corchetes. Ambas `value.x` y `value[x]` acceden una propiedad en _value_—pero no necesariamente la misma propiedad.
La diferencia radica en cómo se interpreta `x`. Cuando usamos un punto, la parte después del punto debe ser un nombre de variable válido y nombra de manera directa a la propiedad. Cuando usamos corchetes, la expresión dentro de los corchetes es _evaluada_ para obtener el nombre de la propiedad. Mientras que `value.x` busca la propiedad de `value` llamada “x”, `value[x]` intenta evaluar la expresión `x` y usa el resultado como el nombre de la propiedad.

Así que si sabes que la propiedad que te interesa se llama “length”, usas `value.length`. Si deseas extraer la propiedad nombrada por el valor almacenado en la variable `i`, usas `value[i]`. Y debido a que el nombre de las propiedades puede ser cualquier cadena, si quieres accesar una propiedad llamada “2” o “John Doe”, debes utilizar corchetes:`value[2]` or `value["John Doe"]`. Así lo harías incluso si conoces el nombre preciso de la propiedad de antemano, ya que ni “2” ni “John Doe” son nombres válidos de variables y por lo tanto no pueden accesarse a traves de la notación con punto.

Los elementos en un arreglo se almacenan en propiedades. Debido a que los nombres de estas propiedades son números y usualmente necesitamos obtener su nombre de una variable, tenemos que usar la sintaxis de corchetes para accesarlos.
La propiedad `length` de un arreglo nos dice cuantos elementos contiene. Este nombre de propiedad es un nombre de variable válido, y conocemos su nombre por anticipado, así que para encontrar la longitud de un arreglo, comúnmente escribiremos `array.length` ya que es más fácil de escribir que `array["length"]`.

### Métodos

Ambos objetos, las cadenas y los arreglos contienen, adicionalmente a la propiedad `length`, un número de propiedades que refieren a valores de tipo función.

```
var doh = "Doh";
console.log(typeof doh.toUpperCase);
// → function
console.log(doh.toUpperCase());
// → DOH
```

Todas las cadenas tienen una propiedad `toUpperCase`. Cuando es llamada, regresará una copia de la cadena en la que todas las letras han sido convertidas a mayúsculas. También existe `toLowerCase`. Puedes adivinar que es lo que hace.

Curiosamente, a pesar de que la llamada a `toUpperCase` no pasa ningun argumento, la funcion del algun modo tiene acceso a la cadena `"Doh"`, el valor cuya propiedad hemos llamado. Como funciona esto es decrito en el Capitulo 6.

Las propiedades que contienen funciones son generalmente llamadas metodos del valor al que pertenecen. Como , _“toUpperCase_  es un metodo de una cadena”.

Este ejemplo demuestra algunos de los métodos que los objetos de tipo array tienen:

```
var mack = [];
mack.push("Mack");
mack.push("the", "Knife");
console.log(mack);
// → ["Mack", "the", "Knife"]
console.log(mack.join(" "));
// → Mack the Knife
console.log(mack.pop());
// → Knife
console.log(mack);
// → ["Mack", "the"]
```

El metodo `push` puede ser usado para añadir valores al final de un arreglo. El metodo pop hace lo opuesto: remueve el valor al final del arreglo y lo retorna. Un arreglo de cadenas puede ser aplanado a una sola cadena con el metodo join. El argumento dado a join determina el texto que es pegado entre los elementos del arreglo. 

### Objetos

De regreso a la ardillalobo. Un conjunto de registro de entradas puede ser representado como un arreglo. Pero las entradas no consisten solamente en un numero o una cadena-cada entrada necesita almacenar una lista de actividades y un valor Booleano que indique si Jacques se convirtió en una ardilla. Idealmente, nos gustaría agrupar esos valores juntos en un unico valor y despues poner esos valores agrupados en un arreglo de registro de entradas.

Los valores del tipo _object_ son colecciones arbitrarias de propiedades y podemos agregar o eliminar esas propiedades como nos parezca. Una manera de crear un objeto es usar notación de llaves.

```
var day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running", "television"]
};
console.log(day1.squirrel);
// → false
console.log(day1.wolf);
// → undefined
day1.wolf = false;
console.log(day1.wolf);
// → false
```

Dentro de las llaves, podemos dar una lista de propiedades separadas por comas. Cada propiedad está escrita como un nombre, seguida por dos puntos, seguida por una expresión que provee un valor para la propiedad. Los espacios y saltos de línea no son significantes. Cuando un objeto abarca multiples líneas, marcandolos como en el ejemplo anterior, esto mejora la legibilidad del codigo.
Las propiedades cuyos nombres no son nombres validos de variables o numeros validos tienen que ser encerradas en comillas.

```
var descriptions = {
  work: "Went to work",
  "touched tree": "Touched a tree"
};
```

Esto significa que las _llaves_ tienen _dos_ significados en JavaScript. Al inicio de una sentencia, inician un bloque de sentencias. En cualquier otra posición, describen un objeto. Afortunadamente, casí nunca es util iniciar una declaración con un objeto de tipo _llave_, y en programas típicos, no hay ambigüedad entre estos dos usos.

Leer una propiedad que no existe producirá el valor undefined, lo que paso la primera vez que intentamos leer la propiedad lobo en el ejemplo anterior.

Es posible asignar un valor a una expresión de tipo propiedad con el operador `=`. Esto reemplazará el valor de la propiedad si existía o creará una nueva propiedad en el objeto si no la había.

Para volver brevemente a nuestro modelo de tentáculos de asociacion de _variables_. Asociación de variables similares. Ellos captan valores, pero otras variables y propiedades podrían estar llevandose a cabo en los mismos valores. Tú puedes pensar en objetos como los pulpos con cualquier número de tentáculos, cada uno de los cuales tiene un nombre inscrito en ella. 

![](img/octopus-object.jpg)
Es un operador unitario que, cuando se aplica a una expresión acceso a la propiedad, eliminará la propiedad con el nombre del objeto. Esto no es una cosa común a hacer, pero es posible.

```
var anObject = {left: 1, right: 2};
console.log(anObject.left);
// → 1
delete anObject.left;
console.log(anObject.left);
// → undefined
console.log("left" in anObject);
// → false
console.log("right" in anObject);
// → true
```

El operador binario 'in', cuando se aplica a una cadena y un objeto, devuelve un valor booleano que indica si ese objeto tiene esa propiedad.
La diferencia entre el establecimiento de una propiedad a `undefined`, y el hecho de eliminarlo es que, en el primer caso, el objeto todavía tiene la propiedad (que simplemente no tiene un valor muy interesante), mientras que en el segundo caso la propiedad ya no está presente y devolverá falso. 


Arrays, then, are just a kind of object specialized for storing sequences of things. If you evaluate `typeof [1, 2]`, this produces `"object"`. You can see them as long,
flat octopuses with all their arms in a neat row, labeled with
numbers.

image::img/octopus-array.jpg[alt="Artist's representation of an array"]

So we can represent Jacques’ journal as an array of objects.

```
var journal = [
  {events: ["work", "touched tree", "pizza",
            "running", "television"],
   squirrel: false},
  {events: ["work", "ice cream", "cauliflower",
            "lasagna", "touched tree", "brushed teeth"],
   squirrel: false},
  {events: ["weekend", "cycling", "break",
            "peanuts", "beer"],
   squirrel: true},
  /* and so on... */
];
```

== Mutability ==

We will get to actual programming _real_ soon now. But first, there's
one last piece of theory to understand.

We've seen that object values can be modified. The types of values discussed in earlier
chapters, such as numbers, strings, and Booleans, are all
__immutable__—it is impossible to change an existing value of those
types. You can combine them and derive new values from them, but when
you take a specific string value, that value will always remain the
same. The text inside it cannot be changed. If you have reference to a
string that contains `"cat"`, it is not possible for other code to
change a character in _that_ string to make it spell `"rat"`.

With objects, on the other hand, the content of a value _can_ be
modified by changing its properties.

When we have two numbers, 120 and 120, we can consider them precisely the same number,
whether or not they refer to the same physical bits. But with objects,
there is a difference between having two references to the same object
and having two different objects that contain the same properties.
Consider the following code:

```
var object1 = {value: 10};
var object2 = object1;
var object3 = {value: 10};

console.log(object1 == object2);
// → true
console.log(object1 == object3);
// → false

object1.value = 15;
console.log(object2.value);
// → 15
console.log(object3.value);
// → 10
```

(((tentacle (analogy))))(((variable,model of)))The `object1` and
`object2` variables grasp the _same_ object, which is why changing
`object1` also changes the value of `object2`. The variable `object3`
points to a different object, which initially contains the same
properties as `object1` but lives a separate life.

(((== operator)))(((comparison,of objects)))(((deep
comparison)))JavaScript's `==` operator, when comparing objects, will
return `true` only if both objects are precisely the same value.
Comparing different objects will return `false`, even if they have
identical contents. There is no “deep” comparison operation built into
JavaScript, which looks at object's contents, but it is possible to
write it yourself (which will be one of the
link:04_data.html#exercise_deep_compare[exercises] at the end of this
chapter).

== The lycanthrope's log ==

(((weresquirrel example)))(((lycanthropy)))(((addEntry function)))So
Jacques starts up his JavaScript interpreter and sets up the
environment he needs to keep his ((journal)).

// include_code

```
var journal = [];

function addEntry(events, didITurnIntoASquirrel) {
  journal.push({
    events: events,
    squirrel: didITurnIntoASquirrel
  });
}
```

And then, every evening at ten—or sometimes the next morning, after
climbing down from the top shelf of his bookcase—he records the day.

```
addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna",
          "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts",
          "beer"], true);
```

Once he has enough data points, he intends to compute the
((correlation)) between his squirrelification and each of the day's
events and ideally learn something useful from those correlations.

(((correlation)))_Correlation_ is a measure of ((dependence)) between
((variable))s (“variables” in the statistical sense, not the
JavaScript sense). It is usually expressed as a coefficient that
ranges from -1 to 1. Zero correlation means the variables are not
related, whereas a correlation of one indicates that the two are
perfectly related—if you know one, you also know the other. Negative
one also means that the variables are perfectly related but that they
are opposites—when one is true, the other is false.

(((phi coefficient)))For binary (Boolean) variables, the _phi_
coefficient (_ϕ_) provides a good measure of correlation and is
relatively easy to compute. To compute _ϕ_, we need a ((table)) _n_
that contains the number of times the various combinations of the two
variables were observed. For example, we could take the event of
eating ((pizza)) and put that in a table like this:

image::img/pizza-squirrel.svg[alt="Eating pizza versus turning into a squirrel",width="7cm"]

_ϕ_ can be computed using the following formula, where _n_ refers to the table:

ifdef::html_target[]

++++
<div>
<style scoped="scoped">sub { font-size: 60%; }</style>
<table style="border-collapse: collapse; margin-left: 1em;"><tr>
  <td style="vertical-align: middle"><em>ϕ</em> =</td>
  <td style="padding-left: .5em">
    <div style="border-bottom: 1px solid black; padding: 0 7px;">n<sub>11</sub>n<sub>00</sub> - n<sub>10</sub>n<sub>01</sub></div>
    <div style="padding: 0 7px;">√<span style="border-top: 1px solid black; position: relative; top: 2px;">
      <span style="position: relative; top: -4px">n<sub>1•</sub>n<sub>0•</sub>n<sub>•1</sub>n<sub>•0</sub></span>
    </span></div>
  </td>
</tr></table>
</div>
++++

endif::html_target[]

ifdef::tex_target[]

pass:[\begin{equation}\varphi = \frac{n_{11}n_{00}-n_{10}n_{01}}{\sqrt{n_{1\bullet}n_{0\bullet}n_{\bullet1}n_{\bullet0}}}\end{equation}]

endif::tex_target[]

The notation (!html _n_~01~!)(!tex pass:[$n_{01}$]!) indicates the
number of measurements where the first variable (squirrelness) is false
(0) and the second variable (pizza) is true (1). In this
example, (!html _n_~01~!)(!tex pass:[$n_{01}$]!) is 9.

The value (!html _n_~1•~!)(!tex pass:[$n_{1\bullet}$]!) refers to the
sum of all measurements where the first variable is true, which is 5
in the example table. Likewise, (!html _n_~•0~!)(!tex pass:[$n_{\bullet0}$]!)
refers to the sum of the measurements where the second variable is false.

(((correlation)))(((phi coefficient)))So for the pizza table, the part
above the division line (the dividend) would be 1×76 - 4×9 = 40, and
the part below it (the divisor) would be the square root of
5×85×10×80, or (!html √340000!)(!tex pass:[$\sqrt{340000}$]!). This
comes out to _ϕ_ ≈ 0.069, which is tiny. Eating ((pizza)) does not
appear to have influence on the transformations.

== Computing correlation ==

(((array,as table)))(((nesting,of arrays)))We can represent a
two-by-two ((table)) in JavaScript with a four-element array (`[76, 9,
4, 1]`). We could also use other representations, such as an array
containing two two-element arrays (`[[76, 9], [4, 1]]`) or an object
with property names like `"11"` and `"01"`, but the flat array is
simple and makes the expressions that access the table pleasantly
short. We'll interpret the indices to the array as two-((bit))
((binary number)), where the leftmost (most significant) digit refers
to the squirrel variable and the rightmost (least significant) digit
refers to the event variable. For example, the binary number `10`
refers to the case where Jacques did turn into a squirrel, but the
event (say, "pizza") didn't occur. This happened four times. And since
binary `10` is 2 in decimal notation, we will store this number at
index 2 of the array.

(((phi coefficient)))(((phi function)))This is the function that
computes the _ϕ_ coefficient from such an array:

// test: clip
// include_code strip_log

```
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

console.log(phi([76, 9, 4, 1]));
// → 0.068599434
```

(((square root)))(((Math.sqrt function)))This is simply a direct
translation of the _ϕ_ formula into JavaScript. `Math.sqrt` is the
square root function, as provided by the `Math` object in a standard
JavaScript environment. We have to sum two fields from the table to
get fields like (!html n~1•~!)(!tex pass:[$n_{1\bullet}$]!) because
the sums of rows or columns are not stored directly in our data
structure.

(((JOURNAL data set)))Jacques kept his journal for three months. The
resulting ((data set)) is available in the coding sandbox for this
chapter(!book (http://eloquentjavascript.net/code#4[_eloquentjavascript.net/code#4_])!),
where it is stored in the `JOURNAL` variable, and in a downloadable
http://eloquentjavascript.net/code/jacques_journal.js[file].

(((tableFor function)))(((hasEvent function)))To extract a two-by-two
((table)) for a specific event from this journal, we must loop over
all the entries and tally up how many times the event occurs in
relation to squirrel transformations.

// include_code strip_log

```
function hasEvent(event, entry) {
  return entry.events.indexOf(event) != -1;
}

function tableFor(event, journal) {
  var table = [0, 0, 0, 0];
  for (var i = 0; i < journal.length; i++) {
    var entry = journal[i], index = 0;
    if (hasEvent(event, entry)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

console.log(tableFor("pizza", JOURNAL));
// → [76, 9, 4, 1]
```

(((array,searching)))(((indexOf method)))The `hasEvent` function tests
whether an entry contains a given event. Arrays have an `indexOf`
method that tries to find a given value (in this case, the event name)
in the array and returns the index at which it was found or -1 if it
wasn't found. So if the call to `indexOf` doesn't return -1, then we
know the event was found in the entry.

(((array,indexing)))The body of the loop in `tableFor` figures
out which box in the table each journal entry falls into by checking
whether the entry contains the specific event it's interested in and
whether the event happens alongside a squirrel incident. The loop then
adds one to the number in the array that corresponds to this box on
the table.

We now have the tools we need to compute individual ((correlation))s.
The only step remaining is to find a correlation for every type of
event that was recorded and see whether anything stands out. But how
should we store these correlations once we compute them?

== Objects as maps ==

(((weresquirrel example)))(((array)))One possible way is to store
all the ((correlation))s in an array, using objects with `name` and
`value` properties. But that makes looking up the correlation for a
given event somewhat cumbersome: you'd have to loop over the whole
array to find the object with the right `name`. We could wrap this
lookup process in a function, but we would still be writing more code,
and the computer would be doing more work than necessary.

[[object_map]]
(((object)))(((square brackets)))(((object,as map)))(((in
operator)))A better way is to use object properties named after the
event types. We can use the square bracket access notation to create
and read the properties and can use the `in` operator to test whether
a given property exists.

```
var map = {};
function storePhi(event, phi) {
  map[event] = phi;
}

storePhi("pizza", 0.069);
storePhi("touched tree", -0.081);
console.log("pizza" in map);
// → true
console.log(map["touched tree"]);
// → -0.081
```

(((data structure)))A _((map))_ is a way to go from values in one
domain (in this case, event names) to corresponding values in another
domain (in this case, _ϕ_ coefficients).

There are a few potential problems with using objects like this, which
we will discuss in link:06_object.html#prototypes[Chapter 6], but for
the time being, we won't worry about those.

(((for/in loop)))(((for loop)))(((object,looping over)))What if
we want to find all the events for which we have stored a coefficient?
The properties don't form a predictable series, like they would in an
array, so we cannot use a normal `for` loop. JavaScript provides a
loop construct specifically for going over the properties of an
object. It looks a little like a normal `for` loop but distinguishes
itself by the use of the word `in`.

```
for (var event in map)
  console.log("The correlation for '" + event +
              "' is " + map[event]);
// → The correlation for 'pizza' is 0.069
// → The correlation for 'touched tree' is -0.081
```

[[analysis]]
== The final analysis ==

(((journal)))(((weresquirrel example)))(((gatherCorrelations
function)))To find all the types of events that are present in the
data set, we simply process each entry in turn and then loop over the
events in that entry. We keep an object `phis` that has correlation
coefficients for all the event types we have seen so far. Whenever we
run across a type that isn't in the `phis` object yet, we compute its
correlation and add it to the object.

// test: clip
// include_code strip_log

```
function gatherCorrelations(journal) {
  var phis = {};
  for (var entry = 0; entry < journal.length; entry++) {
    var events = journal[entry].events;
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    }
  }
  return phis;
}

var correlations = gatherCorrelations(JOURNAL);
console.log(correlations.pizza);
// → 0.068599434
```

(((correlation)))Let's see what came out.

// test: no

```
for (var event in correlations)
  console.log(event + ": " + correlations[event]);
// → carrot:   0.0140970969
// → exercise: 0.0685994341
// → weekend:  0.1371988681
// → bread:   -0.0757554019
// → pudding: -0.0648203724
// and so on...
```

(((for/in loop)))Most correlations seem to lie close to zero. Eating
carrots, bread, or pudding apparently does not trigger
squirrel-lycanthropy. It _does_ seem to occur somewhat more often on
weekends, however. Let's filter the results to show only correlations
greater than 0.1 or less than -0.1.

// start_code
// test: no

```
for (var event in correlations) {
  var correlation = correlations[event];
  if (correlation > 0.1 || correlation < -0.1)
    console.log(event + ": " + correlation);
}
// → weekend:        0.1371988681
// → brushed teeth: -0.3805211953
// → candy:          0.1296407447
// → work:          -0.1371988681
// → spaghetti:      0.2425356250
// → reading:        0.1106828054
// → peanuts:        0.5902679812
```

A-ha! There are two factors whose ((correlation)) is clearly stronger
than the others. Eating ((peanuts)) has a strong positive effect on
the chance of turning into a squirrel, whereas brushing his teeth has
a significant negative effect.

Interesting. Let's try something.

// include_code strip_log

```
for (var i = 0; i < JOURNAL.length; i++) {
  var entry = JOURNAL[i];
  if (hasEvent("peanuts", entry) &&
     !hasEvent("brushed teeth", entry))
    entry.events.push("peanut teeth");
}
console.log(phi(tableFor("peanut teeth", JOURNAL)));
// → 1
```

Well, that's unmistakable! The phenomenon occurs precisely when
Jacques eats ((peanuts)) and fails to brush his teeth. If only he
weren't such a slob about dental hygiene, he'd have never even noticed
his affliction.

Knowing this, Jacques simply stops eating peanuts altogether and finds
that this completely puts an end to his transformations.

(((weresquirrel example)))All is well with Jacques for a while. But a
few years later, he loses his ((job)) and is eventually forced to take
employment with a ((circus)), where he performs as _The Incredible
Squirrelman_ by stuffing his mouth with peanut butter before every
show. One day, fed up with this pitiful existence, Jacques fails to
change back into his human form, hops through a crack in the circus
tent, and vanishes into the forest. He is never seen again.

== Further arrayology ==

(((array,methods)))(((method)))Before finishing up this chapter,
I want to introduce you to a few more object-related concepts. We'll
start by introducing some generally useful array methods.

(((push method)))(((pop method)))(((shift method)))(((unshift
method)))We saw `push` and `pop`, which add and remove elements at the
end of an array, link:04_data.html#array_methods[earlier] in this
chapter. The corresponding methods for adding and removing things at
the start of an array are called `unshift` and `shift`.

```
var todoList = [];
function rememberTo(task) {
  todoList.push(task);
}
function whatIsNext() {
  return todoList.shift();
}
function urgentlyRememberTo(task) {
  todoList.unshift(task);
}
```

(((task management example)))The previous program manages lists of
tasks. You add tasks to the end of the list by calling
`rememberTo("eat")`, and when you're ready to do something, you call
`whatIsNext()` to get (and remove) the front item from the list. The
`urgentlyRememberTo` function also adds a task but adds it to the
front instead of the back of the list.

(((array,searching)))(((indexOf method)))(((lastIndexOf
method)))The `indexOf` method has a sibling called `lastIndexOf`,
which starts searching for the given element at the end of the array
instead of the front.

```
console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3
```

Both `indexOf` and `lastIndexOf` take an optional second argument that
indicates where to start searching from.

(((slice method)))(((array,indexing)))Another fundamental method
is `slice`, which takes a start index and an end index and returns an
array that has only the elements between those indices. The start
index is inclusive, the end index exclusive.

```
console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]
```

(((string,indexing)))When the end index is not given, `slice`
will take all of the elements after the start index. Strings also have
a `slice` method, which has a similar effect.

(((concatenation)))(((concat method)))The `concat` method can be used
to glue arrays together, similar to what the `+` operator does for
strings. The following example shows both `concat` and `slice` in
action. It takes an array and an index, and it returns a new array
that is a copy of the original array with the element at the given
index removed.

```
function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]
```

== Strings and their properties ==

(((string,properties)))We can read properties like `length` and
`toUpperCase` from string values. But if you try to add a new
property, it doesn't stick.

```
var myString = "Fido";
myString.myProperty = "value";
console.log(myString.myProperty);
// → undefined
```

Values of type string, number, and Boolean are not objects, and though
the language doesn't complain if you try to set new properties on
them, it doesn't actually store those properties. The values are
immutable and cannot be changed.

(((string,methods)))(((slice method)))(((indexOf
method)))(((string,searching)))But these types do have some built-in
properties. Every string value has a number of methods. The most
useful ones are probably `slice` and `indexOf`, which resemble the
array methods of the same name.

```
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5
```

One difference is that a string's `indexOf` can take a string
containing more than one character, whereas the corresponding array
method looks only for a single element.

```
console.log("one two three".indexOf("ee"));
// → 11
```

(((whitespace)))(((trim method)))The `trim` method removes whitespace
(spaces, newlines, tabs, and similar characters) from the start and
end of a string.

```
console.log("  okay \n ".trim());
// → okay
```

(((length property,for string)))(((charAt
method)))(((string,indexing)))We have already seen the string type's
`length` property. Accessing the individual characters in a string can
be done with the `charAt` method but also by simply reading numeric
properties, like you'd do for an array.

```
var string = "abc";
console.log(string.length);
// → 3
console.log(string.charAt(0));
// → a
console.log(string[1]);
// → b
```

[[arguments_object]]
== The arguments object ==

(((arguments object)))(((length
property)))(((parameter)))(((optional argument)))(((array-like
object)))Whenever a function is called, a special variable named
`arguments` is added to the environment in which the function body
runs. This variable refers to an object that holds all of the
arguments passed to the function. Remember that in JavaScript you are
allowed to pass more (or fewer) arguments to a function than the
number of parameters the function itself declares.

```
function noArguments() {}
noArguments(1, 2, 3); // This is okay
function threeArguments(a, b, c) {}
threeArguments(); // And so is this
```

(((length property)))The `arguments` object has a `length` property
that tells us the number of arguments that were really passed to the
function. It also has a property for each argument, named 0, 1, 2, and
so on.

indexsee:[pseudo array,array-like object]
(((array,methods)))If that sounds a lot like an array to you,
you're right, it _is_ a lot like an array. But this object,
unfortunately, does not have any array methods (like `slice` or
`indexOf`), so it is a little harder to use than a real array.

```
function argumentCounter() {
  console.log("You gave me", arguments.length, "arguments.");
}
argumentCounter("Straw man", "Tautology", "Ad hominem");
// → You gave me 3 arguments.
```

(((journal)))(((console.log)))(((variadic function)))Some functions
can take any number of arguments, like `console.log`. These typically
loop over the values in their `arguments` object. They can be used to
create very pleasant interfaces. For example, remember how we created
the entries to Jacques’ journal.

```
addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
```

Since he is going to be calling this function a lot, we could create
an alternative that is easier to call.

```
function addEntry(squirrel) {
  var entry = {events: [], squirrel: squirrel};
  for (var i = 1; i < arguments.length; i++)
    entry.events.push(arguments[i]);
  journal.push(entry);
}
addEntry(true, "work", "touched tree", "pizza",
         "running", "television");
```

(((arguments object,indexing)))This version reads its first argument
(`squirrel`) in the normal way and then goes over the rest of the
arguments (the loop starts at index 1, skipping the first) to gather
them into an array.

== The Math object ==

(((Math object)))(((Math.min function)))(((Math.max
function)))(((Math.sqrt function)))(((minimum)))(((maximum)))(((square
root)))As we've seen, `Math` is a grab-bag of number-related utility
functions, such as `Math.max` (maximum), `Math.min` (minimum), and
`Math.sqrt` (square root).

[[namespace_pollution]]
(((namespace)))(((namespace pollution)))(((object)))The
`Math` object is used simply as a container to group a bunch of
related functionality. There is only one `Math` object, and it is
almost never useful as a value. Rather, it provides a _namespace_ so
that all these functions and values do not have to be global
variables.

(((variable,naming)))Having too many global variables “pollutes” the
namespace. The more names that have been taken, the more likely you
are to accidentally overwrite the value of some variable. For example,
it's not unlikely that you'll want to name something `max` in one of
your programs. Since JavaScript's built-in `max` function is tucked
safely inside the `Math` object, we don't have to worry about
overwriting it.

Many languages will stop you, or at least warn you, when you are
defining a variable with a name that is already taken. JavaScript does
neither, so be careful.

(((Math.cos function)))(((Math.sin function)))(((Math.tan
function)))(((Math.acos function)))(((Math.asin
function)))(((Math.atan function)))(((Math.PI
constant)))(((cosine)))(((sine)))(((tangent)))(((PI constant)))(((pi)))Back to
the `Math` object. If you need to do ((trigonometry)), `Math` can
help. It contains `cos` (cosine), `sin` (sine), and `tan` (tangent),
as well as their inverse functions, `acos`, `asin`, and `atan`, respectively. The
number π (pi)—or at least the closest approximation that fits in a
JavaScript number—is available as `Math.PI`. (There is an old
programming tradition of writing the names of ((constant)) values in
all caps.)

// test: no

```
function randomPointOnCircle(radius) {
  var angle = Math.random() * 2 * Math.PI;
  return {x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));
// → {x: 0.3667, y: 1.966}
```

If sines and cosines are not something you are very familiar with,
don't worry. When they are used in this book, in
link:13_dom.html#sin_cos[Chapter 13], I'll explain them.

(((Math.random function)))(((random number)))The previous example
uses `Math.random`. This is a function that returns a new
pseudorandom number between zero (inclusive) and one (exclusive)
every time you call it.

// test: no

```
console.log(Math.random());
// → 0.36993729369714856
console.log(Math.random());
// → 0.727367032552138
console.log(Math.random());
// → 0.40180766698904335
```

(((pseudorandom number)))(((random number)))Though computers are
deterministic machines—they always react the same way if given the
same input—it is possible to have them produce numbers that appear
random. To do this, the machine keeps a number (or a bunch of numbers)
in its internal state. Then, every time a random number is requested,
it performs some complicated deterministic computations on this
internal state and returns part of the result of those computations.
The machine also uses the outcome to change its own internal state so
that the next “random” number produced will be different.

(((rounding)))(((Math.floor function)))If we want a whole random
number instead of a fractional one, we can use `Math.floor` (which
rounds down to the nearest whole number) on the result of
`Math.random`.

// test: no

```
console.log(Math.floor(Math.random() * 10));
// → 2
```

Multiplying the random number by 10 gives us a number greater than or
equal to zero, and below 10. Since `Math.floor` rounds down, this
expression will produce, with equal chance, any number from 0 through
9.

(((Math.ceil function)))(((Math.round function)))There are also the
functions `Math.ceil` (for “ceiling”, which rounds up to a whole
number) and `Math.round` (to the nearest whole number).

== The global object ==

(((global object)))(((window variable)))(((global
scope)))(((scope)))(((object)))The global scope, the space in which
global variables live, can also be approached as an object in
JavaScript. Each global variable is present as a ((property)) of this
object. In ((browser))s, the global scope object is stored in the
`window` variable.

// test: no

```
var myVar = 10;
console.log("myVar" in window);
// → true
console.log(window.myVar);
// → 10
```

== Summary ==

Objects and arrays (which are a specific kind of object) provide ways
to group several values into a single value. Conceptually, this allows
us to put a bunch of related things in a bag and run around with the
bag, instead of trying to wrap our arms around all of the individual
things and trying to hold on to them separately.

Most values in JavaScript have properties, the exceptions being `null`
and `undefined`. Properties are accessed using `value.propName` or
`value["propName"]`. Objects tend to use names for their properties
and store more or less a fixed set of them. Arrays, on the other hand,
usually contain varying numbers of conceptually identical values and
use numbers (starting from 0) as the names of their properties.

There _are_ some named properties in arrays, such as `length` and a
number of methods. Methods are functions that live in properties and
(usually) act on the value they are a property of.

Objects can also serve as maps, associating values with names. The `in`
operator can be used to find out whether an object contains a property with
a given name. The same keyword can also be used in a `for` loop
(`for (var name in object)`) to loop over an object's properties.

== Exercises ==

=== The sum of a range ===

(((summing (exercise))))The link:00_intro.html#intro[introduction] of this book alluded to the
following as a nice way to compute the sum of a range of numbers:

// test: no

```
console.log(sum(range(1, 10)));
```

(((range function)))(((sum function)))Write a `range` function that
takes two arguments, `start` and `end`, and returns an array
containing all the numbers from `start` up to (and including) `end`.

Next, write a `sum` function that takes an array of numbers and
returns the sum of these numbers. Run the previous program and see
whether it does indeed return 55.

(((optional argument)))As a bonus assignment, modify your `range`
function to take an optional third argument that indicates the “step”
value used to build up the array. If no step is given, the array
elements go up by increments of one, corresponding to the old
behavior. The function call `range(1, 10, 2)` should return `[1, 3, 5,
7, 9]`. Make sure it also works with negative step values so that
`range(5, 2, -1)` produces `[5, 4, 3, 2]`.

ifdef::interactive_target[]

// test: no

```
// Your code here.

console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(sum(range(1, 10)));
// → 55
```
endif::interactive_target[]

!!hint!!

(((summing (exercise))))(((array,creation)))(((square
brackets)))Building up an array is most easily done by first
initializing a variable to `[]` (a fresh, empty array) and repeatedly
calling its `push` method to add a value. Don't forget to return the
array at the end of the function.

(((array,indexing)))(((comparison)))Since the end boundary is
inclusive, you'll need to use the `<=` operator rather than simply `<`
to check for the end of your loop.

(((arguments object)))To check whether the optional step argument was
given, either check `arguments.length` or compare the value of the
argument to `undefined`. If it wasn't given, simply set it to its
((default value)) (1) at the top of the function.

(((range function)))(((for loop)))Having `range` understand negative
step values is probably best done by writing two separate loops—one
for counting up and one for counting down—because the comparison that
checks whether the loop is finished needs to be `>=` rather than `<=`
when counting downward.

It might also be worthwhile to use a different default step, namely,
-1, when the end of the range is smaller than the start. That way,
`range(5, 2)` returns something meaningful, rather than getting stuck
in an ((infinite loop)).

!!hint!!

=== Reversing an array ===

(((reversing (exercise))))(((reverse
method)))(((array,methods)))Arrays have a method `reverse`, which
changes the array by inverting the order in which its elements appear.
For this exercise, write two functions, `reverseArray` and
`reverseArrayInPlace`. The first, `reverseArray`, takes an array as
argument and produces a _new_ array that has the same elements in the
inverse order. The second, `reverseArrayInPlace`, does what the
`reverse` method does: it modifies the array given as argument in
order to reverse its elements. Neither may use the standard
`reverse` method.

(((efficiency)))(((pure function)))(((side effect)))Thinking back to
the notes about side effects and pure functions in the
link:03_functions.html#pure[previous chapter], which variant do you
expect to be useful in more situations? Which one is more efficient?

ifdef::interactive_target[]

// test: no

```
// Your code here.

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
```
endif::interactive_target[]

!!hint!!

(((reversing (exercise))))There are two obvious ways to implement
`reverseArray`. The first is to simply go over the input array from
front to back and use the `unshift` method on the new array to insert
each element at its start. The second is to loop over the input array
backward and use the `push` method. Iterating over an array backward
requires a (somewhat awkward) `for` specification like `(var i =
array.length - 1; i >= 0; i--)`.

Reversing the array in place is harder. You have to be careful not to
overwrite elements that you will later need. Using `reverseArray` or
otherwise copying the whole array (`array.slice(0)` is a good way to
copy an array) works but is cheating.

The trick is to _swap_ the first and last elements, then the
second and second-to-last, and so on. You can do this by looping
over half the length of the array (use `Math.floor` to round down—you
don't need to touch the middle element in an array with an odd
length) and swapping the element at position `i` with the one at
position `array.length - 1 - i`. You can use a local variable to
briefly hold on to one of the elements, overwrite that one with its
mirror image, and then put the value from the local variable in the
place where the mirror image used to be.

!!hint!!

[[list]]
=== A list ===

(((data structure)))(((list (exercise))))(((linked
list)))(((object)))(((array)))(((collection)))Objects, as generic
blobs of values, can be used to build all sorts of data structures. A
common data structure is the _list_ (not to be confused with the
array). A list is a nested set of objects, with the first object
holding a reference to the second, the second to the third, and so on.

// include_code

```
var list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};
```

The resulting objects form a chain, like this:

image::img/linked-list.svg[alt="A linked list",width="6cm"]

(((structure sharing)))(((memory)))A nice thing about lists is that
they can share parts of their structure. For example, if I create two
new values `{value: 0, rest: list}` and `{value: -1, rest: list}`
(with `list` referring to the variable defined earlier), they are both
independent lists, but they share the structure that makes up their
last three elements. In addition, the original list is also still a
valid three-element list.

Write a function `arrayToList` that builds up a data structure like
the previous one when given `[1, 2, 3]` as argument, and write a
`listToArray` function that produces an array from a list. Also write
the helper functions `prepend`, which takes an element and a list and
creates a new list that adds the element to the front of the input
list, and `nth`, which takes a list and a number and returns the
element at the given position in the list, or `undefined` when there
is no such element.

(((recursion)))If you haven't already, also write a recursive version
of `nth`.

ifdef::interactive_target[]

// test: no

```
// Your code here.

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
```
endif::interactive_target[]

!!hint!!

(((list (exercise))))(((linked list)))Building up a list is best done
back to front. So `arrayToList` could iterate over the array backward
(see previous exercise) and, for each element, add an object to the
list. You can use a local variable to hold the part of the list that
was built so far and use a pattern like `list = {value: X, rest:
list}` to add an element.

(((for loop)))To run over a list (in `listToArray` and `nth`), a `for`
loop specification like this can be used:

```
for (var node = list; node; node = node.rest) {}
```

Can you see how that works? Every iteration of the loop, `node` points
to the current sublist, and the body can read its `value` property to
get the current element. At the end of an iteration, `node` moves to
the next sublist. When that is null, we have reached the end of the
list and the loop is finished.

(((recursion)))The recursive version of `nth` will, similarly, look at
an ever smaller part of the “tail” of the list and at the same time
count down the index until it reaches zero, at which point it can
return the `value` property of the node it is looking at. To get the
zeroeth element of a list, you simply take the `value` property of its
head node. To get element _N_ + 1, you take the __N__th element of the
list that's in this list's `rest` property.

!!hint!!

[[exercise_deep_compare]]
=== Deep comparison ===

(((deep comparison (exercise))))(((comparison)))(((deep
comparison)))(((== operator)))The `==` operator compares objects by
identity. But sometimes, you would prefer to compare the values of
their actual properties.

Write a function, `deepEqual`, that takes two values and returns true
only if they are the same value or are objects with the same
properties whose values are also equal when compared with a recursive
call to `deepEqual`.

(((null)))(((=== operator)))(((typeof operator)))To find out whether
to compare two things by identity (use the `===` operator for that) or
by looking at their properties, you can use the `typeof` operator. If
it produces `"object"` for both values, you should do a deep
comparison. But you have to take one silly exception into account: by
a historical accident, `typeof null` also produces `"object"`.

ifdef::interactive_target[]

// test: no

```
// Your code here.

var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
```
endif::interactive_target[]

!!hint!!

(((deep comparison (exercise))))(((typeof operator)))(((object)))(((=== operator)))Your test for whether you are dealing with a
real object will look something like `typeof x == "object" && x !=
null`. Be careful to compare properties only when _both_ arguments are
objects. In all other cases you can just immediately return the result
of applying `===`.

(((for/in loop)))(((in operator)))Use a `for`/`in` loop to go over the
properties. You need to test whether both objects have the same set of
property names and whether those properties have identical values. The
first test can be done by counting the properties in both objects and
returning false if the numbers of properties are different. If they're
the same, then go over the properties of one object, and for each of
them, verify that the other object also has the property. The values
of the properties are compared by a recursive call to `deepEqual`.

(((return value)))Returning the correct value from the function is
best done by immediately returning false when a mismatch is noticed
and returning true at the end of the function.

!!hint!!