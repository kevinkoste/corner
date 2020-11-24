// top-level type defining a profile
export type Profile = {
  username: string
  components: Component[]
}

export const EmptyProfile: Profile = {
  username: '',
  components: [],
}

// COMPONENT TYPES //
export type Component = {
  id: string
  type: string
  props: any
}

export type NameComponent = {
  id: string
  type: 'name'
  props: {
    name: string
  }
}

export type HeadlineComponent = {
  id: string
  type: 'headline'
  props: {
    headline: string
  }
}

export type BioComponent = {
  id: string
  type: 'bio'
  props: {
    bio: string
  }
}

export type HeadshotComponent = {
  id: string
  type: 'headshot'
  props: {
    image: string
  }
}

export type Book = {
  id: string
  title: string
  author: string
  date: string
  link: string
  image: string
}
export type BookshelfProps = {
  id: string
  type: 'bookshelf'
  props: {
    books: Book[]
  }
}

export type ExperienceType = {
  id: string
  domain: string
  title: string
  company: string
  date: string
}

export type ExperienceProps = {
  id: string
  type: 'experiences'
  props: {
    experiences: ExperienceType[]
  }
}

export type Post = {
  title: string
  timestamp: string
  subtitle: string
  link: string
}
export type Integration = {
  id: string
  type: string
  title: string
  description: string
  url: string
  posts: Post[]
}
export type IntegrationsComponent = {
  id: string
  type: 'integrations'
  props: {
    integrations: Integration[]
  }
}

export type EducationType = {
  id: string
  domain: string
  degree: string
  school: string
  date: string
}

export type EducationProps = {
  id: string
  type: 'education'
  props: {
    education: EducationType[]
  }
}
