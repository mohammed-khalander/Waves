FROM node:21-slim

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile-page.sh /compile-page.sh
RUN chmod +x /compile-page.sh

WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@latest . --yes

RUN npx --yes shadcn@latest init --yes -b neutral --force
RUN npx --yes shadcn@latest add --all --yes

RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app