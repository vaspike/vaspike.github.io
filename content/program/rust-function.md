---
title: "Rust的函数"
date: 2022-05-31T20:59:22+08:00
draft: false
---

# 函数

## 函数的声明

```rust
fn main() {
    println!("This");
    another_function();
}

fn another_function(){
    println!("Another")
}

```

- 函数不必定义在main前,声明在在其后依然可以在main中调用

## 函数的参数

- **形参** parameters
- **实参** arguments

在函数的声明里,必须声明每个参数的类型:

```rust
fn main() {
    println!("This");
    another_function(45,20.5);//argument
}

fn another_function(x:i32,y:f64){//parameter
    println!("{},{}",x,y);
}
```

## 函数体中的语句和表达式

- 函数体由一系列语句组成,可选的由一个表达式结束
- Rust是一个基于表达式的语言
- 语句是执行一些动作的指令
- 表达式会计算并产生一个值
- 函数的定义也是一个语句

```rust
fn main() {
    let x = 5;
    let y = {
        let x = 1;
        x+3//此处如果加上分号,则会报错,因为不加分号 x+3就是一个表达式,但加上分号 x+3; 变为了一个语句
    };
    println!("{}",y);
}
```

## 函数的返回值

- 在 **->**符号后声明函数返回值的类型,但不可以为返回值明明命名
- 在Rust中,返回值就是函数体里面最后一个表达式的值
- 若想提前返回,则使用**return**关键字,并指定一个值

```rust
fn main() {
    let y = plus_five(4);
    println!("{}",y);
}

fn plus_five(x:i32)->i32{
    x+5
}
```
