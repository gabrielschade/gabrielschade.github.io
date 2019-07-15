---
layout: post
title:  "Entendendo Programação Funcional com Stranger Things"
date:   2019-07-15 00:00:00 +0000
image: https://i.imgur.com/g3ZPR5d.png
comments: true
featured: true
tags: [F#, C#] 
--- 
 
Olá pessoa!

Que tal explorarmos um pouco sobre as teorias de programação funcional com Stranger Things? -E claro, sem spoilers da nova temporada.

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/posts-blog/tree/master/StrangerThings" %} 

Vamos falar sobre toda a teoria por trás de programação funcional? -**Não**, não vamos.

Vamos focar em alguns funções de alta ordem (`return`, `apply`, `map`) e entender o conceito por trás delas. Todas essas funções tem uma coisa comum: elas lidam com _values containers_.

O que são _values containers_? -De forma bastante resumida, um _value container_ é qualquer classe/struct/tipo que "envelopa" outro valor.

Alguns exemplos: listas, arrays, filas, pilhas e por aí vai, mas calma que não são só as coleções que fazem isso. Em C#, por exemplo, temos o `Task<T>` e o `Nullable<T>`, que não são coleções mas entrariam nesse mesmo conceito. Assim como o `option` do F#.

O que isso tem a ver com Stranger Things? -**Mais do que você imagina**.

### O Conceito por trás da Série

Na série Stranger Things existe um conceito chamado **Upside down** ou **Mundo invertido**, esse mundo funciona como uma versão paralela ao mundo real. No entanto, várias criaturas _sinistras_ vivem por lá.

Na imagem abaixo podemos ver o conceito de forma mais explícita. Na parte de cima estão três dos personagens principais e podemos ver o último menino do grupo no _Upside down_ (esse é o plot da primeira temporada).

{% include image.html link="https://i.imgur.com/g5TyyhH.png" alt="Upside down" width=80 %}

Parte da trama da série se passa em entender como as criaturas e as pessoas transitam entre o mundo normal e o _Upside down_. E é aí que entram nossas funções de alta ordem!

### Implementando o Upside Down

Se você precisasse modelar o Upside Down em uma classe ou tipo, como você faria?

Lembre-se que teoricamente, toda criatura do _Upside Down_ pode vir para o mundo normal e qualquer humano do mundo normal pode ir para o _Upside Down_. Então ele precisa funcionar como um **value container**!

No mundo computacional precisamos lembrar que qualquer valor ou função do mundo normal, podem possuir um correspondente no _Upside Down_ e vice-versa.

{% include image.html link="https://i.imgur.com/Z4kzw1M.png" alt="Upside Down as Value Container" width=80 %}

Normalmente este tipo de implementação requer um _Computation Express_ em F#, mas para fins de simplificação, não vamos entrar nesse mérito (talvez no futuro).

Vamos começar modelando a classe em C# e o tipo em F#:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/35a49f2bdfdbb538a0cc0b48bf5a5fbc.js|https://gist.github.com/gabrielschade/d5806b3ffba5fc2de4c4b9a6d0b2c673.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=0 %}

Agora que já temos o nosso tipo, precisamos de alguma maneira interagir com ele. Isso significa que precisamos de formas para sairmos do mundo normal e entrarmos no _Upside down_. E claro, mais importante ainda, formas de sairmos do _Upside Down_ e voltarmos para o mundo normal, afinal, ninguém quer ficar preso por lá, certo?

Precisamos de um **portal** para cruzar os dois mundos.

{% include image.html link="https://i.imgur.com/GiBBMK4.png" alt="Upside Down Portal" width=80 %}

### Conceitos de Funções - Return

O primeiro conceito que vamos tratar aqui é chamado de `return`. Não, não é o `return` que você coloca no fim do método. Na verdade essa função pode receber outros nomes como: `yield` e `pure`, ou até, não ter um nome de função.

Em C#, por exemplo, você pode retirar um valor de uma lista acessando-o via _Indexer_: `lista[indice]`. Mesmo nesses casos o conceito da função `return` é aplicado.

Para nosso caso, vamos chamar a função `return` de Portal. Precisamos de um portal para o mundo invertido e um portal para voltarmos ao mundo normal:

{% include image.html link="https://i.imgur.com/8sjuD9j.png" alt="Upside Down Portal Code" width=80 %}

Para o código em C#, podemos fazer com que o próprio construtor seja um portal para o _Upside Down_, ou caso preferirmos, podemos manter o construtor privado e termos um método estático chamado `Portal` para criar o objeto:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/f0e85a446d0d959c21ecf3e233558685.js|https://gist.github.com/gabrielschade/c57576cec4c812c808f1283ce70a2dfa.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=1 %}

Para melhorar um pouco a usabilidade do código podemos criar métodos de extensão para interagir com o _Upside Down_, vamos começar com o método `PortalToUpsideDown`:

{% assign headers = "C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/afb7bc6ffc42fa463b8377bc03f13653.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=2 %}

Com essa implementação pronta, vale lembrar que o `return` funciona tanto para valores simples quanto para funções, isso mesmo, podemos ter funções no _Upside Down_. 

Mesmo em C# que não é tão focado em programação funcional podemos usar isso, inclusive com o método de extensão, veja:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/3ca5aa7e5b14f56516f7ee445201b1ce.js|https://gist.github.com/gabrielschade/98c76bec458e3b12df2315036e343d3a.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=3 %}

### Conceitos de Funções - Apply

A próxima função que precisamos é o `apply`, diferente da função `return` ela não funciona para valores simples, seu único foco são funções.

O que o `apply` faz é basicamente quebrar uma função encapsulada no _Upside down_ (`UpsideDown< Func<X,Y> >`) em uma função do mundo normal onde os parâmetros estão encapsulados (`Func< UpsideDown<X>,UpsideDown<Y> >`).

{% include image.html link="https://i.imgur.com/6eZOuJk.png" alt="Upside Down Portal Code - Apply" width=80 %}

Nesse caso não temos nenhuma travessia entre os mundos, tudo se mantém no _Upside Down_, mas o que isso significa?

Na primeira temporada, um dos personagens fica preso no _Upside Down_ consegue se comunicar com sua mãe através de luzes, nesse caso, simplesmente passar a função para o _Upside Down_ não é suficiente, precisamos que ela **afete** o _Upside Down_ e que produza resultados lá (ao invés de produzir resultados do mundo normal).

Essas são as luzes que a mãe do Will fez para realizar o `apply` com seu filho perdido:

{% include image.html link="https://i.imgur.com/FCjHMtx.png" alt="Upside Down Portal Code - Lights Apply" width=80 %}

Agora vamos tentar implementar isso. Assim como fizemos antes, vamos enviar a função de mensagem através de nosso portal e tentar executá-la no _Upside Down_.

A função de mensagem através da luz pode simplesmente receber um parâmetro, escrevê-lo no console e retorná-lo. Mas mesmo em uma função assim simples, encontraremos um problema:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/168b42f2fe7c1c55990472d919ec279b.js|https://gist.github.com/gabrielschade/3f10f0064e55a9161a4e43e58f756b4d.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=4 %}

Uma vez que enviamos a função para o _Upside Down_ não somos mais capazes de executá-la, isso porque não temos acesso direto a função. Além disso, como passamos a função para o _Upside Down_, não podemos esperar que ela receba por parâmetro um valor do mundo real, portanto precisamos que ela receba `UpsideDown<"A">` ao invés de `"A"`.

Por último, temos que lembrar que a função precisa afetar o _Upside Down_ e não o mundo normal, logo, seu retorno também deve ser um valor no _Upside Down_.

O jeito mais simples de resolvermos isso, é remover o contexto dos valores e da função, dessa forma, podemos executar a função normalmente. Depois de executarmos a função podemos gerar o resultado no _Upside Down_ enviando-o novamente através do portal.

Nesse caso específico a função em C# fica um pouco mais verbosa, pela necessidade de declaração dos tipos, veja o código abaixo:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/889c61193f9200e5944eab7b387191f4.js|https://gist.github.com/gabrielschade/c9e524a15a985e0c85d0cee03bb3db5d.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=5 %}

Nesse caso é possível notar como em geral, C# e linguagens orientadas a objeto são bastante declarativas, enquanto linguagens funcionais tendem a ter um fluxo de continuídade maior. Isso não significa que um é melhor do que o outro, são apenas formas diferentes de fazer a mesma coisa.

Mas precisamos notar que, linguagens com currying automático e aplicação parcial acabam ganhando uma função `apply` mais poderosa. Vamos fazer a implementação do método de mensagem de luz e depois veremos uma implementação que funcionará em F#, mas infelizmente não funcionará em C#.

Primeiro vamos à implementação da mensagem de luz com um parâmetro:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/14a67b3c0c887bca67c1fb6f85a9dc1e.js|https://gist.github.com/gabrielschade/f6ac25aff5b2fe2104caf46a54883351.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=6 %}

Em C# podemos fazer com que a função `apply` além de estático também seja um método de instância do nosso objeto, podemos fazer da mesma forma da biblioteca Linq, utilizando os métodos de extensão:

{% assign headers = "C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/b3c4146b69c187ff500660bec017859e.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=12 %}

Não temos métodos de extensão em F#, mas também há um ponto que pode soar mais prático (ou mais confuso). Trata-se da utilização de operadores para realizar o `apply`. O operador mais comum para essa função é o `<*>`, para definirmos e utilizarmos é bastante simples, veja:

{% assign headers = "F#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/d76c6ef315075644792623401d2ffcf5.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=7 %}

Dessa forma basta inserir o operador entre a função e o parâmetro que tudo funcionará corretamente. Você pode argumentar que esse operador prejudica a visibilidade do código e eu tendo a concordar com isso. Mas uma vantagem inegável é o que comentei antes sobre funções com múltiplos parâmetros.

Imagine que ao invés da função de passar uma letra na mensagem de luzes precisamos enviar duas... Parece um problema super simples de resolver, mas vamos tentar solucionar isso usando C#.

{% assign headers = "C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/3f57756d63bded5333741d9aa4ade61b.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=8 %}

Com o código que fizemos até agora é simplesmente impossível... O que podemos tentar fazer é utilizar expressões lambda para reduzir o parâmetro da função, criarmos novas sobrecargas para funções com múltiplos parâmetros e etc. Existem saídas, elas só precisariam ser implementadas.

No caso do F#, a linguagem já faz com que uma função com múltiplos parâmetros seja automaticamente reduzida múltiplas funções de um parâmetro, onde cada uma delas retorna uma nova função com menos parâmetros, se isso soa confuso para você acesse [este post sobre Currying e Aplicação Parcial]({{ site.baseurl }}{% link _posts/2018-03-05-currying-partial-app.markdown %}){:target="_blank"}).

A vantagem de combinarmos isso com o operador é que podemos com o código que criamos anteriormente, transformar qualquer função com qualquer quantidade de parâmetro em uma função do _Upside Down_, veja:

{% assign headers = "F#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/b528dcf49220c4862b5b261258d4bf91.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=9 %}

Veja que tanto `result` quanto `result2` terão o mesmo valor, com a diferença de que um utiliza valores armazenados previamente e o último gera os valores no _Upside Down_ inline.

### Conceitos de Funções - Map

Vamos para a última e mais famosa função apresentada aqui. Se você está acostumado com qualquer linguagem de programação que suporte funções de alta ordem, provavelmente vai haver uma função `map`. Com exceção do C#, que possui essa função, mas ela se chama `Select`.

A função `map` é responsável por fazer com que uma função do mundo normal, possa ser aplicada à um valor de um mundo diferente, como uma lista ou um valor do _Upside Down_.

Qual a diferença entre o `map` e o `apply`?

É bastante comum essas duas funções confundirem um pouco e parecerem a mesma, mas não são. Lembre-se do nosso exemplo, no caso do `apply` estamos tentando reproduzir a função equivalente no _Upside Down_.

No caso das mensagens através de luzes, era preciso que as luzes existissem tanto mundo normal `(string->string)` quanto no _Upside Down_ `UpsideDown<string -> string>`. No caso do `map` não temos uma função equivalente no _Upside Down_, simplesmente queremos que uma função do mundo normal consiga afetar os objetos do _Upside Down_.

{% include image.html link="https://i.imgur.com/dEoEKXp.png" alt="Upside Down Portal Code - Map" width=80 %}

Isso seria como os Mike tentando se comunicar com o Will (enquanto ele estava preso no _Upside Down_ através do walk talk. O que ele estava fazendo aqui é basicamente o funcionamento do `map`. Utilizar-se de uma função do mundo normal e **mapeá-la** ao _Upside Down_.

{% include image.html link="https://i.imgur.com/QJuEl5b.png" alt="Upside Down Portal Code - Map" width=80 %}

Talvez você já tenha percebido, mas existem duas formas diferentes de implementarmos o `map`. Na primeira implementação podemos retirar o parâmetro do _Upside Down_, aplicar a função normalmente e transformar o resultado em seu equivalente no _Upside Down_, veja:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/7cad3ac291fde9b4a10532c9c9ae2825.js|https://gist.github.com/gabrielschade/9186bcdd8cf2e9689eac3abd013c5aed.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=10 %}

Essa implementação funciona normalmente, mas além dela, também podemos reaproveitar as implementações de `return` e `apply`, afinal, eles combinados podem formar um `map`.

Para fazer isso, basta transformarmos nossa função em seu equivalente no _Upside Down_ através do `return` e depois utilizarmos o `apply` para resolvê-la:

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/729718517527b0c1925fa392c78d46df.js|https://gist.github.com/gabrielschade/591c7f963873be88b897eb3603e00d37.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=11 %}

No fim das contas não faz muita diferença sua implementação, o que vale ser lembrado aqui é que isso mostra que a combinação: `return` + `apply` é mais poderosa do que o `map`. Afinal, ela pode fazer coisas diferentes e emular um `map` enquanto o contrário não é verdadeiro.

Uma coisa interessante para validar se a implementação do `map` está correta é que podemos tirar a prova real. Uma função aplicada com um `map` em um valor do `Upside Down` deve produzir o mesmo valor que o resultado do `return` da mesma função aplicada ao valor no mundo normal.

{% include image.html link="https://i.imgur.com/ao62MKe.png" alt="Upside Down - Map" width=80 %}

Assim como fizemos com o `apply`, podemos ter a função `map` nas formas de métodos de extensão (C#) e operador (F#):

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/c272ea3f1ab9fcd6454fd75c6c00069c.js|https://gist.github.com/gabrielschade/0daed6ab47df78a5ca704c08669581c4.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=15 %}

Para finalizar, vamos implementar uma função que aumente o poder da Eleven!

{% include image.html link="https://i.imgur.com/eHWNIlt.png" alt="Upside Down - Map" width=80 %}

Na verdade, vamos só incrementar um valor inteiro, mas podemos usar a imaginação aqui né?

{% assign headers = "F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/812aeb8aecf91052983fb5325ce8b111.js|https://gist.github.com/gabrielschade/f2366c5177427457a644b1140a62589b.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=16 %}

Com o perdão do trocadilho, mas programação funcional as vezes pode soar um tanto quanto **estranho**, não acha?

Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.