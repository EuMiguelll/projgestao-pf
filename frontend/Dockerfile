FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

# Build-time public envs (no secrets — they're embedded in the bundle)
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_AUTH0_ROLES_CLAIM
ARG VITE_AUTH0_EMAIL_CLAIM
ARG VITE_API_URL

ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE \
    VITE_AUTH0_ROLES_CLAIM=$VITE_AUTH0_ROLES_CLAIM \
    VITE_AUTH0_EMAIL_CLAIM=$VITE_AUTH0_EMAIL_CLAIM \
    VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ 2>/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
