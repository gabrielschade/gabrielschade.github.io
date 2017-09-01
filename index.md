---
layout: home
title: Home
parallax-bg: /public/img/bg.png
parallax-text: >
     Dev,

     ciência
     
     e reflexões 
---

## Posts

{% for post in site.posts %} {% include postdate.html %}
[ {{ post.title }} ]({{ post.url }}) 

{% endfor %}