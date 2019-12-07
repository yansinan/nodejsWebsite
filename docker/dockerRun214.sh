#!/bin/bash
sudo docker run -it  -p 8085:8080 -p 9229:9229 \
--name=dora --network=nginxNet \
--rm \
-v /home/dr/workspace/dora214:/home/node \
node/dora:alpine