---
title: "在java或kotlin中使用jna调用dll动态链接库"
date: 2023-03-10T08:39:51+08:00
draft: false
---

## 1.jna介绍
Java Native Access (JNA),Github地址:[JNA](https://github.com/java-native-access/jna)

在仓库的README.md中有:
> JNA provides Java programs easy access to native shared libraries without writing anything but Java code - no JNI or native code is required. This functionality is comparable to Windows' Platform/Invoke and Python's ctypes.

> JNA allows you to call directly into native functions using natural Java method invocation. The Java call looks just like the call does in native code. Most calls require no special handling or configuration; no boilerplate or generated code is required.

其是一个由社区开发的库，它使Java程序无需使用Java Native Interface(JNI)即可轻松访问本地共享库。JNA的设计旨在以最少的努力以原生的方式提供本地访问，且不需要样板代码或胶水代码。

## 2.使用JNA

以CH375为例，CH375是一个USB总线的通用接口芯片，它的驱动是一个dll动态链接库，后文中将借助JNA调用它的dll

> CH375官网介绍:[CH375](http://www.wch.cn/products/CH375.html)

官方提供了一个dll相关的头文件,这里节选出需要调用的方法:
```c
HANDLE	WINAPI	CH375OpenDevice(  // 打开CH375设备,返回句柄,出错则无效
	ULONG			iIndex );  // 指定CH375设备序号,0对应第一个设备,-1则自动搜索一个可以被打开的设备并返回序号

BOOL	WINAPI	CH375SetTimeout(  // 设置USB数据读写的超时
	ULONG			iIndex,  // 指定CH375设备序号
	ULONG			iWriteTimeout,  // 指定USB写出数据块的超时时间,以毫秒mS为单位,0xFFFFFFFF指定不超时(默认值)
	ULONG			iReadTimeout );  // 指定USB读取数据块的超时时间,以毫秒mS为单位,0xFFFFFFFF指定不超时(默认值)
	
BOOL	WINAPI	CH375WriteData(  // 写出数据块
	ULONG			iIndex,  // 指定CH375设备序号
	PVOID			iBuffer,  // 指向一个缓冲区,放置准备写出的数据
	PULONG			ioLength );  // 指向长度单元,输入时为准备写出的长度,返回后为实际写出的长度

BOOL	WINAPI	CH375ReadData(  // 读取数据块
	ULONG			iIndex,  // 指定CH375设备序号
	PVOID			oBuffer,  // 指向一个足够大的缓冲区,用于保存读取的数据
	PULONG			ioLength );  // 指向长度单元,输入时为准备读取的长度,返回后为实际读取的长度

```

### 2.1.引入JNA依赖
这里使用的项目管理工具是Gradle,在build.gradle.kts中添加依赖:
```kotlin
dependencies {
    implementation("net.java.dev.jna:jna:5.5.0")
}
```
### 2.2.创建一个接口
```java
import com.sun.jna.Library;
import com.sun.jna.Native;

public interface Ch375Library extends Library {
    
    Ch375Library INSTANCE = Native.load("CH375DLL64.dll", Ch375Library.class);
    
    Integer CH375OpenDevice(Integer index);
    
    Boolean CH375SetTimeout(Integer index, Long writeTimeout,Long readTimeout);

    Boolean CH375WriteData(Integer index, byte[] data, int[] length);

    Boolean CH375ReadData(Integer index, byte[] data, int[] length);
}
```

> 需要特别注意的是,头文件中参数数据类型和接口中数据类型的对应,例如指针类型的参数,在Java中就要换为数组类型

> 这里的接口使用kotlin写也是没问题的

`CH375DLL64.dll`文件要放在resources下:`resources/win32-x86-64/CH375DLL64.dll`

至此,已经可以直接调用这四个函数了,使用JNA就是这么十分的简洁

### 2.3.调用示例

```kotlin
import Ch375Library

object Ch375HandlerKt {
    fun openDevice(): Boolean {
        val openFlagInt = Ch375Library.INSTANCE.CH375OpenDevice(0)
        if (openFlagInt == -1) {
            return false
        }
        return Ch375Library.INSTANCE.CH375SetTimeout(0, 3000, 3000)
    }

    fun writeCommand(command: String): Boolean {
        val data = command.toByteArray()
        val length = IntArray(1)
        length[0] = data.size
        return Ch375Library.INSTANCE.CH375WriteData(0, data, length)
    }

    fun readData(): ByteArray {
        val data = ByteArray(64)
        val length = IntArray(1)
        length[0] = data.size
        Ch375Library.INSTANCE.CH375ReadData(0, data, length)
        return data.copyOf(length[0])
    }


}
```


