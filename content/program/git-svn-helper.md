---
title: "Git中的Git-SVN使用指南"
date: 2024-09-26T19:30:49+08:00
draft: false
---

> 献给所有习惯使用了Git但不得不使用SVN的人们, 比如我
> 
> 使用git-svn拉下来的仓库本质上是一个git仓库, 但所有push和fetch都必须使用`git-svn`而不是`git`
> 
> 优点: 1.有本地仓库, 支持提交到本地仓库;  2.和git一样支持本地版本回退;
> 
> 上述两点SVN都做不到, 其他的优点就不一一列举了,可以了解下git和svn的区别
> 
> 缺点: 主流IDE中不支持git-svn的自动操作 比如IDEA中的push和fetch需要自己自定义操作并绑定快捷键才算是能用,否则每次push和fetch都需要打开命令窗口手动执行
> 
> 另一个缺点是本地代码必须全部提交才能做push和fetch操作

## clone一个svn项目

```shell
git svn clone svn://xxx.xx/code
```

可选参数:
```shell
--no-metadata
```

使用此参数时,拉取下来的仓库将会变成独立仓库,之前的提交信息都在,但之后的所有与svn远程仓库的相关`拉取`和`提交`都不会成功

## 提交

提交分为两个步骤,首先将暂存区文件提交到git本地仓库,然后再上传到svn远程仓库

1. git提交

    ```shell
    git commit -m"git 提交"
    ```

2. git-svn提交

   `dcommit`会将git repo当前branch与远程svn repo中的差异的git commit都提交到svn repo，并为每个git commit生成一个对应的svn revision。这和”git push”很类似。

    ```shell
    git svn dcommit
    ```

## 从svn repo拉取最新代码变更

```shell
git svn rebase
```


