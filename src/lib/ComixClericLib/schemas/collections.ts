// I am keeping this file as the only TS file because I could not be botherd to maintain this without TS. - Aria

export const collectionSchemas: Record<string, CollectionSchema> = {
  // Series collection - main comic/webcomic series
  series: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      logo: { type: "string", reference: "files.id" },
      favicon: { type: "string", reference: "files.id" },
      cover: { type: "string", reference: "files.id" },
      featured_media: { type: "string" },
      schedule: { type: "string" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      logo: {
        type: "belongsTo",
        localKey: "logo",
        foreignKey: "files.id",
      },
      favicon: {
        type: "belongsTo",
        localKey: "favicon",
        foreignKey: "files.id",
      },
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      updates: {
        type: "hasMany",
        localKey: "id",
        foreignKey: "updates.series",
      },
      volumes: {
        type: "hasMany",
        localKey: "id",
        foreignKey: "volumes.series",
      },
      chapters: {
        type: "hasMany",
        localKey: "id",
        foreignKey: "chapters.series",
      },
      contributors: {
        type: "hasManyPolymorphic",
        localKey: "id",
        foreignKey: "post_id",
        junction: "contributors",
        polymorphicType: "post_type",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Updates collection - individual comic pages/updates
  updates: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      type: { type: "string", reference: "update_types.id" }, // 'main-story', 'notice', 'hiatus'
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      number: { type: "number" },
      series: { type: "string", reference: "series.id" },
      chapter: { type: "string", reference: "chapters.id" },
      volume: { type: "string", reference: "volumes.id" },
      blurb: { type: "string" },
      description: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      format_strip: { type: "boolean" },
      featured_media: { type: "string" },
      transcript: { type: "string" },
      audio: { type: "string", reference: "files.id" },
      audio_autoplay: { type: "boolean" },
      audio_autoforward: { type: "boolean" },
      audio_volume: { type: "number" },
      audio_loop: { type: "boolean" },
      warning_popup: { type: "boolean" },
      warning_title: { type: "string" },
      warning_message: { type: "string" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      type: {
        type: "belongsTo",
        localKey: "type",
        foreignKey: "update_types.id",
      },
      series: {
        type: "belongsTo",
        localKey: "series",
        foreignKey: "series.id",
      },
      chapter: {
        type: "belongsTo",
        localKey: "chapter",
        foreignKey: "chapters.id",
      },
      volume: {
        type: "belongsTo",
        localKey: "volume",
        foreignKey: "volumes.id",
      },
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      audio: {
        type: "belongsTo",
        localKey: "audio",
        foreignKey: "files.id",
      },
      contributors: {
        type: "hasManyPolymorphic",
        localKey: "id",
        foreignKey: "post_id",
        junction: "contributors",
        polymorphicType: "post_type",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Chapters collection - groups of updates
  chapters: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      series: { type: "string", reference: "series.id" },
      volume: { type: "string", reference: "volumes.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      volume: {
        type: "belongsTo",
        localKey: "volume",
        foreignKey: "volumes.id",
      },
      series: {
        type: "belongsTo",
        localKey: "series",
        foreignKey: "series.id",
      },
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      updates: {
        type: "hasMany",
        localKey: "id",
        foreignKey: "updates.chapter",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Volumes collection - groups of chapters
  volumes: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      number: { type: "number" },
      blurb: { type: "string" },
      description: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      series: { type: "string", reference: "series.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      series: {
        type: "belongsTo",
        localKey: "series",
        foreignKey: "series.id",
      },
      chapters: {
        type: "hasMany",
        localKey: "id",
        foreignKey: "chapters.volume",
      },
      updates: {
        type: "hasMany",
        localKey: "id",
        foreignKey: "updates.volume",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Media collection - uploaded files
  files: {
    fields: {
      id: { type: "string", primary: true },
      filename_disk: { type: "string", required: true },
      filename_download: { type: "string", required: true },
      name: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      type: { type: "string", required: true },
      filesize: { type: "number", required: true },
      width: { type: "number" },
      height: { type: "number" },
      duration: { type: "number" },
      uploaded_on: { type: "date" },
      modified_on: { type: "date" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Gallery collection
  gallery: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      type: { type: "string", reference: "gallery_types.id" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      series: { type: "string", reference: "series.id" },
      cover: { type: "string", reference: "files.id" },
      featured_media: { type: "string" },
      additional_media: { type: "string" },
      tags: { type: "array" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      type: {
        type: "belongsTo",
        localKey: "type",
        foreignKey: "gallery_types.id",
      },
      series: {
        type: "belongsTo",
        localKey: "series",
        foreignKey: "series.id",
      },
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Blogs collection
  blogs: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      type: { type: "string", reference: "blog_types.id" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      body: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      type: {
        type: "belongsTo",
        localKey: "type",
        foreignKey: "blog_types.id",
      },
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Cast/Characters collection
  cast: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      type: { type: "string", reference: "cast_types.id" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      nickname: { type: "string" },
      age: { type: "string" },
      height: { type: "string" },
      weight: { type: "string" },
      pronouns: { type: "string" },
      appearance: { type: "string" },
      blurb: { type: "string" },
      bio: { type: "string" },
      description: { type: "string" },
      spoilers: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      sheet: { type: "string", reference: "files.id" },
      series: { type: "string", reference: "series.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      type: {
        type: "belongsTo",
        localKey: "type",
        foreignKey: "cast_types.id",
      },
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      sheet: {
        type: "belongsTo",
        localKey: "sheet",
        foreignKey: "files.id",
      },
      series: {
        type: "belongsTo",
        localKey: "series",
        foreignKey: "series.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Update Types collection
  series_types: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      short: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      color: { type: "string" },
      icon: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Update Types collection
  update_types: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      color: { type: "string" },
      icon: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Gallery Types collection (category)
  gallery_types: {
    fields: {
      id: { type: "string", primary: true },
      order_id: { type: "string" },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      color: { type: "string" },
      icon: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Blog Types collection (category)
  blog_types: {
    fields: {
      id: { type: "string", primary: true },
      order_id: { type: "string" },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      color: { type: "string" },
      icon: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Cast Types collection (category)
  cast_types: {
    fields: {
      id: { type: "string", primary: true },
      order_id: { type: "string" },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      blurb: { type: "string" },
      description: { type: "string" },
      color: { type: "string" },
      icon: { type: "string" },
      cover: { type: "string", reference: "files.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Ratings collection
  content_ratings: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string", required: true },
      slug: { type: "string", required: true },
      short: { type: "string" },
      min_age: { type: "number" },
      blurb: { type: "string" },
      description: { type: "string" },
      restricted: { type: "boolean" },
      order: { type: "number" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Comments collection
  comments: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      body: { type: "string", required: true },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  tags: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      alias: { type: "string" },
      description: { type: "string" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {},
  },

  links: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      url: { type: "string", required: true },
      icon: { type: "string" },
      color: { type: "string" },
      custom_css: { type: "string" },
      user: { type: "string", required: true },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Contributors collection
  contributors: {
    fields: {
      id: { type: "string", primary: true },
      post_type: { type: "string", required: true },
      post_id: { type: "string", required: true },
      user_id: { type: "string", reference: "user.id" },
      guest_id: { type: "string", reference: "guests.id" },
      order_id: { type: "number" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_id: {
        type: "belongsTo",
        localKey: "user_id",
        foreignKey: "user.id",
      },
      guest_id: {
        type: "belongsTo",
        localKey: "guest_id",
        foreignKey: "guests.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Guests collection
  guests: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      username: { type: "string" },
      displayname: { type: "string" },
      avatar: { type: "string", reference: "files.id" },
      description: { type: "string" },
      public_email: { type: "string" },
      project_role: { type: "string" },
      links: { type: "array", reference: "links.id" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      avatar: {
        type: "belongsTo",
        localKey: "avatar",
        foreignKey: "files.id",
      },
      links: {
        type: "hasManyArray",
        localKey: "links",
        foreignKey: "links.id",
      },
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Themes collection
  themes: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      name: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      code: { type: "string", required: true },
      custom_fonts: { type: "string" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Pages collection (for app pages like About, etc.)
  pages: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      url: { type: "string", required: true },
      name: { type: "string" },
      label: { type: "string" },
      slug: { type: "string", required: true, unique: true },
      order_id: { type: "number" },
      content: { type: "string" },
      icon: { type: "string" },
      color: { type: "string" },
      subtitle: { type: "string" },
      blurb: { type: "string" },
      description: { type: "string" },
      theme: { type: "string" },
      body: { type: "string" },
      collection: { type: "string" },
      parent: { type: "string" },
      homepage: { type: "boolean" },
      show_header: { type: "boolean" },
      show_footer: { type: "boolean" },
      show_mobile: { type: "boolean" },
      show_thumb: { type: "boolean" },
      show_reader: { type: "boolean" },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Globals collection (settings)
  globals: {
    fields: {
      id: { type: "string", primary: true },
      setup_complete: { type: "boolean" },
      locale: { type: "string" },
      theme: { type: "string" },
      logo: { type: "string", reference: "files.id" },
      logo_height: { type: "string" },
      favicon: { type: "string", reference: "files.id" },
      cover: { type: "string", reference: "files.id" },
      series_branding: { type: "boolean" },
      source_branding: { type: "boolean" },
      avatar: { type: "string", reference: "files.id" }, // Used as a fallback for missing avatars.
      name: { type: "string" },
      subtitle: { type: "string" },
      description: { type: "string" },
      format_strip: { type: "boolean" },
      format_infinite: { type: "boolean" },
      public_registration: { type: "boolean" },
      public_login: { type: "boolean" },
      source: { type: "boolean" },
      copyright: { type: "string" },
      header_layout: { type: "string" },
      schedule: { type: "string" },
      reader_random: { type: "boolean" },
      reader_slim: { type: "boolean" },
      reader_height: { type: "string" },
      reader_width: { type: "string" },
      width: { type: "string" },
      main_section: { type: "string" },
      content_rating: { type: "string", reference: "content_rating.slug" },
      warning_popup: { type: "boolean" },
      warning_title: { type: "string" },
      warning_message: { type: "string" },
      feedback: { type: "boolean" },
      feedback_negative: { type: "boolean" },
      feedback_likes: { type: "boolean" },
      feedback_dislikes: { type: "boolean" },
      feedback_comments: { type: "boolean" },
      feedback_profanity: { type: "boolean" },
      profanity: { type: "boolean" }, // Allows profanity to appear in user comments.
      profanity_warning: { type: "boolean" }, // Displays a warning about the presence of profanity in user comments.
      page_limit: { type: "number" },
      social_links: { type: "array", reference: "links.id" },
      autopublish_posts: { type: "boolean" },
      autopublish_comments: { type: "boolean" },
      bsky_feed: { type: "boolean" },
      bsky_handle: { type: "string" },
      bsky_feed_limit: { type: "number" },
      bsky_feed_message: { type: "string" },
      date_created: { type: "date" },
      date_published: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      logo: {
        type: "belongsTo",
        localKey: "logo",
        foreignKey: "files.id",
      },
      favicon: {
        type: "belongsTo",
        localKey: "favicon",
        foreignKey: "files.id",
      },
      cover: {
        type: "belongsTo",
        localKey: "cover",
        foreignKey: "files.id",
      },
      avatar: {
        type: "belongsTo",
        localKey: "avatar",
        foreignKey: "files.id",
      },
      content_rating: {
        type: "belongsTo",
        localKey: "content_rating",
        foreignKey: "content_rating.slug",
      },
      social_links: {
        type: "hasManyArray",
        localKey: "social_links",
        foreignKey: "links.id",
      },
    },
  },

  // Post Schedule collection
  post_schedule: {
    fields: {
      id: { type: "string", primary: true },
      post_type: { type: "string", required: true },
      post_id: { type: "string", required: true },
      date_published: { type: "date", required: true },
      user_created: { type: "string", reference: "user.id" },
      user_updated: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
      user_updated: {
        type: "belongsTo",
        localKey: "user_updated",
        foreignKey: "user.id",
      },
    },
  },

  // Languages collection
  languages: {
    fields: {
      id: { type: "string", primary: true },
      code: { type: "string" },
      name: { type: "string" },
      direction: { type: "string" },
    },
    relations: {},
  },

  // Backups collection - uploaded zip files
  backups: {
    fields: {
      id: { type: "string", primary: true },
      filename_disk: { type: "string", required: true },
      filename_download: { type: "string", required: true },
      type: { type: "string", required: true },
      filesize: { type: "number", required: true },
      uploaded_on: { type: "date" },
      user_created: { type: "string", reference: "user.id" },
      date_created: { type: "date" },
    },
    relations: {
      user_created: {
        type: "belongsTo",
        localKey: "user_created",
        foreignKey: "user.id",
      },
    },
  },

  // Better-auth realted collections.
  user: {
    fields: {
      id: { type: "string", primary: true },
      status: { type: "string" },
      email: { type: "string", required: true, unique: true },
      emailVerified: { type: "boolean" },
      name: { type: "string" },
      username: { type: "string" },
      displayname: { type: "string" },
      avatar: { type: "string", reference: "files.id" },
      description: { type: "string" },
      public_email: { type: "string" },
      role: { type: "string" },
      project_role: { type: "string" },
      owner: { type: "boolean" },
      active_series: { type: "string" },
      last_page: { type: "string" },
      links: { type: "string", reference: "links.id" },
      banned: { type: "boolean" },
      banReason: { type: "string" },
      banExpires: { type: "date" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
      date_created: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      avatar: {
        type: "belongsTo",
        localKey: "avatar",
        foreignKey: "files.id",
      },
      links: {
        type: "belongsTo",
        localKey: "series",
        foreignKey: "series.id",
      },
    },
  },
  account: {
    fields: {
      id: { type: "string", primary: true },
      userId: { type: "string" },
      accountId: { type: "string" },
      providerId: { type: "string" },
      password: { type: "string" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
      date_created: { type: "date" },
      date_updated: { type: "date" },
      issuer: { type: "string" },
    },
    relations: {
      user: {
        type: "belongsTo",
        localKey: "userId",
        foreignKey: "user.id",
      },
    },
  },
  session: {
    fields: {
      id: { type: "string", primary: true },
      expiresAt: { type: "date" },
      token: { type: "string" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
      ipAddress: { type: "string" },
      userAgent: { type: "string" },
      userId: { type: "string", reference: "user.id" },
      impersonatedBy: { type: "string" },
      date_created: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {
      user: {
        type: "belongsTo",
        localKey: "userId",
        foreignKey: "user.id",
      },
    },
  },
  verification: {
    fields: {
      id: { type: "string", primary: true },
      identifier: { type: "string" },
      value: { type: "string" },
      expiresAt: { type: "date" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
      date_created: { type: "date" },
      date_updated: { type: "date" },
    },
    relations: {},
  },
};

type FieldType = "string" | "number" | "boolean" | "date" | "array";

interface FieldDefinition {
  type: FieldType;
  primary?: boolean;
  required?: boolean;
  unique?: boolean;
  reference?: string; // Format: "collection.field"
  default?: any;
  enum?: string[];
}

type RelationType =
  | "belongsTo"
  | "hasMany"
  | "hasManyArray"
  | "hasManyThrough"
  | "hasManyPolymorphic";

interface RelationDefinition {
  type: RelationType;
  localKey: string;
  foreignKey: string;
  junction?: string; // For hasManyThrough relationships
  polymorphicType?: string; // Field name that contains the type discriminator
}

interface CollectionSchema {
  fields: Record<string, FieldDefinition>;
  relations: Record<string, RelationDefinition>;
  defaultFilter?: Record<string, any>;
}
