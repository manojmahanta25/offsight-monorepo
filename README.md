## Mono Repo Microservice

- Auth Service
- Management Service

### Running the app (In Dev/Locally without dockerizing the application)

```bash
# make sure you have docker installed (this will run redis,kafka,zookeeper on docker)
docker compose -f docker-compose.dev.yml up -d

npm install

# run the auth service
npm run start:dev auth
# auth service running on(swagger doc): http://localhost:3000/api/auth/api-list
# auth api base url: http://localhost:3000/api/auth/v1

# run the management service
npm run start:dev management
# management service running on(swagger doc): http://localhost:3101/api/management/api-list
# management api base url: http://localhost:3101/api/management/v1

```

