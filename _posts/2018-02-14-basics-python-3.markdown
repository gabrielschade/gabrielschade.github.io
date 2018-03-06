---
layout: post
title:  "Lição 3: Valores None, Strings e Introdução à Listas"
date:   2018-02-14 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoas!

Se você está acompanhando esta série, você já deve ser capaz de criar variáveis e criar desvios condicionais em seu programa. Agora vamos olhar um pouco mais de perto algumas características dos tipos em Python!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/03-NoneStringList.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Vamos começar apresentando um novo tipo de valor, os valores `None`.

Valores `None` são utilizados para descrever variáveis que foram criadas, mas que não possuem nenhum valor associado à elas. Espera, como assim?

Eu explico.

Para utilizar uma variável, você precisa declará-la antes, certo? Vamos fazer um teste!
Execute o código abaixo:

```python
print(teste)
```

Simples assim, apenas uma linha de código. Este código, por mais simples e inofensivo que possa parecer gera um erro em sua aplicação.

Este erro ocorre porque a variável `teste` não foi criada antes, então ocorre o que chamamos de `NameError`.

Mas e se não quisermos que este erro ocorra, mas ao mesmo tempo também não queremos alocar memória para a variável `teste`, como fazer? - Use o `None`!

```python
teste = None
print(teste)
```

Problema resolvido!

Outro ponto importante é que os desvios condicionais sempre resultarão em `False` quando realizado com uma variável que contenha o valor `None`:

```python
teste = None

if teste:
    print(teste) # -> não será executado
```
Bem simples né?

## Explorando um pouco mais das strings

Já usamos algumas vezes variáveis do tipo string, mas ainda há muito trabalho para fazer!

Este tipo permite uma série de operações diferentes. Podemos verificar se o texto contém somente números, colocar a primeira letra maiúscula, substituir uma letra no texto e muitas outras coisas.

Todas estas operações são chamadas de **funções**. Este é um conceito bastante poderoso nas linguagens de programação. Por definição, uma função é um *comportamento* que pertence à algo, enquanto uma variável é uma *característica* de algo.

Como assim? - Eu explico, imagine um carro, por exemplo. Algumas características de seu carro são: quantidade de portas, cor, marca, ano e assim por diante. Todas estas características podem ser transcritas para um programa na forma de variáveis.

Mas o seu carro também liga, acelera e freia. Todas estas coisas são comportamentos, ou seja, são ações do carro. As ações são traduzidas para um programa através de **funções**.

Mas não se assuste, é muito fácil de usar!

Vamos fazer o primeiro exemplo juntos, vamos transformar a primeira letra de uma string em maiúsculo, faremos isso através da função `capitalize`:

```python
nome = "gabriel"
nome_maiusculo = nome.capitalize()
print(nome_maiusculo) # -> Gabriel
```

Note que quando executamos uma função é necessário utilizar `()`, isso ocorre porque existem casos ontem precisamos informar valores para realizar uma ação, para substituir uma letra com a função `replace`, por exemplo.

Neste caso precisamos informar dois valores diferentes: o primeiro indica a letra que será substituída e o segundo indica a letra que a substituirá, veja:

```python
nome = "gabriel"
nome_com_letra_alterada = nome.replace('e','a')
print(nome_com_letra_alterada) # -> gabrial
```
Estes valores que são passados para uma função são chamados de **parâmetros**.

Outra função muito útil na strings é a função `format`, ela permite, como o nome sugere, formatar textos. Então eu posso colocar um texto em itálico? - Não estamos falando deste tipo de formatação.

Neste contexto a função `format` permite que você misture um texto livre com variáveis ou valores, veja um exemplo!

```python
mensagem = "Olá {0}".format(nome_maiusculo)
print(mensagem) # -> Olá Gabriel
```
Ok, mas isso ficou confuso demais! - Calma, não é nada demais.

O que a função `format` faz é substituir no texto a formatação `"{N}"` pelo parâmetro N. Onde N é a ordem dos parâmetros, começando por zero (0). Veja outro exemplo:

```python
segunda_mensagem = "Olá {0}, me chamo {1}".format(nome_maiusculo, "Python")
print(segunda_mensagem) # -> Olá Gabriel, me chamo Python
```
Viu só? O primeiro parâmetro entrou no lugar de `"{0}"`, o segundo no lugar de `"{1}"` e assim por diante!

Mas o que acontece se colocarmos mais de um `"{0}"`? Vamos testar!

```python
terceira_mensagem = "Olá {0}, me chamo {1}. {0}".format(nome_maiusculo, "Python")
print(terceira_mensagem) # -> Olá Gabriel, me chamo Python. Gabriel
```

Como pode ser visto no código, todas as ocorrências desta formatação são substituídas pelo parâmetro!

Na verdade, existe uma segunda forma para misturarmos texto livre com variáveis, ela se chama interpolação de strings! -Esta é minha forma preferida!

Eu considero esta sintaxe mais simples de entender. Para fazermos uma interpolação de strings precisamos colocar a letra "f" antes da string. Além disso, a sintaxe não é mais baseada em posição de parâmetro, basta colocarmos direto o nome da variável entre chaves.

```python
mensagem = f"Olá {nome_maiusculo}"
print(mensagem) # -> Olá Gabriel
``` 

O problema desta abordagem é que nem todas as ferramentas de desenvolvimento entendem a interpolação, então talvez você precise digitar o nome da variável em um texto, o que pode causar erro de digitação.

Vamos agora para a última função de strings que vou mostrar aqui, ela se chama `split`!

Esta função é muito útil e bastante popular. Neste caso, escolhemos um caractere para quebrar o texto em partes diferentes. Por exemplo, imagine uma variável com o seguinte valor: `"prato,garfo,copo"`.

Esta variável contém o nome de alguns itens de cozinha, mas e se precisássemos separá-los? -Simples, utilize a função `split` separando os valores pela vírgula!

```python
itens_cozinha = "prato,garfo,copo"
print(itens_cozinha.split(",")) # -> ["prato", "garfo", "copo"]
```
O que são esses colchetes? Vamos entender o que está acontecendo.

Quando utilizamos a função `split` dividimos o texto em vários pedaços diferentes, afinal, agora temos três itens ao invés de um texto.

Mas se só podemos armazenar um valor em uma variável como guardaríamos os 3 itens?

Para nossa sorte há um tipo especial chamado **lista**. Este tipo funciona como uma **coleção** de valores, você utiliza apenas um identificador/nome para acessar vários valores diferentes. 

Vamos guardar o resultado do split em uma variável, veja:

```python
itens = itens_cozinha.split(",")
```
Ok, mas agora como eu faço para acessar os valores individuais? -Simples, utilizamos um **índice**.

Índice?? - Não faço ideia do que seja isso!

Não se preocupe, você já trabalhou com índices na função `format`, isso mesmo, índices são números sequênciais que no caso do **Python** começam com zero (0).

No caso das listas utilizamos colchetes para definir os índices, veja:

```python
itens = itens_cozinha.split(",")
print(itens[0]) # -> prato
print(itens[1]) # -> garfo
print(itens[2]) # -> copo
``` 
Sempre temos que tomar cuidado ao acessar um índice, pois quando acessamos índices além dos limites da lista é gerado um erro!

```python
print(itens[3]) # -> Gera um erro
```
Tenha em mente que sempre o maior índice da lista vai ser igual à seu tamanho -1, no nosso exemplo temos três itens diferentes, portanto o último índice válido é 2.

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