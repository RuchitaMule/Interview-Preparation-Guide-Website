# ---------- Build Stage ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

# SPA fallback (VERY IMPORTANT for React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output (React uses build/)
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
