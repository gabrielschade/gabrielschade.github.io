---
layout: post
title:  "Lição 5: Laços de Repetição - Parte 1"
date:   2018-02-28 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoa!

Hoje veremos um recurso **muito** importante em qualquer linguagem de programação: Os laços de repetição, também conhecidos como loops.

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/05-Loops.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

O último post antes deste explicou o funcionamento das listas e continuaremos a partir dele.

Você deve se lembrar de como acessamos um item de uma lista, certo? -Através de seu índice! Vamos fazer um exemplo criando uma lista de dez números, veja:

```python
numeros = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
```

Como faríamos para imprimir cada número individualmente no console?

```python
numeros = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

print (numeros[0])
print (numeros[1])
print (numeros[2])
print (numeros[3])
print (numeros[4])
print (numeros[5])
print (numeros[6])
print (numeros[7])
print (numeros[8])
print (numeros[9])
```
Perceba que esta tarefa é bastante trabalhosa, além disso, podemos ter problemas com listas maiores. Este tipo de tarefa **repetitiva** pode ser substituída por um laço de **repetição**!

Veja outra forma de realizar esta tarefa:

```python
numeros = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

for numero in numeros:
    print (numero)
```
Muito mais simples, não é mesmo? Mas calma, vamos entender como funciona este comando. 

Pelo resultado é notável que as instruções abaixo do comando `for` executam mais de uma vez, na verdade por isso que se chamam laços de **repetição**. Porque repetem as instruções até um determinado ponto.

Vamos lá, primeiro a sintaxe para o comando: é necessário usar a palavra reservada `for` para iniciar o comando, parecido com o que fizemos com o comando `if`. Então declaramos uma variável, seguida do comando `in` e do nome de uma variável que seja uma lista.

Esta estrutura define que, a variável que criamos (`numero`, no nosso exemplo) receberá um item da lista em cada interação do laço, ou seja, cada vez que o laço for repetir as instruções a variável troca o valor para o próximo item da lista.

Isso ocorre até a lista chegar ao fim, neste momento o laço de repetição é encerrado e o programa segue normalmente.

Mas então só podemos utilizar o laço de repetição para percorrer listas? -Definitivamente, **não**.

Podemos utilizá-los também para repetir uma série de instruções repetidamente, para fazer isso temos a função `range` disponível no Python.

Esta função permite criar listas sob demanda, veja:

```python
valor = 0
for indice in range(5):
    valor += 10
    print(valor)
```

Neste caso serão exibidos os valores: 10, 20, 30, 40 e 50. Isso porque a função `range` indica que o laço deve ser repetido 5 vezes. Para garantir isso, ela cria uma lista com os valores [0, 1, 2, 3, 4].

Esta cria uma lista neste formato por padrão, mas é possível alterar este comportamento através de parâmetros. É possível, por exemplo, utilizar dois parâmetros diferentes, um com o valor inicial e outro com o valor limite.

```python
for valor in range(5, 10):
    print(valor)
```
Neste caso a lista criada conterá os valores: [5, 6, 7, 8, 9]. Note que o valor limite nunca é incluso na lista, ele de fato, define o limite dela e não seu último valor.

Um último modificador possível na função `range` é o salto entre cada valor. Podemos especificar para os valores subirem de dois em dois, dez em dez e assim por diante. Basta inserirmos um último parâmetro!

```python
for valor in range(0, 10,2):
    print(valor)
```
Neste caso a lista resultante é: [0, 2, 4, 6, 8], bem legal né?

Agora que já vimos as variações do `range` e deste comando, vamos praticar!

## Vamos Praticar!

* Faça um programa que inicialize uma lista de compras com 5 itens diferentes e exiba todos utilizando um laço de repetição.

* Faça um programa que inicialize que crie uma lista com os valores de 1 até 10 e depois exiba apenas os números pares. 

* Faça um programa que exiba todos os valores ímpares entre 50 e 100 utilizando o range.

* Faça um programa que inicialize uma lista vazia, solicite ao usuário 10 números diferentes, um por vez. Caso o número digitado seja par, acrescente um ao seu valor. Depois disso, exiba os 10 números digitados.

* Faça um programa que exiba as tabuadas de 1 até 10 no formato: "2 x 3 = 6", (utilize dois comandos `for`)

> **Atenção**
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/05-Loops.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!