---
layout: post
title:  "Publish-Subscribe - Um padrão para troca de mensagens"
date:   2018-03-12 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoas!

Acho que hoje é a primeira vez que veremos um padrão aqui no blog, ele será o *publish-subscribe*, um padrão para troca de mensagens de forma desacoplada!

Deixo aqui o aviso, este post é um pouco mais avançado do que eu costumo colocar, mas vale a pena conferir!
<!--more-->

Esse é um *pattern* (padrão), beeeem versátil e popular, dá pra fazer várias coisas bem legais com ele, mas para entender todo seu poder, precisamos antes, entender seu **conceito**.

Vamos lá, de forma muito resumida, este padrão consiste em criarmos um ou mais publicadores onde cada um irá possuir um ou mais inscritos. A partir disso, criamos um sistema para troca de mensagens de forma **indireta**.

Imagine por exemplo, um canal do YouTube ou uma página do Facebook. Quando há uma publicação nova nestes canais, ele simplesmente publica para quem estiver inscrito, sem ter a necessidade de conhecer cada um dos inscritos. Inclusive, mesmo se não houverem inscritos nenhum a publicação é feita.

O princípio deste padrão é muito similar!

Existem 3 componentes principais:

* Publicador / Canal
* Evento / Publicação
* Inscrito / Assinante

O interessante é que é possível que eles interajam entre si, sem que um conheça o outro, basta que ambos conheçam o evento.

![Publish-Subscribe](https://i.imgur.com/tV2freC.jpg)


Antes de começarmos é importante dizer que este padrão é independente do tipo de aplicação. É possível utilizá-lo em uma aplicação desktop, web e até mobile.

Existem muitas formas de implementar este tipo de *pattern*, o que vou mostrar aqui é uma das formas que mais me agrada, utilizando um pouquinho de programação funcional e programação concorrente, vamos lá!

A primeira coisa que precisamos fazer é criar uma forma de realizar as inscrições dos eventos, ou seja, precisamos criar o canal de inscrição, faremos isso com uma classe estática:

```csharp
public static class CanalInscricao
{

}
```

Agora precisamos de dois itens importantíssimos: *tipo de evento* e *parâmetros de evento*. Toda vez que alguma publicação ocorrer no canal, é necessário identificar qual é a publicação e quais são os parâmetros que eu preciso enviar para meus inscritos.

Isso porque os parâmetros podem variar de acordo com o tipo do evento! Imagine que você deseja gravar um log cada vez que um registro é salvo no banco, os dados registrados irão variar dependendo da operação realizada (inclusão ou alteração).

Para representar o tipo de evento vamos criar um enumerado, que por enquanto ficará vazio:

```csharp
public enum TipoEvento
{
}
```
Vamos criar uma interface para representar os parâmetros dos eventos, ela também ficará vazia, veja:

```csharp
public interface IEventoParametros
{
}
```

Agora sim, podemos terminar de criar nosso canal de inscrição.

Neste ponto é que considero esta implementação um pouco diferente do convencional, é bastante comum criar uma segunda interface para identificar os inscritos, mas no meu ponto de vista, esta interface é desnecessária. Eis o problema que vejo.

Qual a necessidade de criarmos uma interface e forçarmos a implementação de apenas um método específico? -Talvez a resposta seja explicitar o fato de que a classe está apta à ser um inscrito, ok, eu entendo este argumento, mas ainda mantenho a opinião de estamos gerando código desnecessário em boa parte das vezes.

Já que precisamos de um **método** específico que será disparado quando o evento for publicado, podemos fazer com que o assinante seja vinculado diretamente através deste método. Para isso usamos delegates ao invés de interfaces. 

Dessa forma, qualquer classe que contenha um método que atenda os parâmetros e o retorno estão aptas à se inscrever. Talvez eu não esteja enxergando o motivo real da criação desta interface, você pode me ajudar explicando este ponto nos comentários, que tal?

Mas vamos continuar desta forma, então, sem mais interfaces!

Podemos voltar ao canal de inscrição, agora vamos entender um pouco mais sobre ele. Este canal é responsável por inscrever os clientes nas publicações que sejam relevantes. Para isso, é necessário armazenar um lista com todas as **ações** que precisam ser executadas sempre que um determinado **tipo de evento** acontecer.

Utilizaremos a estrutura `Dictionary` para fazer isso. Onde a chave será um tipo de evento, representado pelo `enum TipoEvento` e o valor será uma lista de métodos que recebem um `IEventoParametros` por parâmetro, conforme código:

```csharp
internal static Dictionary<TipoEvento, List<Action<IEventoParametros>>> EventosEAcoes 
{ get; private set; }
```
Note que para armazenar a lista de métodos estamos utilizando o delegate `Action`, ou seja, os métodos não irão retornar nada.

Agora precisamos de um método para popular este dicionário, vamos chamá-lo de `RegistrarInscricao`. Este método deve receber por parâmetro o tipo do evento que está sendo registrado e a ação que deverá acontecer quando este evento for disparado.

É necessário permitir que o tipo do parâmetro seja especializado, portanto, utilizaremos *generics*, mas com a restrição de que o tipo genérico precisa implementar a interface `IEventoParametros`, conforme código:

```csharp
public static void RegistrarInscricao<T>(TipoEvento tipo, Action<T> acao)
where T : IEventoParametros
{

}
```
Agora precisamos fazer o controle de inclusão no dicionário de eventos. Caso o tipo de evento já tenha alguma ação relacionada, basta adicionar esta nova ação à lista de ações existentes, caso contrário, incluimos este tipo de evento no dicionário com uma lista vazia.

Além disso, é importante checar se o dicionário está nulo, neste caso, precisamos inicializá-lo
```csharp
public static void RegistrarInscricao<T>(TipoEvento tipo, Action<T> acao)
    where T : IEventoParametros
{
    if (EventosEAcoes == null)
        EventosEAcoes =
            new Dictionary<TipoEvento, List<Action<IEventoParametros>>>();

    if (!EventosEAcoes.ContainsKey(tipo))
        EventosEAcoes.Add(tipo, new List<Action<IEventoParametros>>());

    EventosEAcoes[tipo].Add(acao);
}
```

Se você estiver implementando esta solução, você irá encontrar um erro de compilação neste ponto!

![Erro de compilação](https://i.imgur.com/ZWGdaTF.jpg)

Isso acontece porque a acao recebida por parâmetro é do tipo `Action<T>` e a lista precisa ser do tipo `Action<IEventoParametros>`, mesmo que `T` seja uma especificação da interface, ela ainda não é a própria interface e o cast não consegue ser realizado sozinho.

Felizmente, como já falei no post sobre delegates e sobre *currying/aplicação parcial*, podemos manipular os tipos das funções. E é isso que faremos aqui!

Vamos criar uma função anônima que contenha o tipo necessário para ser incluída na lista, para isso, basta realizarmos um cast do parâmetro, simples assim.

```csharp
void acaoConvertida(IEventoParametros evento) =>
    acao((T)evento);
```

Agora, basta incluirmos na lista, a `acaoConvertida` ao invés da `acao`, conforme código:

```csharp
public static void RegistrarInscricao<T>(TipoEvento tipo, Action<T> acao)
    where T : IEventoParametros
{
    void acaoConvertida(IEventoParametros evento) =>
        acao((T)evento);

    if (EventosEAcoes == null)
        EventosEAcoes =
            new Dictionary<TipoEvento, List<Action<IEventoParametros>>>();

    if (!EventosEAcoes.ContainsKey(tipo))
        EventosEAcoes.Add(tipo, new List<Action<IEventoParametros>>());

    EventosEAcoes[tipo].Add(acaoConvertida);
}
```
Com isso nosso método para registrar uma inscrição está pronto e falta só mais uma peça para completar a implementação!

Vamos implementar o canal de publicação!

Este canal deve conter um método para realizar a publicação de um evento. Para isso, é necessário que ele receba por parâmetro o tipo de evento que será publicado e os parâmetros deste evento.

Este método deve acessar nosso canal de inscrição para obter todos os inscritos no evento que está sendo publicado e executar todas as ações necessárias! Parece complicado, mas é bem mais simples que o canal de inscrição. Vamos lá!

```csharp
public static void PublicarEvento<T>(TipoEvento tipo, T parametros)
    where T : IEventoParametros
{
    List<Action<IEventoParametros>> acoes =
        CanalInscricao.EventosEAcoes[tipo];

    foreach (var acao in acoes)
        acao(parametros);
}
```
Fácil né?

Agora só precisamos fazer uma checagem, pode acontecer de estarmos tentando publicar um evento que ainda não tem nenhum inscrito, nesses casos podemos só ignorar a publicação:

```csharp
public static class CanalPublicacao
{
    public static void PublicarEvento<T>(TipoEvento tipo, T parametros)
        where T : IEventoParametros
    {
        if (!CanalInscricao.EventosEAcoes.ContainsKey(tipo)) return;

        List<Action<IEventoParametros>> acoes =
            CanalInscricao.EventosEAcoes[tipo];

        foreach (var acao in acoes)
            acao(parametros);
    }
}
```

Vamos ver como ficou?

Faremos isso com um exemplo bem simples, cada vez que uma mensagem for escrita no console, iremos escrever outra mensagem para identificar que ela foi registrada, como uma espécie de log!

Então vamos lá, como estamos criando um evento novo, precisamos criar um item no enumerado e uma classe para os parâmetros!

```csharp
public enum TipoEvento
{
    RegistroDeMensagem
}

public class EventoRegistroMensagemParametros : IEventoParametros
{
    public string Mensagem { get; set; }
}
```
Duas modificações bem simplezinhas! Agora vamos criar o método que será disparado quando a publicação ocorrer, veja:

```csharp
public class Eventos
{
    public static void RegistrarMensagem(EventoRegistroMensagemParametros parametros)
    {
        Console.WriteLine($"Antes da mensagem ser enviada: {parametros.Mensagem}");
    }
}
```

Ok, agora temos tudo criado!

Vamos configurar a inscrição e publicação e podemos ver isso rodando!

```csharp
static void Main(string[] args)
{
    CanalInscricao.RegistrarInscricao<EventoRegistroMensagemParametros>(
        TipoEvento.RegistroDeMensagem,
        Eventos.RegistrarMensagem);

    Escrever("Hello World!");
    Console.ReadKey();
}

static void Escrever(string mensagem)
{
    CanalPublicacao.PublicarEvento(
        TipoEvento.RegistroDeMensagem,
        new EventoRegistroMensagemParametros() { Mensagem = mensagem });

    Console.WriteLine(mensagem);
}
```

Tire um tempo para compreender tudo que foi feito aqui. A primeira etapa utilizamos o canal de inscrição para registrar os eventos, informando os parâmetros necessários.

No método `Escrever`, publicamos o evento e depois escrevemos a mensagem no console!

Com isso, o resultado é o seguinte:

![Resultado da publicação de um evento](https://i.imgur.com/DFxaSZH.jpg)

Vamos adicionar mais uma inscrição antes de encerrarmos o post!
Note que vamos adicionar mais uma inscrição para o mesmo evento, então só precisamos criar um novo método, veja:

```csharp
public static void MensagemEmMaisculo(EventoRegistroMensagemParametros parametros)
{
    Console.WriteLine($"Mensagem transformada: {parametros.Mensagem.ToUpper()}");
}
```
Vamos adicionar esta inscrição no nosso canal:

```csharp
static void Main(string[] args)
{
    CanalInscricao.RegistrarInscricao<EventoRegistroMensagemParametros>(
        TipoEvento.RegistroDeMensagem,
        Eventos.RegistrarMensagem);

    CanalInscricao.RegistrarInscricao<EventoRegistroMensagemParametros>(
        TipoEvento.RegistroDeMensagem,
        Eventos.MensagemEmMaisculo);

    Escrever("Hello World!");
    Console.ReadKey();
}

static void Escrever(string mensagem)
{
    CanalPublicacao.PublicarEvento(
        TipoEvento.RegistroDeMensagem,
        new EventoRegistroMensagemParametros() { Mensagem = mensagem });

    Console.WriteLine(mensagem);
}
```
Perceba que, precisamos registrar a nova inscrição, mas não precisamos fazer nenhum tipo de alteração no método `Escrever`, ao publicar o evento, todas as ações são disparadas!

![Resultado da publicação de um evento com duas inscrições](https://i.imgur.com/jlZaVx4.jpg)

Legal né?

Um último ajuste que normalmente pode ser feito é a paralelização do disparo dos eventos. De acordo com a natureza deste padrão, não deve haver dependência entre os eventos, por isso, é perfeitamente plausível paralelizar isso.

No nosso canal de publicação temos um comando `foreach` para percorrer todas as ações, que tal alterarmos para um `Parallel.ForEach`?

```csharp
Parallel.ForEach(acoes, acao => acao(parametros));
//foreach (var acao in acoes)
//    acao(parametros);
```
Com isso finalizamos nossa implementação deste padrão! O que achou?

> **Atenção**
>
> Você pode encontrar o código implementado aqui no meu [GitHub](https://github.com/gabrielschade/CSharp-Publish-Subscribe-Sample/tree/master/Publish.Subscribe.Exemplo).

Alguma sugestão? Gostou deste tipo de post?

Me conte nos comentários!

E Até mais!