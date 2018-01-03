---
layout: post
title:  "Extraindo dados de uma planilha excel - CSV"
date:   2018-01-10 00:00:00 +0000
comments: true
tags: [F#]
---

Olá pessoas!

Alguém aqui já precisou importar dados de uma planilha excel? - Sentiu aquela raiva do cliente?

Por mais que você não goste, paciência. O mundo gosta do excel e ele é bem maneiro. Aceite.

É totalmente factível fazer esta implementação em C#, inclusive tenho um amigo que já fez isso, tantas, mas tantas vezes, que ele poderia dar uma aula aqui.

Mas mesmo com toda a prática do mundo, eu ainda acho que C# não é a melhor linguagem para fazer isso, vamos mais uma vez **apelar** para a facilidade dos type providers do F#!.

Três linhas de código, planilha do excel em suas mãos.
<!--more-->

Vamos começar criando uma aplicação console em F#!

Depois disso vamos instalar o pacote `FSharp.Data`, através do nuget:

```
PM> Install-Package FSharp.Data
```

Este pacote disponibiliza alguns type providers bastante úteis, incluindo o type provider para **CSV**.

Assim como nos outros casos (JSON e HTML) já vistos aqui no blog, esta implementação é completamente trivial e é uma forma bastante segura de utilizar F# em sua aplicação .NET.

Você pode utilizar qualquer arquivo CSV, fique à vontade para criar um, mas deixarei um arquivo embarcado no projeto.

![Arquivo de exemplo](https://i.imgur.com/M2x33zn.jpg)

Para incorporar o arquivo, insira o seu caminho, conforme código.

```fsharp
[<Literal>]
let caminho = "C:\\Users\\re035148\\Documents\\Custos.csv"
```

Agora vamos definir o tipo que irá receber as informações do CSV através do Type Provider!

Diferente dos anteriores, neste caso iremos informar mais de um parâmetro ao provider, primeiro vamos passar o caminho do arquivo e depois o separador de colunas, neste caso ';'.

```fsharp
type PlanilhaCustos = CsvProvider<caminho,";">
```
Com a definição do tipo `PlanilhaCustos` já podemos acessar as informações com os tipos corretos, assim como fizemos nos outros providers!

Vamos utilizar a função `Load` presente no tipo da planilha, informando por parâmetro o caminho do arquivo:

``` fsharp
let dados = PlanilhaCustos.Load caminho
```

E é isso aí, está pronto! Simples assim.

Podemos exibir no console os dados da planilha:

```fsharp
for linha in dados.Rows do
        printfn "|%s | %s | %i" linha.Descricao linha.Tipo linha.Jan
```

Nesse caso usamos apenas três das colunas definidas na planilha, mas poderíamos ter utilizado todas.

Veja o resultado:

![Resultado da extração dos dados](https://i.imgur.com/H9q2pXm.jpg)

Você pode encontrar o código desenvolvido aqui no meu [Github](https://github.com/gabrielschade/TypeProviderSample/blob/master/CsvTypeProviderSample/CsvTypeProviderSample/Program.fs).


> Atenção
>
> Se quiser se aprofundar mais sobre os type providers você pode encontrar a documentação completa da Microsoft [aqui](https://docs.microsoft.com/en-us/dotnet/fsharp/tutorials/type-providers/).

Agora você só passa trabalho importando uma planilha do Excel, se quiser!

O que você achou deste post?

Me conte nos comentários!

E Até mais!