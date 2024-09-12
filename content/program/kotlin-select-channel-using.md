---
title: "Kotlin中select关键字与Channel的用法"
date: 2022-07-08T16:39:51+08:00
draft: false
---

## Kotlin中Channel的使用

类似*Go*中的*Channel*,*Kotlin*中的*Channel*也可以在**协程**间通信

### 创建

最基本的声明方式:(*Channel*位于*kotlinx.coroutines.channels.Channel*)

```kotlin
val channel01 = Channel<Int>()
```

其中Int处为泛型,代表通道中放置的数据类型,取和拿都是此类型的变量

除此之外,构造函数还可以接收一个参数:

```kotlin
val rendezvousChannel = Channel<Int>()
val bufferedChannel = Channel<Int>(10)
val conflatedChannel = Channel<Int>(CONFLATED)
val unlimitedChannel = Channel<Int>(UNLIMITED)
```

含义如下:

| 通道类型 | 构造参数 | 通道特点                                               |
|------|--------|----------------------------------------------------|
|Rendezvous| 空参     | 0尺寸buffer, *send*和*receive*要**meet on time**, 否则挂起. (默认类型) |
|Buffered| **Int**值   | Int值即为通道大小, 满了之后*send*挂起                             |
|Conflated|**CONFLATED**        |新元素会覆盖旧元素, *receiver*只会得到最新元素, *send*永不挂起                                                    |
|Unlimited|**UNLIMITED**        | 无限元素, *send*不被挂起                                     |

### send与receive

- send:

```kotlin
val channel01 = Channel<Int>()
repeat(100) {
    channel01.send(it)
}
```

- receive:

最简单的*receive*:

```kotlin
val element = channel01.receive()
```

除此之外,我们可以使用*select*关键字进行*receive*操作:

## Kotlin中的select关键字

*select*在*kotlin*中类似*when*一样,可以是一个表达式,此处展示一个例子:

```kotlin
val str = select<String> {
    channel01.onReceive { value ->
        "收到数据"
    }
    onTimeout(1000L) {
        "数据等待超时"
    }
}
```

在上述代码中,*select*表达式的值赋给了str变量,其中*String*可以为其他任意泛型

同时,对channel01通道进行了监听,如果通道中有数据则会立即返回:*"收到数据"*

而*onTimeOut*类似*when*中的*else*,如果上面的通道监听在1000毫秒(即onTimeOut的参数值)内都没有触发,将会执行

因此如果在一秒的时间段内channel01通道中都没有数据,则会执行*onTimeout*部分,返回*"数据等待超时"*

把它放在一个协程中会是这样:

```kotlin

@OptIn(DelicateCoroutinesApi::class, ExperimentalCoroutinesApi::class)
fun fun01(): Job {
    return GlobalScope.launch {
        var index = 0
        while (true) {
            val str = select<String> {
                channel01.onReceive { value ->
                    index++
                    "收到来自channel01的第${index}条数据为:${value}"
                }
                onTimeout(1000L) {
                    "数据等待超时"
                }
            }
            println(str)
        }
    }

}
```

当然,*Kotlin*中的*select*和*when*一样,是自带break case的