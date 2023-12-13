import z from 'zod'

const movieShema = z.object({
  title: z.string({
    invalid_type_error: 'Movie must be a string',
    required_error: 'Movie title is requierd'
  }),
  year: z.number().int().min(1900).max(2030),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})

export default function validateMovie (input: any) {
  return movieShema.safeParse(input)
}

export function validatePartialMovie (input: any) {
  return movieShema.partial().safeParse(input)
}
