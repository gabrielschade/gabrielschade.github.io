---
layout: post
title:  "Entendendo Programação Funcional com Stranger Things"
date:   2019-07-16 00:00:00 +0000
image: https://i.imgur.com/g3ZPR5d.png
comments: true
tags: [F#, C#] 
--- 
 
Olá pessoa!

Que tal explorarmos um pouco sobre as teorias de programação funcional com Stranger Things? -E claro, sem spoilers da nova temporada.

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/algorithms/blob/master/DataStructures/DataStructures.JavaScript/Queue.js" %} 

Vamos falar sobre toda a teoria por trás de programação funcional? -**Não**, não vamos.

Vamos focar em alguns funções de alta ordem (`map`, `return`, `apply`, `bind`) e entender o conceito por trás delas. Todas essas funções tem uma coisa comum: elas lidam com _values containers_.

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

A próxima função que precisamos é o `apply`, diferente da função `return` ela não funciona para valores simples e para funções. Neste caso ela é destinada totalmente para funções.

O que o `apply` faz é basicamente quebrar uma função encapsulada no _Upside down_ (`UpsideDown< Func<X, Y> >`) em uma função do mundo normal onde os parâmetros estão encapsulados (`Func< UpsideDown<X>, UpsideDown<Y> >`).


Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.