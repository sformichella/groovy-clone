function makePlaySubcommand(config) {
  const { name, description } = config

  return subcommand => {
    return subcommand
      .setName(name)
      .setDescription(description)
  }
}

module.exports = makePlaySubcommand
