const mapAlbumToModel = ({ 
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

const mapSongToModel = ({ 
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

const mapSongToBrief = ({ 
  id,
  title,
  performer
}) => ({
  id,
  title,
  performer
})

module.exports = { mapAlbumToModel, mapSongToModel, mapSongToBrief };