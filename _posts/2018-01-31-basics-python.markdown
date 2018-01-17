---
layout: post
title:  "Começando com Python"
date:   2018-01-29 00:00:00 +0000
comments: true
tags: [Python]
published: false
serie: Programe em Python!
---

Olá pessoas!

No post anterior eu comentei sobre alguns motivos para você aprender **Python**, além disso, comentei que faria uma série de posts para ajudar você à aprender.

Pois bem, vamos começar! Sem muita teoria agora, vamos por a mão na massa!
<!--more-->

É importante ressaltar que para esta série estou utilizando a versão 3.6 do Python e o Visual Studio 2017 como IDE, você poderá escolher um ambiente diferente, mas recomendo utilizar o mesmo para evitar possíveis conflitos.

Como este é um post inicial, vamos começar do começo. Bem do começo mesmo. Geralmente a dificuldade dos meus posts fica entre intermediário e avançado, mas nesta série, vamos começar do básico: variáveis, tipos e IO.

### Declarando Variáveis

A coisa mais básica que podemos encontrar em uma linguagem de programação são as variáveis. Mas o que são variáveis?

Basicamente, variáveis são os dados manipulados pelo seu programa. Estes dados são armazenados de modo temporário na memória de seu computador.

Antigamente era necessário ter muito mais cuidado ao utilizar variáveis demais, por conta da limitação da memória dos computadores, hoje em dia isso ainda precisa ser levado em consideração, mas tempos muito mais liberdade do que antes.

Mas como sabemos as variáveis estão armazenadas na memória? -Bom, a memória do computador funciona parecido com nosso sistema social. O que você faz quando precisa dizer para alguém onde você está?

Você passa o **endereço**, certo?

A memória do computador faz a mesma coisa, cada espaço possível tem um endereço único, assim seu computador saberá onde encontrar a informação.

Imagine que o endereço são as coordenadas de latitude e longitude de um lugar, é bem específico e não se repete. Mas com que frequência você passa seu endereço no sistema de coordenadas?

Se você não for bem estranho, provavelmente usa o sistema de coordenadas muito pouco, certo? - Fazemos isso porque ele não é intuitivo para a maioria das pessoas, assim como os endereços de memória em seu computador.

Resolvemos este problema criando nomes para os países, cidades e ruas. Nessa mesma lógica, não utilizamos o sistema de endereçamento de memória do computador, ele é complicado demais e nem temos total controle de onde as coisas são armazenadas (e isso é ótimo).

Para acessar os dados em memória, utilizamos identificadores, ou seja, nomes. Uma variável no final das contas é uma composição de três coisas: identificador de acesso + dado armazenado + tipo.

Peraí, tipo? -É, tipo, mas por enquanto você não precisa se preocupar com isso.

Vamos para o código!

Como criar uma variável em Python? -É muito simples, basta dar um nome à ela e atribuir um valor, veja:

```python
valor = 42
```

E é isso.

O interessante é que você pode realizar operações com estes valores também, veja:

```python
valor = 42
resultado = 42 + 10
```

Neste caso, a informação armazenada na variável `resultado` será o resultado da expressão matemática. Assim como em muitas outras linguagens, você pode utilizar uma variável como um valor. Ou seja, qualquer lugar em que você colocaria um valor, você pode substituir por uma variável.

```python
valor = 42
resultado = valor + 10
```

Viram só, apesar do valor armazenado na varíavel `resultado` ser o mesmo do outro exemplo (52), agora estamos utilizando a variável para calcular.

Você pode exibir o resultado armazenado nas variáveis com da função `print`, veja:

```python
valor = 42
resultado = valor + 10
print(resultado)
```

Vamos fazer alguns exercícios?

* Faça um algoritmo para resolver a equação z = x + y - 4, armazenando o resultado na variável z. Considere que os valores iniciais de x e y são, respectivamente, 10 e 5. Depois disso exiba o resultado.

* Faça um algoritmo para resolver a equação z = a * a - b + c, armazenando o resultado na variável z.
Considere que os valores iniciais de a, b e c são, respecitvamente, 4, 6.5 e 10.5. Depois disso exiba o resultado.

> **Atenção**
>
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/01-VariaveisTiposIO.py)
  

Conseguiu responder? -Eu espero que sim! Caso não tenha dado certo, você pode conferir as respostas no link descrito acima.

Agora que você já realizou alguns pequenos testes, vamos falar dos **tipos**. Lembra que falamos que uma variável é composta por: identificador, dado e tipo? Pois é.

Acredito que tenha ficado muito claro a questão do identificador e do valor, mas talvez o tipo ainda esteja confuso, mas calma, eu explico.

O tipo é o que define a característica do dado que a variável armazena, em Python não precisamos dizer explícitamente isso em nenhum momento, mas podemos deduzir.

Nos exercícios fizemos algumas operações matemáticas, mas nem todos os dados são números. As vezes precisamos armazenar valores de outros tipos, vamos conhecê-los:

* Números: inteiros (int) e com casas decimais (float)
* Textos (string ou str)
* Lógicos (bool)
* Vazio (None)

Uma coisa muito interessante sobre isso, que basta conhecermos os tipos e podemos trabalhar como eles como fizemos com os números antes. Você talvez nem tenha reparado, mas no segundo exercício utilizamos tanto números inteiros como *floats*.

Bastou declararmos as variáveis `b` e `c` com valores decimais.

Vamos para os textos agora!

Para definir que um valor é uma string existem 3 opções:
* Entre aspas simples: `'texto'`;
* Entre aspas duplas: `"texto"`;
* Entre uma trinca de aspas duplas: `"""texto"""`;

Você pode utilizar qualquer um deles e seu programa irá entender que se trata de uma string.

Vamos fazer um exemplo com a função print:

```python
print("Olá Python!")
```

Particularmente eu prefiro utilizar a sintaxe com aspas duplas, mas esteja livre para usar a que mais lhe agradar.

Vamos juntos fazer um programa que solicite o nome do usuário e depois exiba-o no console! Para solicitar uma informação ao usuário utilize a função `input`, conforme código:

```python
nome = input("Digite seu nome: ")
print(nome)
```

Legal né?


Gostou do post?

Me conte nos comentários!

E Até mais!