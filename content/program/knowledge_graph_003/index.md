---
title: "知识图谱与图数据库Neo4j--Part03"
date: 2024-11-16T21:03:44+08:00
draft: false
---

> [知识图谱与图数据库Neo4j--Part02]({{< ref "/program/knowledge_graph_002/index.md" >}}) <--- Part02


# Spring Data Neo4j(SDN)

_可以说目前这个系列就是为了**SDN**这点醋才包的饺子, 笔者写到这里的时候已经踩过了太多的坑_

## 版本

如果不想和不久前的我一样痛苦,版本就跟我保持一致

| DB或依赖名称           | version | 备注                           |
|-------------------|---------|------------------------------|
| Neo4j             | 5.24.0  | 版本较新,够用                      |
| spring-boot       | 3.1.1   | 高一点SDN就有bug;低到2.*则SDN的语法完全变样 |
| spring-data-neo4j | 7.3.1   | 重头戏来了,必须锁住版本为7.3.1           |
| JDK               | 17      | 能上17就用17                     |
|                   |         |                              |

**不要轻易尝试更换这里的版本!**

> 暂时写不完了, 会继续更新

