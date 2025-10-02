# Ép kéo image ARM64 để chạy native trên M1
FROM --platform=linux/arm64 node:20-alpine

WORKDIR /usr/src/app

# Cài deps dựa trên lockfile (nếu có)
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# Copy source
COPY . .

# Biến môi trường mặc định trong container (có thể override bằng .env)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Nếu bạn dùng "npm start"
CMD ["npm", "start"]
# hoặc: CMD ["node", "server.js"]
