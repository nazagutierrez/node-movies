import express, { Request, Response } from "express";
import movies from '../../movies.json';
import validateMovie, { validatePartialMovie } from '../schemas/movies';
import crypto from 'crypto'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      "http://localhost:3030",
      "http://127.0.0.1:5500"
    ]

    if (origin != undefined && ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }
  },
}))
app.disable("x-powered-by");

app.get("/movies", (req: Request , res: Response) => {
  const { genre } = req.query
  if (typeof genre === "string") {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
});

app.get("/movies/:id", (req: Request, res: Response) => {
  const { id } = req.params
  const movie = movies.find(m => m.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: "Movie not found"})
});

app.post("/movies", (req: Request , res: Response) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(movies)
})

app.delete("/movies/:id", (req: Request , res: Response) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch("/movies/:id", (req: Request , res: Response) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 3030;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});