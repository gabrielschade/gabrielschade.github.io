---
layout: post
title:  "Crie tipos com Discriminated Unions"
date:   2018-05-07 00:00:00 +0000
comments: true
tags: [F#]
---

Olá pessoa!

Já vimos como criar tipos utilizando tuplas, que tal darmos uma olhada nas discriminated unions?

<!--more-->

Um tempo atrás falei aqui no blog sobre formas de criarmos tipos utilizando as Tuplas, você pode encontrar o texto completo [nesse post]({{ site.baseurl }}{% link _posts/2018-01-03-value-tuples.markdown %}), mas vou fazer um resumão de um parágrafo.

As tuplas são uma maneira de criar um novo tipo a partir de tipos existentes, este novo tipo é criado a partir de um produto escalar entre dois ou mais tipos. Por conta disso, o tipo gerado sempre poderá armazenar N valores, sendo N a quantidade de tipos do produto escalar.

Imagine a tupla `(int, bool)`, este tipo pode conter qualquer valor inteiro, combinado com qualquer valor booleano, como `(10, true)`, por exemplo.

No caso dos Discriminated Unions é um pouco diferente, ao invés de aumentar a quantidade de valores que o tipo carrega, aumentamos a quantidade de tipos suportados pelo mesmo valor. Enquanto as Tuplas fazem com que o tipo `(int, bool)` possa conter qualquer valor inteiro **e** qualquer valor booleano, um discriminated union gerado pelos mesmos tipos poderia conter qualquer valor, sendo ele um inteiro **ou** um booleano.

Os discriminated unions também são conhecidos como _sum types_, ou seja, você cria um novo tipo a partir da soma de tipos existentes. Legal né?

Veja a sintaxe para definir um Discriminated Union em F#:

```fsharp
 type InteiroOuBool = | Inteiro of int | Bool of bool

 type InteiroOuBool = 
    | Inteiro of int 
    | Bool of bool
```
Podemos fazer a definição de todo o union na mesma linha, ou quebrar cada um dos casos em uma linha distinta. Eu tendo a preferir quebrar as linhas, mas em casos de tipos pequenos, não há nenhum problema em declarar tudo na mesma linha.

Note que `Inteiro` e `Bool` são só nomes criados, poderíamos ter utilizado qualquer nome aqui, mas sempre opte por nomes significativos. Você pode utilizar tipos customizados e criados por você nos casos descritos por um Discriminated Union sem problemas, desde que eles estejam definidos previamente. Ainda não há possibilidades de definirmos um tipo _inline_ na criaçao de um union.

Um detalhe simples, mas que pode gerar um erro é a questão de case sensitive. O nome dado ao caso precisa iniciar com a letra maiúscula. Ainda falando sobre o nome dos casos, por mais estranho que possa soar inicialmente, é bastante comum em unions genéricos utilizarmos o nome do próprio tipo como nome do caso, como fizemos no caso `Bool of bool`, portanto, se olhar código de outras pessoas, é comum acharmos esse tipo de coisa.

Legal, mas como definimos um valor com este tipo? -Simples, basta utilizarmos o nome do caso, seguido pelo valor. Veja só:

```fsharp
let meuInteiro = Inteiro 10 // -> val meuInteiro : InteiroOuBool = Inteiro 10
let meuBoolean = Bool false // -> val meuBoolean : InteiroOuBool = Bool false
```

E para extrair o valor desses caras?

Se você já está acostumado com F#, você provavelmente deve saber a resposta: **pattern matching**!!

```fsharp
let resultado = match meuInteiro with
                | Inteiro inteiro -> inteiro + 10
                | Bool bool -> 0

//val resultado : int = 20

let resultado = match meuBoolean with
                | Inteiro inteiro -> inteiro + 10
                | Bool bool -> 0

//val resultado : int = 0
```

O _pattern matching_ acaba cobrindo todos os casos, então não teremos problemas de incompatibilidade!

Antes de fecharmos o post, existem duas características interessantes nos Discriminated Unions que vale a pena mencionar. A primeira delas é a possibilidade de um caso vazio. Peraí, como assim caso vazio?

É um caso onde não é necessário armazenar nenhum tipo de valor, apenas o nome do caso é o suficiente para identificar o que houve, veja esse exemplo:

```fsharp
 type Resultado = 
    | Sucesso
    | Erro of string list
``` 

Este tipo consegue representar muito bem o resultado de uma operação, através dele podemos identificar se a operação foi bem-sucedida e caso não tenha sido, identificar os erros da operação. Para criar um valor que armazene o tipo vazio, basta utilizar o nome do caso:

```fsharp
let sucesso = Sucesso // -> val sucesso : Resultado = Sucesso
let erros = Erro ["Campo obrigatório não preenchido"; "Campo com formato inválido"]
// val erros : Resultado = Erro ["Campo obrigatório não preenchido"; "Campo com formato inválido"]
```
Quando o _pattern matching_ é utilizado nessa situaçao, não deve haver nenhum parâmetro na expressão lambda deste caso, conforme código:

```fsharp
match sucesso with
    | Sucesso -> "Sucesso"
    | Erro erros ->  "Erros"

//val it : string = "Sucesso"
```
Existem várias situações onde todo o Discriminated Union é composto apenas por casos vazios. Veja este exemplo:

```fsharp
type TamanhoRoupa = | P | M | G | GG | XG
```

Uma última situaçao é a criação de Discriminated Unions com apenas um caso. Isso mesmo, você não leu errado, existem situações (relevantes), onde criar um Discriminated Union com apenas um caso é muito útil!

Ele funciona como uma maneira de distinguir valores de forma semântica. Vamos lá, vamos imaginar que sua aplicação possua as entidades: Cliente e Produto, certo?

As duas entidades possuem um `Id` do tipo inteiro. Imagine a situaçao abaixo:

```fsharp
let codigoCliente = cliente.Id

obterProdutoPorId codigoCliente //-> você está passando um Id de cliente para obter um produto e seu compilador acha que está tudo bem!
```

Para resolver isso, você poderia criar um Discriminated Union contendo apenas um caso:

```fsharp
type ClienteId = | ClienteId of int
type ProdutoId = | ProdutoId of int
```

Utilizando tipos diferentes para definir os dois Ids você consegue evitar o erro descrito anteriormente gerando um erro em tempo de **compilação**, afinal, seu método `obterProdutoPorId` irá esperar um `ProdutoId` e você informou um valor do tipo `ClienteId`.

Essa funcionalidade é fantástica, por mais simples que pareça à primeira vista. Na verdade, ela é tão interessante que existe um tipo específico de _pattern matching_ para valores de apenas um caso.

```fsharp
let id = ClienteId 1 // -> val id : ClienteId = ClienteId 1

let (ClienteId codigo) = id // -> val codigo : int = 1
```
Note que o valor `codigo` é do tipo primitivo `int` novamente. Isso porque podemos utilizar a sintaxe de desconstrução com esse pattern matching de um caso.

Bem legal né? 

Pretendo fazer um post no futuro dando um exemplo de modelagem de domínio com estes tipos!

O que você achou deste post?

Me conte nos comentários!

E Até mais!