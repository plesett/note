### DockerFile 语法



+ `FROM`  基础镜像，当前新镜像是基于那个镜像的
+ `MAINTAINER `  镜像维护者的姓名邮箱地址等

+ `RUN`  容器构建时候需要的命令
+ `EXPOSE `  当前容器对外暴露出的端口

+ `WORKDIR`  指定在创建容器后，终端默认登录进来的工作路径，一个落脚点
+ `ENV `  用来构建镜像过程中设置环境变量

+ `ADD `  将宿主机下的文件拷贝进镜像且ADD命令会自动处理URL和解压tar压缩包
+ `COPY`  类似ADD, 拷贝文件和目录到镜像文件中

+ `VOLUME `  容器卷数据卷，用于数据保存和持久化工作
+ `CMD`  指定有个容器启动时要运行的命令 (可指定多个CMD命令，但是只有最后一个生效，CMD会被 `docker run` 之后的参数替换)

+ `ENTRYPOINT `  指定有个容器启动时要运行的命令 (可以指定启动时候的参数)
+ `ONBUILD` 当构建一个被继承DockerFile是运行的命令，父镜像在被子镜像的onbuild被触发  

#### 编写示例

**简单的IP查询工具**

```DockerFile

FROM centos
RUN yum -y install curl
CMD ["curl", "-s", "http://ip.cn"]

```

**给Centos添加新功能工具**

```DockerFile

FROM centos
MAINTAINER tongtao<XXXX.163@163.com>

ENV MYPATH  /usr/local
WORKDIR $MYPATH

RUN yum -y install vim
RUN yum -y install net-tools

EXPOSE 80

CMD echo "success!!!"
CMD /bin/bash

```

#### 构建命令

`docker build -f <DockerFile文件绝对路径> -t <容器新名字>:TAG .`


#### 常见错误

**dockerfile 里不能 yum**

解决方法: vim /etc/sysctl.conf

    net.ipv4.ip_forward=1   ##添加路由转发


