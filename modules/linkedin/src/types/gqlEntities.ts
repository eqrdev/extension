export type GQLWith<T = string, U extends Record> = {
  $recipeTypes: string[]
  $type: `com.linkedin.${T}`
} & U
