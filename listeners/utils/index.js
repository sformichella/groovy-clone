function makePlaySubcommand(config) {
  const { name, description } = config

  return subcommand => {
    return subcommand
      .setName(name)
      .setDescription(description)
  }
}

const identity = state => state

module.exports = {
  makePlaySubcommand,
  identity
}
