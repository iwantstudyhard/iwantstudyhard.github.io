---
title: 华为matebookego的学习过程
published: 2025-12-24
description: ''
image: ''
tags: [总结，实践]
category: '项目'
draft: false 
lang: ''
---

## 前言

  经过了在青训营的学习之后，对于go语言我有了一些初步的认识，结合着网上的相关资料的学习，我上手完成了一个很小的功能实现，包含的框架有gin和gorm是go语言较为流行的网络框架和数据库管理框架。同时我还用到了jwt认证，Bcrypt 的密码加密存储和验证，保证系统的基本安全。

## 实现目标

1. 实现gorm对数据库进行管理
2. 用户的登录和注册，能够从数据库进行查询和更改
3. 用户密码的加密存储，验证密码是否正确
4. 验证成功之后，返回token，每次登录验证jwt

## 实现步骤

### 一、初始化框架

go mod init GO1
建立go.mod管理各种需要的包，根目录创建main.go

### 二、数据库管理

- 创建config文件夹，创建db.go文件。代码如下，利用go get命令获得相关的包，
- 定义一个**InitDB函数**用来初始化数据库的链接。利用**gorm的Open方法**建立和数据库的链接，dsn内包含的是和数据库链接的信息，**用户名：密码@tcp（lockhost：端口号）/数据库的名字**
- **gorm的Open方法**会返回两个对象，**一个是gorm的管理对象，一个是错误信息**，进行条件判断，err是否为空来检测数据库是否链接成功。
- 定义DB为全局变量，将gorm的管理对象地址传给DB，方便之后的调用。

```
package config

import (
 "fmt"

 "gorm.io/driver/mysql"
 "gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
        dsn := "root:@tcp(localhost:3306)/gorm"
 db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
 if err != nil {
  fmt.Println("数据库链接失败,err:", err)
 } else {
  fmt.Println("数据库链接成功")
 }
 DB = db
}

```

### 二、密码的加密和验证方法和jwt token生成的实现

- 创建utils文件夹，内部包含了一个utils.go文件，表示存放工具类的方法，如密码的加密和验证处理逻辑，根据需要导入的包，进行go get 导入包。
- 包含三个方法，首先来讲解关于**密码的加密和验证**的方法。Bcrypt 是一种用于密码哈希的加密算法，它是基于 Blowfish 算法的加强版被广泛应用于存储密码和进行身份验证。
- HashPassword函数，传入一个**字符串**意为**输入的密码**，返回一个**加密后的密码**和**error**，如果没有错误，error为空。调用bcrypt.GenerateFromPassword，将**输入的密码**变成**字符切片**传入，然后将结果**强制转换**成string类型并返回。

> 提示：nil表示为空，但是只能用来表示指针、切片、映射、通道和接口等类型的零值状态，而不能用于基本数据类型、数组和结构体等值类型，比如`int`、`float64`、`bool`、`string` 等，这些类型有各自的零值，不能用nil表示为空。

- CheckPassword函数，输入参数为**用户输入的密码**和**数据库中存储的加密密码**，返回值是布尔。调用bcrypt.CompareHashAndPassword检测，返回值来验证密码是否正确。
- GenerateJWT函数，输入参数为**用户名**，返回一个**token**和**error**信息。调用  jwt.NewWithClaims函数，设置两个参数，一个是加密的算法类型，一个是内部包含的数据值（位于token的第二部分，不懂的可以查询一下jwt的原理），数据值有username和exp（过期时间），这个数据值应该是可以自己设置有什么的，exp如果不设置默认的是永久，不过这样子不推荐，因为不安全。过期时间是按照距离1970年一月一日到现在的秒数来确定的（为什么，我也不知道），不过这里面有些方法让这个设置变得简单了。`time.Now().Add(time.Hour * 24 * 3).Unix()`表示当前时间的基础上增加三个24小时，然后Unix表示，前面规定的时间到1970年一月一日的秒数。调用token.SignedString函数来进行加密，参数为**字符切片**，包含的是**密钥**，`这个是不可泄露，且只存在于服务器端的`,然后返回"Bearer "和token，这是标准格式。

```
// 写工具和加密方法
// Bcrypt 是一种用于密码哈希的加密算法，它是基于 Blowfish
// 算法的加强版被广泛应用于存储密码和进行身份验证
package utils

import (
 "errors"
 "time"

 "github.com/golang-jwt/jwt"
 "golang.org/x/crypto/bcrypt"
)

// HashPassword 加密密码的方法
func HashPassword(pwd string) (string, error) {
 hash, err := bcrypt.GenerateFromPassword([]byte(pwd), 12) //生成加密密码,第一个参数是穿的的密码，第二个是加密强度
 return string(hash), err                                  //返回加密后的密码和错误信息
}
// 验证密码的方法,输入参数为用户输入的密码和数据库中存储的加密密码，返回值是布尔
func CheckPassword(password string, hash string) bool {
 err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) //第一个是加过密的，第二个输入的密码
 if err != nil {
  return false
 }
 return true
}

// 生成jwt token的方法
func GenerateJWT(username string) (string, error) {
 token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
  "username": username,
  "exp":      time.Now().Add(time.Hour * 24 * 3).Unix(), //过期时间,设置为三天之后过期
 }) //token是一个jwt对象，包含了一些声明
 signedToken, err := token.SignedString([]byte("secret"))
 //SignedString([]byte("secret"))用一个字节切片作为参数，用于签名的密钥
 //signedToken将是一个包含用户相关信息和签名的JWT字符串
 return "Bearer " + signedToken, err
}

```

### 三、用户登录和注册的方法的实现

- 创建一个**controllers**文件夹，内部包含了一个**auth.go文件**，这里面编写用户的登录和注册功能，利用到了gin中的gin context对象，当gin的路由用到这个方法，gin会创建一个gin context对象，将其传入到这个方法中，所以下面的两个方法的参数值都是一个gin context对象，相当于gin context对象是一个gin中进行调用的对象。
- Register函数实现：其中包含大部分的注释，在此讲解一下自己认为疑难的地方。

1. `ctx.ShouldBindBodyWithJSON(&user)`会将请求体的内容json解析成一个models.User结构体，然后将值返回给定义的user变量。
2. 将输入的密码进行密码加密
3. 生成token
4. 数据库生成表格，存储数据
5. 成功之后，json形式返回token

- Login函数的实现：

1. 定义一个input结构体，用来之后解析请求体内容
2. 将请求体解析赋值给input变量
3. 数据库检查表格是否存在这个用户
4. 检查密码是否正确，如果正确返回token，如果不正确，返回密码错误

```
package controllers

import (
 "GO1/config"
 "GO1/models"
 "GO1/utils"
 "net/http"

 "github.com/gin-gonic/gin"
)

func Register(ctx *gin.Context) {
 var user models.User
 //首先读取请求体，并将其解析为一个models.User结构体，即为user变量，如果格式不正确，会绑定失败，并且返回错误信息
 if err := ctx.ShouldBindBodyWithJSON(&user); err != nil {
  ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
  return
 }
 hashPwd, err := utils.HashPassword(user.Password)
 if err != nil {
  ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
  return //可以确保后续的代码不会继续进行，错误处理中都需要return
 }
 user.Password = hashPwd //如果加密密码没有报错，则将加密后的密码赋值给user的Password字段
 // JSON Web Token(WT|json 网络合牌)是一种开放标准(RFC7519)，用于在网络应用环境间安全地传递声明(claims)
 //生成token
 token, err := utils.GenerateJWT(user.Username)
 if err != nil {
  ctx.JSON(http.StatusInternalServerError, gin.H{"jwt生成错误error": err.Error()})
  return
 }
 //http.StatusInternalServerError表示为服务器内部的处理错误
        //判断表格是否存在，并将信息插入表格，（但是我没写检查表格内是否有相同的数据，经过测试发现，会插入相同的数据到表中）
 if config.DB.Migrator().HasTable(&user) {
 } else { //如果user表已经存在，则不需要再次创建
  if err := config.DB.AutoMigrate(&user); err != nil {
   ctx.JSON(http.StatusInternalServerError, gin.H{"数据库表生成错误error": err.Error()})
   return
  } //创建uesr表，如果有错误，会返回500错误，创建表格
 }
 if err := config.DB.Create(&user).Error; err != nil {
  ctx.JSON(http.StatusInternalServerError, gin.H{"数据库信息插入错误error": err.Error()})
  return
 } //将user插入到数据库中，如果有错误，会返回500错误，插入数据
 ctx.JSON(http.StatusOK, gin.H{"token": token})
}

func Login(ctx *gin.Context) {
 var input struct {
  Username string `json:"username"` //写上这个标签，有利于数据的序列化与反序列化对照
  Password string `json:"password"` //方便前后端的json数据的对照
 }
 var user models.User
 
 if err := ctx.ShouldBindJSON(&input); err != nil { //将请求体解析为input变量，如果格式不正确，会绑定失败，并且返回错误信息
  ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
  return
 }
 if err := config.DB.Where("username = ?", input.Username).Find(&user).Error; err != nil { //查询user表中username等于input.Username的用户，如果有错误，会返回500错误，否则查询数据
  ctx.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
  return
 }
 if utils.CheckPassword(input.Password, user.Password) { //检查密码是否正确，如果正确返回token
        token, err := utils.GenerateJWT(user.Username) //生成token
 if err != nil {
  ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
  return
 }
  ctx.JSON(http.StatusOK, gin.H{"token": token})
 } else {
  ctx.JSON(http.StatusUnauthorized, gin.H{"error": "密码错误"})
 }
}

```

### 四、JWT的验证的方法的实现

中间件是gin中的一种函数，可以有以下的作用：
 >
 > - 日志记录：记录请求的详细信息，如请求路径、请求体等。
 > - 身份验证：验证用户的身份，如检查令牌、Cookie等。
 >- 权限控制：确定用户是否有权访问特定的资源或执行特定的操作。
 >- 跨域资源共享（CORS）：允许不同域之间的资源共享。
 >- 参数处理：提取URL中的参数或请求体中的数据。
 >- 错误处理：捕获并处理请求处理过程中的错误。

在此我用到了身份验证，跨域资源请求，之后根据添加还可以增加权限控制，来增加用户和管理员的区别。

- 创建jwt的解析和验证的方法

1. 在utils.go文件中新建方法ParseJWT，参数为token字符串，返回值是用户名和错误值，内容包括了取出token，解析token，然后断言出对象，取出用户名
2. 首先判断前缀是否大于七个字符，并且正好等于"Bearer "，因为之前传输的返回体的token中有这个前缀
3. 然后进行解析token，利用jwt.Parse方法，第一个参数是输入的token，第二个参数是一个回调函数，利用token.Method检测签名的方式是否正确，正确了会返回密钥，然后生成一个jwt.token类型的对象

>这里面我不明白token.Method的检测签名的方式，我打开过源码，但我水平不足不能理解，他是怎么检测这段token使用的是这个签名方式，我的密钥是在他返回的bool之后才给的，所以他不能是通过检测数据和签名加密之后来验证是不是这个签名，而且这样子都已经验证token了，本末倒置了。如果他是加密后的数据有什么特定的样式能够分辨出是什么签名方式，我也不太清楚。我问过ai之后，似乎理解，他就是给token的头部写的签名方式，和这个开发者定义的签名方式名字对照，如果正确，就返回真值，但是这样没有真的分析出token是否是真的用的这个签名方式，但他就算用的假的这个签名方式，之后的加上密钥的验证也不会通过，所以，就算有人造假这个token的签名方式，也不会通过，但是既然这样，为啥还要验证签名方式，直接按照头部的签名方式加上密钥，验证一下对不对好了，而且这样不是可以有很多种签名方式。   这里我目前认知的是很多的验证签名的方式，他们的数据和密钥经过算法加密之后都是不可逆的，所以他们的验证的方式就是，将传回的数据和服务器的密钥按照算法再算一次，如果相同，就说明是没有被篡改，也就是正确的。
1. 将token断言成jwt.MapClaims型的对象，取出username，并且返回。

```
// 解析jwt token的方法，输入参数为token字符串，返回值是用户名和错误信息
func ParseJWT(tokenString string) (string, error) {
 //去掉前缀，将token取出
 if len(tokenString) > 7 && tokenString[:7] == "Bearer " { //这个 "Bearer "，中还有一个空格
  tokenString = tokenString[7:] //去掉前面的 "Bearer "的token
 }
 //解析token,验证签名的方法是否正确，如果正确，会使用签名相同的密钥进行验证
 token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
  if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
   return nil, errors.New("unexpected signing method")}//验证签名的方法不正确时
  return []byte("secret"), nil //如果签名的方法正确,这里的密钥是"secret"，加密和解密的相同密钥
 })
 if err != nil {
  return "", err
 }
 //如果parse解析和验证成功的话，会返回一个token对象，里面包含了声明信息
 //然后再使用这个token对象，断言成jwt.MapClaims型的对象，获取用户名
 //如果token验证成功，则获取用户名
 if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
  username, ok := claims["username"].(string)
  if !ok {
   return "", errors.New("invalid username")//如果获取不到用户名，返回错误信息
  }
  return username, nil//返回用户名,成功解析到这个token中的用户名
 }
 return "", errors.New("invalid token")//最开始的，验证token是否有效，如果不正确，返回错误信息
//总结下来这个函数的过程为：
//1. 先去掉前缀，将token取出
//2. 解析token，验证签名的方法是否正确，如果正确，会使用签名相同的密钥进行验证
//3. 如果token验证成功，将其断言成jwt.MapClaims并获取用户名，并返回用户名
}

```

- 创建middlewares文件夹，创建auth_middleware.go

1. 中间件的返回值都是一个函数，类型为gin.HandlerFunc
2. 内部返回的是一个匿名函数，参数为一个gin.Context，是gin中调用上下文的一个对象
3. 用getHeader方法获取token，如果不存在就返回错误
4. 调用utils中验证token的方法
5. ctx.set是一个中间件将数据存储的方式，可以方便中间件之间的数据共享，可以看代码最下方的注释

```
// 获取token中间件
package middlewares

import (
 "GO1/utils"

 "github.com/gin-gonic/gin"
)

// gin.HandlerFunc 是Gin框架中处理请求的函数类型，这个返回值是一个函数
func AuthMiddleWare() gin.HandlerFunc {
 return func(ctx *gin.Context) {
  token := ctx.GetHeader("Authorization") //获取token
  if token == "" {
   ctx.JSON(401, gin.H{
    "error": "token不存在",
   })
   ctx.Abort() //如果出现错误，先终止，不进行后续的中间件任务
   return      //退出函数
  } //首先从传回的header中获取token
                
  //然后调用utils中的解析和验证token的函数
  username, err := utils.ParseJWT(token)
  if err != nil {
   ctx.JSON(401, gin.H{
    "error": "未成功登录",
   })
   ctx.Abort()
   return
  }
  ctx.Set("username", username) //将解析出来的用户名存入到上下文中，以便后续的处理函数使用
  ctx.Next()                    //如果没有错误，则继续执行后续的中间件或路由函数
 }
}

//ctx的set，get可以让中间体共享数据
//ctx.Next() 继续执行后续的中间件或路由函数
//ctx.Abort() 终止当前请求，不再执行后续的中间件或路由函数

```

### 五、路由的设置，main函数设置

- 创建router文件夹，创建router.go文件

1. 设置gin初始化对象r
2. 配置跨域请求
3. 两个路由组，一个是auth用来注册和登录，一个是index，使用了AuthMiddleWare中间件，用来检测是否有token，以防未登录或注册的人员访问请求
4. index路由组是我实现的一下文章的发表和查询，点赞等功能。
使用.Use方法可以使用中间件，这里是整个路由组都使用了，可以是某一个路由单独使用的，之后会更加完善。

```
package router

import (
 "GO1/controllers"
 "GO1/middlewares"
 "time"

 "github.com/gin-contrib/cors" //跨域请求的包
 "github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
 r := gin.Default()

 // 跨域请求配置
 // 设置CORS中间件配置
  r.Use(cors.New(cors.Config{
   AllowOrigins: []string{"http://localhost:8080"}, // 允许的请求源
   AllowMethods: []string{"GET", "POST"},           // 允许的HTTP方法
   AllowHeaders: []string{"Origin"},                 // 允许的请求头
   ExposeHeaders: []string{"Content-Length"},        // 可暴露的响应头
   AllowCredentials: true,                           // 是否允许发送Cookie
   MaxAge: 12* time.Hour,                           // 预检请求的缓存时间，在这个时间截止之前，浏览器可以不再进行发送预检请求，节省资源
  }))
 auth := r.Group("/auth")
 {
  auth.POST("/login", controllers.Login)
  auth.POST("/register", controllers.Register)
  // Gin 框架会在接收到 /login 请求时自动创建一个 *gin.Context 对象，
  // 并将其作为参数传递给 controllers.Login 函数。
 }
 index := r.Group("/index")
 index.Use(middlewares.AuthMiddleWare()) //表示在这个路由组中应用这个中间件，来实现登录验证
 {
  index.POST("/exchangeurl", controllers.Login)
  index.POST("/createarticle",controllers.CreateArticle)
  index.POST("/getarticles",controllers.GetArticles)
  index.POST("/getarticlebyid/:id",controllers.GetArticleById)
 }
 return r
}

```

### 六、结语

经过了这次的学习，我认识到了go的简洁性，但是性能的优点我目前还未认识到，学习到了web的基础知识，只是刚开始初识web的构建，之后会学习更多的语法使用和原理解析，尝试制作更完整的内容。
