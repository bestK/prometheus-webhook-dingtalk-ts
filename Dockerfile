FROM node:latest

RUN npm config set registry=http://registry.npm.taobao.org

RUN npm install -g typescript
RUN npm install -g cross-env

# 执行命令，创建文件夹
RUN mkdir -p /home/prometheus-webhook-dingtalk-ts

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的文件夹下
COPY ./ /home/prometheus-webhook-dingtalk-ts

WORKDIR /home/prometheus-webhook-dingtalk-ts

# 安装项目依赖包
RUN npm install

EXPOSE 8060

STOPSIGNAL SIGINT

ENTRYPOINT ["npm","run","build"]
