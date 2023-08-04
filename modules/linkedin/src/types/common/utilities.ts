export type Nullable<T> = null | T

type TypedEntity = {
  _type: string
  _recipeType: string
}

type VoyagerEntity = {
  $type: string
  $recipeType: string[]
}

export type Typed<
  Value extends Record<string, unknown> = Record<string, never>,
> = Value & TypedEntity

export type VoyagerTyped<
  Value extends Record<string, unknown> = Record<string, never>,
> = Value & VoyagerEntity

export type With<
  Value extends Record<string, unknown> = Record<string, never>,
  IsVoyager extends true | undefined = undefined,
> = Value & (IsVoyager extends true ? VoyagerEntity : TypedEntity)

export type CollectionOf<
  Type,
  Value extends Record<string, unknown> = Record<string, never>,
> = With<
  {
    elements: Array<Type>
  } & Value
>

export type VoyagerCollectionOf<
  Type,
  Value extends Record<string, unknown> = Record<string, never>,
> = With<
  {
    elements: Array<Type>
  } & Value
>
