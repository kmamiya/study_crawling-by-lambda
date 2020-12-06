FROM amazonlinux:2

ARG USER_ID=1000
ARG USER_GROUP_ID=1000
ARG USER_NAME=worker

ENV NODEJS_VERSION 14.15.1
ENV NODEJS_PATH /usr/local/node-v${NODEJS_VERSION}-linux-x64
ENV PATH ${NODEJS_PATH}/bin:${PATH}

RUN yum install -y shadow-utils
# memo: alsa-lib ... libasound
RUN groupadd -g $USER_GROUP_ID $USER_NAME \
  && useradd -u $USER_ID -g $USER_NAME -m $USER_NAME \
  \
  && yum install -y wget tar xz atk at-spi2-atk cups cups-lib libxkbcommon libXcomposite libXrandr gtk3 alsa-lib \
  \
  && wget https://nodejs.org/dist/v${NODEJS_VERSION}/node-v${NODEJS_VERSION}-linux-x64.tar.xz \
  && tar xfJ node-v${NODEJS_VERSION}-linux-x64.tar.xz -C /usr/local \
  && rm node-v${NODEJS_VERSION}-linux-x64.tar.xz \
  && node --version \

VOLUME /mnt/app
VOLUME ${NODEJS_PATH}

USER ${USER_NAME}

WORKDIR /mnt/app
