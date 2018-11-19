---
layout: post
title:  "O Mindset por trás do Continuation"
date:   2018-11-19 00:00:00 +0000
comments: true
tags: [F#, C#]
---

Olá pessoa!

Se você acompanha meus posts, já deve ter ouvido falar de programação funcional e da biblioteca Tango. Um dos principais recursos dessa biblioteca é o tipo `Continuation` que permite criar um pipeline de execuções. Esse post talvez seja um dos mais pesados sobre funcional, mas vem comigo!

<!--more-->

A primeira coisa importante a ser dita é: eu **não** inventei o `Continuation`, eu só implementei um conceito já estabelecido. Vou tentar desenvolver uma linha de raciocínio para você entender o que há por trás desse conceito, utilizarei C# e F# para os exemplos, vai ser tranquilo, vamos lá.

Vamos começar com um conceito bem mais simples e que você já deve ser familiarizado: **retornos**. Tá, eu falei que o post seria pesado e eu começo falando de retornos? - Isso mesmo, vamos em um passo-a-passo que as coisas vão fazer sentido.

Vamos começar com um exemplo bem simples, vamos fazer uma função que realiza a divisão de dois valores, nos prevenindo de uma divisão por zero:

Primeiro em C#:

```csharp
public int Dividir(int dividendo, int divisor)
{
    if (divisor == 0) throw new InvalidOperationException();

    return dividendo / divisor;
}
```
Agora em F#:

```fsharp
let dividir dividendo divisor =
    if divisor = 0
    then invalidOp "divisão por zero"
    else dividendo/divisor
```

Até aqui, nada demais, certo?

O problema deste método é que ele escolhe o que fazer com os resultados, por exemplo, se o divisor for zero, ele **lançará** uma exceção. Se a divisão for feita com sucesso, ele irá retornar o valor da operação.

Com esta premissa, caso quiséssemos checar se o valor resultante da operação é par ou impar, precisaríamos capturar o valor, ou realizar chamadas aninhadas:

Em C#:

```csharp
public bool NumeroPar(int numero)
=> numero % 2 == 0;

//Capturando valor
int  numero = Dividir(6, 2);
NumeroPar(numero);

//Chamada aninhada
NumeroPar( Dividir(6,2) );
```

Em F#:
```fsharp
let numeroPar numero =
    numero % 2 = 0

//Capturando valor
let numero = dividir 6 3
numeroPar numero

//Chamada aninhada
numeroPar (dividir 6 3)

//Chamada utilizando Pipe
dividir 6 3
|> numeroPar
```

Vamos aos problemas: As chamadas aninhadas não são intuitivas, simplesmente pelo fato de que elas resolvem em ordem diferente do que lemos, podemos nos acostumar com isso, claro, mas ainda não é algo muito intuitivo. 

A opção utilizando uma variável intermediária em C# me agrada bem mais, enquanto no F# a opção com pipe me parece melhor, ambas soam como mais organizadas, mas ainda são um pouco problematicas. Por exemplo, caso eu não quisesse lançar uma exceção com a divisão por zero? Eu poderia simplesmente retornar zero, ou um nullable/option, que tal?

A forma para contornar isso nesta implementação seria realizando um `try/catch`, que sinceramente, não me agrada nenhum pouco.

Uma outra forma de resolver é a função não retornar os valores conforme **ela** quer, mas sim, conforme quem a chamar. Mas como fazer isso? *High Order Functions*!

O que vamos fazer agora é permitir que a função `Dividir` retorne qualquer coisa, ou seja, precisamos utilizar *generics*.

Além disso, vamos passar dois parâmetros extras para a função, ambos serão funções que serão executadas conforme o resultado da divisão.

A primeira função será executada caso o divisor seja zero enquanto que a segunda irá executar se a divisão for realizada. 

Chegamos na conclusão de que a primeira função não precisa receber nenhum parâmetro, afinal ela será executada quando o divisor for zero e deve retornar um tipo genérico qualquer (T). No caso da função que executa quando a divisão ocorre ela precisará receber o resultado da divisão por parâmetro e deve retornar o mesmo tipo genérico.

```csharp
public T Dividir<T>(int dividendo, int divisor, Func<T> SeZero, Func<int, T> SeDividir)
=> divisor != 0 ?
    SeDividir(dividendo / divisor)
    : SeZero();
```

Eu concordo que este código não é trivial e nem muito bonito, apesar de cumprir seu papel, mas o mesmo código em F# já fica bem mais legal:

```fsharp
let dividir seZero seDividir dividendo divisor =
    if divisor <> 0
    then seDividir (dividendo/divisor)
    else seZero()
```
A sintaxe fica relativamente mais simples por conta de podermos omitir os tipos, mas o mais importante disso tudo é a aplicação parcial ser algo natural ao F#, vamos ver como fica a utilização dessas novas funções:

primeiro em C#:

```csharp
//Nullable
int? resultadoNullable = 
    Dividir(6, 2,
        () => null,
        resultado => new int?(resultado)
        );

//Resultado em texto
Dividir(6, 2,
    () => "divisão por zero",
    resultado => resultado.ToString());
```

Em F# vamos aproveitar a aplicação parcial para gerar novas funções:
```fsharp
let seZeroOption() = None
let seDividirOption numero = numero |> Some

let dividirOption = dividir seZeroOption seDividirOption

...
dividirOption 6 2
dividirOption 2 0


let seZeroTexto() = "divisão por zero"
let seDividirTexto numero = numero.ToString()

let dividirTexto = dividir seZeroTexto seDividirTexto

...
dividirTexto 6 2
dividirTexto 2 0
```

Precisamos fazer um pouco mais de coisa antes de executar o código, mas uma vez que criamos a função derivada por aplicação parcial podemos reutilizá-la à vontade, o que permite uma flexibilidade bem bacana.

No final de tudo, se ainda quisermos lançar uma exceção, podemos lançá-la na implementação da função `seZero`, ou seja, tivemos um pouco mais de trabalho, mas ganhamos em abstração e poder. Cabe a você decidir quando cada uma das formas faz mais sentido.

Agora vamos entender a diferença de fluxo entre: 

1. Chamar uma função, capturar o valor e continuar o programa:

{% include image.html link="https://imgur.com/5HveVSV.png" alt="Fluxo Tradicional" width=50 %}

2. Utilizar uma pipeline de Continuation;

{% include image.html link="https://imgur.com/r02ArD3.png" alt="Fluxo com Continuation" width=50 %}

Agora vamos começar a brincar um pouco mais sério.

## Entendendo como os dois fluxos são equivalentes

Vamos começar entendendo o que significa atribuir um valor, neste caso o `binding` do F# é o exemplo real, mas podemos "emular" isso com a atribuição do C#.

Quando fazemos um binding com o `let` estamos dizendo que:

```fsharp
let variavel = expressao
...codigo restante
```

Isso significa que, em qualquer momento que utilizramos essa variável ela será substituída pela expressão atribuída à ela, simples né?

Podemos emular a mesma coisa com o C#:

```csharp
int variavel = expressao;
...codigo restante
```
O mesmo comportamento ocorre aqui.

Por mais estranho que possa parecer, fazemos a mesma coisa quando utilizamos uma expressão lambda, veja:

Primeiro em F#:

```fsharp
fun variavel -> ...codigo restante
```
A diferença principal é que a expressão é passada somente na chamada desta função:

```fsharp
expressao 
|> (fun variavel -> ...codigo restante)
```

Mas note que os mesmos três elementos: variável, expressão e código restante aparecem, apenas em ordens diferentes.

Isso também vale para C#:

```csharp
Action<T> funcao = (variavel) => ...codigo restante

funcao(expressao);
```
Perceba que a expressão e a variável trocam de lugar quando utilizamos uma expressão lambda ao invés do binding, mas isso não importa muito, porque tudo permanece igual.

Ainda parece confuso? Vamos fazer exemplos simples de equivalências, primeiro em F#:

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
Agora em C#:

```csharp
//Binding
public int Funcao()
{
    int a = 5;
    int b = 6;
    int c = a + b;
    return c;
}

//"Lambda" -> na verdade são funções nomeadas locais, mas dá para entender, né?
public int Funcao()
{
    int f(int a)
    {
        int f2(int b)
        {
            int f3(int c) => c;
            return f3(a + b);
        }
        return f2(6);
    }
    return f(5);         
}
```

Como você deve ter notado, apesar de serem equivalentes, a versão utilizando lambda/funções nomeadas não é **nada** intuitiva, ela meio que só serve para mostrar que são equivalentes.

Agora vamos esconder o modo Lambda, em uma função, para diminuirmos um pouco essa loucura.

Na verdade, a função para "esconder" isso é bastante simples, veja:

```fsharp
let continueCom (valor, lambda) =
    valor |> lambda
```

Agora podemos utilizar da seguinte maneira:

```fsharp
let funcao =
    continueCom (5, fun a ->
    continueCom (6, fun b ->
    continueCom (a + b, fun c -> c)))
```

Até em C# temos um resultado bem mais interessante:

```csharp
public int ContinueCom(int valor, Func<int, int> lambda)
    => lambda(valor);

public int Funcao()
    =>  ContinueCom(5, a =>
        ContinueCom(6, b =>
        ContinueCom(a + b, c => c)));
```

OK, fizemos todo esse rolê para fazer a mesma coisa que as atribuições, qual o sentido disso?

O principal objetivo disso tudo, é poder incorporar funcionalidades em uma atribuição, não há como incluirmos uma funcionalidade ao fazermos isso: `int x = 10`. Mas podemos incluir qualquer código dentro do nosso método `ContinueCom`.

Imagine que você queira colocar uma escrita no Console, cada vez que uma variável é atribuída. Agora conseguimos fazer isso simplesmente colocando uma linha de código em nossa função de binding, veja:

```csharp
public int ContinueCom(int valor, Func<int, int> lambda)
{
    Console.WriteLine(valor);
    return lambda(valor);
}
```

Legal né?

Nos vemos no próximo post!

Alguma sugestão? Me conte nos comentários!

E Até mais!