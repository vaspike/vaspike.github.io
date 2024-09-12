---
title: "Rust特性(1)--所有权,深浅拷贝,引用,借用,悬空引用(野指针)"
date: 2022-05-31T20:59:22+08:00
draft: false
---

## 内存模型

- Rust的内存可分为**栈(stack)**和**堆(heap)**两种
- 标量会被分配在栈上
- 栈为后进先出
- 分配在堆上的变量在使用时要注意一个叫做**所有权**的概念

## 所有权(Ownership)

- 变量的所有权与变量的声明作用域相同,在变量离开作用域时,变量会发生Drop操作,除非发生所有权的**移交(move)**

## 深拷贝(deep copy)与浅拷贝(shallow copy)

### 堆上数据的拷贝:

- 分配在堆上的变量默认使用的是浅拷贝

- 堆上的变量发生浅拷贝时实际上是将这段堆内存的所有权移交给拷贝者:

    - 如下的代码在编译时就会报错

  ```rust
  fn main() {
      let s1 = String::from("hello world");
      let s2 = s1;
      println!("{}",s1);//此处会报错
  }
  ```

  因为**s1**(s1的引用是字符串,指向堆的)对字符串的引用已经**移交(move)**给了**s2**,无法再对**s1**进行操作(其实在移交所有权后**s1**已经被销毁了),包括读取它

- 如果使用深拷贝,则会在堆中真正拷贝一个段相同的数据并将新数据的引用交给(move)拷贝者(s2),此时,s1依然拥有所有权,它与s2之间的所有权是相互独立,互不影响的,如下:

  ```rust
  fn main() {
      let s1 = String::from("hello world");
      let s2 = s1.clone();//clone()方法将会使用深拷贝
      println!("{},{}",s1,s2);//此时s1与s2都可以正常读取输出,不会报错
  }
  ```

  ![](https://z3.ax1x.com/2021/08/15/f2tK2R.png)



即:**一块内存在某个时间上只可以属于一个变量**

### 栈中数据的拷贝:

- 栈上变量的拷贝本质上是深拷贝,这与栈上拷贝的操作是不同的

- 所有标量都会分配在栈上

- 例子:

  ```rust
  fn main() {
      let s1 = 5;
      let s2 = s1;
      println!("{},{}",s1,s2);
  }
  ```

  程序可以正常运行:

  ![](https://z3.ax1x.com/2021/08/15/f2UtgA.png)

### Copy trait

- Copy trait可以用于像整数这样完全存放在stack上的类型
- 如果一个类型实现了copy 这个trait,那么这个类型的变量在发生拷贝后依然可以使用
- **实现了Drop trait 的类型不可以再实现Copy trait**(防止double free)

拥有Copy trait的类型:

- 所有的整数类型,如**u32**等
- bool类型
- char类型
- 所有的浮点类型,如f64
- Tuple(元组)类型,前提是其中所有的字段都是Copy的,且数量不超过12个,例如:
    - (u32,f64) 是
    - (u32,string) 不是

## 所有权与函数

- 在语义上,将值传递给函数和将值赋给变量是类似的,因此将值传递给函数时也会发生移动或者复制

例子

```rust
//以下代码会报错
fn main() {
    let s = String::from("hello");
    let i = 5;
    take_ownership(s);//s将所有权移交(move)给了take_ownership()中的some_string变量,s不可再被读取和操作
    makes_copy(i);//i将自己的副本传入了makes_copy(),i的所有权仍在自己手上

    println!("{}",s);//在此处程序会报错
    println!("{}",i);//i还是可以正常被读取使用的

}
fn take_ownership(some_string: String){
    println!("{}",some_string);
    //在此时some_thing变量的作用域马上结束,Rust会调用drop(),它引用的内存将会被free
}
fn makes_copy(some_number: i32){
    println!("{}",some_number);
    //此处却不会发生什么
}
```

## 返回值与作用域

- 函数在返回值的过程中同样会发生所有权的转移

```rust
fn main() {
    let k = String::from("kaka");
    let s1 = give_ownership();//give_ownership()中的s变量的所有权将会移交给s1
    let g = take_and_gives_back(k);//k变量的所有权将先回移交给a_string,a_strin会再将所有权移交回给g,而k已经不再有意义了
}
fn give_ownership() -> String {
    let s = String::from("hello");
    s//所有权移交给give_ownership()的接收者
}
fn take_and_gives_back(a_string: String) -> String {
    a_string//a_string的所有权来自于k的所有权,最后又将此所有权移交给函数接收者g
}
```

- 当一个包含heap数据的变量在离开作用域时,它的值就会被drop()函数清理,除非数据的所有权移动到另一个变量上了

## 引用(Reference)和借用

### 引用(Reference)

例子:

```rust
fn main() {
    let k = String::from("kaka");
    let g = take_and_gives_back(&k);
    println!("{}",k);
}
fn take_and_gives_back(a_string: &String) -> usize {
    a_string.len()
}
```

![](https://z3.ax1x.com/2021/08/15/f26Mz8.png)

可以看到程序正常运行,并没有报错,这是因为:

- 参数的类型是**&string**而不是**string**
- **&**符号就表示引用:**允许你使用某些值而不取得所有权**

### 借用

如上个例子中:

- 把引用作为函数参数的这个行为叫做借用

- 默认是**不可以**修改借用的东西的,除非在声明变量和引用是都加上**mut**关键字:

  ```rust
  fn main() {
      let mut k = String::from("kaka");
      let g = take_and_gives_back(&mut k);
      println!("{},{}",k,g);
  }
  fn take_and_gives_back(a_string: &mut String) -> usize {
      a_string.push_str(" hello");
      a_string.len()
  }
  ```

可变引用的限制:

- 在特定的作用域内,对于某一块数据,只能有一个可变的引用,即**一段内存的可变引用不可以同时超过一个**

这样可以防止发生数据竞争,以下三种情况**同时满足时**,就会发生数据竞争:

- 两个或多个指针**同时**访问一个数据
- 至少有一个指针用于写入数据
- 没有使用任何机制用来同步对数据的访问

Rust在编译时就会检查以上三种情况是否同时发生

- 但如果一个数据的几个可变指针是存在于两个不同的作用域中的,那就是可以的(作用域不重叠)

另一个限制:

**一个数据不可以同时拥有一个可变引用和一个不变的引用**

## 悬空引用(Dangling Reference)

悬空指针(类似野指针):

**一个指针引用了内存中的某个地址,而这块内存可能已经释放并分配给其他人使用了**

- 在Rust中,编译器可以保证引用永远都不是悬空引用

例子:

```rust
//以下代码会报错
fn main() {
   dangle();
}
fn dangle() -> &String { //此处报错
    let  k = String::from("kaka"); 
    &k;
}
```

因为假使编译可以通过,那么在dangle()结束时,k变量就会被Drop(),那么返回的就是一个悬空引用(野指针),这是没有意义且危险的

### 引用的使用规则

- 在同一作用域内一个数据只有一个可变引用
- 在同一作用域内一个数据可以有任意数量的不可变引用

**以上两者只能满足之一**

另一个规则为:

**引用必须一直有效**