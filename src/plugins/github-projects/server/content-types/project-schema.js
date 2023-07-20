module.exports = {
  kind: 'collectionType',
  collectionName: 'projects',
  info: {
    displayName: 'Project',
    singularName: 'project',
    pluralName: 'projects'
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    repositoryId: {
      type: 'uid',
      unique: true
    },
    title: {
      type: 'text',
      required: true,
      unique: true
    },
    shortDescription: {
      type: 'string'
    },
    repositoryUrl: {
      type: 'string'
    },
    longDescription: {
      type: 'richtext'
    },
    coverImage: {
      type: 'media',
      allowedTypes: ['images'],
      multiple: false
    }
  }
}