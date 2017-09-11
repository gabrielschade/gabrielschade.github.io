---
layout: post
title:  "Utilizando o Distinct do LINQ com dignidade"
date:   2017-09-10 00:00:00 +0000
comments: true
tags: [C#, Programação III]
---

Olá pessoas do meu coração, depois de dois posts com bastante conversa e pouca programação, decidi que já era hora de mostrar um pouco de código, neste post irei ilustrar um problema bem específico, o método `Distinct` provido pelo LINQ.

Este post será um pouco mais avançado, então será presumido que você já possui um nível de compreensão razoável em C# e na biblioteca LINQ. Este post não irá se extender demais em exemplos introdutórios.

A biblioteca LINQ (*language integrated query*) do C# provê uma série de métodos para trabalharmos com coleções de dados, através dela é possível realizar uma série de operações como filtrar, reduzir, mapear, ordenar e até unir coleções.

Para realizar operações sobre estas coleções pode-se utilizar dois tipos de sintaxe: *query* e *high order functions (HOF)*. Neste post irei focar nas HOF's, por preferência pessoal e por ser relevante à solução proposta.

Mas antes de partirmos para a apresentação do problema, o que diabos é uma *high order function*?

Tanto em matemática quanto em ciência da computação, uma *high order function* é uma função que precisa seguir um dos itens abaixo:

1. Receber uma ou mais funções por parâmetro;
2. Retornar uma função como resultado.

Em C#, assim como diversas outras linguagens as funções são tratadas como membros de primeira ordem, ou seja, elas podem ser passadas por parâmetro ou retornadas como resultado de uma outra função. A biblioteca LINQ usa e abusa deste conceito.

Vamos realizar um exemplo bastante simples apenas para ilustrar a utilização de uma HOF na biblioteca LINQ:

``` csharp
int[] numeros = { 1, 2, 3, 4, 5 };
int[] pares = numeros.Where(numero => numero % 2 == 0)
                     .ToArray();

//pares -> int[2] { 2, 4 }
```
Este exemplo é bastante simples e você já deve ter implementado algo parecido e até mais complexo que isso. O ponto principal a ser ilustrado é o método `Where` utilizado no exemplo.

O parâmetro deste método é **outro método**, no entanto aqui (como em muitas vezes) utilizamos um método anônimo, ou seja, ele não possui nome e sua assinatura é inferida pelo C#. Vamos identificar alguns elementos deste método anônimo.

1. Ele só possui um parâmetro; 
2. Este parâmetro é do tipo `int`;
3. Ele é composto por apenas uma linha, neste caso esta sintaxe automaticamente executa uma instrução de `return` nesta linha;
4. O retorno é do tipo `boolean`, afinal a expressão `numero % 2 == 0` retornará um valor deste tipo.

Tendo todas estas informações poderíamos substituir esta sintaxe por um método normal?

Sim, poderíamos!

``` csharp
bool VerificaSeNumeroPar(int numero) {
    return numero % 2 == 0;
}

int[] numeros = { 1, 2, 3, 4, 5 };
int[] pares = numeros.Where(VerificaSeNumeroPar)
                     .ToArray();

//pares -> int[2] { 2, 4 }
```

Isso é totalmente permitido porque o C# não se importa se o método é ou não anônimo, desde que o tipo dos métodos (retorno e parâmetros) seja igual ao tipo que a HOF espera por parâmetro.

Com a introdução feita, vamos ao problema que ocorre no método `Distinct`. Este método tem como objetivo eliminar todos os valores repetidos, mantendo apenas os valores **distintos**, muito semelhante à esta funcionalidade dos bancos de dados em uma consulta SQL.

Vamos realizar mais um teste:

``` csharp
int[] numeros = { 2, 2, 4, 5, 11, 6, 4 };
int[] semNumerosRepetidos = numeros.Distinct().ToArray();

//semNumerosRepetidos -> int[5] { 2, 4, 5, 11, 6 }
```
Tudo funcionou conforme o esperado!

Mas peraí, então qual o problema com o distinct?

No exemplo anterior tudo ocorre bem por conta da comparação realizada entre valores inteiros. `int` é um tipo primitivo e por sua vez é comparado através da comparação *estrutural*, nos casos onde comparamos classes que utilizam comparação *referêncial* podemos não ter o resultado esperado.

Vamos criar uma classe chamada `Produto` contendo apenas duas propriedades:

``` csharp
public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; }
}
```

Agora vamos criar uma lista de produtos e montar um exemplo semelhante:

``` csharp
List<Produto> produtos = new List<Produto>();
produtos.Add(new Produto() { Id = 1, Nome = "Caneta" });
produtos.Add(new Produto() { Id = 2, Nome = "Lápis" });
produtos.Add(new Produto() { Id = 3, Nome = "Computador" });
produtos.Add(new Produto() { Id = 1, Nome = "Caneta" });
produtos.Add(new Produto() { Id = 3, Nome = "Computador" });

Produto[] produtosSemRepeticao = 
    produtos.Distinct().ToArray();

// produtosSemRepeticao -> Produto[5] { ... }
```

Neste exemplo o método `Distinct` acaba não fazendo nada, afinal, mesmo existindo duas canetas e dois computadores na listagem, tratam-se de referencias diferentes, portanto são tratados como valores diferentes.

Felizmente todos estão cientes disso, então, existem formas de contornar este problema, de acordo com a documentação do método `Distinct` que você pode encontrar [aqui][https://msdn.microsoft.com/pt-br/library/bb348436(v=vs.110).aspx], você pode acabar com este problema fazendo com que sua classe implemente a interface `IEquatable<T>` onde `T` é o tipo da própria classe. Vamos lá:

``` csharp
public class Produto : IEquatable<Produto>
{
    public int Id { get; set; }
    public string Nome { get; set; }

    public bool Equals(Produto other)
    {
        return this.Id == other.Id;
    }

    public override int GetHashCode()
    {
        return this.Id.GetHashCode();
    }
}
```

Seguindo as diretrizes da documentação tudo funciona normalmente, agora nosso método `Distinct` está funcionando!

É... Até está funcionando, mas esta implementação gera alguns problemas. A partir deste ponto estamos **decidindo** que a única forma de se comparar produtos é através de seu `Id`. Eu não gosto da ideia de firmar algo com tanta certeza.

Mas peraí, há mais uma opção na documentação, trata-se de uma implementação da interface `IEqualityComparer<T>`!

Qual a diferença desta abordagem? Eu considero esta abordagem consideravelmente melhor, ela consiste em criar uma **nova** classe para ser utilizada como comparador, conforme código abaixo:

``` csharp
public class ComparadorProduto : IEqualityComparer<Produto>
{
    public bool Equals(Produto x, Produto y)
    {
        return x.Id == y.Id;
    }

    public int GetHashCode(Produto obj)
    {
        return obj.Id;
    }
}
```

No exemplo acima eu mantive as assinaturas (e nomes de parâmetro) sugeridos pela interface, mas você pode (e na minha opinião deve) alterá-los. Agora no momento de utilizar o método `Distinct` podemos utilizar a sobrecarga disponível, informando um `IEqualityCOmparer`.

``` csharp
List<Produto> produtos = new List<Produto>();
produtos.Add(new Produto() { Id = 1, Nome = "Caneta" });
produtos.Add(new Produto() { Id = 2, Nome = "Lápis" });
produtos.Add(new Produto() { Id = 3, Nome = "Computador" });
produtos.Add(new Produto() { Id = 1, Nome = "Caneta" });
produtos.Add(new Produto() { Id = 3, Nome = "Computador" });

IEnumerable<Produto> produtosSemRepeticao = 
    produtos.Distinct(new ComparadorProduto());
```

Qual as vantagens e desvantagens desta abordagem?

As principais vantagens são: não estamos poluíndo a classe `Produto` e podemos criar diversos comparadores para objetos de uma mesma classe, escolhendo qual comparador utilizar no momento da chamada do método `Distinct`.

A principal desvantagem ao meu ver é a necessidade de criarmos uma nova classe para informarmos este métodos cada vez que for necessário comparar um objeto de uma forma ainda não implementada. Este tipo de abordagem não me soa produtivo.

Mas o que fazer neste caso? **HOF**!

A solução que proponho neste post é utilizarmos *high order functions* para que possamos escrever a comparação no momento de utilizá-la e apenas na própria chamada. Parecido com o que fazemos no método `Where` demonstrado anteriormente.

O resultado desejado é encontrarmos algo próximo a esta implementação:

``` csharp
IEnumerable<Produto> produtosSemRepeticao = 
    produtos.Distinct( (produto1, produto2) => produto1.Id == produto2.Id );
```

Esta implementação não parece muito mais simples do que precisarmos criar uma nova classe, implementar a interface para comparação e só depois disso, implementar o método?

Para que esta solução seja possível teremos que implementar uma classe para gerar `IEqualityComparer's` sob demanda e para isso é muito importante analisar as características que um comparador possui. Vamos lá.

A interface `IEqualityComparer` utiliza generics e possui dois métodos diferentes: `Equals` e o `GetHashCode`. 

Logo de cara já podemos perceber que a assinatura proposta anteriormente não é passível de ser feita, primeiro porque precisaremos de alguma chamada para criar o comparador e segundo porque precisaremos informar dois métodos e não apenas um, mas calma, ainda vamos chegar em um resultado legal.

Primeiro vamos criar uma classe chamada `ComparadorGenerico`, esta classe deverá utilizar generics e implementar a interface `IEqualityComparer`, conforme código:

``` csharp
public class ComparadorGenerico<T> : IEqualityComparer<T>
{
    public bool Equals(T x, T y)
    {
        throw new NotImplementedException();
    }

    public int GetHashCode(T obj)
    {
        throw new NotImplementedException();
    }
}
``` 

Agora que entra a sacada mais importante de todas, ao implementar a interface os métodos já são definidos, como poderemos permitir que o programador possa informar os métodos através de parâmetros?

A resposta é simples, você precisará implementar um `contain and delegate` nesta classe. Okay, mas o que isso significa na prática?

Você terá que criar propriedades para armazenar os métodos informados por parâmetro e os métodos da interface apenas delegarão a chamada para os métodos nas propriedades!

Confuso?

Calma que eu te explico, vamos por partes menores. Primeiro vamos criar as propriedades para armazenar os métodos.

``` csharp
public class ComparadorGenerico<T> : IEqualityComparer<T>
{
    public Func<T, T, bool> MetodoEquals { get; }
    public Func<T, int> MetodoGetHashCode { get; }

    ...
}
``` 
Com isso temos propriedades para armazenar os métodos, note que, a assinatura do delegate `Func` sempre coloca os parâmetros na frente e o último tipo se refere ao retorno. 

Portanto a propriedade `MetodoEquals` armazena a referência para um método que recebe dois objetos do tipo `T` e retorna um `bool` e a propriedade `MetodoGetHashCode` armazena a referência para um método que recebe um `T` e retorna um `int`.

Isso significa que estas duas propriedades podem armazenar métodos com as assinaturas idênticas aos métodos da interface de comparação. Agora podemos fazer com que os métodos da interface deleguem a responsabilidade para estes métodos!

``` csharp
public class ComparadorGenerico<T> : IEqualityComparer<T>
{
    ...

    public bool Equals(T x, T y)
    {
        return MetodoEquals(x, y);
    }

    public int GetHashCode(T obj)
    {
        return MetodoGetHashCode(obj);
    }
}
``` 

A última coisa que precisamos fazer é criar uma forma para o programador informar os dois métodos que serão armazenados nas propriedades, podemos fazer isso através do contrutor de nossa classe:

``` csharp
public class ComparadorGenerico<T> : IEqualityComparer<T>
{
    public Func<T, T, bool> MetodoEquals { get; }
    public Func<T, int> MetodoGetHashCode { get; }

    public ComparadorGenerico(Func<T, T, bool> metodoEquals, Func<T, int> metodoGetHashCode)
    {
        this.MetodoEquals = metodoEquals;
        this.MetodoGetHashCode = metodoGetHashCode;
    }

    public bool Equals(T x, T y)
    {
        return MetodoEquals(x, y);
    }

    public int GetHashCode(T obj)
    {
        return MetodoGetHashCode(obj);
    }
}
```

Agora, podemos comparar os produtos com dignidade, sem precisar criar várias classes ou manter apenas uma comparação por classe, conforme código abaixo:

``` csharp
IEnumerable<Produto> produtosSemRepeticao = 
                produtos.Distinct(new ComparadorGenerico<Produto>(
                    (produto1, produto2) => produto1.Id == produto2.Id,
                    produto => produto.Id.GetHashCode())
                );
```

A grande vantagem desta abordagem é que a classe de comparação genérica é escrita uma única vez para todas as diferentes classes.

A ideia final já está construída, mas podemos ir um pouco mais além.

A primeira mudança é utilizarmos a sintaxe enxuta do C# para diminuir nossa classe genérica, afinal, métodos de uma linha não precisam ter chaves e nem a palavra reservada `return`:

``` csharp
public bool Equals(T x, T y)
    => MetodoEquals(x, y);

public int GetHashCode(T obj)
    => MetodoGetHashCode(obj);
```

Além disso, eu pessoalmente não gosto de utilizar construtores, me parecem não fluídos. Por opiniões pessoais eu prefiro um método estático para a criação deste objeto, fazendo com que a classe final fique desta forma:

``` csharp
public class ComparadorGenerico<T> : IEqualityComparer<T>
{
    public Func<T, T, bool> MetodoEquals { get; }
    public Func<T, int> MetodoGetHashCode { get; }
    private ComparadorGenerico(Func<T, T, bool> metodoEquals, Func<T, int> metodoGetHashCode)
    {
        this.MetodoEquals = metodoEquals;
        this.MetodoGetHashCode = metodoGetHashCode;
    }

    public static ComparadorGenerico<T> Criar(Func<T, T, bool> metodoEquals, Func<T, int> metodoGetHashCode)
        => new ComparadorGenerico<T>(metodoEquals, metodoGetHashCode);

    public bool Equals(T x, T y)
        => MetodoEquals(x, y);

    public int GetHashCode(T obj)
        => MetodoGetHashCode(obj);
}
```

Por fim, a cereja do bolo é criarmos uma extensão para o próprio `IEnumerable` assim como o LINQ faz, mas desta vez, utilizando as nossas `HOF's`.

Antes disso, vamos analisar a assinatura do método `Distinct` da própria biblioteca LINQ:

``` csharp
public static IEnumerable<TSource> Distinct<TSource>(this IEnumerable<TSource> source, IEqualityComparer<TSource> comparer);
```

Eu não vou detalhar como funcionam os métodos de extensão neste post (ficará para o futuro), mas a ideia por trás destes métodos é simples: extender uma classe ou interface com um método implementado em outro local.

Para fazer isso precisamos criar uma classe estática com um método também estático. O primeiro parâmetro deste método recebe o modificador `this` para identificar qual classe ou interface está sendo extendida, depois disso, são informados os parâmetros normalmente.

O método de extensão que iremos criar irá receber as duas *high order functions* necessárias para um comparador genérico e tudo que este método fará é uma chamada para nosso comparador genérico na sobrecarga já existente do método `Distinct`, funcionando apenas como um atalho.

``` csharp
public static class DistinctExtension
{
    public static IEnumerable<TSource> Distinct<TSource>(
        this IEnumerable<TSource> source, 
        Func<TSource, TSource, bool> metodoEquals, 
        Func<TSource, int> metodoGetHashCode)
            => source.Distinct(ComparadorGenerico<TSource>.Criar(metodoEquals, metodoGetHashCode));
}
```

Com isso conseguimos omitir a criação do comparador genérico e informar apenas os métodos de comparação através desta nova sobrecarga e podemos voltar ao problema:

``` csharp
List<Produto> produtos = new List<Produto>();
produtos.Add(new Produto() { Id = 1, Nome = "Caneta" });
produtos.Add(new Produto() { Id = 2, Nome = "Lápis" });
produtos.Add(new Produto() { Id = 3, Nome = "Computador" });
produtos.Add(new Produto() { Id = 1, Nome = "Caneta" });
produtos.Add(new Produto() { Id = 3, Nome = "Computador" });

IEnumerable<Produto> produtosSemRepeticaoPorId = 
    produtos.Distinct(
        (produto1, produto2) => produto1.Id == produto2.Id,
        produto => produto.Id.GetHashCode()
    );

IEnumerable<Produto> produtosSemRepeticaoPorNome = 
    produtos.Distinct(
        (produto1, produto2) => produto1.Nome.ToLower() == produto2.Nome.ToLower(),
        produto => produto.Nome.GetHashCode()
    );
```

Acredito que esta é a melhor forma que conheço para criar comparadores genéricos e tornar sua utilização o mais transparente possível, já utilizei códigos similares em diferentes projetos e até agora tive bons resultados.

Eu sei, este post foi bem mais pesado que os anteriores e exigiu um nível técnico considerável em C#, mas acredito é uma implementação muito útil e tive vontade de compartilhá-la.

(Uma biblioteca minha chamada TangoII possui esta implementação [aqui][https://github.com/gabrielschade/TangoII/blob/master/TangoII/Linq/EqualityComparerBuilder.cs])

Mas me diga você, o que achou desta implementação?
Ficaram dúvidas?
Sugestões?

Usem os comentários, me contem e até o próximo post!