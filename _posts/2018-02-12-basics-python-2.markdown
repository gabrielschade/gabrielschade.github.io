---
layout: post
title:  "Desvios condicionais, fazendo seu programa tomar decisões!"
date:   2018-02-12 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoas!

Se você está acompanhando esta série, já deve ter aprendido o básico sobre Python as variáveis e tipos do Python!

Que tal continuar?
<!--more-->

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
	<div class="spoiler-message" onclick="$(this).hide(); $(this).siblings('.spoiler-hidden').show();">
        <span>Cuidado com Spoiler</span>
    </div>
    
	<div class="spoiler-hidden" markdown="1">
    ```Python
    nota = 5

    if nota >= 7:
        print("Aprovado")
    else:
        print("Reprovado")
    ```
    </div>
</div>



O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!