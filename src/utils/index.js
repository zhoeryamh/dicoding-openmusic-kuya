const mapAlbum = ({ 
  id,
  name,
  year,
  created_at,
  updated_at
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapSong = ({ 
  id,
  title,
  year,
  genre,
  performer,
  duration,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  createdAt: created_at,
  updatedAt: updated_at
})

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  token: {
    key: process.env.ACCESS_TOKEN_KEY,
    age: process.env.ACCESS_TOKEN_AGE,
    refresh: process.env.REFRESH_TOKEN_KEY,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
}

module.exports = { mapAlbum, mapSong, config };