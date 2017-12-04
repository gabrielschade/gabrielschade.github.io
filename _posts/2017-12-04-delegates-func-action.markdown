---
layout: post
title:  "Não ignore os delegates!"
date:   2017-12-04 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoas!

Hoje vou trazer um tema bastante específico do C#, os assustadores **delegates**.

Ok, eles não são assustadores de verdade, mas há uma relação estranha entre os desenvolvedores e os delegates. Nunca entendi o real motivo, mas é bastante comum ver os desenvolvedores negligenciarem ou até não entenderem esta *feature* da linguagem.

Acredito que a falta de contexto sobre o assunto é um problema, por isso decidi escrever um pouco sobre.

Mas vamos lá, afinal de contas, o que é um delegate?

Delegate é um tipo baseado em referência que por ser utilizado para encapsular um **método**, este método pode ser anônimo ou nomeado.

Com isso o C# permite que sejam criadas funções de alta ordem e consequêntemente permite o tratamento de métodos como membros de primeira ordem.

Eu costumo dizer que, um delegate está para um método como uma classe está para um objeto. A comparação não é totalmente real, mas ajuda a compreender do que se trata um delegate à primeira vista.

Existem diversos tipos de delegates já inclusos na linguagem, mas entre todos, dois se destacam em termos de importância e usabilidade, são eles: o delegate `Func` e o `Action`.

Os dois delegates podem ser utilizados para representar qualquer método, com uma única, porém importante diferença. O delegate Func só é capaz de encapsular métodos que geram resultados, ou seja, que possuem algum tipo de retorno.

Enquanto o delegate Action só é capaz de encapsular métodos que não geram resultados, ou seja, métodos do tipo void.

Cada um destes delegates possui uma série de sobrecargas para que seja possível mapear métodos com diferentes quantidades de parâmetros. A quantidade de parâmetros pode variar entre 0 e 16, o que na minha opinião é um exagero a parte, alguém realmente utiliza 16 parâmetros em uma função?

- Se sua resposta for sim, corra! - Mentira, não corra, mas refatore isso!

Veja um exemplo de encapsulamento de um método anônimo para somar dois valores diferentes:

```csharp
Func<int,int,int> somar = (number1, number2) => number1 + number2;
```
Note que o método `Somar` é definido pelo delegate `Func<int,int,int>`, onde os dois primeiros representam os tipos dos parâmetros e o último representa o tipo do retorno.

Podemos utilizar o método normalmente, como qualquer outro método:

```csharp
Func<int,int,int> somar = (number1, number2) => number1 + number2;
int resultado = somar(2,3);
//resultado = 5;
```

Vamos para mais um exemplo, desta vez com um método para verificar se um determinado número é um número par:

```csharp
Func<int,bool> valorPar = number => number % 2 == 0;
```

Note que agora o delegate é representado por `Func<int,bool>`, pois recebe apenas um parâmetro do tipo `int` e retorna o um valor do tipo `bool`.

Como já citado, podemos fazer este tipo de operação com métodos nomeados também!

```csharp
private bool ValorImpar(int number)
{
    return number % 2 == 1;
}

...

Func<int,bool> verificaValorImpar = ValorImpar;
```
Neste caso, não precisamos criar nenhuma expressão lambda, pois o método `ValorImpar` já é compatível com o tipo `Func<int,bool>`.

O delegate `Action` que citei anteriormente funciona exatamente da mesma forma, tanto para métodos anônimos quanto nomeados. A única diferença é que o método precisa retornar o tipo `void`.

```csharp
Action<double> escreverNumero = number => Console.WriteLine(number);
escreverNumero(3);
```

No caso do `Action` ele sempre conterá a mesma quantidade de parâmetros e tipos definidos através de *generics*. Afinal, não precisamos definir um tipo para o retorno do método, pois sempre será `void`.

A tão famosa biblioteca System.Linq abusa deste conceito, utilizando os delegates `Func` para tornar possível a passagem de expressões lambda como parâmetro para um método como o Select, por exemplo.

Viu só, delegates não são assustadores. Trata-se apenas de um conceito diferente, agora que você já tem um pouco mais de contexto, eu espero que você seja capaz de criar suas próprias funções de alta ordem como o Linq!

O que você achou deste post?

Me conte nos comentários!

E Até mais!