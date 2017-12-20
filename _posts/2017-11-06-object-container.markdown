---
layout: post
title:  "Os Universos Paralelos dos containers"
date:   2017-11-06 00:00:00 +0000
comments: true
tags: [C#]
---

Universos paralelos não são uma novidade no mundo das histórias em quadrinhos. Nas sagas do herói da DC, Flash, é comum existir este tipo de dinâmica.

Toda vez que viajam para um universo paralelo, acabam em um planeta Terra muito similar ao nosso, inclusive com as mesmas pessoas. Mas estas pessoas tem outros empregos, outras personalidades e **outros comportamentos**.
<!--more-->
Em computação existem objetos chamados de *containers*, estes objetos se comportam de maneira similar a um universo paralelo, calma, eu vou explicar.

Um container é representado por uma estrutura de dados, geralmente uma classe (não há obrigatoriedade nenhuma em precisar ser uma classe). Seu objetivo principal é encapsular um outro valor de qualquer tipo sob algumas regras de acesso e organização.

Existem diversos tipos de containers diferentes, vários deles implementados dentro das próprias linguagens: listas, filas, pilhas e arrays são exemplos disso.

Mas calma, container não é só uma palavra diferente para identificar *coleções*. Existem containers como `Task<T>` e `Nullable<T>`, que também entram nesta categoria e não se encaixam na definição de coleções.

Ok, então um container é alguma coisa/objeto que guarda outro?

Mais ou menos isso.

E o que isso tem a ver com os universos paralelos?

Eu explico.

O container cria um equivalente à um valor/objeto de um tipo assim como Flash e os outros heróis possuem um equivalente a eles em outro universo.

Vamos à um exemplo prático!

``` csharp
int inteiro = 10;
inteiro += 20;
```

Nada demais neste código, certo? Criamos um valor do inteiro e adicionamos 20 à ele. Mas e se este mesmo valor pertencer à um universo paralelo diferente?

``` csharp
List<int> listaDeInteiros = new List<int>();
listaDeInteiros.Add(10);
...
```

Temos o mesmo valor (10) sendo representado em universos diferentes. No primeiro caso, o valor 10 estava em seu modo "puro", enquanto que neste segundo exemplo, ele está dentro de uma lista.

O valor 10 ainda é um valor inteiro, mas agora há um invólucro protegendo este valor. Não podemos simplesmente adicionar 20 como fizemos anteriormente.

``` csharp
List<int> listaDeInteiros = new List<int>();
listaDeInteiros.Add(10);
listaDeInteiros += 20; // -> isso causará erro de compilação
```

O mesmo acontece com outros tipos de containers, temos um valor equivalente, mas com **comportamentos diferentes**.

No próximo post vamos criar nosso próprio container para representar tipos incertos e lídar com o [problema do null]({{ site.baseurl }}{% link _posts/2017-10-11-problema-null.markdown %})!

O que você acha deste conceito?

Me conte nos comentários!

E Até mais!