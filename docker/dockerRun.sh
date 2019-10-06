sudo docker run -it  -p 8084:8080 \
    --name dora --network=nginxNet  --restart=always \
    -v /home/dr/workspace/nodejsWebsite:/home/node \
    node/dora:base


sudo docker run -it  -p 8084:8080 \
--name doraAlpine --network=nginxNet  --restart=always \
-v /home/dr/workspace/nodejsWebsite:/home/node \
node/dora:alpine