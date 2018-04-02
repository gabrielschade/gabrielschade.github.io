---
layout: post
title:  "Lição 8: Modularização de código com Funções!"
date:   2018-04-23 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoa!

Mais um post na série para aprendizagem em Python, agora vamos aprender sobre como podemos quebrar nossos códigos em partes menores, ou seja, modularizá-lo!

Vamos fazer isso com **funções**!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/08-Funcoes.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Este post talvez seja um pouco mais teórico que os anteriores, mas não se preocupe, vamos programar bastante aqui também!

Até o momento estamos programando soluções pequenas. Cada exercício se baseava em um problema específico que conseguimos resolver com poucas linhas de código, mas em aplicações reais é comum um único programa resolver diversas coisas diferentes.

A criação de soluções mais complexas e programas maiores se torna uma tarefa bastante difícil se continuarmos programando da maneira que estamos. Precisamos fazer com que o programa seja separado em peças menores. 

Dessa forma, todas as vezes que precisarmos resolver um problema mais complexo, podemos conectar essas peças para formar uma solução.

Para isso, precisamos que estas peças sejam reutilizáveis, assim como peças de lego.

{% include image.html link="https://i.imgur.com/e0mEtkB.jpg" alt="Funções como peças de lego" width=80 %}

Estas peças reutilizáveis são chamadas de `funções`. Elas são formadas por um bloco de código que executa uma determinada ação.

Na verdade, durantes os exercícios anteriores, já utilizamos várias vezes funções disponíveis no Python! O `print` e o `input` são exemplos de funções disponíveis, mas o mais interessante disso é que podemos definir nossas próprias funções!

De modo geral, cada função deve realizar apenas **uma ação**. Desta forma ela se torna mais reutilizável e útil para seus programas.

Sempre que você tiver uma função que realiza mais de uma tarefa fique atento, isso provavelmente é um sinal de código ruim. Talvez esta função deva ser quebrada em duas ou mais funções.

Vamos ver como podemos definir uma função em nosso código Python!

```python
def ola_mundo():
    print("Olá mundo")
```
Primeiro é necessário utilizar a palavra reservada `def`, esta palavra é responsável por **definir** a função. Depois disso incluímos o nome da função, esse nome deve seguir as mesmas regras para nome de variáveis.

Por fim, estamos incluindo os caracteres `()`, a partir daqui utilizamos os `:` e todos os comandos pertencentes à este bloco segue as mesmas regras dos comandos já vistos: `if`, `while`, `for` e etc.

Mas há uma diferença importante, ao definirmos uma função não fazemos com que aqueles comandos sejam executados, estamos apenas descrevendo o que irá acontecer quando **executarmos** a função.

Para executar uma função você precisa utilizar o nome dela seguido dos parênteses, veja:

```python
def ola_mundo(): # -> Definição
    print("Olá mundo")

ola_mundo() # -> Chamada para realizar a execução
```

Você pode colocar dentro de uma função quantos comandos desejar e todos eles serão executados assim que a função for executada.

Depois que uma função é definida, é como se a chamada para executá-la fosse um novo comando do Python, a partir de agora, estamos criando nossas próprias instruções e elas se comportam da mesma maneira.

Veja como fica o fluxo de execução do programa considerando que esta chamada é realizada entre operações que já vimos antes.

```python
numero = 10
numero2 = 15
ola_mundo()
resultado = numero + numero2
```

O que acontece neste fluxo?

Bom, primeiro as duas variáveis `numero` e `numero2` são declaradas e os valores 10 e 15 são atribuídos à elas respectivamente. Depois dessas duas linhas iniciais a função `ola_mundo` é executada. 

Quando isso acontece a execução do código principal "congela" para executar todas as instruções da função. Depois disso ele retorna para a próxima instrução.

{% include image.html link="https://i.imgur.com/dqB35MQ.jpg" alt="Fluxo de execução de uma função" width=80 %}

Dividir um algoritmo em partes menores também auxilia bastante a testabilidade de um programa. Sempre será mais simples testar um bloco pequeno do que o programa por completo.

### Parâmetros

É comum precisarmos de dados para realizar algum tipo de operação. Veja a função `print` por exemplo, a tarefa desta função é escrever qualquer coisa no console certo? -Certo.

Para permitir que isso seja possível, a função `print` precisa receber um **parâmetro**. No caso da função print o parâmetro é o texto que será escrito, mas os parâmetros podem ser utilizados para tarefas diferentes.

Vamos criar uma função que eleve qualquer número ao quadrado!

```python
def elevar_ao_quadrado(numero):
    print(numero * numero)
```

Basta colocarmos o parâmetro entre os parêntenses na definição da função! Como já utilizamos várias vezes a função `print` você deve imaginar como passamos um número para está função né?

```python
elevar_ao_quadrado(9)
```
É interessante notar que também podemos passar variáveis e expressões no parâmetro, veja só:

```python
elevar_ao_quadrado(9)
elevar_ao_quadrado(4 + 5)
nove = 9
elevar_ao_quadrado(nove)
```

Em todos os casos o resultado da função será o mesmo, afinal estamos passando o mesmo parâmetro!

Agora vamos criar uma função que some **dois** números diferentes! Sim, você pode criar múltiplos parâmetros! Basta separá-los por vírgula, veja:

```python
def soma(numero1, numero2):
    print(numero1 + numero2)

soma(2, 5)  # -> 7
soma(3, 3)  # -> 6
soma(10, 5) # -> 15
```

Legal né?

## Vamos Praticar!

* Faça um programa que crie um dicionário para definir um produto, contendo sua descrição e seu preço.

* Faça um programa que inicialize uma lista de compras com 5 itens diferentes, onde cada item é um dicionário contendo a descrição e preço do produto. Depois disso, percorra a lista e exiba as informações de cada item.

* Utilize a lista de compras do programa anterior para identificar qual o produto mais barato e qual o produto mais caro da lista de compras.

* Faça um programa que tenha uma lista com 5 de pessoas, onde cada pessoa tem seu nome e sobrenome armazenado em um dicionário, depois disso, exiba todos os nomes e sobrenomes. Para complicar um pouco as coisas, vamos simular que estes dados foram obtidos da web e com isso recebemos algumas inconsistências. Duas das cinco pessoas possuem o dicionário onde as chaves estão em maiúsculo e os outros três em minúsculo.

> **Atenção**
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/07-Dicionario.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!