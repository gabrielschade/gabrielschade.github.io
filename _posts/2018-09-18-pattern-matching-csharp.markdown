---
layout: post
title:  "Usando o Pattern Matching do C#"
date:   2018-09-18 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoa!

Antes de qualquer coisa, sim, semana passada publiquei um post sobre a criação de uma nova alternativa para o pattern matching do C# (já tenho um experimento melhor, logo devo publicar por aqui) e para minha surpresa, boa parte dos leitores não conheciam essa *feature*. Então, vamos falar um pouquinho dela por aqui!

<!--more-->

Primeiro é justo começar falando que o pattern matching do C# não tem o mesmo poder que o do F#, nem mesmo funciona em todas as situações, mas é uma feature bastante útil e você pode estar passando trabalho à toa.

Como você deve ter visto no post passado, o pattern matching do C# geralmente se comporta da seguinte maneira: utilizamos a palavra reservada `is` para checar alguma condição e depois disso declaramos uma variável para receber o resultado, caso a condição seja atendida.

Considere a variável `valor` com o número 10 armazenado nela, a partir disso, vamos montar alguns exemplos:

```csharp
if(valor is null)
{
    //Fazendo vários nadas
}
```
Neste exemplo, a variável simplesmente está sendo comparada com `null`, semelhante à um `valor == null`.

```csharp
const int TRES = 3;
if(valor is TRES)
{
    //Fazendo vários nadas
}
```
Este segundo exemplo é bastante semelhante ao anterior, simplesmente estamos comparando a variável com outro valor, mas neste caso, com uma constante.

Vamos complicar um pouquinho mais:
```csharp
if(valor is int numero)
{
    //Fazendo vários nadas
}
```
Neste caso, estamos checando se o valor é um inteiro. Além disso, caso o valor seja um inteiro é feito um cast e a variável numero recebe 10 (dado armazenado na variável valor). 

Um ponto importante é que só conseguiremos acessar o valor de `numero` dentro do escopo do `if`. Afinal, ele só receberá o valor quando a condição for atendida.

Outro ponto é que caso você precise de mais uma comparação você não poderá utilizar o mesmo nome de variável porque o compilador irá reclamar:

```csharp
if(valor is int numero)
{
    //Fazendo vários nadas
}
if(valor is double numero2 )
{
    //Fazendo outros nadas
}
```

Também podemos utilizar o pattern matching para turbinar o nosso `switch-case`. Confesso que eu tendo a não gostar desse comando, mas com pattern matching ele fica "menos feio". Podemos utilizar um switch para checagem de tipo, considere que você tem um tipo genérico e deseja tomar decisões diferentes de acordo com o tipo específico:

```csharp
public string NomeColecao<T>(IEnumerable<T> colecao)
{
    switch (colecao)
    {
        case Array array: return "Array";
        case List<T> lista: return "Lista";
        case ICollection collection: return "Coleção genérica";
        default: return "Coleção secreta";
    }
}
```
Neste caso, nosso `switch` recebe uma coleção genérica do tipo `IEnumerable` e retorna o nome da coleçao de acordo com a checagem de tipos.

Por fim, podemos turbinar ainda mais nosso `switch` utilizando a palavra reservada `when`. Com ela é possível finalmente colocar uma condição dentro de uma cláusula `case`:

```csharp
public string SwitchCaseCondicional(int valor)
{
    switch (valor)
    {
        case int numero when numero % 2 == 0: 
            return "Par";
        case int numero when numero > 100: 
            return "Número maior que Cem";
        case int numero when numero > 10 && numero < 50: 
            return "Número entre 10 e 50";
        case int numero when numero % 2 == 1: 
            return "Número Ímpar";
        default: return "Número secreto";
    }
}
```
É importante lembrar que a ordem dos casos importa, assim como no `switch` normal. 

Por último, vale lembrar que você também pode utilizar tuplas para condições no `switch`, mas para isso, declaramos o tipo `var`, conforme código:

```csharp
(int numero, string texto) valores = (10, "teste");
switch (valores)
{
    case var tupla when valores.numero == 0:
        //Fazendo vários nadas
        break;
    case var tupla when string.IsNullOrEmpty(valores.texto):
        //Fazendo outros nadas
        break;
    
}
```

Bom, por hoje é isso!

O que achou?

Alguma sugestão? Gostou deste tipo de post?

Me conte nos comentários!

E Até mais!