---
title: "在PostgreSQL中使用窗口函数解决取分组后前n条数据的问题"
date: 2023-02-23T11:09:40+08:00
draft: false
---

先描述一个业务场景:

- 现有一张数据表,结构如下:

  [![pSvjkVg.png](https://s1.ax1x.com/2023/02/23/pSvjkVg.png)](https://imgse.com/i/pSvjkVg)

- 现在要查询每个不同`number`的最后一条(create_time)的完整记录
- 保证查询结果中的`number`不重复

直观的解决办法是:

1. 对`number`字段分组
2. 对`create_time`进行desc排序

如:

```sql
select *
from (select *
      from table_name
      where create_time > '2022-12-01'
        and create_time < '2023-12-12'
      ORDER BY create_time desc) a
GROUP BY number;
```

这条`sql`放在`MySQL`中或许可以执行成功,但在`PostgreSQL`中是无法执行的,因为`pgsql`的group by是严格的,group by后无法再select * (本文忽略select * 的性能问题,与主题无关)

在`pgSQL`中,有一种可行的写法:

```sql
select *, pcd.number
      from table_name pcd
               right join (select number, max(create_time) latest_create_time
                           from table_name
                           where create_time > '2023-02-21'
                             and create_time < '2023-02-22'
                           group by number) d
                          on d.number = pcd.number and pcd.create_time = d.latest_create_time
```

但这种写法存在一个致命的问题:

如果数据表存在有这么两条或多条记录,它们的`number`和`create_time`的值同时相等,那么:

使用上述连接查询的结果将不会将这些重复记录筛选出去,也就是说查询结果中依然有存在相同`number`的可能性

这显然与基本需求不符

### 使用窗口函数

- 窗口函数是什么:

> 窗口函数,也称作`OLAP`函数(On-Line Analytical Processing),可以对数据库数据进行实时分析处理

- 基本语法:

```sql
-- <窗口函数> over (partition by <要分组的列名> order by <要排序的列名>)
```

- 有什么窗口函数:

1. 专用窗口函数: `rank()`,`dense_rank()`,`row_number()`等
2. 普通聚合函数:`sum()`,`avg()`,`count()`等

- 使用:

我们使用`row_number()`解决上述所有问题:

```sql
select *
from (SELECT *,
             row_number() OVER (PARTITION BY number order by create_time desc ) as row_number
      FROM table_name
      order by number) d
where d.row_number = 1
order by create_time desc;
```





