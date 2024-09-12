---
title: "Rust中的切片"
date: 2022-05-31T20:59:22+08:00
draft: false
---

# 切片(Slice)

- Rust的另一种不持有所有权的数据类型: **切片(slice)**

- 一道题,编写一个函数:

    - 它接收字符串作为参数
    - 返回它在这个字符串的第一个空格的索引
    - 如果函数没有找到任何空格,那么返回整个字符串的长度

  ```rust
  fn main(){
      let s = String::from("see you");
      println!("{}",first_word(&s));
  }
  fn first_word(s:&String) -> usize{
      let my_bytes = s.as_bytes();
      for (i, &item) in my_bytes.iter().enumerate() {
          if item == b' '{
              return i;
          }
      }
      s.len()
  }
  ```

  ![](https://z3.ax1x.com/2021/08/21/fxYB9O.png)

  ## 字符串切片

    - 字符串切片是指向字符串中一部分内容的引用:

      ![](https://z3.ax1x.com/2021/08/21/fxNX1U.png)

      方括号中的两个索引值为**左闭右包**

  ### 语法糖

  ![](https://z3.ax1x.com/2021/08/21/fxUx8f.png)



## 使用

改写最开始的函数,让它返回一个字符串切片:

```rust
fn main(){
    let s = String::from("see you");
    println!("{}",first_word(&s));
}
fn first_word(s:&str) -> &str{
    let my_bytes = s.as_bytes();
    for (i, &item) in my_bytes.iter().enumerate() {
        if item == b' '{
            return &s[..i];
        }
    }
    &s[..]
}
```

![](https://z3.ax1x.com/2021/08/21/fx0AIA.png)

- 其实,字符串字面值就是字符串切片

- Rust中切片的其他性质:

  ```rust
  //以下代码会报错
  fn main(){
      let mut s = String::from("see you");
      let s0 = first_word(&s);
      s.clear(); 
      println!("{}",s0);
  }
  fn first_word(s:&str) -> &str{
      let my_bytes = s.as_bytes();
      for (i, &item) in my_bytes.iter().enumerate() {
          if item == b' '{
              return &s[..i];
          }
      }
      &s[..]
  }
  ```

  ![](https://z3.ax1x.com/2021/08/21/fxDcDO.png)



## 其他

- 定义函数时使用字符串切片来代替字符串中的引用会使得我们的API更加通用,且不会损失任何功能

- 其他数据类型的切片:

  ```rust
  fn main(){
      let arr = [1,2,3,4,5];
      let arr0 = &arr[1..3];
      for elem in arr0 {
          println!("{}",elem);
      }
  }
  ```

  ![](https://z3.ax1x.com/2021/08/21/fxyMUe.png)

  