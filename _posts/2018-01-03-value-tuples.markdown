---
layout: post
title:  "Tuplas em C#"
date:   2018-01-03 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoas!

Hoje falaremos de uma funcionalidade que já existia no C#, mas que teve uma melhora **absurda** nas últimas atualizações!

Estamos falando das **Tuplas**!

<!--more-->

As tuplas do namespace [`System.Tuple`](https://msdn.microsoft.com/en-us/library/system.tuple%28v=vs.110%29.aspx) existem no C# faz um bom tempo, mas talvez você nunca tenha ouvido falar delas.

Primeiro vamos entender para o que elas servem. As tuplas representam uma estrutura de dados simples, geralmente carregando poucas informações, ideal para quando você precisa retornar parte de um objeto e não deseja criar um tipo novo, só para remover algumas propriedades.

Poxa, mas a ideia parece ótima, certo?

Sim, de fato, é uma ideia fantástica, mas a sintaxe para utilização destas tuplas não eram a coisa mais amigável que você já viu no C#.

Vamos ver como fica um código simples, utilizando tuplas:

```csharp
public Tuple<int, string, string> ObterUsuario(int id)
{
    //Obtive os dados do banco de dados
    return new Tuple<int, string, string>(10, "Gabriel", "gabriel.schade@email.com");
}
```

Bom, este método é bastante simples. Estou realizando uma busca em um banco de dados simulado, obtendo o identificador, nome e e-mail do usuário e encapsulando-os em uma tupla.

Ok, a sintaxe de criação é um pouco verbosa, mas nada tão terrível assim. Então qual o problema?

Bom... Vamos obter os dados novamente:

```csharp
Tuple<int, string, string> tupla = ObterUsuario(13);

int id = tupla.Item1;
string nome = tupla.Item2;
string email = tupla.Item3;
```

Tá, agora deu para entender né?

Para obter os dados das tuplas temos que utilizar como nome de propriedade `ItemX`. Isso dificulta bastante o entendimento do código.

Além disso, uma tupla suporta até **oito** propriedades, mas é completamente insano controlar oito propriedades utilizando propriedades que se chamam `Item`, então, não faça isso, por favor.

> Beleza Gabriel, então você fez um post para criticar uma feature?

**Não**.

Mesmo essa tupla tendo algumas coisas ruins, ela tem seu valor. E o C# não se contentou com isso, agora temos acesso à um novo tipo de tupla, são as chamadas `ValueTuples`.

Esta nova tupla é totalmente **maravilhosa**. Sério.

Todas as reclamações foram ouvidas e uma salva de palmas para todo o time do C#. 
:clap::clap:

Para instalar estas tuplas em sua aplicação C# utilize o NuGet!

```
PM> Install-Package System.ValueTuple
```

Com ela instalada, vamos refazer o mesmo código, agora na nova sintaxe!

```csharp
public (int, string, string) ObterUsuario(int id)
{
    //Obtive os dados do banco de dados
    return (10, "Gabriel", "gabriel.schade@email.com");
}

(int, string, string) tupla = ObterUsuario(10);

int id = tupla.Item1;
string nome = tupla.Item2;
string email = tupla.Item3;
```

Beleza, para definir o tipo das tuplas agora só precisamos colocar os tipos agrupados em um parênteses, é isso?

Sim, mas também é muito mais do que isso!

Nesta nova tupla é possível nomear os itens, ou seja, não precisaremos mais utilizar as propriedades como `ItemX`!

```csharp
public (int id, string nome, string email) ObterUsuario(int id)
{
    //Obtive os dados do banco de dados
    return (10, "Gabriel", "gabriel.schade@email.com");
}

(int id, string nome, string email) usuario = ObterUsuario(10);

int id = usuario.id;
string nome = usuario.nome;
string email = usuario.email;
```

Legal né?

Mas ainda tem mais!

Existe uma feature chamada **desconstrução**. Como o nome já sugere, podemos desconstruir uma tupla em variáveis locais, veja a sintaxe:

```csharp
var (id, nome, email) = ObterUsuario(10);
int _id = id;
string _nome = nome;
string _email = email;
```

Note que desta forma os valores não são armazenados em uma tupla, são armazenados diretamente em variáveis. 

Outro ponto interessante sobre a desconstrução das tuplas é que podemos escolher apenas algumas das propriedades para armazenar em varíaveis, ou seja, não é necessário criar variáveis para todas as propriedades.

Vamos supor que precisaríamos apenas do id e do email, podemos substituir a variável nome pelo caracter `_`, dessa forma, ignoramos esta propriedade.

```csharp
var (id, _, email) = ObterUsuario(10);

int _id = id;
string _email = email;
```

Eu pessoalmente fiquei **muito** feliz com esta funcionalidade, inclusive, utilizei estas novas tuplas em diversos métodos da [**Tango**]({{ site.baseurl }}{% link _posts/2017-12-14-welcome-tango.markdown %}).

A sintaxe se parece muito mais com as tuplas do F# e sem dúvidas é um passo na direção certa do C#!

O que você achou deste post?

Me conte nos comentários!

E Até mais!