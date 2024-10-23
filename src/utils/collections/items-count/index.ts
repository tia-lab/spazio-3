import { gsap } from '@gsap'

interface CollectionItemsCount {
  attribute: string
  toString: boolean
  scope?: HTMLElement
}

const collectionItemsCount = ({
  attribute,
  scope,
  toString = true
}: CollectionItemsCount) => {
  const array = gsap.utils.toArray(attribute, scope)

  return toString ? array.length.toString() : array.length
}

export default collectionItemsCount
