FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY contractors/ /usr/share/nginx/html/

EXPOSE 8080
