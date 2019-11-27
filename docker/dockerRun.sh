sudo docker run -it  -p 8084:8080 \
    --name dora --network=nginxNet  --restart=always \
    -v /home/dr/workspace/nodejsWebsite:/home/node \
    node/dora:base


sudo docker run -it  -p 8084:8080 -p 9229:9229\
--name doraAlpine --network=nginxNet \
--rm \
--restart=always \
-v /home/dr/workspace/nodejsWebsite:/home/node \
node/dora:alpine

sudo docker run -it  -p 8084:8080 -p 9229:9229 \
--name=dora --network=nginxNet \
--rm \
-v /home/dr/workspace/nodejsWebsite:/home/node \
node/dora:alpine