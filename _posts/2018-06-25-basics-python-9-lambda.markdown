---
layout: post
title:  "Lição 9: Funções Lambda"
date:   2018-06-25 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoa!

Este vai ser o último post da série para aprendizagem em Python, vamos fechar ela com um tipo diferente de função: as expressões lambdas!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/09-Funcoes-2.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Para compreender este post é essencial que você tenha compreendido antes o assunto: funções. Se você já passou pelo post, ótimo, vamos começar com as funções lambda, também conhecidas como expressões lambda.

Todas as características de uma função lambda são muito parecidas com as funções comuns que já vimos, com exceção de duas coisas: elas não possuem uma definição em código, ou seja, são declaradas como variáveis e não possuem um `def` próprio; e elas são funções de **uma** linha, que funcionam como se houvesse a instrução `return` antes do comando.

```python
def soma(numero1, numero2):
    return numero1 + numero2
```

A função acima é uma função de soma normal, por ser uma função de uma linha podemos transformá-la em uma função lambda, ou em uma **expressão lambda**. Para isso, utilize o comando **lambda** conforme código:

```python
soma_lambda = lambda numero1, numero2: numero1 + numero2
```
Notem que a sintaxe é um pouco diferente, utilizamos a palavra reservada `lambda` para declarar o início da expressão, depois disso, inserimos os parâmetros separados por vírgula. Por fim, colocamos o corpo da expressão.

Lembrando que o corpo da expressão sempre deve conter apenas uma linha de comando e ela funciona como se houvesse uma instrução de `return` antes dessa linha.

Portanto as duas funções de soma são definições diferentes para a mesma função:

```python
print(soma(1,2))        # -> 3
print(soma_lambda(1,2)) # -> 3
```

Também podemos ter uma função lambda **sem** parâmetros, quando for o caso, basta omitirmos a declaração de parâmetros normalmente:

```python
obter_valor = lambda: 3 + 2
```

Na prática essa função não faz tanto sentido, mas é um bom exemplo para entendermos o que está acontecendo. Neste caso criamos uma função chamada `obter_valor` que sempre retorna o número cinco. A definição padrão desta função ficaria da seguinte maneira:

```python
def obter_valor():
    return 3 + 2
```

Perceba que um dos pontos fortes de expressões lambda é sua síntese, ela são uma forma rápida de definir funções simples.

Mas e para funções sem retorno? -Nenhum problema!

```python
ola = lambda: print('Olá mundo')
ola() # -> Olá mundo 
```

Veja que estamos utilizando uma função lambda que não possui retorno e nem parâmetros! Tudo funcionará corretamente. 

Talvez você estranhe um pouco, afinal, eu havia escrito antes que as expressões lambda funcionam como se houvesse um `return` antes da instrução e a função `print` não gera retornos. Então como ele entende?

Na prática você pode obter o valor de retorno da função `print`, mas ele será um valor do tipo `None`! Portanto, a mesma sintaxe de lambda continua funcionando normalmente.

### Utilização

Ok, entendi o conceito, mas para o que isso serve?
Agora vem a parte mais complicada desta lição, existem funções que podem receber outras funções por parâmetro!

Sim, você não leu errado, uma função recebe como parâmetro outra função. Estes são os exemplos onde as expressões lambda são mais utilizadas.

Vamos fazer um exercício utilizando os conceitos que já sabemos e depois refazê-lo utilizando expressões lambda!

Vamos declarar um array com diversos números diferentes, depois disso, copiaremos apenas os números pares para um segundo array e o exibiremos no console. Tranquilo, certo?

```python
numeros = [0,2,3,4,5,7]
pares = []
for numero in numeros:
    if numero % 2 == 0:
        pares.append(numero)

# Exibe os números
for par in pares:
    print(par)
```
Utilizamos um laço de repetição para fazer a *filtragem* do array que contém todos os números para um array que contenha somente os números pares. Neste laço de repetição obtemos os números um por um, verificamos se ele é par ou não e caso seja, adicionamos ele ao array de pares.

Este comportamento de **filtro** em uma lista é bastante comum, por conta disso, a linguagem oferece um recurso para simplificar esta implementação. Esse recurso é a função `filter`!

Esta função recebe dois parâmetros: um deles é a listagem que vai ser filtrada, claro. O outro parâmetro é a função que realiza o filtro da lista! Essa função de filtro deve possuir apenas um parâmetro (do mesmo tipo de cada elemento de um array) e deve retornar um `boolean`.

Dessa forma, todas as listas, de qualquer tipo, podem utilizar a mesma função `filter`.

No nosso caso, temos uma lista de números, portanto nossa função deve receber um número e retornar um valor lógico, na prática, ela é a mesma comparação que já fizemos na implementação anterior: `numero % 2 == 0`, veja como fazemos a mesma coisa utilizando o filter:

```python
numeros = [0,2,3,4,5,7]
pares = filter(lambda valor: valor % 2 == 0, numeros)

for par in pares:
    print(par)
```

Transformamos todo nosso laço de repetição com um desvio condicional em uma única instrução! Legal né?
O `filter` não é a única função capaz de realizar este tipo de operação, mas é um bom exemplo para você entender o poder das expressões lambda!

### Vamos Praticar!

* Faça um programa que escreva "Minha primeira função", esta escrita deve ser realizada a partir da chamada de uma função que foi declarada como uma expressão lambda.

* Faça um programa que solicite o nome do usuário e a idade do usuário, depois disso exiba a mensagem: *"{nome} possui {idade} anos."*. Esta mensagem deve ser escrita em uma função lambda.

* Faça um programa que solicite dois números ao usuário e exiba a multiplicação deles. A multiplicação deve ser calculada em uma função lambda.

* Faça um programa que solicite cinco números ao usuário, depois disso, exiba apenas os números maiores do que 10. Utilize a função `filter` para fazer isso.

* Faça um programa que solicite dez números ao usuário, depois disso, exiba todos números pares e só então exiba todos os números ímpares. Utilize a função `filter` para fazer isso.

> **Atenção**
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/09-Funcoes-2.py), elas estão bem no fim no arquivo.

O que achou do post?

Me conte nos comentários!

E Até mais!