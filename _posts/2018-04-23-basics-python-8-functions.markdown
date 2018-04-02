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

Além disso, não há restrição sobre o tipo enviado por parâmetro, veja mais um exemplo:

```python
def saudacao(nome):
    print("Olá", nome)
```

### Retornos

Além de receber informações (parâmetros) as funções também podem produzir resultados. Esses resultados são chamados de **retornos**.

Nem todas as funções produzem resultados, veja a função `saudacao` criada anteriormente. De fato ela não precisa produzir nenhum resultado. 

Por outro lado, não faz muito sentido a função `soma` apenas escrever o resultado da soma. A função se tornaria muito mais reutilizável produzindo um resultado. Desta forma o desenvolvedor poderia fazer o que bem entendesse com o resultado, inclusive escrevê-lo.

Sempre que precisamos criar um retorno utilizamos a palavra reservada `return`. Ela faz com que a função produza um resultado, assim como uma expressão.

Vamos refatorar a função `soma`:

```python
def soma(numero1, numero2):
    return numero1 + numero2
```

Ok, mas como obter o resultado desta função? -Simples!

Basta pensar que a função passa a se comportar uma expressão, portanto conseguimos realizar atribuições, somas e qualquer outra operação que poderíamos fazer com uma expressão. Veja:

```python
resultado = soma(1,2)
print(resultado) # -> 3

resultado = soma(2,2) * 3
print(resultado) # -> 12

resultado = soma(5,5) - 2 * 5
print(resultado) # -> 0

print(soma(3,7)) # -> 10
```

A palavra reservada `return` força a interrupção da função para que o resultado seja retornado, portanto é bastante comum que este comando esteja no final da função. Apesar de não haver nenhuma obrigatoriedade não é uma boa prática interromper o código com um `return`.

Veja este exemplo:

```python
def exemplo(valor):
    numero = valor * 2
    if numero > 10:
        return numero

    valor = valor + 5
    return valor
```

Neste exemplo, caso a variável `numero` seja maior do que 10 a função será interrompida. Caso contrário será retornado o valor da variável `valor` somado à 5.

É importante que você compreenda que este código não está necessariamente errado, mas cria-se uma complexidade que não precisa existir, vamos manter a funcionalidade e reescrevê-lo para termos apenas uma instrução de retorne, veja:

```python
def exemplo(valor):
    resultado = None
    numero = valor * 2

    if numero > 10:
        resultado = numero
    else:
        resultado = valor + 5
    
    return resultado
```
Desta forma, centralizamos a regra na variável `resultado`, sempre retornando-a, independente de qual valor foi atribuido à ela.

Em python podemos encurtar esta função um pouco mais utilizando o desvio condicional ternário:

```python
def exemplo(valor):
    numero = valor * 2
    return numero if numero > 10 else valor + 5
```

Agora ficamos com um código bem mais curto e simples!

Com isso passamos por todos os conceitos envolvidos na criação de uma função!


## Vamos Praticar!

* Faça um programa que escreva "Minha primeira função", esta escrita deve ser realizada a partir da chamada de uma função.

* Faça um programa que solicite o nome do usuário e a idade do usuário, depois disso exiba a mensagem: *"{nome} possui {idade} anos."*. Esta mensagem deve ser escrita em uma função.

* Faça um programa que solicite dois números ao usuário e exiba a multiplicação deles. A multiplicação deve ser calculada em uma função.

* Faça um programa que solicite ao usuário três números diferentes e exiba o dobro do maior número. Para fazer issos separe seu código em duas funções diferentes: Uma função para retornar o maior dos três números e outra função para dobrar o número.

* Faça um programa que inicialize uma lista vazia, depois disso solicite 5 nomes diferentes ao usuário (utilize laço de repetição). Cada nome digitado deve ser adicionado à lista e por fim, todos os nomes devem ser escritos no console. Utilize uma função para solicitar e retornar o nome digitado, uma função para adicionar o nome à lista (passando o nome e a lista por parâmetro) e outra função para escrever todos os nomes no console.

> **Atenção**
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/07-08-Funcoes.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!