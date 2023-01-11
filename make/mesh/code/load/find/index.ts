import { Link, LinkHint, Mesh, code } from '~'
import type { SiteProcessInputType } from '~'

export * from './bear/index.js'
export * from './save/index.js'

export function generateFullImportVariable(
  input: SiteProcessInputType,
): MeshImportVariableType {
  const parent = code.assumeElementAsGenericNest(input)
  const children = code.assumeChildrenFromParent(parent)

  const rename = children.find<MeshImportVariableRenameType>(
    (node): node is MeshImportVariableRenameType =>
      code.isMesh(node, Mesh.ImportVariableRename),
  )

  const name = code.findFullStringConstantByName(input, 'name')
  const scopeName = code.findFullStringConstantByName(input, 'scope')

  code.assertString(name)
  code.assertString(scopeName)

  return {
    bound: true,
    name,
    rename: rename ? rename.name : name,
    scopeName,
    type: Mesh.ImportVariable,
  }
}

export function process_codeCard_load_find(
  input: SiteProcessInputType,
): void {
  const nest = code.assumeLink(input, Link.Tree)

  const find = code.createNest(Nest.ImportVariable, input.scope)
  code.gatherIntoMeshParent(input, find)

  const childInput = code.withElement(input, find)

  code.processNestedChildren(
    childInput,
    nest,
    code.process_codeCard_load_find_nestedChildren,
  )

  code.replaceIfBound(childInput, find, () =>
    code.generateFullImportVariable(childInput),
  )
}

export function process_codeCard_load_find_nestedChildren(
  input: SiteProcessInputType,
): void {
  const type = code.getLinkHint(input)
  switch (type) {
    case LinkHint.StaticTerm: {
      const index = code.assumeLinkIndex(input)

      if (index > 0) {
        code.process_codeCard_load_find_staticTerm(input)
      } else {
        code.process_find_scope(input)
      }
      break
    }
    default: {
      code.throwError(code.generateUnhandledTermCaseError(input))
    }
  }
}

export function process_codeCard_load_find_staticTerm(
  input: SiteProcessInputType,
): void {
  const term = code.resolveTermString(input)
  switch (term) {
    case 'save':
      code.process_codeCard_load_find_save(input)
      break
    case 'bear':
      code.process_codeCard_load_find_bear(input)
      break
    default:
      code.throwError(code.generateUnknownTermError(input))
  }
}

export function process_find_scope(input: SiteProcessInputType): void {
  const nest = code.assumeLink(input, Link.Tree)
  const scope = code.assumeTermString(input)
  const nestedNest = nest.nest[0]
  code.assertGenericLink(nestedNest)

  const nestedInput = code.withLink(input, {
    index: 0,
    nest: nestedNest,
  })

  const name = code.assumeTermString(nestedInput)
  const scopeString = code.createBlueString(scope)
  const nameString = code.createBlueString(name)

  code.pushRed(
    input,
    code.createRedGather(input, 'scope', [scopeString]),
  )

  code.pushRed(input, code.createRedGather(input, 'name', [nameString]))

  code.attachBlue(input, 'scopeName', scopeString)
  code.attachBlue(input, 'name', nameString)
}
