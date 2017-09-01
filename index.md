---
layout: home
title: Home
parallax-bg: /public/img/bg.png
---

## Posts

{% for post in site.posts %} {% include postdate.html %}
[ {{ post.title }} ]({{ post.url }}) 

{% endfor %}