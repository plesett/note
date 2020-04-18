### 2019-10-20

由于第二阶段的React的考核，导致运维任务停滞了一段时间。在这周开始了运维任务，具体进度如下
在这周的学习中、复习了之前的 docker 和 k8s、并且发现了一系列之前没有发现的问题，在此基础上解决了问题。并且对docker、k8s 更加加深了印象。
后续对ceph进行了部署，并发现相应的部署问题。

**现具体问题如下:**
> 重新对 k8s 集群进行了部署，在部署中发现了挺多问题，踩了挺多坑。


### kubernetes（K8S）快速安装与配置集群搭


关闭CentOS7自带的防火墙服务
```shell
[root@master ~]# systemctl disable firewalld
[root@master ~]# systemctl stop firewalld
```

关闭各节点的selinux
```shell
[root@master ~]# setenforce 0
[root@master ~]# vim /etc/selinux/config
SELINUX=enforcing   ===>   SELINUX=disabled
```

时间校对（三台机器都做时间校对）
```shell
[root@master ~]# ntpdate ntp1.aliyun.com
13 Sep 14:48:02 ntpdate[1596]: adjust time server 120.25.115.20 offset -0.015854 sec
```

```shell
[root@master ~]# hwclock
2018年09月13日 星期四 14时49分51秒  -0.646898 秒
```

修改主机名
```shell
[root@localhost ~]# vi /etc/hosts

添加以下机器映射
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1 localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.2.102 master
192.168.2.108 node1
192.168.2.228 node2
[root@master ~]#
```

**以上准备工作很重要，如遇环境没有配置好，后续出现问题还是比较难发现的**

#### 安装Kubernetes
**配置dockers镜像**
 ```shell
[root@master ~]# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
[root@master ~]#
[root@master ~]# vi /etc/yum.repos.d/kubernetes.repo 
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg


[root@master ~]# wget https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
[root@master ~]# rpm --import rpm-package-key.gpg
[root@master ~]# yum repolist
[root@master yum.repos.d]# scp CentOS-Base.repo docker-ce.repo kubernetes.repo node1:/etc/yum.repos.d/
```

#### 安装docker和kubelet
*安装docker无需安装*

```shell
[root@master ~]# yum -y install docker-ce kubelet kubeadm kubectl

启动docker
[root@master ~]# systemctl start docker
 
设置开机启动
[root@master ~]# systemctl enable docker
[root@master ~]# docker info
 
保证输出的都是1
[root@master ~]# cat /proc/sys/net/bridge/bridge-nf-call-ip6tables
1
[root@master ~]# cat /proc/sys/net/bridge/bridge-nf-call-iptables
1
[root@master ~]# rpm -ql kubelet
/etc/kubernetes/manifests  #清单目录
/etc/sysconfig/kubelet   #配置文件
/etc/systemd/system/kubelet.service  
/usr/bin/kubelet   #主程序
 
设置开机启动
[root@master ~]# systemctl enable kubelet
```

##### 初始化

```shell
[root@master ~]# kubeadm init --kubernetes-version=v1.16.1 --pod-network-cidr=10.244.0.0/16 --service-cidr=10.96.0.0/12 --image-repository registry.aliyuncs.com/google_containers --ignore-preflight-errors=all
```

*这里使用--ignore-preflight-errors=all此时会出现预检查抛出的 ERROR，可以忽略，此前并无发现，CPU的内存小可能导致后续的kubectl启动不了。或者异常重启*
**建议是增加内存。增加CPU的核数**


+ CPU的内核
+ 内存问题


> 如果遇到pull不了镜像 则重启docker
>  + ```service docker restart```
**因为您必须先启动docker kubectl，否者时会报错的**

**报错信息，解决办法：**
 
````shell
Unfortunately, an error has occurred:
timed out waiting for the condition

This error is likely caused by:
- The kubelet is not running
- The kubelet is unhealthy due to a misconfiguration of the node in some way (required cgroups disabled)

If you are on a systemd-powered system, you can try to troubleshoot the error with the following commands:
- 'systemctl status kubelet'
- 'journalctl -xeu kubelet'

Additionally, a control plane component may have crashed or exited when started by the container runtime.
To troubleshoot, list all containers using your preferred container runtimes CLI, e.g. docker.
Here is one example how you may list all Kubernetes containers running in docker:
- 'docker ps -a | grep kube | grep -v pause'
Once you have found the failing container, you can inspect its logs with:
- 'docker logs CONTAINERID'
error execution phase wait-control-plane: couldn't initialize a Kubernetes cluster
To see the stack trace of this error execute with --v=5 or higher
````

**是 kubelet 启动时的 cgroup driver 和 docker 的不一致。**
```shell
[root@master ~]# sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
如果找不到就先 find 
[root@master ~]# find / -name 10-kubeadm.conf
```

然后重新初始化

```shell
[root@master ~]# mkdir -p $HOME/.kube
[root@master ~]# cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
```

查询集群信息
```shell
[root@master ~]# kubectl get cs
```
*重启集群*
```shell
$ systemctl restart kubelet.service
```


### **后续的node节点的运行依赖网络节点**
#### 1.部署canal网络插件

```shell
[root@linux-node1 ~]# kubectl apply -f https://docs.projectcalico.org/v3.3/getting-started/kubernetes/installation/hosted/canal/rbac.yaml

[root@linux-node1 ~]# kubectl apply -f https://docs.projectcalico.org/v3.3/getting-started/kubernetes/installation/hosted/canal/canal.yaml
```
#### 2.安装flannel (推荐)
 
 ```shell
[root@master ~]# kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
[root@master ~]# curl -sSL "https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml?raw=true" | kubectl create -f -
[root@master ~]# kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

**查看启动的Pod**
*等待一段时间等待pod的启动*

```shell
[root@linux-node1 ~]# kubectl get pods --all-namespaces

NAMESPACE NAME READY STATUS RESTARTS AGE

kube-system canal-rq5n5 0/3 ContainerCreating 0 109s

kube-system coredns-78d4cf999f-5k4sg 0/1 Pending 0 31m

kube-system coredns-78d4cf999f-bnbgf 0/1 Pending 0 31m

kube-system etcd-linux-node1.linuxhot.com 1/1 Running 0 30m

kube-system kube-apiserver-linux-node1.linuxhot.com 1/1 Running 0 30m

kube-system kube-controller-manager-linux-node1.linuxhot.com 1/1 Running 0 31m

kube-system kube-proxy-sddlp 1/1 Running 0 31m

kube-system kube-scheduler-linux-node1.linuxhot.com 1/1 Running 0 30m
```

可以看到此时CoreDNS处于Pending状态，需要等待网络插件canal的Pod状态变成Running之后CoreDNS也会正常。所有Pod的状态都变成Running之后，这个时候再次获取Node，会发现节点变成了Ready状态。

```shell
[root@linux-node1 ~]# kubectl get node

NAME STATUS ROLES AGE VERSION

linux-node1.linuxhot.com Ready master 29m v1.13.3
```


**查看pod运行情况:**
```shell
[root@master ~]# kubectl get pods -n kube-system
```

配置文件传到node1 。。。

 ```shell
[root@master ~]# scp /usr/lib/systemd/system/docker.service node1:/usr/lib/systemd/system/docker.service
[root@master ~]# scp /etc/sysconfig/kubelet node1:/etc/sysconfig/
```

#### node1服务器配置

```shell
[root@node1 ~]# wget https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
[root@node1 ~]# rpm --import rpm-package-key.gpg
```

**安装docker、kubelet**
```shell
[root@node1 ~]# yum -y install docker-ce kubelet kubeadm
```

启动docker
```shell
[root@node1 ~]# systemctl start docker
[root@node1 ~]# systemctl enable docker kubelet
[root@node1 ~]# docker info
```

**添加主集群里（这里参数是主节点初始化提供的参数）**
```shell
[root@node1 ~]# kubeadm join 192.168.2.102:6443 --token ns4kps.j8cuqwf78emp5a5b --discovery-token-ca-cert-hash sha256:b71b7e52c318959bab3f05f02f6fe51d6396d8c54ea6849ec7556927d1c6c88a --ignore-preflight-errors=Swap
```


**在master服务器上可以查节点信息**
```shell

[root@master ~]# kubectl get nodes
```

节点添加
`export KUBECONFIG=/etc/kubernetes/admin.conf`


**日志**
`$ journalctl -f -u kubelet`

**解决node节点没启动**

`$ vim /etc/cni/net.d/10-flannel.conflist`
各节点添加：
```json
{
  "name": "cbr0",
  "cniVersion": "0.2.0",
  "plugins": [
    {
      "type": "flannel",
      "delegate": {
        "hairpinMode": true,
        "isDefaultGateway": true
      }
    },
    {
      "type": "portmap",
      "capabilities": {
        "portMappings": true
      }
    }
  ]
}
```

这时候发现 各节点都处于 Ready状态。

**参考文献**
`https://idc.wanyunshuju.com/K8S/583.html`
`http://m.unixhot.com/kubernetes/kubeadm-install.html#test`
`https://blog.csdn.net/wangmiaoyan/article/details/101216496`

### **ceph总结**

对于ceph再部署中遇到的问题，在创建osd的时候一直显示创建失败，在百度，谷歌上找了很多办法都无济于事。但是在之前的部署中并没有出现小错误。

后续问题慢慢解决，scyllaDB部署也看了一点，部署的文章资料都是很老旧了，后续我在寻找资料参考一下，pedis 和该 scyallDB是一起的。后面尝试先了解该几个的架构理解。再去部署学习。
