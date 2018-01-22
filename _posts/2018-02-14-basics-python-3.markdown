---
layout: post
title:  "Lição 3: Strings, Valores None e Listas"
date:   2018-02-14 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoas!

Se você está acompanhando esta série, você já deve ser capaz de criar variáveis e criar desvios condicionais em seu programa. Agora vamos olhar um pouco mais de perto algumas características dos tipos em Python!

<!--more-->

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Já usamos algumas vezes variáveis do tipo string, mas ainda há muito trabalho para fazer!

Este tipo permite uma série de operações diferentes. Podemos verificar se o texto contém somente números, colocar a primeira letra maiúscula, substituir uma letra no texto e muitas outras coisas.

Todas estas operações são chamadas de **funções**. Este é um conceito bastante poderoso nas linguagens de programação. Por definição, uma função é um *comportamento* que pertence à algo, enquanto uma variável é uma *característica* de algo.

Como assim? - Eu explico, imagine um carro, por exemplo. Algumas características de seu carro são: quantidade de portas, cor, marca, ano e assim por diante. Todas estas características podem ser transcritas para um programa na forma de variáveis.

Mas o seu carro também liga, acelera e freia. Todas estas coisas são comportamentos, ou seja, são ações do carro. As ações são traduzidas para um programa através de **funções**.

Mas não se assuste, é muito fácil de usar!

Vamos fazer o primeiro exemplo juntos, vamos transformar a primeira letra de uma string em maiúsculo, faremos isso através da função `capitalize`:

```python
nome = "gabriel"
nome_maiusculo = nome.capitalize() # -> Gabriel
```

Note que quando executamos uma função é necessário utilizar `()`, isso ocorre porque existem casos ontem precisamos informar valores para realizar uma ação, para substituir uma letra com a função `replace`, por exemplo.

Neste caso precisamos informar dois valores diferentes: o primeiro indica a letra que será substituída e o segundo indica a letra que a substituirá, veja:

```python
nome = "gabriel"
nome_com_letra_alterada = nome.replace('e','a') # -> Gabrial
```


> **Atenção**
>
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/02-DesvioCondicional.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!