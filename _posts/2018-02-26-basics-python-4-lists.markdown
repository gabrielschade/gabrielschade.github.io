---
layout: post
title:  "Lição 4: Operações com Listas"
date:   2018-02-26 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoas!

Se você tem praticado em Python você já deve ter se deparado com o problema de criação de variáveis para descrever listas, por exemplo, um conjunto de estudantes, um conjunto de carros estacionados ou até uma lista de compras!

Você não precisa criar uma variável para cada item da lista! Como vimos no post passado, você pode manipular múltiplos valores sob uma única variável. Estas variáveis se chamam **Listas**!

<!--more-->

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Assim como os exemplos descritos anteriores, todo tipo de informação que precisa ser agrupada em algum tipo de conjunto utiliza este recurso, um exemplo disso, foi a função `split` que vimos no post passado. Essa função resulta em uma série de valores que estão agrupados em uma única variável, uma lista.

Vamos começar vendo como criar uma lista vazia, ou seja, uma varíavel que se identifique com o tipo lista, mesmo não contendo nada dentro de si, assim como muitas outras coisas, é muito fácil definir uma lista em Python, basta declarar o nome da variável e utilizar colchetes vazios, veja:

```python
lista_de_compras = []
```

Simples assim! Além disso, você também pode criar a lista já incluindo alguns itens nela! Basta separar cada item da lista por vírgula!

```python
lista_de_compras = ["Pão", "Água", "Leite", "Ovos"]
```

Perceba que cada item da lista é inicializado individualmente e separados por vírgula. Você lembra como acessamos cada item da lista? -Através de seu **índice**!

```python
print(lista_de_compras[0]) # -> Pão
print(lista_de_compras[1]) # -> Água
print(lista_de_compras[2]) # -> Leite
print(lista_de_compras[3]) # -> Ovos
```

Lembre-se que o índice sempre começa no **zero**, isso é um erro bem comum em iniciantes, mas com o tempo você se acostuma.

Você também pode acessar a lista de trás para frente, mas agora o índice começa do -1:

```python
print(lista_de_compras[-1])
print(lista_de_compras[-2])
print(lista_de_compras[-3])
print(lista_de_compras[-4])
```

Tente imaginar a lista conforme o desenho abaixo:

![Índices de Listas](https://i.imgur.com/OPShwvQ.jpg)

Você pode alterar o valor de um item em uma lista tão fácil quanto obtê-lo, basta utilizar o índice e realizar a alteração como uma variável normal.

```python
lista_de_compras[2] = "Suco de Laranja"
```

O código altera o item "Leite" para "Suco de Laranja", tão simples quanto alterar uma variável! 

Até agora apenas alteramos o valor de itens já existentes, mas se precisarmos adicionar um novo item, como fazemos?

O que ocorre se tentarmos acessar a posição após o término da lista? -Em nosso caso, a posição 4. Veja:

```python
lista_de_compras[4] = "Café"
```

Este código não irá funcionar, pois esta atribuição apenas altera o valor de itens existentes!

Para incluir novos itens é necessário utilizar a função `append` e passar por parâmetro o item que será adicionado na lista!

```python
lista_de_compras.append("Café")
```

Agora sim!

## Vamos Praticar!

* Faça um programa que solicite o nome do usuário e depois disso faça uma saudação no formato: "Olá {nome digitado pelo usuário}"

* Faça um programa que solicite uma mensagem qualquer para o usuário e exiba esta mensagem com todas as letras em maiúsculo.

* Faça um programa que solicite a idade do usuário, verifique se o texto informado só contém números. Caso contenha somente números exiba a mensagem: "Você tem {idade digitada} anos.", caso contrário exiba a mensagem: "Você digitou uma idade inválida".

* Faça um programa que solicite o nome completo do usuário e exiba somente o seu segundo nome/primeiro sobrenome.

> **Atenção**
>
> Alguns exercícios utilizam funções que não foram mostradas neste post, você pode buscá-las através da internet, documentação do Python ou simplesmente digite a string no Visual Studio e pressione ctrl + espaço (ele mostrará as funções disponíveis).
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/03-NoneStringList.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!