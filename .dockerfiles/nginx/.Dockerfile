FROM nginx:stable

CMD ["/bin/sh", "-c", "envsubst '$$DOMAIN $$UPSTREAM_HOST $$UPSTREAM_PORT' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]