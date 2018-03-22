---
layout: post
title:  "Lição 2: Desvios condicionais, fazendo seu programa tomar decisões!"
date:   2018-02-12 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoa!

Se você está acompanhando esta série, já deve ter aprendido o básico sobre Python as variáveis e tipos do Python!

Que tal continuar?
<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/02-DesvioCondicional.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Agora que você já viu os tipos básicos e já trabalhou bastante com valores lógicos, iremos introduzir uma complexidade para nossos programas. Criaremos um desvio condicional, ou seja, vamos fazer com que o programa siga por um caminho ou outro de acordo com uma condição.

Assim como quase tudo que venho falando por aqui, a sintaxe para criar um desvio condicional em Python é **bastante** simples.

A primeira coisa que precisamos entender é: quando falamos de uma a condição, significa que precisamos saber se algo é verdade ou mentira, ou seja, precisamos utilizar um tipo lógico.

A ideia por trás dos desvios condicionais é utilizada o tempo todo em nossas conversas do dia-a-dia, veja este exemplo:

> Vá até o mercado e compre leite, se não tiver, compre água.

Veja o raciocínio por trás! Precisamos checar se o mercado tem leite em estoque, se ele tiver vamos comprá-lo, mas caso não tenha, vamos comprar água.

Como Python utiliza o inglês como idioma padrão a condição **se** é traduzida para o comando `if`, veja:

```python
leite_em_estoque = True

if leite_em_estoque:
    print("Comprei leite")
else:
    print("Comprei água")
```

Execute este algoritmo, depois altere o valor da variável para `False` e execute-o novamente!

Viu só? Agora podemos fazer os algoritmos tomarem decisões!

Você precisa utilizar o comando `else` para o caso negativo, ele seria o equivalente à um "senão", ou seja: **se** `condição` entao faça x **senao** faça y.

Perceba também que após a condição é necessário colocar os dois pontos, isso é necessário para a sintaxe do Python.

Vamos fazer mais um exemplo! 

* Crie uma variável numérica para representar uma nota de uma prova, depois disso exiba a mensagem "Aprovado" **caso** a nota seja maior ou igual à 7, caso contrário exiba a mensagem "Reprovado".

<div class="spoiler">
	<div class="spoiler-message" 
    onclick="$(this).hide(); $(this).siblings('.spoiler-hidden').show();">
        <span>Cuidado com Spoiler </span>
    </div>
    
<div class="spoiler-hidden" markdown="block">
{% highlight python %}
nota = 5

if nota >= 7:
    print("Aprovado")
else:
    print("Reprovado")
{% endhighlight %}
</div>
</div>

Neste caso você pode optar por duas abordagens distintas: salvar o resultado da comparação em uma variável lógica e comparar ela ou utilizar a expressão diretamente no comando `if`.

Geralmente é mais comum utilizarmos a expressão diretamente no comando, salvo em casos onde esta mesma comparação precisa ser feita mais de uma vez, nestes casos é melhor armazenarmos o resultado e reutilizá-lo ao invés de fazer a comparação várias vezes.

Também acontece precisarmos tratar mais de dois casos, ou seja, há situações em que um **se** e um **senao** não são suficientes para atender todas as condições, veja este exemplo: Um aluno que tira acima de 7 já está aprovado, se tirar 7 ou 6 ele irá para recuperação e abaixo disso estará reprovado. Como fazer?

```python
nota = 6
if nota > 7:
    print ("Aprovado")
else:
    if nota == 7 or nota == 6:
        print("Recuperacao")
    else:
        print ("Reprovado")
```

Você pode colocar vários comandos `if` e `else` aninhados, ou seja, um dentro do outro. Este código funcionará sem problemas, mas isso não significa que esta é a melhor forma de fazer isso. 

Para casos onde é necessário uma expressão: senão se, utilize o comando `elif`. Este comando é uma mescla dos dois anteriores. Ele funciona como um `if`, mas só será testado caso o `if` anterior ter resultado em `False`, veja:

```python
if nota > 7:
    print ("Aprovado")

elif nota == 7 or nota == 6:
     print("Recuperacao")

else:
     print ("Reprovado")
```
Este exemplo é bastante simples, mas já dá para entendermos a utilização do `elif`. É importante ressaltar também que este comando de desvio permite apenas um `if` e um `else` que estejam conectados, mas é você pode inserir quantos `elif` forem necessários.

### Valores confiáveis

Outro conceito interessante no Python é a questão dos *Truthy values*, este conceito define quando os valores são confiáveis, ou verdadeiros para uso. Por exemplo, no caso de um número, qualquer valor que seja **diferente** de zero é um valor confiável (incluindo números negativos).

O mesmo se aplica para textos (strings), qualquer texto diferente de vazio é considerado como confiável, ou seja, apenas o valor "" não é.

Esta funcionalidade permite que a variável seja avaliada diretamente, sem precisarmos fazer a comparação, veja o exemplo com um valor inteiro:

```python
valor = 4

if valor != 0:
    print("Valor não é zero")

if valor:
    print("Valor não é zero")

```

Os dois códigos irão fazer a mesma coisa, mas a segunda forma é ainda mais simples! O mesmo serve para as strings:

```python
texto = "teste"

if texto != "":
    print("Texto não está vazio")

if texto:
    print("Texto não está vazio")
```

Outra coisa que podemos explorar normalmente é a questão de múltiplas condições. Podemos utilizar os operadores os operadores `not`, `and` e `or` para criar uma condição da mesma forma que usamos para a atribuição de um valor lógico.

```python
nota1 = 7
nota2 = 10

if nota1 > 5 and nota2 >= 7:
    print("Aprovado")

deu_sol = True

if not deu_sol:
    print("Choveu")
```

Por fim, existe mais uma forma de descrevermos o comando `if`. Esta outra forma é conhecida como condição ternária. Ela é utilizada principalmente para condições curtas e permite uma sintaxe mais ágil, geralmente de uma única linha.

A ordem das coisas muda um pouco, mas ainda se parece bastante com linguagem natural. Veja esta frase:

* Ele foi aprovado **se** tirou 7 ou mais, **senão** ele foi reprovado.

Vamos traduzir isso para Python com o comando que já conhecemos:

```python
nota = 6
if nota >= 7:
    print("Aprovado")
else:
    print("Reprovado")
```

Agora veja como esta mesma operação fica ao utilizarmos uma condição ternária

```python
nota = 6
print( "Aprovado" if nota >= 7 else "Reprovado" z )
```
A ordem das palavras muda um pouco, mas não se assuste, vamos com calma que logo você se acostuma.

## Vamos Praticar!

* Faça um algoritmo que solicite 3 notas para o usuário, calcule a média e indique se o aluno foi aprovado ou reprovado (nota precisar ser maior ou igual à sete para o aluno ser aprovado).

* Faça um algoritmo que solicite o ano que o usuário nasceu, depois disso, faça o programa descrever se o usuário fará ou já fez 18 anos neste ano.

* Faça um programa que solicite ao usuário sua idade, depois disso, exiba a classificação etária de acordo com as faixas de valores: 
  * Criança para 0 até 11 anos;
  * Adolescente para 12 até 18 anos;
  * Jovem para 19 até 24 anos;
  * Adulto para 25 até 40 anos;
  * Meia Idade para 41 até 60 anos;
  * Idoso acima de 60 anos.

* Faça um programa que solicite ao usuário 2 valores, utilize uma condição ternária para escrever qual o maior valor: o primeiro ou o segundo (caso os valores sejam iguais, considere o segundo).


> **Atenção**
>
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/02-DesvioCondicional.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!