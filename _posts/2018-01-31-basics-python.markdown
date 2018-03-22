---
layout: post
title:  "Lição 1: Começando com Python"
date:   2018-01-31 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoa!

No post anterior eu comentei sobre alguns motivos para você aprender **Python**, além disso, comentei que faria uma série de posts para ajudar você à aprender.

Pois bem, vamos começar! Sem muita teoria agora, vamos por a mão na massa!
<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/01-VariaveisTiposIO.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %}) 

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
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/01-VariaveisTiposIO.py), tome cuidado para não receber spoilers dos próximos exercícios.
  

Conseguiu responder? -Eu espero que sim! Caso não tenha dado certo, você pode conferir as respostas no link descrito acima.

Agora que você já realizou alguns pequenos testes, vamos falar dos **tipos**. Lembra que falamos que uma variável é composta por: identificador, dado e tipo? Pois é.

Acredito que tenha ficado muito claro a questão do identificador e do valor, mas talvez o tipo ainda esteja confuso, mas calma, eu explico.

O tipo é o que define a característica do dado que a variável armazena, em Python não precisamos dizer explícitamente isso em nenhum momento, mas podemos deduzir.

Nos exercícios fizemos algumas operações matemáticas, mas nem todos os dados são números. As vezes precisamos armazenar valores de outros tipos, vamos conhecê-los:

* Números: inteiros (int) e com casas decimais (float)
* Textos (string ou str)
* Lógicos (bool)

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

Legal né? - Note que você pode utilizar a função `input` para obter dados de qualquer tipo, não só para textos, mas nos outros casos será preciso transformar o tipo.

Teremos um post completo sobre o tipo string, ele possui diversas características específicas, então não vou me alongar por aqui, vamos para o próximo tipo: O tipo lógico!

Variáveis do tipo lógico ou *boolean* são utilizadas para definir verdades (True) e mentiras (False). Só existem estes dois possíveis valores.

Veja um exemplo:

```python
verdade = True
mentira = False
```
Geralmente os valores deste tipo são escritos em letras minúsculas, Python tem esta particularidade, onde estes valores começam com letra maiúscula, mas as diferenças acabam aí.

Assim como os valores numéricos, também é possível realizar operações com valores lógicos. Utilizamos os operadores: não (`not`), *e* (`and`) e *ou* (`or`).

Vamos aplicar estes operadores em sentenças de linguagem natural:

* Hoje deu sol pela manhã -> considere esta frase como verdade
* Hoje choveu pela tarde  -> considere esta frase como mentira

Estas afirmações em português podem ser interpretadas como:

```python
sol_pela_manha   = True
chuva_pela_tarde = False
```
Agora vamos aplicar os operadores, começando pelo operador de negação (`not`):

* Hoje **não** deu sol pela manhã -> se a primeira afirmação era verdade, esta afirmação é mentira
* Hoje **não** choveu pela tarde  -> se a segunda afirmação era mentira, esta afirmação é verdade

Perceberam algo?

O operador de negação inverte o valor de um valor lógico! O que antes era verdade agora é mentira e vice-versa.

Veja no código:

```python
sol_pela_manha   = True
chuva_pela_tarde = False

sol = not sol_pela_manha     # -> False
chuva = not chuva_pela_tarde # -> True
```

O segundo operador é o operador *e*. Este operador relaciona dois valores diferentes para produzir um novo. Neste caso, para o resultado de uma operação *e* ser verdade, os dois valores relacionados precisam ser verdadeiros.

Vamos novamente para as sentenças:

* Hoje deu sol pela manhã **e** choveu pela tarde -> será uma mentira, pois definimos que não houve chuva pela tarde.

* Hoje deu sol pela manhã **e** **não** choveu pela tarde -> será verdade, pois ao negarmos o valor da chuva, os dois valores relacionados retornarão verdadeiro.

```python
sol_e_chuva = sol_pela_manha and chuva_pela_tarde         # -> False
sol_e_nao_chuva = sol_pela_manha and not chuva_pela_tarde # -> True
```

O operador *ou* funciona de forma bastante similar ao *e*, mas nesse caso o valor produzido será verdadeiro sempre que **um** dos valores seja verdadeiro. Este caso é o que funciona pior comparado à nossa linguagem, mas acho que ainda ajuda a entender:

* Hoje deu sol pela manhã **ou** choveu pela tarde -> se uma das afirmações for verdadeira, a frase é uma verdade.

Veja no código:

```python
sol_ou_chuva = sol_pela_manha or chuva_pela_tarde         # -> True
sol_ou_nao_chuva = sol_pela_manha or not chuva_pela_tarde # -> True
nao_sol_ou_chuva = not sol_pela_manha or chuva_pela_tarde # -> False
```

Para ajudar a entender estas operações temos a famosa "Tabela Verdade", veja:

| Operador | negação (`not`)  | Operador | *e* | `and` | Operador | *ou* |`or` |
|-------------------|-----------------------------|-----------------------------|
| **Valor** | **Resultado** |  **Valor** |  **Valor** | **Resultado** | **Valor** |  **Valor** | **Resultado** |
|:-----:|:---------:|:------:|:------:|:---------:|:------:|:------:|:---------:|
| True  | False     | True   | True   | True      | True   | True   | True      |
| False | True      | True   | False  | False     | True   | False  | True      |
|       |           | False  | True   | False     | False  | True   | True      |
|       |           | False  | False  | False     | False  | False  | False     |

Além destes operadores, os tipos lógicos também podem ser produzidos ao compararmos valores de qualquer tipo, por exemplo: 5 > 3 (cinco é maior que três?), esta expressão retorna um valor lógico!

```python
cinco_maior_que_tres = 5 > 3 # -> True
```

Temos diversos operadores para realizar estas comparações!

| Operador            | Descrição |
|---------------------|-----------|
| == (igual)          | Retorna `True` caso os dois valores são iguais |
| != (diferente)      | Retorna `True` caso os dois valores sejam diferentes |
| > (maior)           | Retorna `True` caso o valor à esquerda do operador seja maior que o valor à direita do operador |
| >= (maior ou igual) | Retorna `True` caso o valor à esquerda do operador seja maior ou igual que o valor à direita do operador |
| < (menor)           | Retorna `True` caso o valor à esquerda do operador seja menor que o valor à direita do operador |
| <= (maior ou igual) | Retorna `True` caso o valor à esquerda do operador seja menor ou igual que o valor à direita do operador |

Perceba que para compararmos os valores utilizamos dois iguais `==`, isso porque quando utilizamos somente um igual estamos atribuindo um valor. Veja:

```python
x = 5
y = 10

x = y  # -> estamos fazendo a variável x receber o mesmo valor da variável y
x == y # -> estamos comparando se os valores de x e y são iguais
```

Que tal fazermos alguns exercícios para finalizarmos?

* Faça um algoritmo que solicite um número ao usuário


Vamos praticar um pouco mais?

* Faça um algoritmo que solicite o nome do usuário e depois escreva o nome da pessoa no console.

* Faça um algoritmo que pergunte ao usuário quantos anos ele tem, depois disso, escreva `True` no console, caso ele já tenha alcançado a maioridade (18 anos), caso contrário escreva `False`.

* Faça um algoritmo que solicite um número ao usuário, depois disso, escreva `True` no console, caso o número tenha dois dígitos (Esteja entre 10 e 99), caso contrário escreva `False`.

> **Atenção**
>
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/01-VariaveisTiposIO.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!