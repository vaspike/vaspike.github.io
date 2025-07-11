---
title: "Java Launcher Introduction"
date: 2025-07-11T10:19:25+08:00
---

## ![150X150/logo-small.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/MFdm/150X150/logo-small.png) Java Launcher  

## ⭐️ [中文介绍]({{< ref "/program/java-launcher-zh.md" >}}) 

Java Launcher is a powerful and intuitive VS Code extension for discovering, running, managing, and debugging your Java applications. Its design is inspired by the seamless run and debug experience in JetBrains IntelliJ IDEA.

Say goodbye to the tedious work of manually editing `launch.json`. Java Launcher automatically discovers all runnable entry points in your project—including `main` methods, Spring Boot applications, and tests—and displays them in a dedicated view in the Activity Bar. You can even start, restart, or stop your entire microservice stack with a single click.

## Links

- Marketplace: [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=River.java-launcher)
- Repository: [Java-Launcher](https://github.com/RiverMao/java-launcher)

## Core Features

- **Zero-Configuration Run/Debug**: Automatically scans and discovers all runnable entry points in your workspace (main methods, `@SpringBootApplication`, JUnit & TestNG tests).
- **Clear Tree View**: Groups all discovered applications and tests by project module in a dedicated sidebar view for easy management.
- **One-Click Actions**: Run, debug, or stop any application directly from the tree view.
    ![902X356/Snipaste_2025-07-11_09-40-22.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/8Pxw/902X356/Snipaste_2025-07-11_09-40-22.png)

    ![1526X1862/Snipaste_2025-07-11_11-09-53.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/mCCe/1526X1862/Snipaste_2025-07-11_11-09-53.png)

    ![1088X936/Snipaste_2025-07-11_09-31-15.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/kOtD/1088X936/Snipaste_2025-07-11_09-31-15.png)

- **Compound Launch Configuration**: Combine multiple applications into a "Compound Launch Configuration". You can start your entire microservice stack with one click, in a preset order and with custom delays.
    ![1646X1742/Snipaste_2025-07-11_11-07-04.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/Xn70/1646X1742/Snipaste_2025-07-11_11-07-04.png)

- **Quick Search & Run**: Provides a powerful command palette (similar to Ctrl+P) that allows you to quickly find and run any entry point or compound configuration.
    ![1520X956/Snipaste_2025-07-11_09-38-01.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/HsJc/1520X956/Snipaste_2025-07-11_09-38-01.png)

    ![2094X528/Snipaste_2025-07-11_11-14-13.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/eVPH/2094X528/Snipaste_2025-07-11_11-14-13.png)

- **Powerful Spring Boot Support**: Automatically recognizes Spring Boot applications. Easily set and switch Active Profiles for single or all Spring Boot applications.
    ![1256X330/Snipaste_2025-07-11_09-38-56.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/Qcpq/1256X330/Snipaste_2025-07-11_09-38-56.png)

- **Process Management**: View, stop, or restart any Java process started by this extension in a dedicated management interface.
    ![2702X676/Snipaste_2025-07-11_09-33-49.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/iHVJ/2702X676/Snipaste_2025-07-11_09-33-49.png)

    ![1620X596/Snipaste_2025-07-11_09-35-19.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/LxzL/1620X596/Snipaste_2025-07-11_09-35-19.png)

    ![898X164/Snipaste_2025-07-11_09-43-07.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/WSyj/898X164/Snipaste_2025-07-11_09-43-07.png)

    ![886X164/Snipaste_2025-07-11_09-44-08.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/CsDJ/886X164/Snipaste_2025-07-11_09-44-08.png)

## Notes

- It is recommended to disable the JMX option in VS Code, otherwise you may encounter a **JMX port conflict** when starting a `Compound Configuration`. If you are not developing remotely, disabling this option will not affect your development and debugging work, and it will reduce Java resource consumption.
    ![2132X338/Snipaste_2025-07-10_22-03-05.png](https://tc.z.wiki/autoupload/f/orCzaWOvKzgYH1bdiGU7RymIkHMchKbLor7dh3rvZ9Gyl5f0KlZfm6UsKj-HyTuv/20250711/zTd9/2132X338/Snipaste_2025-07-10_22-03-05.png)

- Currently, Java Launcher's support for Gradle projects is still experimental. 