---
layout: page
title: Writing
permalink: /writing/
description: "Signal broadcast logs and essays"
---

<p class="section-kicker">SIGNAL BROADCAST</p>
<h2>COMMAND LOGS</h2>

<div class="writing-log">
  {% assign essays = site.posts | where: 'category', 'essay' %}
  {% for post in essays %}
  <article class="log-row">
    <span class="log-date">[{{ post.date | date: "%Y-%m-%d" }}]</span>
    <div>
      <a class="log-title glitch-hover" href="{{ post.url | prepend: site.baseurl | prepend: site.url }}">{{ post.title }}</a>
      <p class="log-excerpt">{{ post.description | default: post.excerpt | strip_html | strip_newlines | truncate: 170 }}</p>
    </div>
  </article>
  {% endfor %}
</div>
