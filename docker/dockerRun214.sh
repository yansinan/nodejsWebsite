#!/bin/bash
sudo docker run -it  -p 8084:8080 -p 8900:8900 -p 8899:8899 -p 8888:8888 -p 9229:9229 -p 9999:9999 -p 5800:5800 -p 9230:9230 \
--name=dora --network=nginxNet \
-v /home/dr/workspace/dora214:/home/node \
node/dora:214 \
/bin/bash

# sudo docker run -it  -p 8084:8080 -p 9229:9229 \
# --name=dora --network=host \
# -v /home/dr/workspace/dora214:/home/node \
# node/dora:214 \
# /bin/bash