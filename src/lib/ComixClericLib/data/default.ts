// Series collection - main comic/webcomic series
export const series = [
  {
    id: "1",
    status: "published",
    name: "Default Series",
    slug: "default",
    blurb: "The default series that ships with Comix Cleric!",
    description:
      "The default series that ships with Comix Cleric! *Please change this text...*",
    logo: null,
    favicon: null,
    cover: null,
    featured_media: null,
    schedule: `{months: ["*"], days: ["*"], times: [{hour: "12", minute: "30", timezone: "EDT"}]}`,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

export const series_types = [
  {
    status: "published",
    name: "Action",
    short: null,
    slug: "action",
    blurb: "Combat and thrills that keep the story moving!",
    description: "Combat and thrills that keep the story moving!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Adventure",
    short: null,
    slug: "adventure",
    blurb: "Characters going on quests and discovering new things!",
    description: "Characters going on quests and discovering new things!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Alternate History",
    short: "Alt-History",
    slug: "alternate-history",
    blurb: "Based on real-world history, but changes some things up!",
    description: "Based on real-world history, but changes some things up!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Apocalypse",
    short: null,
    slug: "apocalypse",
    blurb: "Stories telling tales of world-ending catastropies!",
    description: "Stories telling tales of world-ending catastropies!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Comedy",
    short: null,
    slug: "comedy",
    blurb: "Stories that really make you bust a gut!",
    description: "Stories that really make you bust a gut!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Comic",
    short: null,
    slug: "comic",
    blurb: "An image-based story-telling medium that uses humor and/or action to keep readers interested!",
    description: "An image-based story-telling medium that uses humor and/or action to keep readers interested!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Comfy/Cozy",
    short: "Cozy",
    slug: "comfy-cozy",
    blurb: "Light-hearted, laid-back stories to relax and enjoy.",
    description: "Light-hearted, laid-back stories to relax and enjoy.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Crime/Noir",
    short: "Crime",
    slug: "crime",
    blurb: "Stories following detiective-work to figure out the culprit or motive of a crime!",
    description: "Stories following detiective-work to figure out the culprit or motive of a crime!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Cyberpunk",
    short: null,
    slug: "cyberpunk",
    blurb: "Stories set in 1980's retro-future Japanese aesthetics!",
    description: "Stories set in 1980's retro-future Japanese aesthetics!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Drama",
    short: null,
    slug: "drama",
    blurb: "Emotional tales that make an impact.",
    description: "Emotional tales that make an impact.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Dystopian",
    short: null,
    slug: "dystopian",
    blurb: "Stories where society at large is in an oppressive, often hostile state to regular people.",
    description: "Stories where society at large is in an oppressive, often hostile state to regular people.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Educational",
    short: null,
    slug: "educational",
    blurb: "Stories that try to teach you something!",
    description: "Stories that try to teach you something!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Fanfiction",
    short: "Fanfic",
    slug: "fanfiction",
    blurb: "Fiction based on other creators' stories or charaters.",
    description: "Fiction based on other creators' stories or charaters.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Fantasy",
    short: null,
    slug: "fantasy",
    blurb: "Stories outside the realm of reality.",
    description: "Stories outside the realm of reality.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
    {
    status: "published",
    name: "Graphic Novel",
    short: null,
    slug: "graphic-novel",
    blurb: "An image-based medium for stories with a more serious tone!",
    description: "An image-based medium for stories with a more serious tone!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Heartwarming",
    short: null,
    slug: "heartwarming",
    blurb: "Stories written to fill you with feelings of love and/or joy!",
    description: "Stories written to fill you with feelings of love and/or joy!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Historical",
    short: "History",
    slug: "historical",
    blurb: "Stories based purely in real-world history.",
    description: "Stories based purely in real-world history.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Historical Fiction",
    short: null,
    slug: "historical-fiction",
    blurb: "Stories based on history, but the story didn't *actually* happen.",
    description: "Stories based on history, but the story didn't *actually* happen.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Historical Fantasy",
    short: null,
    slug: "historical-fantasy",
    blurb: "Stories based on history, but with a fantasy twist!",
    description: "Stories based on history, but with a fantasy twist!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Horror",
    short: null,
    slug: "horror",
    blurb: "Slashers, ghosts, & psychological torment live here!",
    description: "Slashers, ghosts, & psychological torment live here!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "LGBTQIA+",
    short: "LGBTQ+",
    slug: "lgbtqia",
    blurb: "Stories featuring primarily gay, queer, and/or transgender characters!",
    description: "Stories featuring primarily gay, queer, and/or transgender characters!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Modern/Contemporary",
    short: "Modern",
    slug: "modern",
    blurb: "Stories with a modern setting.",
    description: "Stories with a modern setting.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Modern/Contemporary Fantasy",
    short: "Modern Fantasy",
    slug: "modern-fantasy",
    blurb: "What would today be like if things were different?",
    description: "What would today be like if things were different?",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Mystery",
    short: null,
    slug: "mystery",
    blurb: "Stories that take you on a jorney to find the answers. Maybe a twist or two along the way!",
    description: "Stories that take you on a jorney to find the answers. Maybe a twist or two along the way!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Mythology",
    short: null,
    slug: "mythology",
    blurb: "Stories that focus on tales or beings from mythology.",
    description: "Stories that focus on tales or beings from mythology.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Nonfiction",
    short: "Nonfic",
    slug: "nonfiction",
    blurb: "Stories based on factual information or ideas.",
    description: "Stories based on factual information or ideas.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Isekai/Reincarnation",
    short: "Isekai",
    slug: "isekai",
    blurb: "Characters enter a new world with new adventures!",
    description: "Characters enter a new world with new adventures!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Long-Format",
    short: null,
    slug: "long-format",
    blurb: "Stories crafted to be read as a long page, chapter, or volume at a time!",
    description: "Stories crafted to be read as a long page, chapter, or volume at a time!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
    {
    status: "published",
    name: "Post-Apocalypse",
    short: null,
    slug: "post-apocalypse",
    blurb: "Stories telling tales of survival in the aftermath of world-ending catastropies!",
    description: "Stories telling tales of survival in the aftermath of world-ending catastropies!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Print-Format",
    short: null,
    slug: "print-format",
    blurb: "Stories crafted to be read as a single page, like a regular book!",
    description: "Stories crafted to be read as a single page, like a regular book!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Romance",
    short: null,
    slug: "romance",
    blurb: "Stories focusing on the emotional/romantic connection between characters.",
    description: "Stories focusing on the emotional/romantic connection between characters.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Romance Fantasy",
    short: "Romantasy",
    slug: "romance-fantasy",
    blurb: "Stories focusing on the emotional/romantic connection between characters, but in a fantasy setting!",
    description: "Stories focusing on the emotional/romantic connection between characters, but in a fantasy setting!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Science Fantasy",
    short: null,
    slug: "science-fanstasy",
    blurb: "Stories focusing on fantastical, difficult to explain science.",
    description: "Stories focusing on fantastical, difficult to explain science.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Science Fiction",
    short: "Sci-fi",
    slug: "sci-fi",
    blurb: "Stories focusing on fantastical, difficult to explain science.",
    description: "Stories focusing on fantastical, difficult to explain science.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Slice of Life",
    short: null,
    slug: "slice-of-life",
    blurb: "Stories focused on the less action-y moments in life.",
    description: "Stories focused on the less action-y moments in life.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Space-Travel",
    short: null,
    slug: "space-travel",
    blurb: "Stories focused on beings moving throughout the universe!",
    description: "Stories focused on beings moving throughout the universe!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Steampunk",
    short: null,
    slug: "steampunk",
    blurb: "Stories set in or based on the industrial era copper and steam-powered technology!",
    description: "Stories set in or based on the industrial era copper and steam-powered technology!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Strip-Format",
    short: null,
    slug: "strip-format",
    blurb: "Stories crafted to be read as a mostly horizontal series of panels.",
    description: "Stories crafted to be read as a mostly horizontal series of panels.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Sports",
    short: null,
    slug: "sports",
    blurb: "Teams, points, and going for gold!",
    description: "Teams, points, and going for gold!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Superhero",
    short: null,
    slug: "superhero",
    blurb: "Powers, villains, and battles of good and evil!",
    description: "Powers, villains, and battles of good and evil!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Supernatural",
    short: null,
    slug: "supernatural",
    blurb: "Things beyond our world become known!",
    description: "Things beyond our world become known!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Suspense",
    short: null,
    slug: "Suspense",
    blurb: "Stories that really keep you on the edge of your seat!",
    description: "Stories that really keep you on the edge of your seat!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Survival",
    short: null,
    slug: "Survival",
    blurb: "Stories that raise the stakes to life or death.",
    description: "Stories that raise the stakes to life or death.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Thriller",
    short: null,
    slug: "Thriller",
    blurb: "Stories made to exhilarate, for better or for worse!",
    description: "Stories made to exhilarate, for better or for worse!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Time-Travel",
    short: null,
    slug: "Time-Travel",
    blurb: "Heading back to the past or into the future may have consequences.",
    description: "Heading back to the past or into the future may have consequences.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Utopian",
    short: null,
    slug: "utpoian",
    blurb: "Stories where society at large is in an idyllic state, where everyone is taken care of and generally get along peacefully.",
    description: "Stories where society at large is in an idyllic state, where everyone is taken care of and generally get along peacefully.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Young Adult",
    short: "YA",
    slug: "Young Adult",
    blurb: "Stories for those too mature for the kid stuff, but still too young for the *actual* mature stuff.",
    description: "Stories for those too mature for the kid stuff, but still too young for the *actual* mature stuff.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Zombie Apocalypse",
    short: "Zombies",
    slug: "Zombie-apocalypse",
    blurb: "Stories where the dead come back to life and try to overtake the living!",
    description: "Stories where the dead come back to life and try to overtake the living!",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
]

// Update types (categories)
export const update_types = [
  {
    status: "published",
    name: "Main Story",
    slug: "main-story",
    blurb:
      "An update that is part of the main storyline, continuity, or numbered set.",
    description:
      "An update that is part of the main storyline, continuity, or numbered set.",
    color: null,
    icon: "question-mark",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Update",
    slug: "update",
    blurb:
      "A generic update type.",
    description:
      "A generic update type.",
    color: null,
    icon: "newspaper",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Intermission",
    slug: "intermission",
    blurb:
      "An update type that indicates a short break (usually one or two updates) in the story. Will not be included in the Main Story set.",
    description:
      "An update type that indicates a short break (usually one or two updates) in the story. Will not be included in the Main Story set.",
    color: null,
    icon: "timer",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Hiatus",
    slug: "hiatus",
    blurb:
      "An update type that indicates a long, potentially indefinite break in the story. Will not be included in the Main Story set.",
    description:
      "An update type that indicates a long, potentially indefinite break in the story. Will not be included in the Main Story set.",
    color: null,
    icon: "calendar-slash",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Notice",
    slug: "notice",
    blurb:
      "An update type that indicates an important notice for readers. Will not be included in the Main Story set.",
    description:
      "An update type that indicates an important notice for readers. Will not be included in the Main Story set.",
    color: null,
    icon: "note",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Snippet",
    slug: "snippet",
    blurb:
      "An update type that showcases an extended preview of an upcoming update. Will not be included in the Main Story set.",
    description:
      "An update type that showcases an extended preview of an upcoming update. Will not be included in the Main Story set.",
    color: null,
    icon: "scissors",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Preview",
    slug: "preview",
    blurb:
      "An update type that showcases a short preview of an upcoming update. Will not be included in the Main Story set.",
    description:
      "An update type that showcases a short preview of an upcoming update. Will not be included in the Main Story set.",
    color: null,
    icon: "film-slate",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Misc.",
    slug: "misc",
    blurb:
      "An update type that covers any miscellaneous use-case. Will not be included in the Main Story set.",
    description:
      "An update type that covers any miscellaneous use-case. Will not be included in the Main Story set.",
    color: null,
    icon: "dots-three",
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

// Gallery Types collection (category)
export const gallery_types = [
  {
    status: "published",
    name: "Fan Art",
    slug: "fan-art",
    blurb: "This work was voluntarily created by a fan.",
    description: "This work was voluntarily created by a fan.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Official",
    slug: "official",
    blurb: "This work was created or commissioned by staff of this app.",
    description: "This work was created or commissioned by staff of this app.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Misc.",
    slug: "misc",
    blurb: "This work is potentially unrelated to the comic or site, but is an original creation.",
    description: "This work was created or commissioned by staff of this app.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

// Blog Types collection (category)
export const blog_types = [
  {
    status: "published",
    name: "General",
    slug: "general",
    blurb: "A generic blog type.",
    description: "A generic blog type.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Notice",
    slug: "notice",
    blurb:
      "A blog type that indicates important information for readers or users.",
    description:
      "A blog type that indicates important information for readers or users.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Personal",
    slug: "personal",
    blurb:
      "A blog type that indicates personal/life updates for readers or users..",
    description:
      "A blog type that indicates personal/life updates for readers or users..",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

// Cast Types collection (category)
export const cast_types = [
  {
    status: "published",
    name: "Main Character",
    slug: "main-character",
    blurb: "A lead or hero of the main story, there can be more than one.",
    description:
      "A lead or hero of the main story, there can be more than one.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Side Character",
    slug: "side-character",
    blurb:
      "A character that appears often, but does not drive the main story in a meaningful way.",
    description:
      "A character that appears often, but does not drive the main story in a meaningful way.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Supporting Character",
    slug: "supporting-character",
    blurb:
      "A character that appears often and helps the main character(s) drive the story forward.",
    description:
      "A character that appears often and helps the main character(s) drive the story forward.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Hero",
    slug: "hero",
    blurb:
      "A character generally aligned with morals that fight for the greater good.",
    description:
      "A character generally aligned with morals that fight for the greater good.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Antihero",
    slug: "antihero",
    blurb:
      "A character with generally abiguous morals that still manage to save the day.",
    description:
      "A character with generally abiguous morals that still manage to save the day.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Antivillain",
    slug: "antivillain",
    blurb:
      "A character with generally reprehensible morals that commit any evil for the 'greater good.'",
    description:
      "A character with generally reprehensible morals that commit any evil for the 'greater good.'",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Antagonist",
    slug: "antagonist",
    blurb:
      "A conflicting character in the story, generally averse to the goals of the main characters.",
    description:
      "A conflicting character in the story, generally averse to the goals of the main characters.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Main Villain",
    slug: "main-villain",
    blurb:
      "The main conflicting character(s) of the story, generally averse to the goals of the main characters.",
    description:
      "The main conflicting character(s) of the story, generally averse to the goals of the main characters.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Mentor",
    slug: "mentor",
    blurb:
      "A character whose primary purpose is to teach, train, or otherwise mentor a main character to further their growth.",
    description:
      "A character whose primary purpose is to teach, train, or otherwise mentor a main character to further their growth.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Love Interest",
    slug: "love-interest",
    blurb:
      "A character whose primary story role is being a romantic counterpart to another character, generally the main character.",
    description:
      "A character whose primary story role is being a romantic counterpart to another character, generally the main character.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Rival",
    slug: "rival",
    blurb:
      "A character whose primary story role is being a romantic counterpart to another character, generally the main character.",
    description:
      "A character whose primary story role is being a romantic counterpart to another character, generally the main character.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Misc.",
    slug: "misc",
    blurb:
      "A character that does not fit any other category.",
    description:
      "A character that does not fit any other category.",
    color: null,
    icon: null,
    cover: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

export const content_ratings = [
  {
    status: "published",
    name: "Everyone",
    slug: "everyone",
    short: "E",
    min_age: 0,
    blurb: "This media is rated for all ages.",
    description: "This media is rated for all ages.",
    restricted: false,
    order: 0,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Teen",
    slug: "teen",
    short: "T",
    min_age: 13,
    blurb: "This media is rated for ages 13 and up.",
    description: "This media is rated for ages 13 and up.",
    restricted: false,
    order: 1,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Young Adult",
    slug: "young-adult",
    short: "YA",
    min_age: 15,
    blurb: "This media is rated for ages 15 and up.",
    description: "This media is rated for ages 15 and up.",
    restricted: true,
    order: 2,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "published",
    name: "Mature",
    slug: "mature",
    short: "M",
    min_age: 17,
    blurb: "This media is restricted for ages 17 and up.",
    description: "This media is restricted for ages 17 and up.",
    restricted: true,
    order: 3,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "draft",
    name: "Adult",
    slug: "adult",
    short: "A",
    min_age: 18,
    blurb: "This media is restricted to ages 18 and up.",
    description: "This media is restricted to ages 18 and up.",
    restricted: true,
    order: 4,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    status: "draft",
    name: "Extreme",
    slug: "extreme",
    short: "X",
    min_age: 18,
    blurb: "This media is restricted to ages 18 and up, and contains potentially disturbing imagery and text.",
    description: "This media is restricted to ages 18 and up, and contains potentially disturbing imagery and text.",
    restricted: true,
    order: 5,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

// Users collection
export const users = [
  {
    status: "published",
    email: null,
    name: "name",
    displayname: "Displayname",
    avatar: null,
    description: null,
    public_email: null,
    role: "admin",
    project_role: "Creator",
    owner: true,
    active_series: "default",
    last_page: null,
    links: "[1]",
    date_created: { type: "date" },
    date_updated: { type: "date" },
  }
];

// Themes collection
export const themes = [
  {
    id: "1",
    status: "published",
    name: "Custom 1",
    slug: "custom1",
    code: `
[data-theme='custom1'] {
  --text-scaling: 1;
  --base-font-color: var(--color-surface-950);
  --base-font-color-dark: var(--color-surface-50);
  --base-font-family: "Outfit", system, sans-serif;
  --base-font-size: inherit;
  --base-line-height: inherit;
  --base-font-weight: normal;
  --base-font-style: normal;
  --base-letter-spacing: 0em;
  --heading-font-color: inherit;
  --heading-font-color-dark: inherit;
  --heading-font-family: inherit;
  --heading-font-weight: bold;
  --heading-font-style: normal;
  --heading-letter-spacing: inherit;
  --anchor-font-color: var(--color-primary-500);
  --anchor-font-color-dark: var(--color-primary-500);
  --anchor-font-family: inherit;
  --anchor-font-size: inherit;
  --anchor-line-height: inherit;
  --anchor-font-weight: inherit;
  --anchor-font-style: inherit;
  --anchor-letter-spacing: inherit;
  --anchor-text-decoration: none;
  --anchor-text-decoration-hover: underline;
  --anchor-text-decoration-active: none;
  --anchor-text-decoration-focus: none;
  --spacing: 0.25rem;
  --radius-step: 0.125rem;
  --radius-base: 0.375rem;
  --radius-container: 0.75rem;
  --default-border-width: 1px;
  --default-divide-width: 1px;
  --default-ring-width: 1px;
  --body-background-color: var(--color-surface-50);
  --body-background-color-dark: var(--color-surface-950);
  --color-primary-50: oklch(83.97% 0.11 223.73deg);
  --color-primary-100: oklch(80.06% 0.12 230.31deg);
  --color-primary-200: oklch(76.01% 0.14 236.84deg);
  --color-primary-300: oklch(72.26% 0.15 241.56deg);
  --color-primary-400: oklch(68.45% 0.17 246.4deg);
  --color-primary-500: oklch(64.97% 0.18 250.16deg);
  --color-primary-600: oklch(58.14% 0.18 253.93deg);
  --color-primary-700: oklch(51.23% 0.17 258.03deg);
  --color-primary-800: oklch(44.18% 0.17 262.29deg);
  --color-primary-900: oklch(37.34% 0.16 267.49deg);
  --color-primary-950: oklch(30.96% 0.16 274.07deg);
  --color-primary-contrast-dark: var(--color-primary-950);
  --color-primary-contrast-light: var(--color-primary-50);
  --color-primary-contrast-50: var(--color-primary-contrast-dark);
  --color-primary-contrast-100: var(--color-primary-contrast-dark);
  --color-primary-contrast-200: var(--color-primary-contrast-dark);
  --color-primary-contrast-300: var(--color-primary-contrast-dark);
  --color-primary-contrast-400: var(--color-primary-contrast-dark);
  --color-primary-contrast-500: var(--color-primary-contrast-dark);
  --color-primary-contrast-600: var(--color-primary-contrast-dark);
  --color-primary-contrast-700: var(--color-primary-contrast-light);
  --color-primary-contrast-800: var(--color-primary-contrast-light);
  --color-primary-contrast-900: var(--color-primary-contrast-light);
  --color-primary-contrast-950: var(--color-primary-contrast-light);
  --color-secondary-50: oklch(89.98% 0.05 35.09deg);
  --color-secondary-100: oklch(84.75% 0.08 22.7deg);
  --color-secondary-200: oklch(79.67% 0.11 16.54deg);
  --color-secondary-300: oklch(75.26% 0.15 15.13deg);
  --color-secondary-400: oklch(71.15% 0.18 14.45deg);
  --color-secondary-500: oklch(67.85% 0.21 15.71deg);
  --color-secondary-600: oklch(61.11% 0.19 15.12deg);
  --color-secondary-700: oklch(54.18% 0.17 14.38deg);
  --color-secondary-800: oklch(46.96% 0.15 13.5deg);
  --color-secondary-900: oklch(39.54% 0.13 12.16deg);
  --color-secondary-950: oklch(31.79% 0.11 10.22deg);
  --color-secondary-contrast-dark: var(--color-secondary-950);
  --color-secondary-contrast-light: var(--color-secondary-50);
  --color-secondary-contrast-50: var(--color-secondary-contrast-dark);
  --color-secondary-contrast-100: var(--color-secondary-contrast-dark);
  --color-secondary-contrast-200: var(--color-secondary-contrast-dark);
  --color-secondary-contrast-300: var(--color-secondary-contrast-dark);
  --color-secondary-contrast-400: var(--color-secondary-contrast-dark);
  --color-secondary-contrast-500: var(--color-secondary-contrast-dark);
  --color-secondary-contrast-600: var(--color-secondary-contrast-dark);
  --color-secondary-contrast-700: var(--color-secondary-contrast-light);
  --color-secondary-contrast-800: var(--color-secondary-contrast-light);
  --color-secondary-contrast-900: var(--color-secondary-contrast-light);
  --color-secondary-contrast-950: var(--color-secondary-contrast-light);
  --color-tertiary-50: oklch(95.21% 0.07 93.25deg);
  --color-tertiary-100: oklch(94.04% 0.09 93.85deg);
  --color-tertiary-200: oklch(92.74% 0.11 93.23deg);
  --color-tertiary-300: oklch(91.66% 0.12 93.46deg);
  --color-tertiary-400: oklch(90.44% 0.14 92.74deg);
  --color-tertiary-500: oklch(89.45% 0.15 92.57deg);
  --color-tertiary-600: oklch(79.48% 0.14 88.99deg);
  --color-tertiary-700: oklch(69.32% 0.12 83.81deg);
  --color-tertiary-800: oklch(58.52% 0.11 76.27deg);
  --color-tertiary-900: oklch(47.67% 0.1 66.38deg);
  --color-tertiary-950: oklch(36.32% 0.09 54.05deg);
  --color-tertiary-contrast-dark: var(--color-tertiary-950);
  --color-tertiary-contrast-light: var(--color-tertiary-50);
  --color-tertiary-contrast-50: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-100: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-200: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-300: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-400: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-500: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-600: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-700: var(--color-tertiary-contrast-dark);
  --color-tertiary-contrast-800: var(--color-tertiary-contrast-light);
  --color-tertiary-contrast-900: var(--color-tertiary-contrast-light);
  --color-tertiary-contrast-950: var(--color-tertiary-contrast-light);
  --color-success-50: oklch(93.85% 0.12 137.57deg);
  --color-success-100: oklch(89.3% 0.15 144.23deg);
  --color-success-200: oklch(85.08% 0.17 147.54deg);
  --color-success-300: oklch(81.54% 0.2 148.98deg);
  --color-success-400: oklch(78.2% 0.21 148.81deg);
  --color-success-500: oklch(75.31% 0.22 147.68deg);
  --color-success-600: oklch(66.85% 0.2 147.36deg);
  --color-success-700: oklch(58.4% 0.17 146.86deg);
  --color-success-800: oklch(49.37% 0.15 146.11deg);
  --color-success-900: oklch(40.23% 0.12 144.75deg);
  --color-success-950: oklch(30.36% 0.09 141.35deg);
  --color-success-contrast-dark: var(--color-success-950);
  --color-success-contrast-light: var(--color-success-50);
  --color-success-contrast-50: var(--color-success-contrast-dark);
  --color-success-contrast-100: var(--color-success-contrast-dark);
  --color-success-contrast-200: var(--color-success-contrast-dark);
  --color-success-contrast-300: var(--color-success-contrast-dark);
  --color-success-contrast-400: var(--color-success-contrast-dark);
  --color-success-contrast-500: var(--color-success-contrast-dark);
  --color-success-contrast-600: var(--color-success-contrast-dark);
  --color-success-contrast-700: var(--color-success-contrast-light);
  --color-success-contrast-800: var(--color-success-contrast-light);
  --color-success-contrast-900: var(--color-success-contrast-light);
  --color-success-contrast-950: var(--color-success-contrast-light);
  --color-warning-50: oklch(93.83% 0.09 93.15deg);
  --color-warning-100: oklch(89.56% 0.1 80.64deg);
  --color-warning-200: oklch(85.61% 0.11 71.11deg);
  --color-warning-300: oklch(81.65% 0.13 62.71deg);
  --color-warning-400: oklch(78.09% 0.15 56.54deg);
  --color-warning-500: oklch(74.64% 0.17 50.8deg);
  --color-warning-600: oklch(68.06% 0.16 48.45deg);
  --color-warning-700: oklch(61.37% 0.15 46.53deg);
  --color-warning-800: oklch(54.56% 0.15 43.35deg);
  --color-warning-900: oklch(47.59% 0.14 40.74deg);
  --color-warning-950: oklch(40.55% 0.13 37.21deg);
  --color-warning-contrast-dark: var(--color-warning-950);
  --color-warning-contrast-light: var(--color-warning-50);
  --color-warning-contrast-50: var(--color-warning-contrast-dark);
  --color-warning-contrast-100: var(--color-warning-contrast-dark);
  --color-warning-contrast-200: var(--color-warning-contrast-dark);
  --color-warning-contrast-300: var(--color-warning-contrast-dark);
  --color-warning-contrast-400: var(--color-warning-contrast-dark);
  --color-warning-contrast-500: var(--color-warning-contrast-dark);
  --color-warning-contrast-600: var(--color-warning-contrast-dark);
  --color-warning-contrast-700: var(--color-warning-contrast-light);
  --color-warning-contrast-800: var(--color-warning-contrast-light);
  --color-warning-contrast-900: var(--color-warning-contrast-light);
  --color-warning-contrast-950: var(--color-warning-contrast-light);
  --color-error-50: oklch(85.47% 0.08 38.94deg);
  --color-error-100: oklch(81.14% 0.11 33.06deg);
  --color-error-200: oklch(77.08% 0.13 29.92deg);
  --color-error-300: oklch(73.36% 0.16 29.24deg);
  --color-error-400: oklch(70.04% 0.19 28.45deg);
  --color-error-500: oklch(67.26% 0.21 28.36deg);
  --color-error-600: oklch(60.56% 0.19 27.99deg);
  --color-error-700: oklch(53.84% 0.17 27.54deg);
  --color-error-800: oklch(46.84% 0.15 27.66deg);
  --color-error-900: oklch(39.66% 0.13 27.02deg);
  --color-error-950: oklch(31.97% 0.11 26.14deg);
  --color-error-contrast-dark: var(--color-error-950);
  --color-error-contrast-light: var(--color-error-50);
  --color-error-contrast-50: var(--color-error-contrast-dark);
  --color-error-contrast-100: var(--color-error-contrast-dark);
  --color-error-contrast-200: var(--color-error-contrast-dark);
  --color-error-contrast-300: var(--color-error-contrast-dark);
  --color-error-contrast-400: var(--color-error-contrast-dark);
  --color-error-contrast-500: var(--color-error-contrast-dark);
  --color-error-contrast-600: var(--color-error-contrast-dark);
  --color-error-contrast-700: var(--color-error-contrast-light);
  --color-error-contrast-800: var(--color-error-contrast-light);
  --color-error-contrast-900: var(--color-error-contrast-light);
  --color-error-contrast-950: var(--color-error-contrast-light);
  --color-surface-50: oklch(89.64% 0.07 225.35deg);
  --color-surface-100: oklch(81.8% 0.08 229.54deg);
  --color-surface-200: oklch(74.15% 0.09 231.63deg);
  --color-surface-300: oklch(66.29% 0.11 235.24deg);
  --color-surface-400: oklch(58.73% 0.12 238.28deg);
  --color-surface-500: oklch(51.18% 0.12 243.99deg);
  --color-surface-600: oklch(44.79% 0.11 244.72deg);
  --color-surface-700: oklch(38.36% 0.09 244.26deg);
  --color-surface-800: oklch(31.44% 0.08 245.41deg);
  --color-surface-900: oklch(24.32% 0.06 244.71deg);
  --color-surface-950: oklch(16.35% 0.04 246.43deg);
  --color-surface-contrast-dark: var(--color-surface-950);
  --color-surface-contrast-light: var(--color-surface-50);
  --color-surface-contrast-50: var(--color-surface-contrast-dark);
  --color-surface-contrast-100: var(--color-surface-contrast-dark);
  --color-surface-contrast-200: var(--color-surface-contrast-dark);
  --color-surface-contrast-300: var(--color-surface-contrast-dark);
  --color-surface-contrast-400: var(--color-surface-contrast-dark);
  --color-surface-contrast-500: var(--color-surface-contrast-light);
  --color-surface-contrast-600: var(--color-surface-contrast-light);
  --color-surface-contrast-700: var(--color-surface-contrast-light);
  --color-surface-contrast-800: var(--color-surface-contrast-light);
  --color-surface-contrast-900: var(--color-surface-contrast-light);
  --color-surface-contrast-950: var(--color-surface-contrast-light);
}
    `,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

// Pages collection (for app pages like About, etc.)
export const pages = [
  {
    id: "1",
    status: "published",
    url: "/",
    name: "Home",
    subtitle: null,
    label: null,
    slug: "home",
    icon: "house",
    color: null,
    order_id: 0,
    description: null,
    theme: null,
    body: JSON.stringify([{"component":"hero","props":{"img":"latest"}},{"component":"archive_preview","props":{"max_posts":"6"}}]),
    parent: null,
    show_header: true,
    show_footer: true,
    show_mobile: true,
    show_thumb: true,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    id: "2",
    status: "published",
    url: "/archive",
    name: "Archive",
    subtitle: null,
    label: null,
    slug: "archive",
    icon: "archive",
    color: null,
    order_id: 1,
    description: null,
    theme: null,
    body: "[]",
    parent: null,
    show_header: true,
    show_footer: true,
    show_mobile: true,
    show_thumb: true,
    show_reader: true,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    id: "3",
    status: "published",
    url: "/api/latest",
    name: "Latest",
    subtitle: null,
    label: null,
    slug: "latest",
    icon: "hourglass-high",
    color: null,
    order_id: 2,
    description: null,
    theme: null,
    body: "[]",
    parent: null,
    show_header: true,
    show_footer: true,
    show_mobile: true,
    show_thumb: true,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    id: "4",
    status: "published",
    url: "/about",
    name: "About",
    subtitle: null,
    label: null,
    slug: "about",
    icon: "question-mark",
    color: null,
    order_id: 3,
    description: null,
    theme: null,
    body: "[]",
    parent: null,
    show_header: true,
    show_footer: true,
    show_mobile: true,
    show_thumb: true,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    id: "5",
    status: "published",
    url: "/cast",
    name: "Cast",
    subtitle: null,
    label: null,
    slug: "cast",
    icon: "users-three",
    color: null,
    order_id: 4,
    description: null,
    theme: null,
    body: "[]",
    parent: null,
    show_header: true,
    show_footer: true,
    show_mobile: true,
    show_thumb: false,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    id: "6",
    status: "published",
    url: "/gallery",
    name: "Gallery",
    subtitle: null,
    label: null,
    slug: "gallery",
    icon: "image",
    color: null,
    order_id: 5,
    description: null,
    theme: null,
    body: "[]",
    parent: null,
    show_header: true,
    show_footer: true,
    show_mobile: true,
    show_thumb: false,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    id: "7",
    status: "published",
    url: "/blog",
    name: "Blog",
    subtitle: null,
    label: null,
    slug: "blog",
    icon: "file-text",
    color: null,
    order_id: 6,
    description: null,
    theme: null,
    body: "[]",
    parent: null,
    show_header: true,
    show_footer: true,
    show_mobile: true,
    show_thumb: false,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
  {
    id: "8",
    status: "published",
    url: "/api/random",
    name: "Random",
    subtitle: null,
    label: null,
    slug: "random",
    icon: "dice-five",
    color: null,
    order_id: 7,
    description: null,
    theme: null,
    body: "[]",
    parent: null,
    show_header: false,
    show_footer: false,
    show_mobile: false,
    show_thumb: false,
    show_reader: true,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

export const links = [
  {
    status: "published",
    name: "Website",
    slug: "website",
    url: "https://comixcleric.com",
    icon: "globe",
    color: null,
    custom_css: null,
    user: null,
    user_created: null,
    user_updated: null,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

// Globals collection (settings)
export const globals = [
  {
    id: "1",
    locale: "en-US",
    theme: "custom1",
    logo: null,
    logo_height: "3rem",
    favicon: null,
    cover: null,
    name: "Comix Cleric",
    subtitle: "A new way to host your webcomics!",
    description: "A new way to host your webcomics!",
    format_strip: false,
    format_infinite: false,
    reader_height: "350px",
    copyright: "$APP_NAME © 2025 - $CURRENT_YEAR\r\nAll rights reserved.",
    source_branding: true,
    public_registration: false,
    public_login: false,
    schedule: null,
    feedback: false,
    feedback_negative: false,
    feedback_likes: false,
    feedback_dislikes: false,
    feedback_comments: false,
    feedback_profanity: false,
    content_rating: "everyone",
    warning_popup: false,
    warning_title: null,
    warning_message: null,
    header_layout: "inline-between",
    main_section: "hero",
    hero_title: "Check out the latest update!",
    hero_subtitle: "What new adventure awaits you?",
    profanity: false,
    profanity_warning: false,
    width: "1280px",
    page_limit: 25,
    autopublish_posts: false,
    autopublish_comments: false,
    bsky_feed_message: `<i class='ph-fill ph-butterfly'></i>
    
[Check out more on Bluesky!]($BSKY_LINK)`,
    date_created: new Date().toISOString(),
    date_published: new Date().toISOString(),
    date_updated: null,
  },
];

// Languages collection
export const languages = [
  {
    code: "en-US",
    name: "English",
    direction: "ltr",
  },
  {
    code: "es-ES",
    name: "Spanish",
    direction: "ltr",
  },
  {
    code: "de-DE",
    name: "German",
    direction: "ltr",
  },
];
