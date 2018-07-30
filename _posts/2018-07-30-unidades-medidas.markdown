---
layout: post
title:  "Utilizando Unidades de Medidas"
date:   2018-07-30 00:00:00 +0000
comments: true
tags: [F#]
---

Olá pessoa!

Já ouviu falar de domínios ricos? Que tal utilizar unidades de medida nos seus valores númericos? -Com F# você pode!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/posts-blog/blob/master/UnidadesMedida/Program.fs" %} 

Eu mencionei em algumas das minhas últimas palestras um recurso bastante interessante do F#. Com essa linguagem é possível definir um tipo como uma unidade de medida.

Se você acompanha o blog já sabe que não é novidade eu falar de F#, eu gosto bastante da linguagem e acredito que ela tem diversas funcionalidades poderosíssimas. Antes de entrarmos no código propriamente dito é importante dizer que as unidades de medidas não existem em **runtime**.

O que isso significa? -Na prática, isso quer dizer que esta funcionalidade é útil para criarmos *constraints* de tipos em tempo de compilação, isso gera uma camada extra de prevenção contra erros em seu código.

Vamos começar!

Como quase tudo no F#, é bastante simples declarar um tipo como uma unidade de medida, basta utilizarmos ---a anotation--- o atributo modificador `[<Measure>]` antes do nome do tipo, veja alguns exemplos:

```fsharp
[<Measure>] type g //grama
[<Measure>] type kg //quilograma
[<Measure>] type t //tonelada

[<Measure>] type m //metro
[<Measure>] type km //quilometro

[<Measure>] type h //horas
[<Measure>] type s //segundos
```

Com isso definimos tipos para diferentes medidas: peso, distância e tempo. Legal, mas como utilizamos isso? -Utilizamos as unidades de forma parecida com a utilização de *generics*, basta colocar a unidade entre os símbolos de menor e maior: `<u>`.

```fsharp
let distancia = 300<km>
let tempo = 1<h>
```

Agora que começa a parte legal, podemos combinar valores de unidades diferentes! 

```fsharp
let velocidade = distancia/tempo
```
Se olharmos o tipo do valor `velocidade` veremos que ele é um: `int<km/h>`, como esperado!

Claro que a combinação de tipos possui algumas regras, por exemplo, não é possível somá-los ou subtraí-los:

```fsharp
let erro = distancia + tempo
let erro2 = distancia - tempo
```

Isso porque de fato, não podemos fazer este tipo de operação no mundo real. Portanto são permitidas apenas as operações de multiplicação e divisão. Inclusive com valores do mesmo tipo:

```fsharp
let largura = 50<m>
let comprimento = 75<m>

let area = largura * comprimento
```
Nesse último exemplo, o valor `area` estará em `m^2`, que é a representação para metros quadrados(m²). Legal né?

Podemos definir inclusive unidades de medida mais complexas, as chamadas, unidades de medida derivadas, como por exemplo: Tesla.

Tesla é uma unidade de medida para densidade de fluxo magnético, definida por: `kg / A * s²`, ou seja: quilogramas divido pelo produto entre ampere e segundos ao quadrado. Como colocamos isso em uma unidade de medida do F#? -Tão simples quanto parece:

```fsharp
[<Measure>] type A //ampere

[<Measure>] type T = kg / (A * s^2) //Tesla
```
É importante frisar, que as unidades derivadas são apenas alias para seus cálculos, se voltarmos ao exemplo da velocidade, poderíamos ter definido uma unidade para isso também, veja:

```fsharp
[<Measure>] type v = km/h //velocidade
```

Claro que esse último exemplo representa velocidade apenas em um formato determinado (km/h), que não condiz com a realidade, mas tudo bem, é só um exemplo.

Mas o que ganhamos com isso?

Bom, agora podemos criar *constraints* para nossas funções:

```fsharp
let calcularVelocidade (distancia:int<km>) (tempo:int<h>) =
    distancia/tempo

let velocidadeCalculada = calcularVelocidade 300 4 //Erro de compilação
let velocidadeCalculada = calcularVelocidade 300<km> 4<h> //OK
```

Com a possibilidade de causar erros de compilação através das unidades de medida podemos criar cálculos complexos e relativamente mais seguros, porque os parâmetros precisam estar na escala indicada.

Podemos inclusive, criar fatores de conversão:

```fsharp
let metrosPorQuilometros = 1000.0<m/km>

let valorEmMetros = 10.0<km> * metrosPorQuilometros
```
O resultado disso será 10 mil metros, afinal, descrevemos o fator de conversão como mil metros para cada 1 quilometro!

Podemos fazer a conversão para a outra direção também, sem problemas:

```fsharp
let quilometrosPorMetros = 0.001<km/m>
let valorEmQuilometros = 3000.0<m> * quilometrosPorMetros
```

Também podemos definir unidades de medidas genêricas para funções, veja:

```fsharp
let dobrar (valor:int<'u>) =
    valor * 2

let dobroKm = dobrar 10<km>
let dobroM = dobrar 5<m>
let dobro = dobrar 10
```

Como não explicitamos qual unidade de medida estamos utilizando, podemos usar qualquer uma! Essa funcionalidade é útil para criarmos tipos e funções que aceitam qualquer unidade de medida (ou nenhuma).

Geralmente utiliza-se `'u` para a unidade de medida genérica, em casos onde existem mais de uma, é normal utilizarmos `'v`. Vamos fazer um exemplo mais complexo.

Agora vamos fazer uma função genérica para converter qualquer unidade:

```fsharp
let converter (fatorConversao:float<'u/'v>) (valor:float<'v>) =
    valor * fatorConversao
```
A função `converter` recebe o fator de conversão e o valor que será convertido e realiza a multiplicação dos dois. Apesar da assinatura um pouco assustadora, é uma função bastante simples.

Um ponto que vale ressaltar é que estamos criando uma regra na assinatura da função. Por utilizarmos `'v` tanto no fator de conversão (como divisor) quanto no parâmetro valor, estamos forçando que estes dois valores estejam na mesma unidade `'v`, ou seja, eles podem estar em qualquer unidade, desde que o divisor e o valor que será convertido estejam na mesma.

Podemos utilizar a função criada desta forma:

```fsharp
let valorCalculado = 
    converter metrosPorQuilometros 20.0<km>
```

Podemos utilizar uma versão um pouco mais idiomática (que faz exatamente a mesma coisa):

```fsharp
let valorCalculado = 
    20.0<km>
    |> converter metrosPorQuilometros 
```

Para facilitar as conversões ainda mais, podemos criar funções específicas para cada conversão, dessa forma, não precisamos ficar passando o fator de conversão por parâmetro sempre. Para criar essa função, vamos utilizar a função já existente!

```fsharp
let converterKmParaM = 
    converter metrosPorQuilometros 

let converterMParaKm =
    converter quilometrosPorMetros
```

Por conta da aplicação parcial automática do F# recebemos como retorno uma nova função que espera os parâmetros faltantes quando chamamos uma função com menos parâmetros do que o declarado.

> **Atenção**
>
> Se você não estiver familiarizado com o conceito de aplicação parcial, este [post]({{ site.baseurl }}{% link _posts/2018-03-05-currying-partial-app.markdown %}) pode te ajudar.

Com isso, criamos novas funções simplesmente omitindo um parâmetro. Parâmetro esse que é o valor para ser convertido, ou seja, basta chamarmos a função com o valor e ele será convertido normalmente:

```fsharp
let metros = 10.0<km> |> converterKmParaM
let quilometros = 10.0<m> |> converterMParaKm
```

Essa é uma funcionalidade muito poderosa no F#, mas vale lembrar que as unidades de medida não fazem parte do .NET em si, elas existem apenas no F#, portanto, qualquer código exposto para para outra linguagem .NET irá simplesmente perder essa informação. Continua sendo possível interoperar sem problemas, mas perdemos a informação de medida.

Por hoje era isso pessoal!

Você pode encontrar o código desenvolvido aqui no meu [Github](https://github.com/gabrielschade/posts-blog/blob/master/UnidadesMedida/Program.fs).


O que você achou deste post?

Me conte nos comentários!

E até mais!