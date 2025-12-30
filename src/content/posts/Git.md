---
title: Expressive Code Example
published: 2024-04-10
description:  Git 的技术总结和归纳，学习 Git的基本命令和工作方式，以及作用。
tags: [Git，总结]
category: 技术
draft: false
---

git 是一种协议，一个工具，规定了怎么把东西上传，下拉，然后日志的记录和撤回之前的操作的一个协议，具体的代码放到哪里其实是自己定义的服务器，比如 github 就是代码托管，你免费给代码放上去，放到他的服务器上仅此而已，git 原生的甚至没有可视化页面，和 mysql 一样都没有，可视化页面可以自己下载对应的软件方便去管理，可能这也是一种 分层封装的思想，专注于自己的业务，其他的有不同的需求由不同的用户去对应创建工具。  

svn 是集中式的版本控制，由一个服务器控制所有的数据信息，git 相比而言是分布式的，所有的主机都拥有全部的信息，可以不害怕服务器的信息的丢失，但是安全性上没有 svn 的安全性高！

---

+ Git bash ： Linux 风格的命令行
+ Git cmd： Windows 风格的命令行
+ Git gui：图形界面的 git
+ 绿色文件，蓝色目录，白色文件

git 原理：

1. 工作区：存放本地内容
2. 暂存区：修改的还未提交（本质就是一个文件而已）
3. 仓库区：本地提交的修改内容
4. 远程仓库：服务器上的内容
5. 配置 ssh 公钥
由 git 产生公钥，然后 到代码托管平台去设置公钥，本地还有一个私钥
这样子 托管平台才能识别到这个 git 是谁，两者相互连接

---
git 的命令：
Git config --global（用户）
Git config --system （系统设置）
Git init 初始化
Git commit - 将暂存区内容添加到仓库中。
Git add . - 添加文件到暂存区。
（每一次提交都要带上对应的信息说明这次的提交，方便后续的整理和了解）

| 命令 | 描述 |
|------|------|
| git clone | 拷贝一份远程仓库，也就是下载一个项目。 |
| git add | 添加文件到暂存区。 |
| git status | 查看仓库当前的状态，显示有变更的文件。 |
| git diff | 比较文件的不同，即暂存区和工作区的差异。 |
| git difftool | 使用外部差异工具查看和比较文件的更改。 |
| git range-diff | 比较两个提交范围之间的差异。 |
| git reset | 回退版本。 |
| git rm | 将文件从暂存区和工作区中删除。 |
| git mv | 移动或重命名工作区文件。 |
| git notes | 添加注释。 |
| git checkout | 分支切换。 |
| git switch | 更清晰地切换分支。（Git 2.23 版本引入） |
| git restore | 恢复或撤销文件的更改。（Git 2.23 版本引入） |
| git show | 显示 Git 对象的详细信息。 |
| git remote | 远程仓库操作。 |
| git fetch | 从远程获取代码库。 |
| git pull | 下载远程代码并合并。 |
| git push | 上传远程代码并合并。 |
| git submodule | 管理包含其他 Git 仓库的项目。 |
| git branch --merged | 显示所有已合并到当前分支的分支。 |
| git branch --no-merged | 显示所有未合并到当前分支的分支。 |
| git branch -m master master_copy | 本地分支改名。 |
| git checkout -b master_copy | 从当前分支创建新分支 master_copy 并检出。 |
| git checkout -b master master_copy | 上面命令的完整版。 |
| git checkout features/performance | 检出已存在的 features/performance 分支。 |
| git checkout --track hotfixes/BJVEP933 | 检出远程分支 hotfixes/BJVEP933 并创建本地跟踪分支。 |
| git checkout v2.0 | 检出版本 v2.0。 |
| git checkout -b devel origin/develop | 从远程分支 develop 创建新本地分支 devel 并检出。 |
| git checkout -- README | 检出 head 版本的 README 文件（可用于修改错误回退）。 |
| git merge origin/master | 合并远程 master 分支至当前分支。 |
| git cherry-pick ff44785404a8e | 合并提交 ff44785404a8e 的修改。 |
| git push origin master | 将当前分支 push 到远程 master 分支。 |
| git push origin :hotfixes/BJVEP933 | 删除远程仓库的 hotfixes/BJVEP933 分支。 |
