### Docker基础命令

**Linux docker**
*启动*
`$ systemctl start docker`

*停止*
`$ systemctl stop docker`

*重启服务*
`$ systemctl restart docker`

**docker 镜像命令**

*查看docker详细信息*
`$ docker info`

*查看本地所有的镜像文件*
`$ docker images`
`$ docker images -qa` #显示镜像详细信息

*搜索镜像 (有互联网连接)*
`$ docker search <镜像名称>`

*拉取镜像*
`$ docker pull <镜像名称>`  # 默认拉取最新版本
`$ docker pull <镜像名称>:<tag>`  # 拉取指定版本 

*删除镜像*
`$ docker rmi <镜像名称>` # 删除已停止的镜像容器的前提下
`$ docker rmi -f <镜像名称>` # 强制删除 如果镜像有容器在运行 那么就需要强制删除 增加 -f 参数
`$ docker rmi -f $(docker images -qa)` # 强制删除全部镜像

**容器命令**

*查看正在运行镜像的实例*
`$ docker ps`

*创建该镜像的实例并且运行该镜像的实例*
`$ docker run <容器ID>`

*创建该镜像的实例并且运行该镜像的实例以终端方式进入*
`$ docker run -it <容器ID>`

*创建该镜像的实例并且运行该镜像的实例后台运行更名name为XXXX*
`$ docker run -d --name XXXX <容器ID>`

*更改正在运行中容器的name*
`$ docker rename sharp_blackburn tongling1111`

*创建该镜像的实例并且以后台方式运行该镜像的实例*
`$ docker run -d <容器ID>` #docker检测出对该容器无操作时会关闭该容器 

*在容器中退出 / 后台运行容器并退出*
`$ exit`
`$ ctrl + P + Q`

*在宿主机上运行容器内的命令*
`$ docker exec -it <容器ID> <bashShell?`

*重新进入运行容器内*
`$ docker attach <容器ID>`

*查看容器详情*
`$ docker inspect <容器ID>`

*删除所有未运行的容器（已经运行的删除不了，未运行的就一起被删除了）*
`$ docker rm $(sudo docker ps -qa)`

*根据容器的状态，删除Exited状态的容器*
`$ docker rm $(sudo docker ps -qf status=exited)`

*从容器内拷贝文件到主机上*
`$ docker cp <容器ID>:<容器内路劲> <目的主机路径>`

*创建一个镜像文件,使容器成为一个新的镜像文件*
`$ docker commit -m="提交信息的描述" -a="作者" <容器ID>:[标签版本]`

#### 数据共享

> **docker run命令的-v标识创建的挂载点只能对创建的容器有效**

*挂载到宿主机*
`$ docker run -it -v /<宿主机的绝对路径>:/<容器内目录> <容器ID>` #可读可写

*挂载到宿主机*
`$ docker run -it -v /<宿主机的绝对路径>:/<容器内目录>:ro <容器ID>` #可读不可写

> 事先设置好挂载点可以继承
*挂载继承直到没有在运行的容器(XXX2继承与XXX1,包括文件挂载共享)*
`$ docker run -it --name XXX2 --volumes-from XXX1 <容器ID>` 


