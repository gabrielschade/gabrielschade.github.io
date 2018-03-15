---
layout: post
title:  "Lição 6: Laços de Repetição - Parte 2"
date:   2018-03-19 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoas!

Que tal continuar nossos exemplos com laços de repetição?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/06-Loops%202.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

O último post antes deste introduziu o conceito de laços de repetição utilizando o comando `for`. Mas esta não é a única forma de realizar este tipo de operação!

Além do `for`, temos o comando `while`! 

Sua sintaxe é um pouco diferente da sintaxe do `for`, mas muito parecida com a sintaxe do comando `if`, mas não se engane, as semelhanças entre o `if` e o `while` acabam aí.

Para fins de exemplo, vamos utilizar a mesma lista do post passado!

```python
numeros = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
```

A ideia por trás do comando `while` é repetir uma tarefa **enquanto** uma condição for verdadeira, ou seja, na declaração do comando precisamos realizar uma comparação, caso esta comparação seja verdadeira o bloco de instruções do `while` será executado.

O programa voltará para o início do bloco depois que a última instrução deste comando for executada, fazendo novamente a comparação.

Quando esta comparação resultar em um valor `False` o bloco de instruções do `while` será pulado e o programa continuará normalmente. Vamos fazer um exemplo?

Vamos imprimir todos os números da lista `numeros`, veja:
```python
numeros = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

posicao = 0
while posicao < len(numeros):
    print(numeros[posicao])
    posicao += 1
```
Note que acaba ficando um pouco diferente do comando `for`. Neste caso precisamos armazenar a posição da lista em uma variável e alterá-la manualmente a cada interação do laço de repetição.

Isso pode causar um problema sério em seu programa! Se por um acaso esquecermos de alterar os valores que fazem a comparação do `while` podemos ficar presos em um *loop infinito*, ou seja, nosso programa nunca irá acabar!

Vamos fazer a experiência! Retire a instrução que adiciona 1 para a variável `posicao` e execute o programa:

```python
numeros = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

posicao = 0
while posicao < len(numeros):
    print(numeros[posicao])
```
![Loop infinito](https://i.imgur.com/VY8hqRD.jpg)

Portanto, não esqueça de alterar os valores que influenciam na comparação!

Se por algum motivo aleatório, você decidir que quer fazer um laço de repetição infinito, basta utilizar o comando desta forma:

```python
while True:
    print("INFINITO")
```
Ao invés de realizarmos uma comparação, marcamos diretamente o resultado da comparação como `True`, mas cuidado, isso pode dar ruim!

Agora vamos para dois novos comandos que podem ser utilizados em um laço de repetição, devo dizer que, não gosto de nenhum deles, mas eles existem e não pretendo ignorá-los.

São eles: `continue` e o `break`, ambos interferem nas interações do laço de repetição.

O comando `continue` faz com que o laço de repetição volte para o início do bloco, ou seja, para que ele continue com a próxima interação, mas interrompe imediatamente a interação atual.

Vamos fazer um exemplo para escrever todos os elementos da lista de números, exceto a posição 5:

```python
posicao = 0
while posicao < len(numeros):
    posicao += 1
    if posicao == 5:
        continue
    print(numeros[posicao-1])
```
Eis a questão que me faz não gostar desta instrução, você pode simplesmente remanejar as instruções para que não precise utilizar o `continue`, veja:

```python
posicao = 0
while posicao < len(numeros):
    posicao += 1
    if posicao != 5:
        print(numeros[posicao-1]) 
```

O resultado final é o mesmo e neste caso você não interrompe o fluxo principal do programa.

A outra instrução é o `break`, neste caso a interrupção é mais agressiva, ela não só interrompe a interação atual como o próprio laço de repetição.

Isso significa que, ao utilizarmos o comando `break` vamos sair do laço de repetição mesmo se comparação ainda for verdadeira, quebrando inclusive loops infinitos.

```python
posicao = 0
while posicao < len(numeros):
    posicao += 1
    if posicao == 5:
        break
    print(numeros[posicao-1])
```

Com o código acima, seriam exibidos os números da posição 0 até a posição 4. Nenhum número depois da posição 4 será exibido no console, porque o `break` interrompeu todo o laço de repetição.

A estratégia para evitar o `break` é simples. Se você está utilizando-o provavelmente sua lógica de verificação no laço de repetição não está cumprindo seu papel. No exemplo acima não queremos percorrer até o final da lista como a condição sugere, mas sim, até a quarta posição:

```python
posicao = 0
while posicao < 5:
    print(numeros[posicao])
    posicao += 1
```

Esse post foi fácil ein?! 

Então agora é hora de por a mão na massa!

## Vamos Praticar!

* Faça um programa que inicialize uma lista de compras com 5 itens diferentes e exiba todos utilizando um laço de repetição `while`.

* Faça um programa que inicialize uma lista com os valores de 1 até 10 e depois exiba apenas os números pares utilizando `while`.

* Faça um programa que inicialize uma lista vazia, solicite ao usuário 10 números ímpares diferentes, um por vez. Caso o número digitado seja par, solicite novamente um número, até que o valor seja um número ímpar. Depois disso, exiba os 10 números digitados.

* Faça um programa que exiba um menu para o usuário selecionar uma das três opções:
 * 1 - Olá mundo
 * 2 - Eu programo em Python
 * 3 - Laços de repetição

O programa deve solicitar ao usuário uma das 3 opções, caso o usuário digite um valor diferente das opções (1, 2 ou 3), o programa deve apresentar novamente o menu de opções até que uma delas seja escolhida.
Por fim, o programa deve exibir uma mensagem diferente para cada opção.

* Remove a instrução `break` e a instrução `continue` do laço de repetição abaixo:
```python
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
posicao = 0
while posicao < len(numeros):
    posicao += 1
    if posicao == 3:
        continue
    elif posicao == 6:
        break
    print(numeros[posicao-1])
```
> **Atenção**
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/06-Loops%202.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!