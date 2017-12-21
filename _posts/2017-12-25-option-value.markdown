---
layout: post
title:  "Lidando com a falta de valores"
date:   2017-12-25 00:00:00 +0000
comments: true
tags: [C#, F#]
---

Olá pessoas!

Hoje vamos ver como lidar com a falta de valores em nossa aplicação, nos casos onde geramos ou obtemos um valor.

As implementações vão utilizar a linguagem C#, mas terá uma forte inspiração em implementações disponíveis em outras linguagens!

Anteriormente já vimos que o [`null` é um problema]({{ site.baseurl }}{% link _posts/2017-10-11-problema-null.markdown %}), além disso, também já vimos o conceito abstrato dos [objetos que agem como *containers*]({{ site.baseurl }}{% link _posts/2017-11-06-object-container.markdown %}).

<!--more-->

Agora vamos ver uma das formas de resolver isso. Através dos valores **opcionais**.

Os valores opcionais são uma maneira de representar dados incertos, ou a falta de valores, como já foi dito. Afinal, nem sempre é possível termos certeza do resultado de alguma operação.

Estes valores geralmente são oferecidos como uma proposta melhorada dos tipos anuláveis (nullables).

Os valores nulos são problemáticos, já falamos disso aqui, lembra? 

Como resolução os valores opcionais são uma forma de encapsular um dado, mas sem permitir que o desenvolvedor acesse a informação encapsulada quando ela não existir, ou seja, só é possível obter o dado, quando ele existir.

Em algumas linguagens como Haskell, por exemplo, o tipo opcional é representado pelo tipo [Maybe](https://hackage.haskell.org/package/base-4.10.0.0/docs/Data-Maybe.html), apesar de possuir um nome diferente, o conceito por trás deste tipo é exatamente o mesmo.

Um valor opcional pode estar em um dos dois estados possíveis:

* Contendo alguma coisa (*Some*);
* Não contendo nada (*None*).

Como você deve ter notado, a ideia dos tipos anuláveis e dos tipo opcional é bastante similar, mas de forma geral o tipo opcional é **mais** poderoso, porque evita exceções e pode-se criar valores opcionais inclusive para tipos baseado em referência e não somente para tipos primitivos.

**Haskell** não é a única linguagem com este tipo implementado, na verdade, dentro da plataforma .NET temos o valor opcional implementado na linguagem F#.

Vamos ver como ele funciona e depois veremos uma implementação similar em C#!

Como o tipo é implementado nativamente na linguagem, podemos definílo como `T option`, onde `T` pode ser qualquer tipo. Podemos ter `int option`, `string option`, `Produto option` e assim por diante.

Para criar um valor opcional *contendo alguma coisa* utilizamos a sintaxe: `Some valor`, conforme código:

```fsharp
let talvezUmInteiro = Some 3;;
```

O ponto importante é que este valor não é tratado como um inteiro, como ocorreria se ele fosse um valor anulável. Ele funciona como um tipo distinto, então precisamos retirá-lo do contexto para aplicar qualquer tipo de operação.

Vamos tentar somar 2 à este valor!

```fsharp
let resultado = talvezUmInteiro + 2

//stdin(12,35): error FS0001: The type 'int' does not match the type 'int option'
```

Erro de compilação!

Não podemos somá-lo com um número inteiro, porque não temos certeza se há algum valor ali dentro.
Para extrair o valor deste tipo, precisamos do *pattern matching*!

Ok, mas o que isso significa?

Significa que precisamos fazer uma comparação identificando os possíveis casos: `Some` e `None`. Nesta estrutura do pattern matching teremos duas funções, uma para cada caso.

E é aqui que entra a grande sacada, a função para o caso `Some` recebe um valor por parâmetro, este valor é do mesmo tipo do valor encapsulado no opcional. Enquanto a função para o caso `None` não recebe nenhum parâmetro!

Entendeu?

A própria estrutura decide qual das funções ela irá chamar de acordo com o estado do valor opcional, caso ele contenha alguma coisa, a primeira função é invocada passando o valor encapsulado por parâmetro, caso ele não tenha nada, a função que não possui nenhum parâmetro é executada!

Assim só conseguimos acessar o valor encapsulado, caso ele exista. Legal né?


```fsharp
let resultado =
    match talvezUmInteiro with
    | Some valor -> valor + 2
    | None -> 0
```

Para nosso exemplo, o resultado recebe o valor 5, afinal o valor `talvezUmInteiro` estava com 3 encapsulado dentro de si.

Mas como representar isso em C#?

No começo deste mês publiquei sobre uma biblioteca que escrevi para C#, a [**Tango**]({{ site.baseurl }}{% link _posts/2017-12-14-welcome-tango.markdown %}). Esta biblioteca possui uma implementação para [valores opcionais em C#](https://github.com/gabrielschade/Tango/blob/master/Tango/Tango/Types/Option.cs).

Esta estrutura utiliza generics para permitir valores opcionais de qualquer tipo, assim como no F#. Claro que a sintaxe é um pouquinho diferente.

Vamos fazer o mesmo exemplo:

```csharp
Option<int> talvezUmInteiro = Option<int>.Some(3);
```

Este é o exemplo utilizando uma sintaxe mais parecida com a do F#, mas isso não é necessário, por conta das sobrecargas para cast implícito, você pode simplesmente passar o valor para o tipo opcional e ele será convertido automaticamente:

```csharp
Option<int> talvezUmInteiro = 3;
```

Mais simples né?

Ok, mas e a questão do *pattern matching*?

Bom, isso foi resolvido através de um método chamado `Match`, este método recebe dois outros métodos por parâmetro, com as mesmas assinaturas possíveis do `pattern matching`, um método para o caso `Some` e outro para o caso `None`.

Veja só:

```csharp
int resultado = talvezUmInteiro.Match(
                    valor => valor + 2,
                    () => 0);
```

Como precisamos utilizar o método `Match` somos obrigados a tratar os dois casos sempre! Isso evita muito o famoso erro: `ArgumentNullException`.

Além disso, não se preocupe, o tipo `Option` é uma struct, então ele nunca estará nulo! Mesmo que você não inicialize-o. Nestes casos ele assumirá o estado `None`.

Existem várias outras formas para manipular e interagir com valores deste tipo, mas por enquanto é isso!

Quem sabe isso não vira uma série de posts?

Caso você tenha ficado curioso, você poderá encontrar mais detalhes da implementação na [documentação](https://gabrielschade.gitbooks.io/tango-br/content/Types/Option/Introduction.html).

O que você achou destes valores?

Alguma sugestão de melhoria?

Me conte nos comentários!

E Até mais!