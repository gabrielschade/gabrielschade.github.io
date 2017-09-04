---
layout: page
title: Posts
---

## Posts

{% assign rawtags = "" %}
{% for post in site.posts %}
	{% assign ttags = post.tags | join:'|' | append:'|' %}
	{% assign rawtags = rawtags | append:ttags %}
{% endfor %}
{% assign rawtags = rawtags | split:'|' | sort %}

{% assign tags = "" %}
{% for tag in rawtags %}
	{% if tag != "" %}
		{% if tags == "" %}
			{% assign tags = tag | split:'|' %}
		{% endif %}
		{% unless tags contains tag %}
			{% assign tags = tags | join:'|' | append:'|' | append:tag | split:'|' %}
		{% endunless %}
	{% endif %}
{% endfor %}

{% for tag in tags %}
    {% include huge-h3.html content="{{ tag }}" %} 
	<ul>
	 {% for post in site.posts %}
		 {% if post.tags contains tag %}
		  {% include single-post.html %} 
		 {% endif %}
	 {% endfor %}
	</ul>
{% endfor %}

{% for post in site.posts %} {% include postdate.html %}
[ {{ post.title }} ]({{ post.url }}) 

{% endfor %}