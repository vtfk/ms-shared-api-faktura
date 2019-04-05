module.exports = userId => {
  const now = new Date().getTime()
  return {
    userId: userId,
    agreement: {
      id: 'images',
      name: 'Samtykke for bruk av bilder',
      description: 'samtykke for bruk av bilde og video',
      url: ''
    },
    state: true,
    lastUpdated: now,
    history: [
      {
        state: true,
        timeStamp: now
      }
    ]
  }
}
