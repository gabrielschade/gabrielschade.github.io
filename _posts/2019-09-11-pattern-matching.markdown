---
layout: post
title:  "Criando um Pattern Matching em C#"
date:   2018-09-11 00:00:00 +0000
comments: true
tags: [C#, F#]
---

Olá pessoa!

Antes de qualquer coisa, sim, eu sei que existe um Pattern Matching nativo em C#, mas na minha opinião ele é relativamente estranho. Então vou propor algo um pouquinho diferente hoje. Criarmos o nosso próprio **pattern matching**.

<!--more-->

Ok, talvez possa parecer um pouco ambicioso da minha parte, estou falando que o pattern matching nativo do C# é estranho e estou me proponho a fazer um diferente. Bom, na verdade, só de termos acesso ao pattern matching no C# hoje em dia já é bem legal!

Mas como vocês já devem saber, eu gosto bastante de programação funcional e depois de algumas experimentações por aqui cheguei em um resultado que fiquei satisfeito e gostaria de compartilhar com vocês (e coletar opiniões).

Primeiro vale citar uma pequena explicação sobre o pattern matching:

> Como o próprio nome sugere, pattern matching é utizado para comparar padrões. Um pattern matching é uma expressão que realiza uma comparação e extração de valores.
> Não é exatamente isso, mas você pode entender um pattern matching como um `switch` que permite realizar comparações e retornar valor a partir de uma expressão.

## Introdução

Primeiro vale uma introdução geral sobre pattern matchings em F#, se você já domina este assunto, fique à vontade para pular para a [implementação proposta na próxima seção](#implementacao).

Vamos começar com um pattern matching "comum" em F#, algo similar à um desvio condicional, veja:

```fsharp
let valor = 10
let texto = 
    match valor with
    | valor when valor % 2 = 0 -> "Numero Par"
    | valor when valor > 5 -> "Maior que cinco"
    | _ -> "Outros casos"

Console.WriteLine texto
```
Neste caso, estamos comparando o valor 10 com diversas expressões diferentes e retornando uma string em correspondente à expressão escolhida. Vale lembrar que o valor *discard* (_) é utilizado como o `default`, ou seja, se nenhum dos casos anteriores atenderem a condição, este é o caso que será escolhido.

No exemplo acima, o valor 10 faz com que o texto retornado seja o retorno da primeira expressão: "Número par". Ele executa a **primeira expressão** correspondente, mesmo que neste exemplo, o valor também seja maior do que cinco.

Se alterarmos o valor para 9, teremos como resultado: "Maior que cinco" e por fim, se alterarmos o valor para 3, teremos como resultado "Outros casos".

Tudo tranquilo até aqui, certo?

Vamos para o segundo tipo de comparação, comparação com base em **tipos**. Esta comparação geralmente é utilizada em conjunto com os discriminated unions, onde você possui um valor que pode ser qualquer um dos casos, veja.

```fsharp
type Forma = | Quadrado | Triangulo | Circulo

let forma = Quadrado
let texto =
    match forma with
    | Quadrado -> "Quadrado"
    | Triangulo -> "Triangulo"
    | Circulo -> "Circulo"
```

Simples né?

Também podemos fazer isso quando precisarmos obter alguma propriedade de um tipo derivado, veja esse novo exemplo:

```fsharp
type PessoaFisica = { CPF: string}
type PessoaJuridica = { CNPJ: string}

type Pessoa = 
    | PessoaFisica of PessoaFisica 
    | PessoaJuridica of PessoaJuridica
```
Neste exemplo, temos um tipo para pessoa física e outro para pessoa jurídica. Além disso, temos um tipo para pessoa, que pode ser física ou jurídica!

Podemos utilizar este pattern matching para obter o código (CPF ou CNPJ) independente do tipo de pessoa:

```fsharp
let pessoa = PessoaFisica {CPF = "123321123"}

let codigo =
    match pessoa with
    | PessoaFisica pf -> pf.CPF
    | PessoaJuridica pj -> pj.CNPJ
```

Por fim, temos o pattern matching para estruturas de dados, este é um caso que possui várias particularidades. A principal delas é que o próprio pattern matching separa o primeiro elemento do resto da estrutura, facilitando a implementação de funções recursivas. Infelizmente o pattern matching proposto neste post **ainda** não cobre esta funcionalidade.

<a name="implementacao" tabindex="-1" href="#implementacao"></a>
<h2>
<span>Implementação proposta</span>
</h2> 

Vamos deixar uma coisa clara, a base de inspiração dessa implementação foi o pattern matching do F#, então vamos fazer algumas comparações por aqui, usando os exemplos da introdução, beleza?

Primeiro vamos para a implementação do pattern matching propriamento dito. Na prática ele virou um método de apenas uma linha. Não é dos métodos mais simples de compreender batendo o olho, admito. Mas ficou relativamente poderoso.

Como acho que ele não vai ficar tão claro colocando a implementação completa de cara, vamos por partes.

Começando pelo retorno, vamos lá, a ideia do pattern matching é retornar qualquer coisa, afinal a expressão é passada por parâmetro, por conta disso, precisamos utilizar **generics**.

```csharp
T Match<T>()
    => default;
```

Até agora criamos um método que retorna o valor padrão para qualquer tipo informado no generics, certo?

Vamos entender como funcionam as expressões que vamos utilizar no pattern matching, como eu disse antes, vamos olhar para o F# primeiro:

```fsharp
match valor with
    | valor when valor % 2 = 0 -> "Numero Par"
    | valor when valor > 5 -> "Maior que cinco"
    | _ -> "Outros casos"
```

Cada caso, pode ser separado em dois pontos: **condição** e **expressão**. Onde a condição determina qual caso será executado e a expressão determina a função que será executada naquele caso. Como precisamos de dois valores diferentes.

O primeiro parâmetro será um `bool`, ou seja, a condição para executar o caso. Enquanto o segundo parâmetro deve ser uma função que retorne `T`, afinal, este é o valor que será retornado pelo `Match`, quando o caso for executado, veja:

```csharp
T Match<T>( bool condicao, Func<T> expressao )
    => default;
```

Agora vamos fazer com que a expressão seja executada caso a condiçao seja verdadeira, caso contrário, vamos continuar retornando o valor padrão:

```csharp
T Match<T>( bool condicao, Func<T> expressao )
    => condicao ? expressao(): default;
```

Este código até vai funcionar, mas uma das bases do pattern matching é poder passarmos diversos padrões diferentes na mesma comparação, como fazemos?

Felizmente o C# possui a palavra reservada **params**! Com esta palavra reservada permitimos que a chamada do método possa conter virtualmente infinitos parâmetros. Estes parâmetros são agrupados em um array para o corpo interno da função.

> Se você não conhece o `params`, você pode acessar a documentação oficial [neste link](https://docs.microsoft.com/pt-br/dotnet/csharp/language-reference/keywords/params).

No entanto, temos 2 parâmetros diferentes: a condição e a expressão. E nesse caso, cada parâmetro precisa conter este par inteiro. Para fazer isso, vamos utilizar uma **tupla**.

Vamos lá, então vamos refatorar o parâmetro do método `Match`, para ser um `params array` onde cada elemento do array é uma tupla, contendo a condição e a expressão. Vamos chamar este array de **casos**, afinal, cada elemento dele representará um caso diferente.

```csharp
T Match<T>(params (bool? condicao, Func<T> expressao)[] casos)
```

Por fim, vamos implementar o corpo do método, eu prometi que era só uma linha, lembra?

O pattern matching precisa encontrar a **primeira** condição atendida e executar sua expressão, algo bem simples de resolvermos usando Linq:

```csharp
static T Match<T>(params (bool condicao, Func<T> expressao)[] casos)
=> casos.First(caso => caso.condicao.Value)
        .expressao();
```

Neste ponto já conseguimos utilizar o Match, no entanto, realizei um último ajuste: tornar o parâmetro que define a condição um `bool nullable` e definir o caso `null` como um caso para executar:

```csharp
T Match<T>(params (bool? condicao, Func<T> expressao)[] casos)
=> casos.First(caso => !caso.condicao.HasValue || caso.condicao.Value)
        .expressao();
```
Eu sei, soa **bastante** controverso (e nem me agrada muito), mas ele produz um resultado bastante agradável e como eu disse, logo mais já vou explicar, segura aí.

Agora vamos para a utilização desse cara! - Vamos para o primeiro do pattern matching:

Primeiro em F# novamente:

```fsharp
let valor = 3
let texto = 
    match valor with
        | valor when valor % 2 = 0 -> "Numero Par"
        | valor when valor > 5     -> "Maior que cinco"
        | _                        -> "Outros casos"
```
Agora usando o nosso Match em C#:

```csharp
int valor = 3;
string texto = 
    Match(
        (valor % 2 == 0, () => "Número Par"),
        (valor > 5,      () => "Valor maior que cinco"),
        (true,           () => "Outros casos")
        );
```

Perceba que apra o caso padrão, eu precisei colocar de forma fixa o valor `true`, confesso que isso não me agradou muito e este é justamente o motivo de termos alterado a condição para um tipo `nullable` e estarmos validando `null` como um caso verdadeiro. Com isso, podemos alterar o valor `true` para `default` que o resultado continuará sendo o mesmo:

```csharp
int valor = 3;
string texto = 
    Match(
        (valor % 2 == 0, () => "Número Par"),
        (valor > 5,      () => "Valor maior que cinco"),
        (default,        () => "Outros casos")
    );
```

Legal né?

Vamos para o segundo caso, onde utilizamos formas:

```fsharp
type Forma = | Quadrado | Triangulo | Circulo
let forma = Quadrado
let texto =
    match forma with
    | Quadrado  -> "Quadrado"
    | Triangulo -> "Triangulo"
    | Circulo   -> "Circulo"
```

Agora em C#:

```csharp
public abstract class Forma { }
public class Quadrado : Forma { }
public class Triangulo : Forma { }
public class Circulo : Forma { }

Forma forma = new Quadrado();
string texto = 
    Match(
        (forma is Quadrado,  () => "Quadrado"),
        (forma is Triangulo, () => "Triangulo"),
        (forma is Circulo,   () => "Circulo")
    );
```

Por fim, temos o exemplo utilizando comparação de padrão e obtendo um valor (este foi o caso que menos gostei). Primeiro em F#:

```fsharp
type PessoaFisica =   { CPF: string}
type PessoaJuridica = {CNPJ: string}
type Pessoa = 
    | PessoaFisica of PessoaFisica 
    | PessoaJuridica of PessoaJuridica

let pessoa = PessoaFisica {CPF = "123321123"}
let codigo =
    match pessoa with
    | PessoaFisica pf -> pf.CPF
    | PessoaJuridica pj -> pj.CNPJ
```
E agora em C#:

```csharp
public abstract class Pessoa { }
public class PessoaFisica : Pessoa
{
    public string CPF { get; set; }
}

public class PessoaJuridica : Pessoa
{
    public string CNPJ { get; set; }
}

Pessoa pessoaFisica = new PessoaFisica() {CPF = "12312312" };
string codigo =
    Match(
        (pessoaFisica is PessoaFisica,   () => pessoaFisica is PessoaFisica pf ? 
                                               pf.CPF : ""),
        (pessoaFisica is PessoaJuridica, () => pessoaFisica is PessoaJuridica pj ? 
                                               pj.CNPJ : "")
    );
```

É eu sei, ficou bastante verboso e fazemos duas comparações.

Bom pessoal, este é o estágio em que o pattern matching está, assim que eu gostar mais dele vou incluí-lo na `Tango`, por enquanto, ainda fica só como experimentação!

Me mandem feedbacks, gostaram? Acharam que ficou ruim? Sugestões? Críticas?

- Bom, me conte nos comentários!

E Até mais!