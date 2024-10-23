import { gsap } from '@gsap'

interface CollectionItemsCount {
  attribute: string
  toString?: boolean
  scope?: HTMLElement
}

const collectionItemsCount = ({
  attribute,
  scope,
  toString = true
}: CollectionItemsCount): string | number | undefined => {
  const array = gsap.utils.toArray(attribute, scope)

  if (array.length === 0) return undefined

  return toString
    ? (array.length.toString() as string)
    : (array.length as number)
}

export default collectionItemsCount
