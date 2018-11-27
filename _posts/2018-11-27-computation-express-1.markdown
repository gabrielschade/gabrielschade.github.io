---
layout: post
title:  "Criando uma sintaxe mais limpa para o binding"
date:   2018-11-27 00:00:00 +0000
comments: true
tags: [F#, C#]
---

Olá pessoa!

No post da semana passada falei um pouco sobre o mindset para criarmos um `Continuation` e também mostrei como fazer a equivalência entre um *binding* e uma expressão lambda, que tal continuarmos nesse assunto?

<!--more-->

É bem importante que você entende a equivalência entre *binding* e expressões lambda, com isso, ficará muito mais claro entender como (e porque) a sintaxe mostrada funciona.

<!-- O post completo pode ser acessado clicando [aqui]({{ site.baseurl }}{% link _posts/2017-11-19-continuation-mindset.markdown %}), mas vou fazer uma recaptulação rápida. -->

O principal ponto é você entender que estas duas implementações, apesar de sintaticamente diferentes, representam a mesma coisa:

```fsharp
//Binding
let funcao =            
    let a = 5
    let b = 10
    let c = a + b
    c

//Lambda
let funcao = 
    5 |> (fun a -> 
        6 |> (fun b ->
            a + b |> (fun c ->
                c)))
```
Uma das interpretações para entender isso é bastante simples. É claro que você já deve saber que não é possível acessar um valor (como `a`, por exemplo) antes dele ser criado, certo?

Então, o código abaixo causaria erros:

```fsharp
let funcao=
    Console.WriteLine a
    let a = 5
```

Até aqui, **bem** simples. A visão de código que precisamos ter aqui é: imagine que cada declaração de variavel seja um parâmetro para todo o código que acontece depois dele.

Ou seja, quando criamos o valor `a`, é como se encapsulássemos todo o código restante em uma função que contém o parâmetro `a` e o valor atribuído à ele é o valor passado por parâmetro.

```fsharp
let funcao =
    let funcao2 a =
        let b = 10
        let c = a + b
        c
    
    funcao2 5
```

Essa sintaxe é a mesma coisa que a sintaxe mostrada como expressão lambda, mas talvez seja um pouco mais clara para você.

Utilizando este conceito, vimos que é possível inserir código em uma atribuição, afinal, podemos inserir qualquer trecho de código em uma função, se uma atribuição e uma função podem ser equivalentes, então está tudo certo.

Nosso último exemplo em F# era o seguinte:

```fsharp
let funcaoUsandoLet =            
    let a = 5
    let b = 10
    let c = a + b
    c

let continueCom (valor, lambda) =
    printfn "%i" valor
    valor |> lambda

let funcaoUsandoContinuation =
    continueCom (5, fun a ->
    continueCom (10, fun b ->
    continueCom (a + b, fun c -> c)))
```
Na prática, as duas funções acima representam o mesmo código, mas usando continuation conseguimos inserir um código para escrever os valores no console.

No post passado eu mencionei que podíamos fazer isso utilizando o próprio `let`, a questão é, como?

Bom, vamos criar um tipo para fazer isso. Este tipo deve conter a função `continueCom`. Vamos chamá-lo de auditor.

```fsharp
type Auditor() = 
    member this.continueCom (valor, lambda) =
        printfn "%i" valor
        valor |> lambda
```

Bom, ele é um tipo que pode ser construído e contém a função `continueCom` criada anteriormente, só guardarmos o método em um local, certo? -Certo.

Essa é a hora que vamos alterar um pouco a sintaxe para o modo mais formal. Não sabemos exatamente qual o valor, por definição, se você encontrar por aí uma função que recebe qualquer coisa, existe uma boa chance desse parâmetro se chamar `x`.

No caso do parâmetro `lambda`, bom, sabemos que é uma função, então com bastante frequência você verá esse parâmetro se chamar `f`. Quem não lembra do famoso "F de X" das aulas de matemática? -Pois é, aqui estamos de novo com o "F de X".

Vamos autalizar nosso código com os nomes convecionais, embora eu os ache mais confuso. Também vou remover o pipe, transformando `valor |> lambda` em `f x`.

```fsharp
type Auditor() = 
    member this.continueCom (x, f) =
        printfn "%i" x
        f x
```

Mesmo método, certo? Só alteramos alguns nomes. E falando em alterar nomes, vamos alterar o nome do `continueCom` também.

Dessa vez para um nome que faz mais sentido mesmo. Lembra qual operação estamos tentando substituir com nosso continuation? -Isso mesmo, o `Bind`.

Vamos colocar exatamente este nome na função.

```fsharp
type Auditor() = 
    member this.Bind (x, f) =
        printfn "%i" x
        f x
```

Vamos incluir mais uma função aqui, você ainda não precisa se preocupar com o motivo disso.

```fsharp
type Auditor() = 
    member this.Bind (x, f) =
        printfn "%i" x
        f x

    member this.Return(x) =
        x
```

E pronto! Já podemos utilizar nosso novo `let`.

Espera aí, como assim?

Eu explico. Utilizando essa nomenclatura de método, o compilador é capaz de identificar e criar atalhos sintáticos para melhorar a visibilidade de nosso código, vamos ver como nosso código está atualmente:

```fsharp
[<EntryPoint>]
let main argv = 
    let auditor = new Auditor()

    auditor.Bind (5, fun a ->
    auditor.Bind (6, fun b ->
    auditor.Bind (a + b, fun c -> c)))
    |> ignore
```

Vamos substituir os trechos onde utilizamos o `Bind` por um comando `let!`. Para fazer isso, precisamos avisar o compilador o escopo do `Bind`, veja:

```fsharp
let auditor = new Auditor()

auditor{
        //Inserir o código aqui
} |> ignore
```
Com isso definimos que, dentro do bloco `auditor`, todo comando `let!` (não esqueça da exclamação) se torna uma chamada para o método `Bind`.

```fsharp
let auditor = new Auditor()

auditor{
    let! x = 5
    let! y = 6
    let! z = x + y
} |> ignore
```
Um bloco deste tipo também é uma expressão, logo, precisamos retornar alguma coisa. Por isso implementamos a função `Return`. Ela permite utilizarmos a palavra reservada `return` dentro destes blocos:

```fsharp
auditor{
    let! x = 5
    let! y = 6
    let! z = x + y
    return z
} |> ignore
```

Na prática, alteramos a foram de escrever nosso método, mas a compilação transformará as duas soluções na mesma coisa. Esta é só uma forma mais familiar de escrevermos código escondendo uma complexidade.

> **Atenção**
> Um disclaimer importante é: vamos conversar sobre os métodos possíveis e o que é este "bloco" utilizado como exemplo aqui.
> O tema é relativamente complexo, então vamos seguir um passo de cada vez. Por vezes estou utilizando simplificações para facilitar o entendimento.


Por hoje ficamos por aqui, o que achou?

Me conte nos comentários!

E Até mais!