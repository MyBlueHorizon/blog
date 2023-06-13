---
title: Minecraft 1.20 互通服务器搭建记录
date: 2023-06-13 20:27:10
tags: [技术,Minecraft,服务器,游戏]
---
## 准备

### 前言

自上一次搭建 Minecraft 服务器已经过去很长时间了，这段时间内 Minecraft 与社区发生了很大的变化，但抛下各种纷扰，高版本互通服务器确实充满吸引力，也因此开启了这一旅程。

### 概况

#### 版本与服务端选择

为了实现 Java 与基岩端的互通，版本只能选择最新版本（事实上，可以通过相关插件来搭建旧版服务器，但显然会降低体验）。在高版本 Minecraft 下，官方原版服务端的性能并不佳，而 Paper 之类的插件端作为传统选择比较适宜，但本次接触到了 Fabric 这个涵盖了服务端和客户端的新一代加载器，并且这一加载器具有较多的优化 Mod 和其它辅助类 Mod，故选择 Fabric 服务端。

### Java 选择

在 1.17 或更高版本上，Mojang 将 Minecraft Java 版的最低 Java 版本提升到了 Java 17。这意味着 Java 的安装也不像过去直接下载即可。同时，各类的 JDK 纷纷出现，而本次选择具有较好性能表现的 Alibaba Dragonwell 17。

#### 愿景

本次目的是实现 1.20 下的 Java 端与基岩端的互联，实现无缝切换的体验，同时使服务器对于玩家的安全性和便利性有所提升，服务器流畅运行。

## 实践

### Java 下载与安装

#### Java 下载

阿里在 GitHub 上提供了 Alibaba Dragonwell 17 的二进制发行版本，但下载速度缓慢，而 Wiki 页提供了[镜像源](https://github.com/dragonwell-project/dragonwell17/wiki/Mirrors-for-download-(%E4%B8%8B%E8%BD%BD%E9%95%9C%E5%83%8F))。  
对于一般 Windows 用户，选择 Alibaba_Dragonwell_Standard_jdk-17.x.x.x.x+x_x64_windows.zip 下载即可。

#### Java 安装

对于 Oracle Java，其一键式的安装程序会解决大部分问题，但对于此，需要解压并设置环境变量手动安装。
在 `系统属性` 里的 `高级` 选项卡，你可以找到环境变量设置。在用户变量的 `Path` 处点击编辑，新建值为 `“解压后的位置”\bin` 的变量即可。（注意，这里假定你之前从未安装过 Java，如果你安装过，请自行寻找如何更改 Java 默认版本。

### 服务端安装与初期配置

#### 服务端安装

Fabric 为我们提供了一键式的安装体验。我们只需前往其[下载页面](https://fabricmc.net/use/installer/)，选择服务端安装选项并按照页面提示创建启动脚本，运行启动脚本稍后会自动完成安装。

#### 初期配置

为了最大化减少性能占用同时保障游戏体验，`view-distance` 被设置为 `4` ，同时为了保障正版玩家的体验 `online-mode` 被设置为 `true`。同时为了保障安全性，白名单也设置为开启。  
至此，尝试运行并加入，一切正常。

### Mod 选择

#### 功能性 Mod 选择

为了实现 Java 版与基岩版的互通，我们选择并下载了 [Gersey 及 Floodgate](https://geysermc.org/download) 作为基岩端的协议翻译与用户鉴权。注意，请在下载页面选择 Fabric 选项卡下载，之后拖入 `mods` 文件夹即可。  
为了实现正版用户与离线玩家同时在线，我们选择 [EasyAuth](https://modrinth.com/mod/easyauth) 作为 Java 端的用户鉴权。注意，这一 Mod 依赖于 [Fabric API](https://modrinth.com/mod/fabric-api)，请一并安装。

#### 优化性 Mod 选择

为了优化服务器，添加了以下 Mod。

- [Lithium](https://modrinth.com/mod/lithium)
- [Starlight](https://modrinth.com/mod/starlight)
- [Krypton](https://modrinth.com/mod/krypton)
- [FerriteCore](https://modrinth.com/mod/ferrite-core)

同时，这些 Mod 也可以考虑安装

- [Concurrent Chunk Management Engine](https://modrinth.com/mod/c2me-fabric)
- [Very Many Players](https://modrinth.com/mod/vmp-fabric)

### 后期配置

#### Gersey 配置

Gersey 的配置文件为 `\config\Geyser-Fabric\config.yml`。这里唯一需要修改的是 `auth-type` 项，应被修改为 `floodgate`。其余选项可以按需修改。

#### Floodgate 配置

Gersey 的配置文件为 `\config\floodgate\config.yml`。我们需要进行以下操作。

1. 修改 `player-link` 下的 `require-link` 与 `enable-own-linking` 为 `true`。
2. 下载 [SQLite 扩展](https://ci.opencollab.dev/job/GeyserMC/job/Floodgate/job/master/)（`floodgate-sqlite-database.jar`），并放置于配置文件同目录下。

#### EasyAuth 配置

Gersey 的配置文件为 `\mods\EasyAuth\config.json`。这里唯一需要修改的是 `floodgateAutologin` 项，应被修改为 `true`。其余选项可以按需修改。

## 结束

### 测试服务器

此时对服务器进行测试，正版登录与离线模式（需手动编辑白名单文件）都可以登入，基岩版用户在 [Global Link](https://link.geysermc.org/) 绑定账号后可以直接登入。对于其它未绑定的基岩版玩家，可以手动编辑 `\config\floodgate\` 下的数据库文件，手动录入玩家登入时服务台控制台显示的 XUID 和应该具有的 UUID 与游戏名。服务器在 JVM 预热完成后占用较低，相对流畅。

### 最后的话

显然，这个解决方案依然具有不完善之处，比较明显的正如`测试服务器`一节中所写。这些问题依然需要日后的探索。
