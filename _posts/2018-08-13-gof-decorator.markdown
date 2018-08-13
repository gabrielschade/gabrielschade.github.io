---
layout: post
title:  "Padrão de Projeto: Decorator"
date:   2018-08-13 00:00:00 +0000
comments: true
tags: [C#, F#]
serie: Design Patterns
---

Olá pessoa!

Um bom tempo atrás escrevi sobre o padrão de projeto **Command**, hora de continuar a série.

Dessa vez o padrão escolhido é o **Decorator**!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/CSharp-Patterns/tree/master/Decorator" %} 

Esta é a segunda publicação de uma série sobre *design patterns*, você pode acompanhar a série completa [neste link]({{ site.baseurl }}{% link posts-serie/design patterns.html %}).

Vamos continuar na mesma pegada, mostrando uma implementação focada em orientação a objetos e outra focada em programação funcional!

### Sobre o padrão Decorator

O padrão *Decorator* é um padrão de projeto estrutural que permite adicionar responsabilidades a um objeto de maneira dinâmica, criando algo similar a uma extensão do objeto. Geralmente isso é feito através de camadas aninhadas.

Geralmente este padrão é composto por alguns elementos:

1. Definição abstrata de um componente de software;
2. Implementação concreta deste componente;
3. Definição abstrata de um *decorator* para este componente;
4. Uma ou mais implementações concretas do *decorator* do componente;

Esta estrutura pode se tornar mais complexa, com abstrações diferentes de *decorators* e por aí vai, mas acredito que esta estrutura já vai ser o suficiente para fazermos o exemplo.

Vamos para as implementações!

### Implementação utilizando Orientação a Objetos

Para o nosso exemplo, vamos fazer uma calculadora de salários. Esse exemplo não é meu, eu vi em algum lugar ou me contaram (não lembro), mas achei bastante intuitivo.

Vou adaptar esse mesmo exemplo para completar a seguinte funcionalidade: vamos ter um valor base por hora, então teremos que convertê-lo para um valor mensal e em seguida descontar os impostos e o plano de saúde, vamos lá!

Vamos começar conforme a estrutura que listamos acima, com a definição abstrata do componente, no caso, a calculadora de salários:

```csharp
public interface ICalculadoraSalario
{
    double CalcularSalario(double valorPorHora);
}
```

Esta interface vai definir todas as classes que realizam algum tipo de cálculo em cima do salário, começando com a conversão do valor de horas para o valor mensal:

```csharp
public class CalculadoraSalario : ICalculadoraSalario
{
    public double CalcularSalario(double valorPorHora)
        => valorPorHora * 40 * 5;
}
```

Até aqui tranquilo, certo?

Agora vamos definir a abstração para o *decorator* da nossa classe. Esse é o cara que faz a magia desse padrão de projeto acontecer, portanto precisamos seguir algumas regrinhas.

Esse cara precisa implementar a mesma interface da calculadora original, aplicar alguma transformação (decoração) no valor e mesmo assim, manter o cálculo original. 

Por exemplo, para descontarmos os impostos, precisamos que o cálculo de conversão das horas para o valor mensal seja feito e depois disso calculamos os impostos. Mas é importante lembrar que estamos criando a definição **abstrata** do *decorator*, portanto ela precisa ser genérica o suficiente para qualquer transformação de cálculo.

Vamos ver como essa implementação fica na prática:

```csharp
public abstract class DecoratorCalculadoraSalario : ICalculadoraSalario
{
    private readonly ICalculadoraSalario _calculadoraBase;

    protected abstract double AplicarTransformacao(double salarioBase);

    public DecoratorCalculadoraSalario(ICalculadoraSalario calculadoraBase)
    {
        _calculadoraBase = calculadoraBase;
    }

    public double CalcularSalario(double valorPorHora)
    => AplicarTransformacao(
        _calculadoraBase.CalcularSalario(valorPorHora)
        );
}
```

Ótimo! Agora todas as vezes em que o método `CalcularSalario` do *decorator* é chamado, ele primeiro resolve o cálculo de sua calculadora base, fazendo com que seja possível concatenar operações.

Agora vamos criar o *decorator* para desconto de impostos. Esse componente precisa herdar a classe abstrata base para os *decorators* e implementar o método `AplicarTransformacao`, conforme código:

```csharp
public class DescontoImpostoCalculadoraSalario : DecoratorCalculadoraSalario
{
    public DescontoImpostoCalculadoraSalario(ICalculadoraSalario calculadoraBase) : 
        base(calculadoraBase)
    {}

    protected override double AplicarTransformacao(double salarioBase)
    => salarioBase - (salarioBase * 0.15);
}
```

Vamos fazer o mesmo para o cálculo de desconto do plano de saúde:

```csharp
public class DescontoPlanoSaudeCalculadoraSalario : DecoratorCalculadoraSalario
{
    public DescontoPlanoSaudeCalculadoraSalario(ICalculadoraSalario calculadoraBase) : 
        base(calculadoraBase)
    {}

    protected override double AplicarTransformacao(double salarioBase)
    => salarioBase - 600;
}
```

Agora já temos todos os elementos que precisamos para completar nossa funcionalidade corretamente, vamos para a utilização dos *decorators*.

Essa é a parte que de longe é a que menos me agrada, conforme as abstrações criadas, precisamos sempre passar a calculadora base no construtor, isso faz com que tenhamos uma cascata na criação dos objetos, conforme código:

```csharp
double salarioFinal = 
    new DescontoPlanoSaudeCalculadoraSalario(
        new DescontoImpostoCalculadoraSalario(
            new CalculadoraSalario()
    )).CalcularSalario(40);

Console.WriteLine($"Salário com impostos e plano de saúde: {salarioFinal}");
```

Veja como o código acaba (na minha opinião) não ficando muito intuitivo. Isso porque a resolução dos objetos é do mais interno para o mais externo, ou seja, estamos utilizando para fazer o cálculo um objeto do tipo `DescontoPlanoSaudeCalculadoraSalario`. Este objeto utiliza como calculadora base um `DescontoImpostoCalculadoraSalario`, que por sua vez utiliza uma instância de `CalculadoraSalario`.

Com isso atingimos nosso objetivo, podemos adicionar as funcionalidades à vontade, mas a solução desta forma, me parece pouco intuitiva e bastante verbosa.

### Implementação utilizando programação funcional em CSharp

Vamos mudar um pouco a forma de pensar e implementarmos uma calculadora dessas de uma maneira um pouco mais "funcional". Na verdade, vamos criar um mecanismo fluente, então utilizaremos alguns aspectos de programação funcional, mas vamos armazenar estado para controlar a composição do cálculo.

A primeira coisa que faremos é uma classe estática contendo todas as operações necessárias para o cálculo do salário, veja:

```csharp
public static class CalculosSalario
{
    public static double CalcularSalarioMensal(double valorPorHora)
        => valorPorHora * 40 * 5;

    public static double DescontarImpostos(double salario)
        => salario - (salario * 0.15);

    public static double DescontarPlanoSaude(double salario)
        => salario - 600;
}
```

Agora vamos criar uma classe (que guardará estado), para fazer a composição dos cálculos. Para fazer isso, ela deve receber o valor base em seu construtor e ter apenas um método. Este método recebe o cálculo que deve ser feito e retorna novamente o próprio objeto, criando assim uma interface de utilização fluente.

```csharp
public class CalculadoraSalarioFP
{
    public double Valor { get; private set; }

    public CalculadoraSalarioFP(double valorPorHora)
    {
        Valor = valorPorHora;
    }

    public CalculadoraSalarioFP Calcular(Func<double,double> calculo)
    {
        Valor = calculo(Valor);
        return this;
    }
}
```
Agora já podemos utilizar esta calculadora de forma bastante simples!

```csharp
double salarioFinal = 
    new CalculadoraSalarioFP(40)
        .Calcular(CalculosSalario.CalcularSalarioMensal)
        .Calcular(CalculosSalario.DescontarImpostos)
        .Calcular(CalculosSalario.DescontarPlanoSaude)
        .Valor;

Console.WriteLine($"Salário com impostos e plano de saúde: {salarioFinal}");
}
```

Nesse caso, podemos inclusive incrementar com funções anônimas através de expressões lambda:

```csharp
double salarioFinal = 
    new CalculadoraSalarioFP(40)
        .Calcular(CalculosSalario.CalcularSalarioMensal)
        .Calcular(CalculosSalario.DescontarImpostos)
        .Calcular(CalculosSalario.DescontarPlanoSaude)
        .Calcular(valor => valor - (valor * 0.10)) //Função anônima no meio da composição
        .Valor;

Console.WriteLine($"Salário com impostos e plano de saúde: {salarioFinal}");
```

Claro que se isso fizer parte de sua regra de negócio não é recomendado utilizar funções anônimas. Considero dois pontos fortes nessa implementação:

1. Escrevemos menos código e chegamos na mesma funcionalidade;
2. A ordem que os cálculos são escritos é a mesma ordem da execução.

Isso faz com que o código se torne mais intuitivo para **utilizar**, mesmo que talvez seja um pouco menos intuitivo para criarmos.

Por fim, assim como fizemos no padrão *command* vamos implementá-lo utilizando o F#!

### Implementação utilizando programação funcional em FSharp

A implementação em F# se parece um pouco com a implementação funcional em C#, então vamos começar da mesma forma. Criando um arquivo contendo as operações para o cálculo de salário, mas agora utilizaremos um módulo ao invés de uma classe estática:

```fsharp
module CalculosSalario

let calcularSalarioMensal valorPorHora =
    valorPorHora * 40.0 * 5.0

let descontarImpostos salario =
    salario - (salario * 0.15)

let descontarPlanoSaude salario =
    salario - 600.0
```

E **pronto**, já podemos utilizar nossa implementação.

É isso mesmo, não precisamos criar a calculadora nem nada disso. A composição é uma operação **nativa** do F#, basta utilizarmos o operador `>>` para vincular a saída de uma função como parâmetro da função seguinte!

```fsharp
open CalculosSalario

let calculo =
    calcularSalarioMensal
    >> descontarImpostos
    >> descontarPlanoSaude
```

Com isso definimos uma nova função chamada `calculo`. Esta função irá receber o mesmo parâmetro que a função `calcularSalarioMensal` e retornará o mesmo retorno que a função `descontarPlanoSaude`. Isso porque uma função que é resultante de uma composição assume isso automaticamente, sem precisarmos fazer nada.

Agora já podemos utilizar a função `calculo` normalmente:

```fsharp
open CalculosSalario
open System

[<EntryPoint>]
let main argv =
    let calculo =
        calcularSalarioMensal
        >> descontarImpostos
        >> descontarPlanoSaude
    
    calculo 40.0
    |> Console.WriteLine
```

De modo geral, essa solução é bastante semelhante à implementação funcional em C#, mas não precisamos armazenar estado em nenhum momento.

> **Atenção**
>
> Você pode encontrar o código implementado aqui no meu [GitHub](https://github.com/gabrielschade/CSharp-Patterns/tree/master/Decorator).

Com isso finalizamos nossa implementação deste padrão! O que achou?

Alguma sugestão? Gostou deste tipo de post?

Me conte nos comentários!

E Até mais!