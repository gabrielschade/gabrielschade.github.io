---
layout: post
title:  "Mapeando incertezas com o tipo Option"
date:   2017-11-09 00:00:00 +0000
comments: true
tags: [C#]
---

O `null` é mesmo um problema?

**Sim**, é. Até mais e vamos ao próximo post. - Ainda não.

Vamos lá, acredito que **todos** os programadores que já utilizaram objetos/referências, já se depararam com o problema do `null`. Muitas e muitas vezes nossos códigos geram problemas porque, em algum momento, sem que tívessemos pensado previamente, geramos um valor nulo.

Antes de discutirmos mais sobre esse valor maldito, vamos entender o motivo dele existir.

A referência do valor `null` na documentação da microsoft é basicamente esta:

> **Null (C#)**
>
> `null` é a palavra reservada para representar uma referência nula, ou seja, algum endereço que não se refere à nenhum objeto instanciado. Além disso o `null` é o valor padrão para tipos baseados em referências.
>
> O texto original pode ser encontrado aqui: http://bit.ly/null-msdn

Além disso, é bastante comum a utilização do `null` para indicar a falta de um valor ou a falta de um retorno para uma determinada operação. Este tipo de comportamento é bastante ruim e pessoalmente eu detesto utilizá-lo, mas temos exemplos na própria linguagem em que isto é feito.

O problema inerente ao `null` é a criação de códigos **mentirosos**, afinal o `null` é capaz de se passar por qualquer valor baseado em referência. E isso pode causar muitos problemas.

Vamos levar em consideração a classe abaixo:

``` csharp
public class Pessoa
{
    public int Id { get; set; }
    public int Idade { get; set; }
    public string Nome { get; set; }
}
```
Uma classe bastante simples. Agora vamos para um dos casos onde o `null` é problemático. Vamos criar um método para verificar se uma pessoa possui mais de 18 anos. 

Esta é uma operação muito simples e mesmo assim, problemática.

``` csharp
bool Maioridade(Pessoa pessoa)
    => pessoa.Idade >= 18;
```
Agora já temos o nosso primeiro código problemático. No cenário acima, é permitido passar o valor `null` por parâmetro, afinal `null` consegue se passar por uma instância da classe `Pessoa`. Caso isso venha a ocorrer, oque acontecerá?

Será lançada uma exceção `ArgumentNullException` e como qualquer exceção não tratada, isso pode causar problemas.
Agora você pode ser perguntar: "Tá, mas porque alguém passaria `null` para este método?".

Vamos chegar à um exemplo prático logo, mas antes vamos ver outro problema causado pelo `null`. 

Como já citado anteriormente, é comum o `null` ser utilizado como um algo para informar que está faltando um valor, existem casos assim, inclusive na própria biblioteca LINQ. Observe o código abaixo:

``` csharp
List<Pessoa> pessoas = new List<Pessoa>();

Pessoa primeiraPessoa = pessoas.FirstOrDefault();
Maioridade(primeiraPessoa);
```
Este código irá causar problemas, afinal o método `FirstOrDefault` irá retornar o primeiro valor da lista ou o valor padrão de acordo com o tipo do elemento na lista (`Pessoa`, no exemplo). Este é um código que utiliza o `null` como valor que não existe, ou como a falta de um valor.

Vamos incluir um registro nesta lista:

``` csharp
List<Pessoa> pessoas = new List<Pessoa>();
pessoas.Add(null);

Pessoa primeiraPessoa = pessoas.FirstOrDefault();
Maioridade(primeiraPessoa);
```
Mais uma vez o `null` está se passando por alguém que ele não é! E agora fica mais evidente o problema de retornar o valor `null` em casos onde faltam um valor.

Neste segundo exemplo a lista não está vazia, mas contém um valor `null`. O método `FirstOrDefault` não faz nenhuma distinção sobre estas duas situações, que apesar de serem igualmente problemáticas, são sim casos diferentes.

Mas se são tão problemáticos, como podemos evitá-los?

A resposta que mais me agrada é: **containers**. Mas vamos explorar estas soluções em um próximo post!





O que você acha disso?

Me conte nos comentários!

E Até mais!