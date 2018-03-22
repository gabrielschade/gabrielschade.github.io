---
layout: post
title:  "Métodos de Extensão em C#"
date:   2018-02-05 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoa!

Hoje vamos discutir sobre um conceito muito poderoso presente no C#. Trata-se dos *extension methods*, ou em português, métodos de extensão.
<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/posts-blog/tree/master/ExtensionMethods" %} 

Os métodos de extensão são um recurso bastante utilizado dentro da própria linguagem. A biblioteca `Linq`, por exemplo, extende a interface `IEnumerable` com diversos métodos, talvez você nunca tenha percebido, mas métodos como o `Select` e `Where`, por exemplo, não estão escritos na própria coleção. 

Isso porque a funcionalidade conhecida como **Extension Methods** permite aos desenvolvedores .NET adicionar métodos à tipos ou classes existentes, permitindo inclusive chamá-los como se fizessem parte da classe, mesmo que o código esteja em outro arquivo.

Para utilizar este recurso precisamos cumprir com alguns pré-requisitos. Vamos fazer um exemplo para ilustrar a criação de um método de extensão passo-a-passo.

Primeiro vamos criar a classe e aqui encontramos nossa primeira regra, a classe **precisa** ser estática.

```csharp
public static class Extensao
{

}
```

Agora vamos criar dois métodos diferentes para o tipo `int`! 

O primeiro método irá checar se um determinado valor é par, simples assim. Já o segundo irá comparar se um número é maior do que um segundo número. Dois métodos bastante simples, mas que já vai dar para entender o conceito.

O mais legal é que da forma que vamos escrevê-lo ele funcionará como se ele fosse escrito direto na estrutura do tipo primitivo que representa os inteiros!

Assim como a classe, nosso método também precisa ser estático:

```csharp
public static class Extensao
{
    public static bool Par(int numero)
    {
        return numero % 2 == 0;
    }

    public static bool Maior(int numero, int segundoNumero)
    {
        return numero > segundoNumero;
    }
}
```
Ok, o método é bem simples e acho que não requer nenhuma explicação diferenciada. Agora veja, este método ainda não funciona como um método de extensão, ainda falta fazermos um ajuste.

Para fazer com que o método se torne uma extensão, precisamos identificar qual a classe ou tipo estamos extendendo, fazemos isso com a palavra reservada `this`.

Você já deve ter utilizado esta palavra reservada antes para se referir ao próprio objeto, certo? -No caso dos métodos de extensão, você deve utilizá-la como um prefixo do primeiro parâmetro. Isso identifica o tipo que será extendido, veja:

```csharp
public static class Extensao
{
    public static bool Par(this int numero)
    {
        return numero % 2 == 0;
    }

    public static bool MaiorQue(this int numero, int segundoNumero)
    {
        return numero > segundoNumero;
    }
}
```
Com isso tornamos estes dois métodos uma extensão para o tipo `int`, e já podemos incluir chamadas no método `Main` para testá-los!

Mas antes, vamos encurtá-los com uma abordagem um pouquinho mais funcional, vamos utilizar *arrow functions*.

```csharp
public static class Extensao
{
    public static bool Par(this int numero)
        => numero % 2 == 0;
    

    public static bool MaiorQue(this int numero, int segundoNumero)
        => numero > segundoNumero;
    
}
```
Esta abordagem não é necessária para métodos de extensão, mas eu prefiro escrever métodos curtos com esta sintaxe, então nada mais justo do que deixar da forma que julgo melhor.

Agora sim, vamos para o método `Main`. Primeiro vamos utilizá-los como métodos estáticos normalmente, veja:

```csharp
static void Main(string[] args)
{
    Extensao.Par(3);         // -> false
    Extensao.MaiorQue(3, 2); // -> true
}
```

Nada de tão estranho, além do nome `MaiorQue` que não parece um nome ótimo para nosso método.

Agora vamos ver como fica a utilização destes mesmos métodos, mas como uma extensão para o tipo inteiro:

```csharp
static void Main(string[] args)
{
    Extensao.Par(3);         // -> false
    Extensao.MaiorQue(3, 2); // -> true

    int numero = 3;
    numero.Par();       // -> false
    numero.MaiorQue(2); // -> true
}
```
Essa é a magia dos métodos de extensão, podemos usá-los como se eles realmente fosse dos valores daquele tipo! Inclusive, podemos utilizá-lo diretamente nos valores:

```csharp
static void Main(string[] args)
{
    Extensao.Par(3);         // -> false
    Extensao.MaiorQue(3, 2); // -> true

    int numero = 3;
    numero.Par();       // -> false
    numero.MaiorQue(2); // -> true

    2.Par()       // -> true
    5.MaiorQue(2) // -> true
}
```

Legal né? -Mas nem tudo são flores, vamos deixar claro alguns detalhes:

* Não é possível criar **propriedades**, **atributos/fields** ou **eventos** de extensão;

* Não é possível **sobrescrever** um método da classe através de um método de extensão, mas é possível **sobrecarregar** um;

* Você precisa importar o namespace com os métodos de extensão para que eles sejam acessíveis (O Visual Studio já dá uma força nessa).

Você pode encontrar o código destes métodos de extensão no [meu GitHub](https://github.com/gabrielschade/posts-blog/tree/master/ExtensionMethods).

Eu acho essa funcionalidade fantástica e considero um dos destaques do C#, inclusive utilizei este tipo de implementação em diversos métodos da [**Tango**]({{ site.baseurl }}{% link _posts/2017-12-14-welcome-tango.markdown %}).

Gostou do post? 

Me conte nos comentários!

E Até mais!