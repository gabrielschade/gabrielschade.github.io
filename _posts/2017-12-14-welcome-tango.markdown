---
layout: post
title:  "Tango, uma biblioteca para programação funcional em C#"
date:   2017-12-14 00:00:00 +0000
comments: true
tags: [C#]
published: false
---

Olá pessoas!

Hoje vou apresentar algo que estou trabalhando já faz um tempo, uma biblioteca para programação funcional em C#!

![TANGO](https://gabrielschade.gitbooks.io/tango-br/content/assets/logo%20tango.png)

Quem me conhece sabe que sou bastante entusiasta deste paradigma, mas não, não vou listar motivos **X** ou **Y** para tentar provar que ele é melhor do que orientação à objeto.

Ao invés disso, podemos só utilizar os dois e sermos mais feliz.

Infelizmente programação funcional ainda é um tanto quanto nichada. Tenho muitos amigos programadores, mas dá para contar na mão os que usam o paradigma, considerando os iniciantes.

Em outubro deste ano, tive o prazer de lançar um livro sobre programação funcional em .NET, onde explico diversos conceitos utilizando C# e F#, você pode encontrá-lo [aqui](https://www.casadocodigo.com.br/products/livro-programacao-funcional-net).

Mas, o que é a **Tango**?

A **Tango** é uma biblioteca que provê uma série de funções e tipos para auxiliar um programador C#, o objetivo principal é trazer a programação funcional de uma forma mais acessível para os programadores que ainda não estão acostumados com este paradigma. Similar ao que a biblioteca `System.Linq` fez.

Você pode instalar a **Tango** em seu projeto utilizando o NuGet.

```
PM> Install-Package Tango
```

A partir daí é só aproveitar as funcionalidades!

Em sua data de lançamento, os principais temas que considero destaques da Tango são:

#### Utilize *pattern matching* com valores opcionais e valores `Either`

```csharp
Option<int> optionalValue = 10;
int value = optionalValue.Match(
                methodWhenSome: number => number,
                methodWhenNone: () => 0);

Either<bool, int> eitherValue = 10;
int value = eitherValue.Match(
                methodWhenRight: number => number,
                methodWhenLeft: boolean => 0);
```

#### Crie processos contínuos utilizando Then e Catch e retornos de tipos diferentes

```csharp
Continuation<string, int> continuation = 5;

continuation.Then(value => value + 4)
            .Then(value =>
            {
                if( value % 2 == 0)
                    return value + 5;
                else
                    return "ERROR";
            })
            .Then(value => value + 10)
            .Catch(fail => $"{fail} catched");
```
#### Crie processos contínuos utilizando pipeline!

```csharp
continuation
    > (value => value + 4)
    > (value =>
    {
        if( value % 2 == 0)
            return value + 5;
        else
            return "ERROR";
    })
    > (value => value + 10)
    >= (fail => $"{fail} catched")
```

#### Utilize Poderosas Funções de alta ordem!

```csharp
//IEnumerable<int> source = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }
IEnumerable<IEnumerable<int>> result = source.ChunkBySize(3);

//result = { {1, 2, 3}, {4, 5, 6}, {7, 8, 9}, {10} }

var (resultEvens, resultOdds) =
source.Partition(value => value % 2 == 0)

//resultEvens = { 2, 4, 6, 8, 10 }
//resultOdds = { 1, 3, 5, 7, 9 }
```

#### Utilize operações para redução!
```csharp
int result = source.Scan(10, IntegerOperations.Add);
//result = {11, 13, 16, 20, 25, 31, 38, 46, 55, 65}
```

#### Utilize Curry e Aplicação Parcial!
```csharp
Func<int, int, int> add =
    (value, value2) => value + value2;

Func<int, Func<int, int>> addCurried = add.Curry();
curriedResult = addCurried(2)(3);

Func<int, int> addPartial = add.PartialApply(2);
int partialResult = addPartial(3);
```


#### Aproveite o *QuickDelegateCast*!

```csharp
using static Tango.Functional.QuickDelegateCast;

int SampleAdd(int value1, int value2)
    => value1 + value2;

F<int, int, int>(SampleAdd).Curry();
F<int, int, int>(SampleAdd).PartialApply(1);
```

{% include huge-h2.html content="Documentação" %}

Mas como você vai saber utilizar isso tudo? 

Não se preocupe, a **Tango** tem uma documentação bastante completa que pode ser acessada [online](https://gabrielschade.github.io/tango-br) ou se preferir, você pode fazer o download do arquivo no formato de sua preferência.

![Capa do livro](https://gabrielschade.gitbooks.io/tango-br/content/assets/cover-rotated-pt-50.jpg)

Faça download do livro da documentação:

* [Formato PDF](https://www.gitbook.com/download/pdf/book/gabrielschade/tango-br)
* [Formato mobi](https://www.gitbook.com/download/mobi/book/gabrielschade/tango-br)
* [Formato ePub](https://www.gitbook.com/download/epub/book/gabrielschade/tango-br)

{% include huge-h2.html content="Totalmente Gratuita" %}

É importante frisar que a **Tango** é **completamente** gratuita, seu código está disponível no [GitHub](https://github.com/gabrielschade/Tango) e sua documentação no [Gitbooks](https://www.gitbook.com/book/gabrielschade/tango-br).

Você pode me ajudar favoritando ⭐️(star) o repositório da biblioteca e abrindo uma [issue](https://github.com/gabrielschade/Tango/issues) caso encontre algum problema, tanto no código quanto na documentação.

E claro, se gostar dela, conte para os seus amigos também, não custa nada.

O que você achou deste post?

Me conte nos comentários!

E Até mais!