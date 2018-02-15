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

Ao utilizar o `append`, adicionamos um item ao fim da lista, ou seja, ele será o último elemento. Além do `append` existem diversas outras funções e recursos para este tipo de variável. Um dos recursos disponíveis é a palavra reservada `in`.

Podemos utilizar este comando para checar se um item está na lista, basta utilizar a seguinte sintaxe: `item in lista`, isso irá retornar um valor lógico `True` ou `False`, dependendo se o item informado está contido na lista ou não.

Isso nos permite criar desvios condicionais, por exemplo, veja:

```python
if "Café" in lista_de_compras:
    print("Preciso comprar café")
```

Bem simples né?

Outra tarefa bem comum é a necessidade de contar quantos itens uma determinada lista possui, para fazer isso utilizamos a função `len` embutida na linguagem. O comando `len` é uma abreviação para *length*, palavra em inglês para tamanho.

A função `len` deve receber a lista por parâmetro e ela retornará um inteiro com a quantidade de elementos. 

```python
len( lista_de_compras ) # -> 5
```

Perceba que a quantidade de elementos não é a mesma coisa que a posição máxima do índice. Em nosso exemplo, a lista contém cinco itens, portanto temos como índices válidos 0 até 4.

Já vimos como adicionar itens em uma lista, como verificar se um item está contido nela e até verificar a quantidade de itens, mas ainda não vimos como remover um item da lista. Algum palpite?

Muitos iniciantes tentam realizar a seguinte operação:

```python
lista_de_compras[2] = None
```
O raciocínio até que faz um pouco de sentido, se eu digo que não há nada na posição 2, então este item não deve existir, certo? -Errado.

Ao fazer a operação acima, você irá dizer que o item na posição 2 não contém nada e não que não há item na posição 2. Percebe a diferença sutíl? No primeiro caso você diz que a posição 2 existe, mas não há nada nela, enquanto no segundo caso, você remove ela da lista.

Ok, mas como fazemos para remover ela da lista? Da mesma forma que temos uma abreviação para *lenght* também há uma abreviação para *delete*. Este comando chama-se `del`.

Vamos remover os ovos(posição 3) da nossa lista de compra!

```python
del lista_de_compras[3]
```
Simples assim.

Agora é importante você notar que, a posição 3 não deixará de existir. O que acontece de fato, é que todos os itens que estavam em uma posição maior que a do item excluído são deslocados uma posição para a esquerda.

Ou seja, tínhamos o café na posição 4 e agora ele está na posição 3, fazendo com que a posição 4 deixe de existir.

Vamos entender melhor cada função com alguns exercícios!

## Vamos Praticar!

* Faça um programa que inicialize uma lista com o nome das pessoas da sua família.

* Faça um programa que inicialize uma lista vazia e solicite ao usuário 3 nomes de cidades, um por vez, cada vez que o usuário digitar um nome, o programa deve incluir este nome na lista de cidades. 

* Faça um programa que inicialize uma lista com vários números diferentes, depois disso, solicite ao usuário um número, verifique se o número está ou não na lista e exiba uma mensagem notificando o usuário do resultado.

* Faça um programa que inicialize uma lista vazia e a preencha com 5 nomes diferentes digitados pelo usuário, depois disso solicite um número de 0 até 4 e remova o elemento desta posição.

> **Atenção**
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/04-Listas.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!