---
title: "Rust的变量、常量与遮蔽(Shadowing)"
date: 2022-05-31T20:59:22+08:00
draft: false
---

# Rust的变量,常量,Shadowing

## 变量

- 声明变量使用let关键字

- 默认情况下,Rust的变量是不可变的(immediate),但这与常量仍有很大的区别

- 在声明变量时,如果变量名前加上_mut_关键字,就可以使此变量可变

- 变量的声明使用蛇形命名法

  例子:

  ```rust
  let mut question_will_send = "Who am I ?";
  ```





## 常量

- 使用const关键字声明常量

- 不可以使用_mnt_关键字,常量永不可变

- 常量在声明时必须同时声明数据类型

- 常量可以在任何作用域中声明,包括全局作用域

- 常量只可以绑定到常量表达式,无法绑定到函数的调用结果或者只有在运行时才能计算出的值(即常量的值和类型在编译期就必须被确定)

- 在程序运行期间,常量在其声明的作用域中一直有效

- 常量的命名规范为

  1.使用大写字母

  2.单词间使用下划线连接

  例子:

  ```rust
  const MAX_USER_ID: U32 = 100_000; //100_000即为100000,添加下划线可增强可读性,java中也有类似的使用
  ```

## Shadowing(遮蔽/隐藏)

- Rust中可以使用相同的名字声明变量,新的变量就会把之前声明的同名变量Shadow(遮蔽掉)

  ```rust
  let x = 5;
  let x = x + 1;
  ```

  这种语法在Java等大多数语言中是不允许的,却是Rust的一大特点

- shadow的变量可以更改为与之前不同的数据类型

  例子:

  ```rust
  fn main() {
      let  space = "   ";
      let space = space.len();
      println!("空格数量为:{}",space);
  }
  ```

  ![shadow](https://z3.ax1x.com/2021/08/15/fcC6sS.png)



​	但如果不使用shadow时,一个变量的数据类型不可更改:

​		例子:

![不使用shadow](https://z3.ax1x.com/2021/08/15/fcP9sO.png)


