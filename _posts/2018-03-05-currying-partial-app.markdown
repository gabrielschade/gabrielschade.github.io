---
layout: post
title:  "Currying e Aplicação Parcial"
date:   2018-03-05 00:00:00 +0000
comments: true
tags: [C#, F#]
---

Olá pessoas!

Hoje veremos dois recursos presentes no paradigma de programação **funcional**, que causam um pouco de confusão.

Tanto *Currying* quanto *Aplicação Parcial* são conceitos muito poderosos e que podem facilitar muito suas tarefas no dia-a-dia, mesmo em linguagens que não são totalmente funcionais.

Para fins de exemplo, vamos utilizar C# e F#. Vamos lá!
<!--more-->

Esses dois conceitos operam diretamente em funções com o objetivo de alterar tipo delas. Espera aí, tipo das funções? Isso mesmo!

Se você ainda não conhece delegates, dá uma olhadinha [neste post]({{ site.baseurl }}{% link _posts/2017-12-04-delegates-func-action.markdown %}), sugiro fortemente que dê uma olhada lá e depois volte aqui com essa bagagem!

Vamos entender como funciona o tipo de uma função, para isso, irei utilizar uma sintaxe **parecida** com a sintaxe utilizada em F#.

Em F# o tipo da função é definido por: `parâmetro -> retorno`.

Logo, uma função com um parâmetro do tipo `int` e um retorno do tipo `bool` pode ser descrita como: `int -> bool`.

Quando houverem múltiplos parâmetros iremos representar aqui (diferente do F#) como: `int, int, int -> bool`.

Com isso, criamos nossa sintaxe para definir o tipo de uma função, ficou bem fácil né?

Agora vamos entender como estas duas técnicas auxiliam na resolução de alguns problemas.

Como o próprio nome sugere, a programação **funcional** é baseada principalmente no conceito de funções. Por definição, uma função matemática deve possuir apenas um parâmetro (domínio) e um retorno (alcance).

Então, isso deveria implicar em: todas as funções escritas em um código funcional devem conter apenas um parâmetro, certo? Mas como fazer isso? - Com **Currying**

### Entendendo Currying

O processo de *currying* consiste em quebrar funções de N parâmetros em N funções, onde cada função irá receber apenas um parâmetro e retornar uma **nova função** que espera os parâmetros restantes.

Logo, uma função de soma representada por: `int, int -> int` teria seu tipo alterado após passar pelo processo de currying, podendo ser representada por: `int -> int -> int`.

Vamos realizar um passo-a-passo do processo de currying em uma função simples, que realiza a soma de 2 valores.

Primeiro vamos definir a função como:

```csharp
Func<int, int, int> soma = 
    (valor, valor2) => valor + valor2;
```

Podemos utilizar esta função normalmente, conforme código:

```csharp
int resultado = 0;
Func<int, int, int> soma = 
    (valor, valor2) => valor + valor2;
resultado = soma(2, 3);
//resultado = 5
```
Ao realizar o processo de *currying* na função `soma` o retorno será uma função do tipo `Func<int, Func<int,int>>`, ou seja, será uma função que receberá um valor inteiro e retornará um nova função esperando o segundo valor inteiro.

Quando esta segunda função receber o último parâmetro ela irá realizar o processamento proposto por `soma`.

Veja como podemos realizar o *currying* com a biblioteca [**Tango**](https://github.com/gabrielschade/Tango).

```csharp
int resultado = 0;
Func<int, int, int> soma = 
    (valor, valor2) => valor + valor2;

Func<int, Func<int, int>> somaPosCurrying = Currying.Curry(soma);
resultado = somaPosCurrying(2)(3);
//resultado = 5
```

Veja que a forma de informar os parâmetros na função `somaPosCurrying` é um pouco diferente, isso porque ele gera uma série de funções, onde cada uma espera apenas um parâmetro.

A [**Tango**](https://github.com/gabrielschade/Tango) também fornece o `Curry` através de métodos de extensão para os delegates `Func` e `Action`, portanto ao você também poderá realizar a operação descrita anteriormente da seguinte forma:

```csharp
int resultado = 0;
Func<int, int, int> soma = 
    (valor, valor2) => valor + valor2;

Func<int, Func<int, int>> somaPosCurrying = soma.Curry();
resultado = somaPosCurrying(2)(3);
//resultado = 5
```

Esta forma me soa mais intuitiva, mas esteja livre para escolher o que mais lhe agradar.

> **Atenção**
>
> É importante frisar que este é um post mais conceitual, se você deseja entender como a função `Curry` funciona acesse o código da biblioteca **Tango** disponível no meu [GitHub](https://github.com/gabrielschade/Tango/blob/master/Tango/Tango/Functional/Currying.cs).


### Entendendo a Aplicação Parcial

A aplicação parcial é um pouco diferente do processo de *currying*, mas também envolve a questão dos tipos de uma função.

Através da aplicação parcial é possível realizar a chamada de um método sem informarmos todos os parâmetros, mas podemos passar mais de um por vez. 

Como resultado desta operação, será retornada uma nova função que espera **todos** os parâmetros restantes.

Veja as diferenças entre *currying* e aplicação parcial em uma função que soma três números inteiros.

Esta teria o seguinte tipo: `int, int, int -> int`.

Ao realizar o *currying* nesta função o resultado obtido será: `int -> int -> int -> int`, uma função nova para cada parâmetro.

Neste ponto a aplicação parcial funciona completamente diferente do processo de *currying*, poderíamos inclusive, realizar diferentes aplicações parciais nesta função.

Ao informar apenas um parâmetro o resultado obtido com aplicação parcial seria: `int, int -> int`. No entanto é perfeitamente possível informar dois parâmetros, com isso o resultado seria: `int -> int`.

Similar ao processo de *currying*, a operação fundamental descrita pela função só é executada quando todos os parâmetros forem informados, independente da quantidade de funções intermediárias geradas.

Veja a implementação descrita, primeiro através de currying:

```csharp
Func<int, int, int, int> soma = 
    (valor, valor2, valor3) => valor + valor2 + valor3;

Func<int, Func<int, Func<int, int>>> somaPosCurrying = soma.Curry();
int resultado = somaPosCurrying(2)(3)(5);
//resultado = 10
```

Utilizando aplicação parcial com apenas um parâmetro:

```csharp
Func<int, int, int, int> soma = 
    (valor, valor2, valor3) => valor + valor2 + valor3;

Func<int, int, int> somaParcialmenteFeita = soma.PartialApply(2);
int resultado = = somaParcialmenteFeita(3,5);
//resultado = 10
```

Utilizando aplicação parcial com dois parâmetros:
```csharp
Func<int, int, int, int> soma = 
    (valor, valor2, valor3) => valor + valor2 + valor3;

Func<int, int> somaParcialmenteFeita = soma.PartialApply(2);
int resultado = = somaParcialmenteFeita(3,5);
//resultado = 10
```

> **Atenção**
>
> O mesmo aviso vale para aplicação parcial, se você deseja entender como a função `PartialApply` funciona acesse o código da biblioteca **Tango** disponível no meu [GitHub](https://github.com/gabrielschade/Tango/blob/master/Tango/Tango/Functional/PartialApplication.cs).


Todos os métodos disponíveis para aplicação parcial e *currying* podem ser encontrados na **Tango** e você pode utilizá-la de forma totalmente gratuita, inclusive para aplicações comerciais! 

Estas funções operam em métodos de até 4 parâmetros, podendo retornar qualquer tipo, inclusive `void`. Tanto em formato estático quanto como método de extensão.

Eu gosto bastante dessa biblioteca que desenvolvi e se você gosta de programação funcional ela pode ser uma boa companheira!

### Espera aí, mas e o F#?

Bom, eu tinha comentado que mostraria exemplos em F# também, certo?

Lembram que eu falei que a sintaxe para o tipo de funções de multiplos parâmetros era diferente no F#? Isso acontece porque nessa linguagem as funções interagem com *curry* e aplicação parcial **automaticamente**.

```fsharp
let soma valor valor2 valor3 = 
    valor + valor2 + valor3

//tipo da soma: int -> int -> int -> int
```
Viram só? O tipo já vem no formato de *currying*!

Então ele trata cada função como múltiplas funções de um parâmetro, mas as facilidades não acabam aqui. Além disso, você **pode** informar mais de um parâmetro normalmente e caso não informe todos, a aplicação parcial ocorre automaticamente!

```fsharp
let soma valor valor2 valor3 = 
    valor + valor2 + valor3

let somaParcialmenteAplicada = soma 2

let resultado = somaParcialmenteAplicada 3 5 

//resultado = 10
//tipo da somaParcialmenteAplicada: int -> int -> int
```
O mesmo pode ser feito com múltiplos parâmetros, veja:

```fsharp
let soma valor valor2 valor3 = 
    valor + valor2 + valor3

let somaParcialmenteAplicada = soma 2 3

let resultado = somaParcialmenteAplicada 5 

//resultado = 10
//tipo da somaParcialmenteAplicada: int -> int
```

Neste sentido, por conta do F# ser voltado para programação funcional ele entrega uma série de funcionalidades já imbutidas na linguagem, legal né?

Por hoje era isso pessoal!

O que achou do post? Gosta de programação funcional?

Me conte nos comentários!

E Até mais!