---
title: "Java Launcher 中文介绍"
date: 2025-07-11T10:19:25+08:00
---



## ![150X150/logo-small.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/MFdm/150X150/logo-small.png) Java Launcher  

## ⭐️ [Instructions in English]({{< ref "/program/java-launcher.md" >}}) 

Java Launcher 是一款功能强大、操作直观的 VS Code 插件，用于发现、运行、管理和调试您的 Java 应用。其设计灵感来源于 JetBrains IntelliJ IDEA 中流畅的运行和调试体验。

告别手动编辑 launch.json 的繁琐工作。Java Launcher 会自动发现您项目中所有可运行的入口点——包括 main 方法、Spring Boot 应用和测试——并将它们展示在活动栏的一个专属视图中。您甚至可以一键启动,重启, 停止整个微服务技术栈。

## 地址

- 插件市场: [VScode marketplace](https://marketplace.visualstudio.com/items?itemName=River.java-launcher)
- 仓库: [Java-Launcher](https://github.com/RiverMao/java-launcher)

## 核心功能展示

- 零配置运行/调试: 自动扫描并发现您工作区中所有可运行的入口点（main 方法、@SpringBootApplication、JUnit & TestNG 测试）。
- 清晰的树状视图: 在专属的侧边栏视图中，将所有发现的应用和测试按项目模块分组，一目了然，方便管理。
- 一键化操作: 直接在树状视图中运行、调试或停止任何一个应用。
    ![902X356/Snipaste_2025-07-11_09-40-22.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/8Pxw/902X356/Snipaste_2025-07-11_09-40-22.png)

    ![1526X1862/Snipaste_2025-07-11_11-09-53.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/mCCe/1526X1862/Snipaste_2025-07-11_11-09-53.png)

    ![1088X936/Snipaste_2025-07-11_09-31-15.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/kOtD/1088X936/Snipaste_2025-07-11_09-31-15.png)

- 聚合启动配置: 将多个应用组合成一个“聚合启动配置”。您可以按预设顺序和自定义延迟，一键启动您的整个微服务技术栈。
    ![1646X1742/Snipaste_2025-07-11_11-07-04.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/Xn70/1646X1742/Snipaste_2025-07-11_11-07-04.png)


- 快速搜索与运行: 提供一个强大的命令面板（类似 Ctrl+P），让您能快速查找并运行任何入口点或聚合配置。
    ![1520X956/Snipaste_2025-07-11_09-38-01.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/HsJc/1520X956/Snipaste_2025-07-11_09-38-01.png)

    ![2094X528/Snipaste_2025-07-11_11-14-13.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/eVPH/2094X528/Snipaste_2025-07-11_11-14-13.png)

- 强大的 Spring Boot 支持, 自动识别 Spring Boot 应用。为单个或所有 Spring Boot 应用轻松设置和切换 Active Profile。
    ![1256X330/Snipaste_2025-07-11_09-38-56.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/Qcpq/1256X330/Snipaste_2025-07-11_09-38-56.png)

- 进程管理: 在专属的管理界面中，查看、停止或重启由本插件启动的任何 Java 进程。
    ![2702X676/Snipaste_2025-07-11_09-33-49.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/iHVJ/2702X676/Snipaste_2025-07-11_09-33-49.png)

    ![1620X596/Snipaste_2025-07-11_09-35-19.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/LxzL/1620X596/Snipaste_2025-07-11_09-35-19.png)

    ![898X164/Snipaste_2025-07-11_09-43-07.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/WSyj/898X164/Snipaste_2025-07-11_09-43-07.png)

    ![886X164/Snipaste_2025-07-11_09-44-08.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/CsDJ/886X164/Snipaste_2025-07-11_09-44-08.png)

## 注意事项

- 建议在VScode中关闭jmx选项, 否则启动`聚合配置`时可能遇到**jmx端口冲突**的问题; 如果不是远程开发, 关闭这个选项不会影响开发调试工作, 且让java资源占用更少
    ![2132X338/Snipaste_2025-07-10_22-03-05.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/zTd9/2132X338/Snipaste_2025-07-10_22-03-05.png)

- 目前Java Launcher对Gradle 项目的支持还仅仅是实验性的