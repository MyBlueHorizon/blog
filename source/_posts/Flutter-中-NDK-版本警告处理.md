---
title: Flutter 中 Android NDK 版本警告处理
date: 2025-07-20 17:55:27
tags: [技术,Flutter]
hidden: true
---
## 问题

Flutter 中所指定的默认版本较为老旧，每当插件引入了较新的 Android NDK 版本进行构建时会产生如下警告：

```bash
One or more plugins require a higher Android NDK version.
Fix this issue by adding the following to .../android/app/build.gradle.kts:
android {
  ndkVersion "xx.x.xxxxxxx"
  ...
}
```

通常，Android NDK 是向下兼容的，只需安装最新版本即可。若根据上述提示修改 `build.gradle.kts` 为具体版本号，虽可消除警告，但不能从根本上解决问题。既然此次引用了 Flutter SDK 的变量，若要从根本上解决，则应当对 Flutter SDK 的文件进行修改。

## 解决

在 Flutter 中，使用默认的应用构建时所使用的Android NDK 版本取决于 Flutter SDK 所指定的 Android NDK 版本，在最新的 Flutter SDK 版本中（`3.32.x`），这一变量值来自于 Flutter SDK安装位置下的 `.\packages\flutter_tools\gradle\src\main\kotlin\FlutterExtension.kt` 的如下字段：

```kotlin
open class FlutterExtension {
    /**
     * Sets the ndkVersion used by default in Flutter app projects.
     * Chosen as default version of the AGP version below as found in
     * https://developer.android.com/studio/projects/install-ndk#default-ndk-per-agp.
     */
    val ndkVersion: String = "28.2.13676358"
}
```

由于 Android NDK 是向下兼容的，我们只需将其修改为设备上所安装的最新 Android NDK 版本（或从上述链接中选择版本，构建时会自动下载安装）即可，这也符合最佳实践的精神。  

此外，`compileSdkVersion`、`minSdkVersion`、`targetSdkVersion` 等变量也存储在这一文件内。

## 后记

根据 Flutter 仓库中的 [Issue](https://github.com/flutter/flutter/issues/139427)，针对这一问题已有人提出改进，但是否未来能够被采纳则不得而知。  

此外，针对于旧版 Flutter SDK，则应当修改 `./packages/flutter_tools/gradle/src/main/groovy/flutter.groovy` 文件。虽这一文件在新版已经被移除，但检索时发现的大量页面与 AIGC 均提到了这一失效文件，并未进行更新。
