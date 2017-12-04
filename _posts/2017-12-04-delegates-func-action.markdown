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

Delegate é um tipo baseado em referência que deve ser utilizado para encapsular um **método**, seja ele anônimo ou nomeado.

Com isso o C# permite que sejam criadas funções de alta ordem e consequêntemente permite o tratamento de métodos como membros de primeira ordem.

Eu costumo dizer que, um delegate está para um método, como uma classe está para um objeto. A comparação não é totalmente válida, eu sei, mas ajuda a compreender do que se trata um delegate à primeira vista.

Existem diversos tipos de delegates já inclusos na linguagem, mas entre todos, dois se destacam em termos de importância e usabilidade, são eles: o `Func` e o `Action`.

Estes dois delegates podem ser utilizados para representar qualquer método, com uma única, e importante diferença. O delegate `Func` só é capaz de encapsular métodos que geram resultados, ou seja, que possuem algum tipo de retorno.

Enquanto o delegate Action só é capaz de encapsular métodos que não geram resultados, ou seja, métodos do tipo `void`.

Cada um destes delegates possui uma série de sobrecargas para que seja possível mapear métodos com diferentes quantidades de parâmetros. A quantidade de parâmetros pode variar entre 0 e 16, o que na minha opinião é um exagero a parte, alguém realmente utiliza 16 parâmetros em uma função?

- Se sua resposta for sim, corra! - Mentira, não corra, mas refatore isso!

Vamos para um pouco de código para entender melhor!

Primeiro veja o encapsulamento de um método anônimo para somar dois valores diferentes:

```csharp
Func<int,int,int> somar = (number1, number2) => number1 + number2;
```

Note que o método `somar` é definido pelo delegate `Func<int,int,int>`, onde os dois primeiros tipos representam os tipos dos parâmetros e o último representa o tipo do retorno.

Podemos utilizar o método normalmente, como qualquer outro método:

```csharp
Func<int,int,int> somar = (number1, number2) => number1 + number2;
int resultado = somar(2,3);

//resultado = 5;
```
Fácil né?

Vamos para mais um exemplo, desta vez com um método para verificar se um determinado número é um número par:

```csharp
Func<int,bool> valorPar = number => number % 2 == 0;
```

Note que agora o delegate é representado por `Func<int,bool>`, pois recebe apenas um parâmetro do tipo `int` e retorna o um valor do tipo `bool`.

Também poderíamos utilizá-lo normalmente!

Além disso, como já citado no começo do post, também podemos fazer este tipo de operação com métodos nomeados!

Veja só o próximo exemplo, desta vez com um método nomeado chamado `ValorImpar`.

```csharp
private bool ValorImpar(int number)
{
    return number % 2 == 1;
}

...

Func<int,bool> verificaValorImpar = ValorImpar;
```
Neste caso, não precisamos criar nenhuma expressão lambda, afinal o método `ValorImpar` já é compatível com o tipo `Func<int,bool>`, recebe um número inteiro e retorna um boolean.


Até agora só mostramos o delegate `Func`, mas não se esqueça do `Action`!

Este segundo delegate funciona exatamente da mesma forma que os exemplos mostrados, tanto para métodos anônimos quanto nomeados. A única diferença é que o método precisa retornar o tipo `void`.

```csharp
Action<double> escreverNumero = number => Console.WriteLine(number);

escreverNumero(3);
```

No caso do `Action`, o método atribuído a ele sempre conterá a mesma quantidade de parâmetros que seus tipos definidos através de *generics*. Isso porque não precisamos definir um tipo para o retorno do método, já sabemos que será `void`.

Se você acha que este recurso não parece útil, veja a biblioteca System.Linq. Ela é um exemplo ótimo de utilização de delegates.

Esta biblioteca abusa do conceito, utilizando os delegates `Func` para tornar possível a filtragem, transformação e diversas operações em coleções de dados de forma genérica, contando com a passagem de expressões lambda ou métodos nomeados como parâmetro para seus próprios métodos, como o Select ou o Where, por exemplo.

Viu só, delegates são **muito úteis** e **não são assustadores**. Trata-se apenas de um conceito diferente, agora que você já tem um pouco mais de contexto, eu espero que você seja capaz de criar suas próprias funções de alta ordem como o Linq!

O que você achou deste post?

Me conte nos comentários!

E Até mais!