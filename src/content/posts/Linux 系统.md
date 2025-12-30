---
title: Linux 系统
published: 2025-10-10
description: Linux 的内核工作机制的总结。
tags: [技术，Linux]
category: 技术
draft: false
---

``基本内核技术：  
之前面试会问到，看书发现和操作系统十分类似，简直一样，理论照进现实了!
``


## <span style='color:#FA0000'>内存管理方式</span>：采用请求分页，虚拟存储器的方式，可以支持高并发，利用交换来实现装入更多的进程到内存，实现并发操作，对于不同的进程并不会全部读入内存，而是用到那一页就把那一页放到内存，没有位置了再换出去  

## <span style='color:#FA0000'>用户的权限管理对于文件的权限</span>（之前操作系统做过题，文件对于不同的用户可以设置访问权限）

## <span style='color:#FA0000'>进程和线程的区别</span>  

如何进行系统调度（linux 用的是多级队列调度，具体的调度方式支持三种，优先权，先进先出，还有一个叫做 other 的方式）  
<span style='color:#FA0000'>进程的通信也问到了，下面图片讲清楚了如何进行通信的方式</span>  

## <span style='color:red'> 还有一个小注意点:</span> ##

1. <span style='color:black'>shell 是命令解释程序是对于用户而言的，也就是终端，命令行 就是命令，shell 是一种命令解释程序，但是还有其他的命令解释程序，名字也不同。</span>
2. <span style='color:black'>只要一开机，会给每个用户都配置一个 shell 进程，之后所有的进程都是利用这个进程或者他的子孙进程去创建的，整体是一个倒着的进程树。</span>
<span style='color:black'></span>  
<span style='color:black'></span>  



c 语言内部的函数，有些直接就是系统调用，有的是库函数，库函数是对系统调用的封装的函数，本质还是系统调用，故 c 语言十分靠近底层！用 c 来写一下比较底层的东西
---

<span style='color:#FA0000'></span>
<span style='color:#FA0000'>Linux 的基本目录内容</span>
/根目录，所有的目录都从根目录开始
/bin binary 的缩写，常用的 shell 命令都在这里
/boot 引导核心的程序目录
/dev device 的缩写，包含了所有的外部设备的名字，内部存的是设备文件，仅有名字而没有内容，设备驱动程序作为内核的一部分在内核中，相关源码的模块 放在和源代码相关的 modules
/etc etcetera 其他事项，附加目录
/home 用户的主目录
/lib library 存放系统最基本的动态链接库，几乎所有的应用程序都要用到这个目录的共享库，包含两个重要的目录，modules 和 security
/root 超级用户的默认目录
/tmp temporary 存放程序的临时文件
/user 用户的应用程序和文件几乎都存放在这个目录之中
/var 存放系统的记录文件和配置文件，为管理员提供用户注册，系统负载和安全性等方面的查询

---
sudo：以root权限运行程序
<span style='background:white'>Superuser Do</span>
有的程序需要做一些特权操作，比如前面讲的用户账号管理：adduser、deluser。

通常我们要执行这样的程序必须以root用户登录去执行。
<span style='color:#FA0000'></span>
<span style='color:#FA0000'>但是，我们有时却希望给某几个信任的用户授予这样的权限，允许他们某次可以申请以以root权限执行该程序。</span>

Windows里面的 以管理员权限 运行某个程序，就是这样，因为root只有一个，我不是root ，但是我也想用某些权利，就用sudo

Linux上也有这种方法，就是使用命令 sudo

- <span style='background: white'>超级用户：可以再linux系统下做任何事情，不受限制；命令提示符是“#”</span>
- <span style='background: white'>普通用户：在linux下做有限的事情；命令提示符是“\$”</span>
