---
layout: post
title:  "Código em C#, teste unitário em F#"
github: https://github.com/gabrielschade/posts-blog/tree/master/Teste-unitario-fsharp
date:   2017-09-24 00:00:00 +0000
comments: true
tags: [C#, F#]
---

Olá pessoas, que tal falar um pouco sobre teste unitário?

O foco deste post será propor uma forma de você começar a implementar seus testes unitários de aplicações .NET utilizando a linguagem F#.
<!--more-->
Para quem ainda não conhece esta linguagem maravilhosa e não sabe do que estou falando: F# é a iniciativa da Microsoft para o paradigma de programação funcional na plataforma .NET.

Não é nenhum segredo que eu gosto MUITO desta linguagem e do quão **idiomática** ela é. Eu concordo totalmente com a frase: "Um bom código é feito primeiro para humanos entenderam depois para computadores", afinal, quem nunca teve de alterar um código totalmente incompreesível e sofreu com isso?

Mas vamos ao tema! Para mostrar os projetos de teste irei criar uma classe bastante simples, esta classe representará uma calculadora com a operação aritmética de soma.

Vamos lá:

``` csharp
public static class Calculadora
{
    public static int Somar(int parcela1, int parcela2)
        => parcela1 + parcela2;
}
```

O método é bastante simples e consiste de uma única linha para retornar o resultado do cálculo. Felizmente como o foco é a construção dos testes, não faz muita diferença a complexidade deste código.

Primeiro vamos criar um projeto de testes em C#, para termos um ponto de comparação. Com o setup inicial de um projeto de testes em C#, já encontraremos uma classe com a seguinte sintaxe:

``` csharp
[TestClass]
public class CalculadoraTestes
{
    [TestMethod]
    public void TestMethod1()
    {
    }
}
```

Temos as anotações/atributos `[TestClass]` e `[TestMethod]` para identificarmos que esta classe e seu respectivo método são membros de teste. Primeiro vamos criar um método para testar a soma de nossa calculadora:

``` csharp
[TestMethod]
public void TesteSomando2E3()
{
    int parcela1 = 2, 
        parcela2 = 3, 
        esperado = 5;

    int resultado = Calculadora.Somar(parcela1, parcela2);
    Assert.AreEqual(esperado, resultado);
}
```
É muito comum utilizarmos os métodos da classe `Assert` para validarmos o resultado do teste, por conta disso, esta classe possui uma boa quantidade de métodos para diferentes tipos de validação:

* ● AreEqual
* ● IsTrue
* ● Fail
* ● IsInstanceOfType

Existem vários outros além dos listados acima, no entanto, como eu falei no início do post, eu estou preferindo utilizar a sintaxe do F# para realizar este tipo de operação. Vamos ver como ficaria este mesmo teste, agora em F#.

Para fazer isso, vamos criar um projeto do tipo Class Library em F#. Para configurarmos o projeto para testes é necessário incluir a biblioteca FsUnit.

``` fsharp
PM> Install-Package FsUnit
```

> **Documentação**
> 
> Você pode encontrar a documentação do FsUnit em: http://fsprojects.github.io/FsUnit/

Além disso, precisamos instalar o adaptador para o nUnit, você pode encontrá-lo na galeria de extensões.

> E neste link: https://www.nuget.org/packages/NUnit3TestAdapter/

Vale ressaltar que estas instalações são feitas apenas uma vez e são necessárias porque estamos utilizando o NUnit para testes. Elas seriam necessárias mesmo em uma versão para C#.

Com tudo instalado, vamos para a parte interessante dos testes em F#.

1. Sintaxe idiomática
2. Nome dos métodos

Vamos criar o método de teste na sintaxe do F#, conforme código:
``` fsharp
[<Test>]
let TesteSomando2E3() =
    let parcela1 = 2
    let parcela2 = 3
```

Ainda falta realizarmos o *assert* da resposta e é neste ponto que considero um ótimo ganho. Esqueça a classe `Assert`, vamos utilizar palavras do idioma inglês. Isso mesmo, palavras, Afinal é assim quenos comunicamos.

Para fazermos um *assert* de igualdade devemos montar a seguinte sentença: *resultado* deve ser igual à *resultado esperado*. Vamos ver como isso fica no F#!

``` fsharp
[<Test>]
let TesteSomando2E3() =
    let parcela1 = 2
    let parcela2 = 3

    Calculadora.Somar(parcela1, parcela2)
    |> should equal 5
```

O fato de podermos utilizar um *should equal* me faz gostar bastante desta sintaxe. Podemos ampliar um pouco mais, se quisermos "traduzir" os termos, basta criarmos nossas próprias funções:

``` fsharp

let deve = should
let ser = equal

[<Test>]
let TesteSomando2E3() =
    let parcela1 = 2
    let parcela2 = 3

    Calculadora.Somar(parcela1, parcela2)
    |> deve ser 5
```
Parece loucura certo? Mas é ótimo.

Eu costumo não realizar este tipo de tradução, mas isso fica a seu critério. Também existem diferentes operações assim como no `Assert`.

* ● should equal
* ● should not' (função)
* ● should be (função)
* ● should startWith
* ● should endWith

E nos casos onde há o sufixo "(função)" é possível compor com outras funções, por exemplo:
`should not' (equal 5)`, `should be (greaterThan 5)` e etc.

O fato de existir esta combinação e se parecer tanto com a linguagem humana me agrada bastante.

Além disso, o nome dos métodos no F# podem ser definidos como uma string, desta forma a integração com o Visual Studio se torna mais limpa. Afinal, eu prefiro ler `Teste somando 2 com 3` do que `TesteSomando2E3`.

Para alterar o nome da função em F# basta seguir a sintaxe:

``` fsharp
let ``Teste somando os valores 2 e 3``() =
    ...
```

Com isso a integração no Visual Studio acaba ficando mais limpa, conforme imagem abaixo:

{% include image.html link="https://i.imgur.com/8HYXZEk.png" alt="Integração com o Visual Studio" width=50 %} 

Você pode encontrar o código deste teste em: https://github.com/gabrielschade/posts-blog/tree/master/Teste-unitario-fsharp

Mas me diga você, o que achou de testar seu código com F#?
Ficaram dúvidas?
Sugestões?

Usem os comentários, me contem e até o próximo post!