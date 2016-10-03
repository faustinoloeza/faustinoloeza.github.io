# La Vida Secreta de los Objetos

>El problema con los lenguajes orientados a objetos es que tienen todos un medio implícito que llevan consigo. Tu quieres un plátano pero eres un gorila con un plátano y la jungla entera.
>Joe Armstrong, entrevistado en Coders at Work

Cuando un programador dice ˝objeto˝, este es un término amplio. En mi profesión, los objetos son una forma de vida, tema de guerras sagradas y una amada palabra llamativa que todavía no ha perdido su gran poder.

Para alguien ajeno, esto es probablemente un poco confuso. Empecemos con una introducción a la _historia_ de los objetos como una forma de programación.

### Historia

Esta historia, como la mayor parte de las historias de programación, comienza con el problema de la _complejidad_. Una filosofía es que la complejidad puede ser manejable separándola en pequeñas partes, que son aisladas unas de otras. Estas partes han terminado con el nombre de _objetos_.

Un objeto es una cápsula opaca que oculta una sofisticada complejidad en su interior y en su lugar nos ofrece unos pocos reguladores y conectores (como por ejemplo _método_s) que presentan una _interfaz_ a través de la cual el objeto es usado.
La idea es que la la interfaz es relativamente simple y todas las cosas complejas que van _dentro_ del objeto pueden ser ignoradas cuando trabajamos con el.

![alt="Una interfaz simple puede ocultar gran complejidad."](img/object.jpg)

Como ejemplo, puedes imaginarte un objeto que te dé una interfaz para un área de la pantalla. Te da una forma de dibujar formas o texto en esta área pero oculta los detalles de como esas formas son convertidas a los pixeles que decoran la pantalla actualmete. Puedes tener un conjunto de métodos-por ejemplo `dibujarCirculo`-y estos
son lo único que necesitas para usar un objeto.

Estas ideas fueron puestas en marcha en los 70, los 80 y los 90, fueron acompañadas por un gran _bombo_-la revolución de la programación orientada a objetos.
Inmediatamente había un grupo de gente declarando que los objetos eran el camino _correcto_ a la programación-y que no incluir objetos era un sin sentido, estaba obsoleto.

Este tipo de fanatismo siempre produce mucha estupidez no práctica y ha habido una pequeña contra revolución después de esto. Actualmente en algunos círculos, los objetos tienen una reputación bastante mala.

Yo prefiero abordar el tema desde la práctica, en lugar de desde la ideología. Hay varios conceptos útiles, más importantes que la _encapsulación_ (distinguir entre la complejidad interna y externa de la interfaz), que la cultura de la programación orientada a objetos a popularizado. Estos son dignos de estudio.

En este capítulo se describen de forma excéntrica los objetos y las técnicas clásicas sobre como se relacionan entre sí los objetos en JavaScript.

### Métodos

Los métodos son propiedades simples que contienen funciones como valores. Este es un método simple:

```
var conejo = {};
conejo.hablar = function(linea) {
  console.log("El conejo dice '" + linea + "'");
};

conejo.hablar("Estoy vivo.");
// → El conejo dice 'Estoy vivo.'
```

Normalmente el método necesita hacer algo con el objeto desde el que se le ha llamado. Cuando una función es llamada como método-se busca como propiedad y es inmediatamente llamada, como en `objeto.metodo()`—la variable especial `this` esta en su cuerpo y apuntará al objeto que la ha llamado.


```
function hablar(linea) {
  console.log("El conejo " + this.tipo + " dice '" +
              line + "'");
}
var conejoBlanco = {tipo: "blanco", hablar: hablar};
var conejoGordo = {tipo: "gordo", hablar: hablar};

conejoBlanco.hablar("¡Por mis orejas y los pelos de mi " +
                  "bigote, que tarde se está haciendo!");
// → El conejo blanco dice '¡Por mis orejas y los pelos'
//   de mi bigote, que tarde se está haciendo!'
conejoGordo.hablar("Puedes estar seguro de que me comería +"
                  "una zanahoria.");
// → El conejo gordo dice 'Puedes estar seguro de que
//   me comería una zanahoria.'
```

El código usa la palabra clave `this` para la salida del tipo de conejo que está hablando. Se puede rellamar con los métodos `apply` y `bind`, ambos toman un primer argumento que puede ser utilizado para simular llamadas al método. El primer argumento es de echo utilizado para dar valor a `this`.

Hay un método similar a `apply`, llamado `call`. Este llama a la función que es un método, pero toma sus argumentos normalmente, en lugar de con un array. Como `apply` y `bind`, `call` puede pasar un valor específico de `this`.

```
hablar.apply(conejoGordo, ["¡Burp!"]);
// → El conejo gordo dice '¡Burp!'
hablar.call({tipo: "viejo"}, "¡Oh!, ¡Ah!");
// → El conejo viejo dice '¡Oh!, ¡Ah!'
```


### Prototipos 

(Fíjate detenidamente).

```
var vacio = {};
console.log(vacio.toString);
// → function toString(){…}
console.log(vacio.toString());
// → [object Object]
```

Acabo de extraer una propiedad de un objeto vacío. ¡Magia!

Bien, no realmente. Simplemente he omitido información acerca de como los Objetos funcionan en JavaScript. Además de sus propiedades, casi todos los objetos además tienen un _prototipo_.
Un _prototipo_ es otro objeto que es usado como alternativa fuente de propiedades. Cuando un objeto tiene una llamada a una propiedad que no posee, se buscará en su prototipo, después en el prototipo de su prototipo y así sucesivamente.

Entonces, ¿Cual es el _prototipo_ de este objeto vacío? Es el genial prototipo ancestral, la entidad detrás de casi todos los objetos, `Object.prototype`.

```
console.log(Object.getPrototypeOf({}) ==
            Object.prototype);
// → true
console.log(Object.getPrototypeOf(Object.prototype));
// → null
```

Como imaginarás la función `Object.getPrototypeOf` devuelve el prototipo de un objeto.

Las relaciones de prototipo en JavaScript tienen forma de _árbol_, y la raíz de esta estructura es `Object.prototype`.
Este provee unos pocos _métodos_ que se mostrarán en casi todos los objetos, como `toString`, que convierte un objeto en una representación en una cadena de texto.

Muchos objetos no tienen directamente `Object.prototype` como su _prototipo_, pero en su lugar tienen otro objeto, que les provee sus propiedades por defecto. Las funciones derivan de `Function.prototype`, y los arrays derivan de `Array.prototype`.

```
console.log(Object.getPrototypeOf(isNaN) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf([]) ==
            Array.prototype);
// → true
```

Como un objeto prototipo tiene su propio prototipo normalmente `Object.prototype`, entonces este indirectamente provee de métodos como `toString`.

La función `Object.getPrototypeOf` obviamente devuelve el prototipo de un objeto. Puedes usar `Object.create` para crear un objeto con un _prototipo_ específico.

```
var protoConejo = {
  hablar: function(linea) {
    console.log("El conejo " + this.type + " dice '" +
                linea + "'");
  }
};
var conejoAsesino = Object.create(protoConejo);
conejoAsesino.type = "asesino";
conejoAsesino.hablar("SKREEEE!");
// → El conejo asesino dice 'SKREEEE!'
```

El “proto” conejo actúa como container para las propiedades que son compartidas por todos los conejos. Un objeto conejo individual, como el conejo asesino, contiene propiedades que se aplican únicamente a sí mismo, en este caso su tipo y propiedades derivadas de su prototipo.

### Constructores

Una forma más conveniente de crear objetos que deriven su forma de prototipos compartidos es usar un _constructor_. En JavaScript, llamar a una función con la palabra clave `new` delante de ella, hace que sea tratada como un constructor. El constructor tendrá su variable `this` en los límites del objeto creado, y si no se específica otro valor de objeto este será el nuevo objeto que retorne la llamada.

Un objeto creado con `new` se dice que es una  _instancia_ de su constructor.

Tenemos un constructor simple para los conejos. Es una convención capitalizar (poner la primera letra en mayúscula) los nombres de los constructores así son fácilmente distinguidos de otras funciones.

```
function Conejo(tipo) {
  this.tipo = tipo;
}

var conejoAsesino = new Conejo("asesino");
var conejoNegro = new Conejo("negro");
console.log(conejoNegro.tipo);
// → negro
```

Los constructores (de hecho, todas las funciones) automáticamente tienen una propiedad llamada `prototype`, que por defecto contiene un objeto plano, vacío que deriva de `Object.prototype`. Todas las instancias creadas con este constructor tendrán este objeto como su ((prototipo)). Así que para añadir un método `hablar` a los conejos creados con el constructor `Conejo`, simplemente hacemos lo siguiente:

```
Conejo.prototype.hablar = function(linea) {
  console.log("El conejo " + this.tipo + " dice '" +
              linea + "'");
};
conejoNegro.hablar("Maldición...");
// → El conejo negro dice 'Maldición...'
```

Es importante notar la diferencia entre la forma en que un prototipo es asociado con
un constructor (a través de su propiedad `prototype`) y la forma en la que los objetos _tienen_ un prototipo (que podemos consultar con `Object.getPrototypeOf`). El prototipo actual de un constructor es `Function.prototype` desde que los constructores son funciones. Esta propiedad `prototype` será el prototipo de las instancias creadas a
través de el pero no su _propio_ prototipo.

### Sobre Escribiendo Las Propiedades Derivadas

Cuando añades una _propiedad_ a un objeto, esté presente en el prototipo o no, la propiedad es añadida a _ese_ objeto, que de ahora en adelante tendrá como su propiedad. Si _existe_ una propiedad con el mismo nombre en el prototipo, esta propiedad no afectará más al objeto. El prototipo por si mismo no cambia.

```
Conejo.prototype.dentadura = "pequeña";
console.log(conejoNegro.dentadura);
// → pequeña
conejoAsensino.dentadura = "larga, afilada y sangrienta";
console.log(conejoAsesino.dentadura);
// → larga, afilada y sangrienta
console.log(conejoNegro.dentadura);
// → pequeña
console.log(Conejo.prototype.dentadura);
// → pequeña
```

El siguiente diagrama representa la situación después de ejecutar este código. El `Conejo` y `Objeto` _prototipo_s están detrás de `conejoAsesino` como una especie telón de fondo, donde sus propiedades que no son encontradas en el objeto por si mismo
pueden ser buscadas.

![alt="Esquema de objeto prototipo conejo"](img/rabbits.svg)

Sobre escribir propiedades que existen en un prototipo, es a menudo algo útil que hacer. Como muestra el ejemplo de la dentadura del conejo, esto puede ser usado para expresar propiedades excepcionales en instancias de una clase más genérica de objetos, mientras dejamos los objetos no excepcionales simplemente tomar un valor estándar de su prototipo.

Esto es además usado para dar a los prototipos de función y array un método `toString` diferente del básico prototipo de los objetos.

```
console.log(Array.prototype.toString ==
            Object.prototype.toString);
// → false
console.log([1, 2].toString());
// → 1,2
```

Llamar a `toString` en un array da un resultado similar a `.join(",")`-esto pone comas entre los valores del array. Una llamada directa a `Object.prototype.toString` con un array produce una cadena de texto diferente. Esta función no sabe acerca de arrays, así que simplemente pone la palabra "object" y el nombre del tipo entre corchetes.

```
console.log(Object.prototype.toString.call([1, 2]));
// → [object Array]
```

### Interferencia de prototipos

Un _prototipo_ puede ser usado en cualquier momento para añadir nuevas propiedades y métodos a todos los objetos basados en él. Por ejemplo, puede ser necesario para poner a nuestros conejos a bailar.

```
Conejo.prototype.bailar = function() {
  console.log("El conejo " + this.type + " baila un paso.");
};
conejoAsesino.bailar();
// → El conejo asesino baila un paso.
```

Esto es conveniente. Pero hay situaciones donde esto causa problemas. En capítulos anteriores, hemos usado un objeto como forma de asociar valores con nombres creando propiedades para los nombres y dándoles los correspondientes valores como su valor.
Aquí hay un ejemplo Capitulo 4:

```
var mapa = {};
function guardarPhi(evento, phi) {
  mapa[evento] = phi;
}

guardarPhi("pizza", 0.069);
guardarPhi("árbol tocado", -0.081);
```

Podemos iterar sobre todos los valores de phi en el objeto usando un bucle `for`/`in` y comprobar cuando un nombre esta usando el operador regular `in`. Pero desafortunadamente, el objeto del prototipo continua con su camino.

```
Object.prototype.sinSentido = "hola";
for (var nombre in mapa)
  console.log(nombre);
// → pizza
// → árbol tocado
// → sinSentido
console.log("sinSentido" in mapa);
// → true
console.log("toString" in mapa);
// → true

// Borrar la propiedad problemática
delete Object.prototype.sinSentido;
```

Esta todo mal. No hay evento llamado "sinSentido" en nuestro set de datos. Y _definitivamente_ no hay evento llamado "toString".

Extrañamente, `toString` no se muestra en el bucle `for`/`in`, pero el operador `in` ha retornado true para el. Esto es por que JavaScript distingue entre propiedades _enumerable_ (enumerables) y _nonenumerable_ (no enumerables).

Todas las propiedades que creamos simplemente asignándolas son enumerables. Las propiedades estándar en `Object.prototype` son todas nonenumerable, que es por lo que no se muestran en un bucle como un `for`/`in`.

Es posible definir nuestras propias propiedades nonenumberable usando la función `Object.defineProperty`, esta nos permite controlar el tipo de propiedad que estamos creando.

```
Object.defineProperty(Object.prototype, "ocultarSinSentido",
                      {enumerable: false, value: "hola"});
for (var nombre in mapa)
  console.log(nombre);
// → pizza
// → árbol tocado
console.log(mapa.ocultarSinSentido);
// → hola
```

Entonces ahora la propiedad esta, pero no se muestra en un bucle.
Esto es bueno. Pero seguimos teniendo el problema con el operador regular `in`demandando que las propiedades del `Object.prototype` existen en nuestro objeto. Para esto, podemos usar el método de objeto `hasOwnProperty`.

```
console.log(mapa.hasOwnProperty("toString"));
// → false
```

Este método nos dice cuando el objeto _por si mismo_ tiene la propiedad, sin mirar en sus prototipos. Esto es a menudo una información más útil que la que nos da el operador `in`.

Cuando tu estás preocupado de que algo (algún otro código que has incluido en tu programa) puede tener problemas con el objeto base prototipo, te recomiendo escribir
bucles `for`/`in` como este:

```
for (var nombre in mapa) {
  if (mapa.hasOwnProperty(nombre)) {
    // ... esta es una propiedad propia
  }
}
```

### Objetos sin prototipo

Pero el agujero del conejo no acaba aquí. ¿Qué pasa si alguien registra el nombre
`hasOwnProperty` en nuestro objeto `mapa` y le asigna el valor 42? Ahora la llamada a `mapa.hasOwnProperty` intentará llamar a la propiedad local, que contiene un número, no una función.

En este caso, los prototipos solo continúan su camino y nosotros podemos preferir tener
objetos sin prototipos por ahora. Vemos la función `Object.create`, que nos permite crear un objeto con un prototipo específico. Le puedes pasar `null` como prototipo para crear un objeto vacío sin prototipo.
Para objetos como `map`, donde las propiedades pueden ser cualquiera, esto es exactamente lo que queremos.

```
var mapa = Object.create(null);
mapa["pizza"] = 0.069;
console.log("toString" in mapa);
// → false
console.log("pizza" in mapa);
// → true
```

¡Mucho mejor! Ya no necesitaremos la chapuza de `hasOwnProperty` por que todas las propiedades que el objeto tiene son sus propias propiedades.
Ahora podemos usar de forma segura bucles `for`/`in`, no hay problema con lo que la gente le haya estado haciendo a `Object.prototype`.

### Polimorfismo 

Cuando llamas a la función `String`, que convierte un valor en una cadena, en un objeto, esta llamará al método `toString` cuando el objeto trate de crear una cadena con sentido para retornarla. He mencionado que alguno de los prototipos estándar definen su propia versión de `toString` así que ellos pueden crear cadenas que contengan información más útil que `"[object Object]"`.

Esta es una simple instancia de una poderosa idea. Cuando un trozo de código es escrito para trabajar con objetos que tienen una _interfaz_ concreta -en este caso, un método `toString`- entonces cualquier tipo de objeto que soporte esta interfaz y pueda ser introducido en el código, simplemente funcionará.

Esta técnica es llamada __polimorfismo__-aunque no hay cambio de forma real actualmente involucrado. El código polimórfico puede trabajar con valores de diferentes formas, tantas como sean soportadas por la interfaz.


### Dando estilo a una tabla

Voy a trabajar a través de un ejemplo un poco más complicado en un intento de darte una idea mejor de como se utiliza el _polimorfismo_ y la _programación orientada a objetos_ en general. El proyecto es este: escribiremos un programa que, dado un array de arrays, de _tabla_ celdas, construya una cadena de texto que contenga un genial diseño de tabla-significa que las columnas y las filas están correctamente alineadas. Algo como esto:

```
nombre       altura país
------------ ------ -------------
Kilimanjaro    5895 Tanzania
Everest        8848 Nepal
Mount Fuji     3776 Japan
Mont Blanc     4808 Italy/France
Vaalserberg     323 Netherlands
Denali         6168 United States
Popocatepetl   5465 Mexico
```

La forma en que nuestro sistema de generación de tablas funcionará es que la función generadora preguntará a cada celda cual va a ser su ancho y alto y después usar esa información para determinar la anchura de las columnas y la altura de las filas. La función generadora después pedirá a las celdas que se dibujen a sí mismas con el tamaño correcto y ensamblando los resultados en una sola cadena.

El programa de estilo se comunicará con los objetos celda a través de una interfaz bien definida. De esta forma, los tipos de celda que el programa soporta no estarán fijados. Podremos añadir nuevos tipos de celda más adelante-por ejemplo, celdas subrayadas para la cabecera de la tabla-y si lo soporta nuestra interfaz, simplemente funcionará, sin requerir cambios al programa de diseño.

Esta es la interfaz:

* `minAltura()` devuelve un número indicando la altura mínima que la celda
  requiere (en lineas).

* `minAnchura()` devuelve un número indicando la anchura mínima de esta celda
  en caracteres).

* `dibujar(anchura, altura)` devuelve un array de tamaño
  `altura`, que contiene una serie de cadenas que son cada `anchura` en caracteres.
  Esto representa el contenido de la celda.

Voy a hacer uso intensivo de métodos de orden superior en arrays en este ejemplo, ya que se presta bien a este enfoque.

La primera parte del programa calcula arrays de los mínimos anchos de columna y altos de fila para una grilla de celdas.
La variable `filas` contendrá un array de arrays, con cada array interno representado una fila de celdas.

```
function alturasFila(filas) {
  return filas.map(function(fila) {
    return fila.reduce(function(max, celda) {
      return Math.max(max, celda.minAltura());
    }, 0);
  });
}

function anchurasColumna(filas) {
  return filas[0].map(function(_, i) {
    return filas.reduce(function(max, fila) {
      return Math.max(max, fila[i].minAnchura());
    }, 0);
  });
}
```

Usar un nombre de variable que comience con un guión bajo (_) o que consista en un
simple guión bajo es una forma de indicar (a los lectores humanos) que este argumento no se utilizará.

La función `alturasFila` no debería ser demasiado difícil de seguir.
Esta usa `reduce` para calcular la altura máxima de un array de celdas y está dentro de un `map` para conseguir que se haga para todas las filas en el array `filas`.

Las cosas son un poco mas complicadas para la función `anchurasColumna` por que el array exterior es un array de filas, no de columnas. Se me ha olvidado mencionar que a `map` (como a `forEach`, `filter`, y métodos similares de array) se les puede pasar un segundo argumento, este es en la función el _índice_ del elemento actual. Mapeando los elementos de la primera fila y usando solo el segundo argumento de la función mapping, `colWidths` genera un array con un elemento para cada índice de columna. La llamada a `reduce` se ejecuta sobre el array externo `filas` para cada índice y se extrae la anchura de la celda más ancha para ese índice.

Aquí esta el código
para dibujar una tabla:

```
function dibujarTabla(filas) {
  var alturas = alturasFilas(filas);
  var anchuras = anchurasColumnas(filas);

  function dibujarLinea(bloques, numLinea) {
    return bloques.map(function(bloque) {
      return bloque[numLinea];
    }).join(" ");
  }

  function dibujarFila(fila, numFila) {
    var bloques = fila.map(function(celda, numColumna) {
      return celda.dibujar(anchuras[numColumna], alturas[numFila]);
    });
    return bloques[0].map(function(_, numLinea) {
      return dibujarLinea(bloques, numLinea);
    }).join("\n");
  }

  return filas.map(dibujarFila).join("\n");
}
```

La función `dibujarTabla` usa la función auxiliar interna `dibujarFila` para dibujar todas las filas y después unirlas todas con el caracteres de nueva línea.

La función `dibujarFila` por si misma convierte los objetos celda en la fila a _bloques_, que son los arrays de cadenas representando el contenido de las celdas, separados por línea. Una celda simple contiene simplemente el número 3776 puede ser representado como un elemento simple de array como `["3776"]`, como una celda subrayada nos va a ocupar dos lineas será representada por el array `["nombre", "------"]`.

Los bloques para una fila, que tienen la misma altura, deben aparecer uno junto a otro en la salida final.
La segunda llamada a `map` en `dibujarFila` genera esta salida línea a línea mapeando a través de las líneas desde el bloque más a la izquierda y, para cada uno de estos, coleccionando una línea que ocupa la anchura total de la tabla. Estas líneas están unidas con el carácter nueva línea para proveer la fila entera como valor de retorno de `dibujarFila`.

La función `dibujarLinea` extrae líneas que deben aparecer unas junto a otras de un array de bloques y las une con un carácter espacio para crear un hueco de un carácter entre las columnas de la tabla.

Ahora vamos a escribir un constructor, para las celdas que contienen texto, que implementa la ((interfaz)) para las celdas de la tabla. El constructor separa una cadena en un array de líneas usando el método de string `split`, que separa una cadena en cada ocurrencia de su argumento y retorna un array de piezas. El método `minAnchura` encuentra la máxima anchura de línea en este array.

```
function repetir(cadena, veces) {
  var resultado = "";
  for (var i = 0; i < veces; i++)
    resultado += cadena;
  return resultado;
}

function CeldaTexto(texto) {
  this.texto = texto.split("\n");
}
CeldaTexto.prototype.minAnchura = function() {
  return this.texto.reduce(function(anchura, linea) {
    return Math.max(anchura, linea.length);
  }, 0);
};
CeldaTexto.prototype.minAltura = function() {
  return this.texto.length;
};
CeldaTexto.prototype.dibujar = function(anchura, altura) {
  var resultado = [];
  for (var i = 0; i < altura; i++) {
    var linea = this.texto[i] || "";
    resultado.push(linea + repetir(" ", anchura - linea.length));
  }
  return resultado;
};
```

El código usa una función auxiliar llamada `repetir` que genera una cadena cuyo valor es el argumento `cadena` repetido las `veces` que se indica. El método `dibujar` se usa para añadir “espacio“ a las líneas ya que todas ellas tiene la longitud requerida.

Vamos a probar lo que hemos escrito hasta ahora generando un damero de 5 x 5.

```
var filas = [];
for (var i = 0; i < 5; i++) {
   var fila = [];
   for (var j = 0; j < 5; j++) {
     if ((j + i) % 2 == 0)
       fila.push(new CeldaTexto("##"));
     else
       fila.push(new CeldaTexto("  "));
   }
   filas.push(fila);
}
console.log(dibujarTabla(filas));
// → ##    ##    ##
//      ##    ##
//   ##    ##    ##
//      ##    ##
//   ##    ##    ##
```

¡Esto funciona! Pero como todas las celda tienen la misma anchura, el código de diseñar tabla no hace algo realmente interesante.

La fuente de datos de la tabla de las montañas que estamos tratando de generar esta disponible en la variable `MOUNTAINS` en el _sandbox_ y además en http://eloquentjavascript.net/code/mountains.js[descargable] y desde la web (!book (http://eloquentjavascript.net/code#6[_eloquentjavascript.net/code#6_])!).

Queremos destacar la fila de arriba, que contiene los nombres de las columnas, subrayando las celdas con una serie de caracteres guión. No hay problema-simplemente escribiremos un tipo de celda que soporte subrayado.

```
function CeldaSubrayada(contenido) {
  this.contenido = contenido;
};
CeldaSubrayada.prototype.minAnchura = function() {
  return this.contenido.minAnchura();

function UnderlinedCell(inner) {
  this.inner = inner;
}
UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
};
CeldaSubrayada.prototype.minAltura = function() {
  return this.contenido.minAltura() + 1;
};
CeldaSubrayada.prototype.dibujar = function(anchura, altura) {
  return this.contenido.dibujar(anchura, altura - 1)
    .concat([repetir("-", anchura)]);
};
```

Una celda subrayada contiene otra celda.
Esto significa que su tamaño mínimo será el mismo que el de la celda interna (llamando a través de los métodos de estas celdas `minAnchura` y `minAltura`) pero añade uno a la altura para contar el espacio tomado por el subrayado.


Dibujar una celda es muy simple -nosotros tomamos el contenido de la celda interior y le concatenamos a una línea simple de guiones.

Teniendo un mecanismo de subrayado, ahora podemos escribir una función que genere una grilla de celdas para nuestro set de datos.

```
function datosTabla(datos) {
  var keys = Object.keys(datos[0]);
  var encabezados = keys.map(function(nombre) {
    return new CeldaSubrayada(new TextCell(nombre));
  });
  var cuerpo = datos.map(function(row) {
    return keys.map(function(nombre) {
      return new CeldaTexto(String(row[nombre]));
    });
  });
  return [encabezados].concat(cuerpo);
}

console.log(dibujarTabla(datosTabla(MOUNTAINS)));
// → nombre       altura país
//   ------------ ------ -------------
//   Kilimanjaro  5895   Tanzania
//   … etcétera
```

La función estándar `Object.keys` retorna un array de nombres de propiedades en un objeto. La fila de arriba de la tabla debe contener celdas subrayadas que den los nombres a las columnas. Debajo, los valores de todos los objetos en el set de datos parecen celdas normales-los extraeremos mapeando sobre el array `keys` así que estamos seguros de que el orden de las celdas es el mismo en cada fila.

La tabla resultante parece la del ejemplo mostrado antes, excepto por que on tiene el alineamiento a la derecha de los número en la columna `altura`. Vamos a conseguirlo en un momento.

### Getters y setters 

Cuando especificamos una interfaz, es posible incluir propiedades que no son métodos. Podemos tener definida `minAltura` y `minAnchura` para simplemente almacenar números. Pero esto podría requerir que lo calculáramos en él _constructor_, esto añade código en el que no es estrictamente relevante para _construir_ el objeto.
Esto podría causar problemas si, por ejemplo, el interior de una celda subrayada cambia, en este punto el tamaño del subrayado de la celda debería cambiar también.

Esto ha servido como excusa para adoptar el principio de no incluir nunca propiedades que no sean métodos en las interfaces. Más que un acceso directo a un propiedad de valor simple, se pueden usar los métodos `getAlgo` y `setAlgo` para leer y escribir la propiedad. Esta aproximación tiene el inconveniente de que tu tienes que escribir -y leer- un montón de métodos adicionales.

Afortunadamente, JavaScript provee de una técnica que nos da lo mejor de ambos mundos. Podemos especificar propiedades que, dese fuera, parezcan propiedades normales pero secretamente tienen _método_s asociados con ellas.

```
var pila = {
  elementos: ["cascara de huevo", "peladura de naranja", "gusano"],
  get altura() {
    return this.elementos.length;
  },
  set altura(valor) {
    console.log("Ignorando el intento de guardar la altura: ", valor);
  }
};

console.log(pila.altura);
// → 3
pila.altura = 100;
// → Ignorando el intento de guardar la altura: 100
```

En un objeto literal, la notación `get` o `set` para propiedades te permite especificar una función para ser ejecutada cuando la propiedad es leída o escrita. Podemos incluso
añadir una propiedad a un objeto existente, por ejemplo un prototipo, usando la función `Object.defineProperty` (que hemos usado previamente para crear propiedades nonenumerable).

```
Object.defineProperty(CeldaTexto.prototype, "alturaProp", {
  get: function() { return this.texto.length; }
});

var celda = new CeldaTexto("sin\nsalida");
console.log(celda.alturaProp);
// → 2
celda.alturaProp = 100;
console.log(celda.alturaProp);
// → 2
```

Puedes usar la propiedad similar `set`, en el objeto pasándola a `defineProperty`, para especificar un método setter. Cuando se define un getter pero no un setter, escribir la propiedad es simplemente ignorado.

### Herencia

Todavía no hemos acabado el ejercicio de diseño de tabla. Ayuda a la legibilidad alinear a la derecha las columnas con números. Debemos crear otro tipo de celda que es como `CeldaTexto`, pero sin espacio en la parte derecha, estas tienen el espacio en la parte izquierda así que aliniémoslas a la derecha.

Podemos simplemente escribir un nuevo _constructor_ entero con los tres métodos en su prototipo. Pero los prototipos pueden tener sus prototipos, y esto nos permite hacer algo inteligente.

```
function DCeldaTexto(texto) {
  CeldaTexto.call(this, texto);
}
DCeldaTexto.prototype = Object.create(CeldaTexto.prototype);
DCeldaTexto.prototype.dibujar = function(anchura, altura) {
  var resultado = [];
  for (var i = 0; i < altura; i++) {
    var linea = this.text[i] || "";
    resultado.push(repetir(" ", anchura - linea.length) + linea);
  }
  return resultado;
};
```

Reutilizamos el constructor y los métodos `minAltura` y `minAnchura` de `CeldaTexto`.
Una `DCeldaTexto` es ahora básicamente equivalente a `CeldaTexto`, excepto por que su método `dibujar` contiene una función diferente.

Este patrón es llamado _herencia_. Este nos permite generar tipos de datos muy similares desde tipos de datos existente con poco trabajo relativamente. Típicamente, el nuevo constructor llamará al viejo _constructor_ (usando el método `call` para permitir darle al nuevo objeto su valor `this`). Una vez este constructor se ha llamado,
podemos asumir que todos los campos que el tipo de objeto viejo tenía han sido añadidos. Arreglamos el constructor del _prototipo_ para derivarlo al del viejo prototipo así que las instancias de este prototipo tendrán también acceso a las propiedades del viejo prototipo. Finalmente podemos sobre escribir alguna de esas propiedades añadiéndolas a nuestro nuevo prototipo.

Ahora, si ajustamos un poco la función `datosTabla` para usar _DCeldaTexto_s para celdas cuyo valor sea un número, tendremos la tabla que estábamos buscando.

```
function datosTabla(datos) {
  var keys = Object.keys(datos[0]);
  var encabezados = keys.map(function(nombre) {
    return new CeldaSubrayada(new CeldaTexto(nombre));
  });
  var cuerpo = datos.map(function(row) {
    return keys.map(function(nombre) {
      var valor = row[nombre];
      // Esto ha cambiado:
      if (typeof valor == "number")
        return new DCeldaTexto(String(valor));
      else
        return new CeldaTexto(String(valor));
    });
  });
  return [encabezados].concat(cuerpo);
}

console.log(dibujarTabla(datosTabla(MOUNTAINS)));
// → … preciosa tabla alineada

```

La herencia es una parte fundamental de la tradición de la orientación a objetos, junto con la encapsulación y el polimorfismo. Pero mientras las dos últimas son generalmente consideradas como ideas geniales, la herencia es algo controvertido.

La principal razón para esto es que a menudo es confundida con el _polimorfismo_, vendido como una herramienta más poderosa de lo que en realidad es, y posteriormente sobre utilizado de todas las malas formas posibles. Mientras que la _encapsulación_ y el polimorfismo pueden ser usados para _separar_ trozos de código de otros, reduciendo el enmarañado general del programa, la _herencia_ fundamentalmente empata con ambos, creando _más_ enmarañado.

Puedes tener polimorfismo sin herencia, como hemos visto. No te voy a decir que evites la herencia por completo-Yo la uso regularmente en mis programas.
Pero tu debes verla como un truco un poco sucio que te puede ayudar a definir nuevos tipos con poco código, no como un gran principio de organización de código. Una forma mejor de extender tipos es a través de _composición_, como `CeldaSubrayada` genera otro objeto celda simplemente guardándolo en una propiedad y remitiendo las llamadas a los métodos a sus propios _métodos_s.

### El operador instanceof

Es ocasionalmente útil conocer cuando un objeto deriva de un constructor específico. Para esto, JavaScript tiene un operador binario llamado `instanceof`.

```
console.log(new DCeldaTexto("A") instanceof DCeldaTexto);
// → true
console.log(new DCeldaTexto("A") instanceof CeldaTexto);
// → true
console.log(new CeldaTexto("A") instanceof DCeldaTexto);
// → false
console.log([1] instanceof Array);
// → true
```

El operador verá a través de los tipos heredados.
Una `DCeldaTexto` es una instancia de `CeldaTexto` porque `DCeldaTexto.prototype` deriva de `CeldaTexto.prototype`. El operador puede ser aplicado a constructores estándar como `Array`. Aunque casi todos los objetos son una instancia de `Object`.

### Resumen

Entonces los objetos son más complicados de lo que inicialmente he mostrado.
Tienen prototipos, que son otros objetos, y actuarán como si tuviesen las propiedades que no tienen, si las tienen sus prototipos. Los objetos simples tienen `Object.prototype` como su prototipo.

Los constructores, que son funciones cuyos nombres normalmente empiezan con una mayúscula, pueden ser usados con el operador `new` para crear nuevos objetos. Los nuevos prototipos de los objetos se encontrarán en la propiedad `prototype` de la función constructora. Puedes hacer buen uso de esto poniendo las propiedades que comparten todos los valores de un tipo dado en su prototipo.
El operador `instanceOf` puede, dado un objeto y un constructor, decirte cuando ese objeto es una instancia de ese constructor.

Algo útil para hacer con objetos es especificar una interfaz para ellos y decir a todos los que van a comunicarse con el objeto que lo hagan solo a través de la interfaz. El resto de detalles que maquillan tu objeto son ahora _encapsulados_, ocultados tras la interfaz.

Ahora que estamos hablando en términos de interfaces, ¿quien dice que solo un tipo de objeto puede implementarse en esa interfaz? Tener diferentes objetos expuestos a la misma interfaz y después escribir código que funcione en cualquier objeto, es la interfaz llamada _polimórfica_. Esto es muy útil.

Cuando implementamos múltiples tipos que difieren solo en algunos detalles, esto puede ayudar a simplificar haciendo el que el prototipo del nuevo tipo de objeto derive del prototipo del viejo y tener un nuevo constructor que puede llamar al antiguo. Esto te da un tipo de objeto similar al viejo pero puedes añadir y sobre escribir propiedades que veas que encajan.

### Ejercicios

### Un tipo vector

Escribe un _constructor_ `Vector` que represente un vector en un espacio de dos dimensiones. Este toma `x` e `y` como parámetros (números), que se deben guardar como propiedades del mismo nombre.

Añade al prototipo `Vector` dos métodos, `mas` y `menos`, que toman otro vector como parámetro y devuelven un nuevo vector con el resultado de la suma o resta de los dos vectores (el vector almacenado en `this` y el parámetro) con sus valores _x_ e _y_.

Añade una propiedad _getter_ `longitud` al prototipo que calcule la longitud del vector-esto es, la distancia del punto (_x_, _y_) desde el origen (0,0).


```
// Your code here.

console.log(new Vector(1, 2).mas(new Vector(2, 3)));
// → Vector{x: 3, y: 5}
console.log(new Vector(1, 2).menos(new Vector(2, 3)));
// → Vector{x: -1, y: -1}
console.log(new Vector(3, 4).longitud);
// → 5
```

!!pista!!

Tu solución se puede acercar mucho al patrón del constructor `Conejo` de este capítulo.

Añadir una propiedad getter al constructor se puede hacer con la función `Object.defineProperty`. Para calcular la distancia de (0,0) a (x,y), puedes usar el teorema de Pitágoras, que dice que el cuadrado de la distancia que buscamos es igual a la suma de los cuadrados de la coordenada-x y la coordenada-y. Por tanto, (!html √(x^2^ + y^2^pass:[)]!)(!tex pass:[$\sqrt{x^2 + y^2}$]!) es el número que buscas, y `Math.sqrt` es la forma en la que calculas una raíz cuadrada en JavaScript.

### Otra celda

Implementa un tipo de celda llamado `CeldaEstirar(contenido, anchura, altura)` que se ajuste a la interfaz tabla celda] descrita previamente en el capítulo. Esta debe contener otra celda (como hace `CeldaSurayada`) y asegurar que la celda resultante tiene al menos la `anchura` y `altura` dadas, incluso si el contenido de la celda pueda
ser naturalmente menor.

```
// Your code here.

var sc = new CeldaEstirar(new CeldaTexto("abc"), 1, 2);
console.log(sc.minAnchura());
// → 3
console.log(sc.minAltura());
// → 2
console.log(sc.dibujar(3, 2));
// → ["abc", "   "]
```

!!pista!!

Tienes que guardar los tres argumentos de la instancia en el constructor. Los métodos `minAnchura` y `minAltura` deben llamarse a través de los correspondientes métodos en el `contenido` de la celda pero asegurar que no se retorna un número menor que el tamaño
dado (probablemente usando `Math.max`).

No olvides añadir un método `draw` que simplemente redireccione la llamada al contenido de la celda.


### Interface secuencia 

Diseña una _interfaz_ que resuma la _iteración_ sobre una _colección_ de valores. El objeto que provee a esta interfaz representa una secuencia. La interfaz debe mostrar como se hace esto posible usando un objeto para iterar sobre la secuencia, mirando los valores que tienen el elemento y con forma de detectar cuando se ha llegado al final de la secuencia.

Cuando hayas especificado tu interfaz, intenta escribir una función `mostrarCinco` que tome el objeto secuencia y llame a `console.log` en sus primeros cinco elementos-o menos, si la secuencia tiene menos de cinco elementos.

Después implementa un objeto del tipo `ArraySec` que contenga un array y permita la iteración sobre el array usando la interfaz que has diseñado.
Implementa otro tipo de objeto `RangoSec` que itere sobre un rango de enteros (tomando los argumentos `desde` y `hasta` en su constructor) en su lugar.

```
// Your code here.

mostrarCinco(new ArraySeq([1, 2]));
// → 1
// → 2
mostrarCinco(new RangeSeq(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104
```


!!pista!!

Una forma de resolver esto es dar a los objetos secuencia un _estado_, implicando que sus propiedades son cambiadas mientras se esta utilizando. Puedes guardar un contador que indique como de lejos ha llegado la secuencia.

Tu _interfaz_ necesitará contar con al menos una forma de obtener el siguiente elemento y calcular si la iteración ha llegado al final de secuencia o no. Es tentador incluir esto en un método, `siguiente`, que retorne `null` o `undefined` cuando la secuencia haya llegado a su fin.
Pero ahora tienes un problema cuando una secuencia actualmente contiene `null`. A sí que un método separado (o una propiedad getter) para encontrar cuando se ha llegado al final es probablemente preferible.

Otra solución es evitar cambiar el estado en el objeto. Puedes tener un método para devolver el elemento actual (sin avanzar ningún contador) y otro para obtener una nueva secuencia que represente los elementos restantes después del actual (o un valor especial cuando se llega al final de la secuencia). Esto es bastante elegante-un valor secuencia que “dependa de si mismo” incluso si después es usado y por tanto pueda ser compartido con otro código sin preocuparse de que puede pasar. Esto es, desafortunadamente, incluso algo ineficiente en un leguaje como JavaScript porque implica la creación de muchos objetos durante la iteración.
