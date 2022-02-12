import sql from '../providers/sql.js'

export function create(data) {
  const vars = [
    data.guildId,
    data.commandSymbol
  ]

  const query = `
    INSERT INTO guild_configs (guild_id, command_symbol)
    VALUES ($1, $2)
    RETURNING *
  `
  return sql(query, vars).then(row => {
    return {
      guildId: row.guild_id,
      commandSymbol: row.command_symbol
    }
  })
}

export function read(data) {
  const query = `
    SELECT * FROM guild_configs
    WHERE guild_id=$1
  `
  return sql(query, [data.guildId]).then(row => {
    if(!row) return null
    return {
      guildId: row.guild_id,
      commandSymbol: row.command_symbol
    }
  })
}

export function update(data) {
  const vars = [
    data.guildId,
    data.commandSymbol
  ]

  const query = `
    UPDATE guild_configs
    SET command_symbol=$2
    WHERE guild_id=$1
    RETURNING command_symbol
  `
  return sql(query, vars).then(row => {
    if(!row) return null
    return {
      commandSymbol: row.command_symbol
    }
  })
}
